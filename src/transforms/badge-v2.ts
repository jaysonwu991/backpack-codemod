import { isJsLike, type TransformResult } from "../utils/transform-helpers.js";

/**
 * Transform BpkBadge V2 migration (Backpack v32.0.0)
 * - Replaces BpkBadgeV2 with BpkBadge
 * - Updates all imports and JSX usage
 */
export function transformBadgeV2(code: string, filename: string): TransformResult {
  // Only process TypeScript/JavaScript files
  if (!isJsLike(filename)) {
    return { code, modified: false };
  }

  // Check if file has BpkBadgeV2
  if (!code.includes("BpkBadgeV2")) {
    return { code, modified: false };
  }

  let transformedCode = code;
  let modified = true;

  // Replace all occurrences of BpkBadgeV2 with BpkBadge
  transformedCode = transformedCode.replace(/\bBpkBadgeV2\b/g, "BpkBadge");

  return {
    code: transformedCode,
    modified,
  };
}
