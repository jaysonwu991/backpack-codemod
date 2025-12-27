import { parseSync } from "@swc/core";
import {
  BACKPACK_PACKAGE,
  BACKPACK_WEB_PACKAGE,
  hasImport,
  isJsxLike,
  isJsLike,
  type TransformResult,
} from "../utils/transform-helpers.js";

/**
 * Transform BpkButton imports from V1 to V2
 * - Replaces BpkButton with BpkButtonV2 in imports
 * - Renames BpkButton usage to BpkButtonV2 in JSX
 */
export function transformBpkButton(code: string, filename: string): TransformResult {
  try {
    // Determine if file supports JSX
    const isTypeScript = filename.endsWith(".ts") || filename.endsWith(".tsx");
    const isJSX = isJsxLike(filename);

    if (!isJsLike(filename)) {
      return { code, modified: false };
    }

    // Parse to check if file has BpkButton
    const ast = parseSync(code, {
      syntax: isTypeScript ? "typescript" : "ecmascript",
      tsx: isJSX,
      decorators: true,
    });

    if (!hasImport(ast, "BpkButton", [BACKPACK_PACKAGE, BACKPACK_WEB_PACKAGE])) {
      return { code, modified: false };
    }

    // Transform code using string replacement
    let transformedCode = code;

    // Replace import statements - handle various formats
    // 1. Single import: import { BpkButton } from '...'
    transformedCode = transformedCode.replace(
      /import\s*\{\s*BpkButton\s*\}\s*from\s*(['"])(backpack-react-native|@skyscanner\/backpack-web)\1/g,
      "import { BpkButtonV2 } from $1$2$1",
    );

    // 2. BpkButton with other imports: import { BpkButton, ... } or import { ..., BpkButton }
    transformedCode = transformedCode.replace(
      /import\s*\{([^}]*?)\bBpkButton\b([^}]*?)\}\s*from\s*(['"])(backpack-react-native|@skyscanner\/backpack-web)\3/g,
      (match, before, after, quote, pkg) => {
        // Remove BpkButton and add BpkButtonV2
        let imports = (before + after)
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
        imports = imports.filter((imp: string) => imp !== "BpkButton");
        if (!imports.includes("BpkButtonV2")) {
          imports.push("BpkButtonV2");
        }
        return `import { ${imports.join(", ")} } from ${quote}${pkg}${quote}`;
      },
    );

    // Replace JSX elements
    // 3. Opening tags: <BpkButton ... >
    transformedCode = transformedCode.replace(/<BpkButton(\s|>)/g, "<BpkButtonV2$1");

    // 4. Closing tags: </BpkButton>
    transformedCode = transformedCode.replace(/<\/BpkButton>/g, "</BpkButtonV2>");

    const modified = transformedCode !== code;

    return {
      code: transformedCode,
      modified,
    };
  } catch (error) {
    console.error(`Error transforming ${filename}:`, error);
    return { code, modified: false };
  }
}
