import { parseSync } from "@swc/core";
import {
  BACKPACK_PACKAGE,
  BACKPACK_WEB_PACKAGE,
  hasImport,
  isJsLike,
  isJsxLike,
  type TransformResult,
} from "../utils/transform-helpers.js";

/**
 * Transform BpkLink to add implicit prop (Backpack v37.0.0)
 * - Adds implicit prop to maintain old default style
 * - New explicit style is now default; old style requires implicit prop
 *
 * Note: This is conservative - only adds implicit to links without it
 */
export function transformLinkImplicit(code: string, filename: string): TransformResult {
  try {
    // Only process TypeScript/JavaScript files with JSX
    const isTypeScript = filename.endsWith(".ts") || filename.endsWith(".tsx");
    const isJSX = isJsxLike(filename);

    if (!isJSX || !isJsLike(filename)) {
      return { code, modified: false };
    }

    // Parse to check if file has BpkLink
    const ast = parseSync(code, {
      syntax: isTypeScript ? "typescript" : "ecmascript",
      tsx: isJSX,
      decorators: true,
    });

    if (
      !hasImport(ast, "BpkLink", [BACKPACK_PACKAGE, BACKPACK_WEB_PACKAGE, "bpk-component-link"], {
        includeDefault: true,
        matchSubpath: true,
      })
    ) {
      return { code, modified: false };
    }

    let transformedCode = code;
    let modified = false;

    // Match BpkLink components without implicit prop
    // Handle both with props and without props
    const linkPattern = /<BpkLink(\s+([^>]*?))?>/g;

    transformedCode = transformedCode.replace(linkPattern, (match, _whitespaceAndProps, props) => {
      // Skip if implicit already exists
      if (props && /\bimplicit\b/.test(props)) {
        return match;
      }

      modified = true;

      // Add implicit prop to maintain old style
      if (props && props.trim()) {
        return `<BpkLink ${props.trim()} implicit>`;
      } else {
        return `<BpkLink implicit>`;
      }
    });

    return {
      code: transformedCode,
      modified,
    };
  } catch (error) {
    console.error(`Error transforming ${filename}:`, error);
    return { code, modified: false };
  }
}
