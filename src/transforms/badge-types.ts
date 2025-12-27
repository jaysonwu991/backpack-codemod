import { isJsLike, type TransformResult } from "../utils/transform-helpers.js";

/**
 * Transform Badge types rename (Backpack v18.0.0)
 * - BADGE_TYPES.destructive → BADGE_TYPES.critical
 * - BADGE_TYPES.light → BADGE_TYPES.normal
 * - Default badge changed from Warning to Normal
 */
export function transformBadgeTypes(code: string, filename: string): TransformResult {
  // Only process TypeScript/JavaScript files
  if (!isJsLike(filename)) {
    return { code, modified: false };
  }

  let transformedCode = code;
  let modified = false;

  // Check if file has anything to transform
  const hasRelevantContent =
    transformedCode.includes("BADGE_TYPES") ||
    transformedCode.includes('type="destructive"') ||
    transformedCode.includes("type='destructive'") ||
    transformedCode.includes('type="light"') ||
    transformedCode.includes("type='light'");

  if (!hasRelevantContent) {
    return { code, modified: false };
  }

  // 1. Replace BADGE_TYPES.destructive with BADGE_TYPES.critical
  if (transformedCode.includes("BADGE_TYPES.destructive")) {
    modified = true;
    transformedCode = transformedCode.replace(/BADGE_TYPES\.destructive/g, "BADGE_TYPES.critical");
  }

  // 2. Replace BADGE_TYPES.light with BADGE_TYPES.normal
  if (transformedCode.includes("BADGE_TYPES.light")) {
    modified = true;
    transformedCode = transformedCode.replace(/BADGE_TYPES\.light/g, "BADGE_TYPES.normal");
  }

  // 3. Replace string literal values in type prop
  if (transformedCode.includes('type="destructive"')) {
    modified = true;
    transformedCode = transformedCode.replace(/type="destructive"/g, 'type="critical"');
  }

  if (transformedCode.includes("type='destructive'")) {
    modified = true;
    transformedCode = transformedCode.replace(/type='destructive'/g, "type='critical'");
  }

  if (transformedCode.includes('type="light"')) {
    modified = true;
    transformedCode = transformedCode.replace(/type="light"/g, 'type="normal"');
  }

  if (transformedCode.includes("type='light'")) {
    modified = true;
    transformedCode = transformedCode.replace(/type='light'/g, "type='normal'");
  }

  return {
    code: transformedCode,
    modified,
  };
}
