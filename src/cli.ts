#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { glob } from "glob";
import { readFile, writeFile, stat } from "fs/promises";
import { resolve, relative } from "path";
import { transformRegistry, type TransformName } from "./index.js";

interface CliOptions {
  transform: Array<TransformName | "all">;
  path: string;
  extensions?: string[];
  dry: boolean;
  verbose: boolean;
  from?: string;
  to?: string;
  list: boolean;
}

function normalizeVersion(version: string): number[] {
  const cleaned = version.trim().replace(/^v/i, "");
  const parts = cleaned.split(".").map((part) => Number(part));
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

function compareVersions(left: string, right: string): number {
  const [lMajor, lMinor, lPatch] = normalizeVersion(left);
  const [rMajor, rMinor, rPatch] = normalizeVersion(right);

  if (lMajor !== rMajor) return lMajor - rMajor;
  if (lMinor !== rMinor) return lMinor - rMinor;
  return lPatch - rPatch;
}

function resolveTransforms(options: CliOptions): TransformName[] {
  const allTransforms = Object.keys(transformRegistry) as TransformName[];
  const requested = options.transform.length === 0 ? ["all"] : options.transform;
  const selected = requested.includes("all")
    ? allTransforms
    : (requested.filter((name) => name !== "all") as TransformName[]);

  const filteredByVersion = selected.filter((name) => {
    const version = transformRegistry[name].version;
    if (options.from && compareVersions(version, options.from) <= 0) {
      return false;
    }
    if (options.to && compareVersions(version, options.to) > 0) {
      return false;
    }
    return true;
  });

  return filteredByVersion;
}

function resolveExtensions(options: CliOptions, transforms: TransformName[]): string[] {
  if (options.extensions && options.extensions.length > 0) {
    return options.extensions.map((ext) => String(ext));
  }

  const extensions = new Set<string>();
  for (const name of transforms) {
    for (const ext of transformRegistry[name].extensions) {
      extensions.add(ext);
    }
  }

  return Array.from(extensions);
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .usage("Usage: $0 --transform <transform-name> --path <path>")
    .option("transform", {
      alias: "t",
      description: "Transform(s) to apply",
      type: "array",
      choices: ["all", ...Object.keys(transformRegistry)],
    })
    .option("path", {
      alias: "p",
      description: "Path to files or directory",
      type: "string",
      default: "./src",
    })
    .option("extensions", {
      alias: "e",
      description: "File extensions to process",
      type: "array",
    })
    .option("dry", {
      alias: "d",
      description: "Dry run (no files will be modified)",
      type: "boolean",
      default: false,
    })
    .option("verbose", {
      alias: "v",
      description: "Verbose output",
      type: "boolean",
      default: false,
    })
    .option("from", {
      description: "Backpack version you are upgrading from (exclusive lower bound)",
      type: "string",
    })
    .option("to", {
      description: "Backpack version you are upgrading to (inclusive upper bound)",
      type: "string",
    })
    .option("list", {
      description: "List available transforms with versions and exit",
      type: "boolean",
      default: false,
    })
    .example("$0 -t bpk-button-v2 -p ./src", "Transform BpkButton to BpkButtonV2 in src directory")
    .example("$0 -t all -p ./src", "Run all available transforms")
    .example("$0 -t all --from 32.0.0 --to 41.0.0", "Run transforms in a version range")
    .help()
    .alias("help", "h")
    .parseAsync();

  const options = argv as unknown as CliOptions;
  const rawTransforms = (argv as { transform?: unknown }).transform;
  options.transform = Array.isArray(rawTransforms)
    ? (rawTransforms as Array<TransformName | "all">)
    : rawTransforms
      ? [rawTransforms as TransformName | "all"]
      : [];

  if (options.list) {
    console.log("\nAvailable transforms:\n");
    for (const name of Object.keys(transformRegistry) as TransformName[]) {
      const def = transformRegistry[name];
      console.log(`- ${def.name} (v${def.version}) - ${def.description}`);
    }
    console.log();
    return;
  }

  if (options.transform.length === 0) {
    console.log("❌ No transforms specified. Use --transform or --list.");
    process.exit(1);
  }

  const selectedTransforms = resolveTransforms(options);
  if (selectedTransforms.length === 0) {
    console.log("❌ No transforms selected for the provided version range.");
    process.exit(1);
  }

  console.log(`\n🚀 Running transforms: ${selectedTransforms.join(", ")}\n`);

  const extensions = resolveExtensions(options, selectedTransforms);

  // Build glob pattern
  const extensionsPattern = extensions.length === 1 ? extensions[0] : `{${extensions.join(",")}}`;
  const resolvedPath = resolve(options.path);
  const stats = await stat(resolvedPath).catch(() => null);

  const files = stats?.isFile()
    ? [resolvedPath]
    : await glob(`${resolvedPath}/**/*.${extensionsPattern}`, {
        ignore: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.git/**"],
        absolute: true,
      });

  if (files.length === 0) {
    console.log(`❌ No files found matching path: ${options.path}`);
    process.exit(1);
  }

  console.log(`📁 Found ${files.length} file(s) to process\n`);

  let modifiedCount = 0;
  let errorCount = 0;

  // Process each file
  for (const file of files) {
    try {
      const code = await readFile(file, "utf-8");
      let transformedCode = code;
      let fileModified = false;

      for (const name of selectedTransforms) {
        const transformFn = transformRegistry[name].transform;
        const result = transformFn(transformedCode, file);
        transformedCode = result.code;
        if (result.modified) {
          fileModified = true;
        }
      }

      if (fileModified) {
        modifiedCount++;
        const relativePath = relative(process.cwd(), file);

        if (options.dry) {
          console.log(`✓ Would modify: ${relativePath}`);
        } else {
          await writeFile(file, transformedCode, "utf-8");
          console.log(`✓ Modified: ${relativePath}`);
        }

        if (options.verbose) {
          console.log(`  Original length: ${code.length} chars`);
          console.log(`  New length: ${transformedCode.length} chars\n`);
        }
      } else if (options.verbose) {
        const relativePath = relative(process.cwd(), file);
        console.log(`- No changes: ${relativePath}`);
      }
    } catch (error) {
      errorCount++;
      const relativePath = relative(process.cwd(), file);
      console.error(`✗ Error processing ${relativePath}:`, error);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log(`\n📊 Summary:`);
  console.log(`   Total files: ${files.length}`);
  console.log(`   Modified: ${modifiedCount}`);
  console.log(`   Unchanged: ${files.length - modifiedCount - errorCount}`);
  console.log(`   Errors: ${errorCount}`);

  if (options.dry) {
    console.log(`\n⚠️  Dry run mode - no files were actually modified`);
    console.log(`   Run without --dry to apply changes`);
  } else if (modifiedCount > 0) {
    console.log(`\n✅ Successfully transformed ${modifiedCount} file(s)!`);
  } else {
    console.log(`\n✅ No files needed transformation`);
  }

  console.log();
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
