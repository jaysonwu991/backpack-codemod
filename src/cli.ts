#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { glob } from 'glob';
import { readFile, writeFile } from 'fs/promises';
import { resolve, relative } from 'path';
import { transforms, type TransformName } from './index.js';

interface CliOptions {
  transform: TransformName;
  path: string;
  extensions: string[];
  dry: boolean;
  verbose: boolean;
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .usage('Usage: $0 --transform <transform-name> --path <path>')
    .option('transform', {
      alias: 't',
      description: 'Transform to apply',
      type: 'string',
      choices: Object.keys(transforms),
      demandOption: true,
    })
    .option('path', {
      alias: 'p',
      description: 'Path to files or directory',
      type: 'string',
      default: './src',
    })
    .option('extensions', {
      alias: 'e',
      description: 'File extensions to process',
      type: 'array',
      default: ['ts', 'tsx', 'js', 'jsx'],
    })
    .option('dry', {
      alias: 'd',
      description: 'Dry run (no files will be modified)',
      type: 'boolean',
      default: false,
    })
    .option('verbose', {
      alias: 'v',
      description: 'Verbose output',
      type: 'boolean',
      default: false,
    })
    .example('$0 -t bpk-button-v2 -p ./src', 'Transform BpkButton to BpkButtonV2 in src directory')
    .example('$0 -t bpk-button-v2 -p ./src -d', 'Dry run to see what would be changed')
    .help()
    .alias('help', 'h')
    .parseAsync();

  const options = argv as unknown as CliOptions;

  console.log(`\n🚀 Running transform: ${options.transform}\n`);

  // Build glob pattern
  const extensionsPattern =
    options.extensions.length === 1
      ? options.extensions[0]
      : `{${options.extensions.join(',')}}`;
  const pattern = `${options.path}/**/*.${extensionsPattern}`;

  // Find all files
  const files = await glob(pattern, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    absolute: true,
  });

  if (files.length === 0) {
    console.log(`❌ No files found matching pattern: ${pattern}`);
    process.exit(1);
  }

  console.log(`📁 Found ${files.length} file(s) to process\n`);

  const transformFn = transforms[options.transform];
  let modifiedCount = 0;
  let errorCount = 0;

  // Process each file
  for (const file of files) {
    try {
      const code = await readFile(file, 'utf-8');
      const result = transformFn(code, file);

      if (result.modified) {
        modifiedCount++;
        const relativePath = relative(process.cwd(), file);

        if (options.dry) {
          console.log(`✓ Would modify: ${relativePath}`);
        } else {
          await writeFile(file, result.code, 'utf-8');
          console.log(`✓ Modified: ${relativePath}`);
        }

        if (options.verbose) {
          console.log(`  Original length: ${code.length} chars`);
          console.log(`  New length: ${result.code.length} chars\n`);
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
  console.log('\n' + '='.repeat(50));
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
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
