import { isScssLike, type TransformResult } from "../utils/transform-helpers.js";

/**
 * Transform SCSS @import to @use (Backpack v39.0.0)
 * - Replaces @import with @use
 * - Updates unstable__bpk-mixins to bpk-mixins
 * - Adds namespace to mixin usage
 */
export function transformScssUse(code: string, filename: string): TransformResult {
  // Only process SCSS files
  if (!isScssLike(filename)) {
    return { code, modified: false };
  }

  let transformedCode = code;
  let modified = false;

  // 1. Replace @import with @use for backpack-web imports
  const importRegex = /@import\s+(['"])~?@skyscanner\/backpack-web\/([^'"]+)\1\s*;/g;
  if (importRegex.test(code)) {
    modified = true;
    transformedCode = transformedCode.replace(importRegex, "@use '~@skyscanner/backpack-web/$2';");
  }

  // 2. Replace unstable__bpk-mixins with bpk-mixins
  if (transformedCode.includes("unstable__bpk-mixins")) {
    modified = true;
    transformedCode = transformedCode.replace(/unstable__bpk-mixins/g, "bpk-mixins");
  }

  // 3. Add namespace to common mixin usage patterns
  // This is a conservative approach - only handles common patterns
  const mixinPatterns: Array<{
    pattern: RegExp;
    replacement: string | ((match: string) => string);
  }> = [
    // Border radius mixins
    {
      pattern: /@include\s+bpk-border-radius-sm\b/g,
      replacement: "@include bpk-mixins.bpk-border-radius-sm",
    },
    {
      pattern: /@include\s+bpk-border-radius-md\b/g,
      replacement: "@include bpk-mixins.bpk-border-radius-md",
    },
    {
      pattern: /@include\s+bpk-border-radius-lg\b/g,
      replacement: "@include bpk-mixins.bpk-border-radius-lg",
    },

    // Spacing mixins
    { pattern: /@include\s+bpk-margin\b/g, replacement: "@include bpk-mixins.bpk-margin" },
    { pattern: /@include\s+bpk-padding\b/g, replacement: "@include bpk-mixins.bpk-padding" },

    // Typography mixins
    { pattern: /@include\s+bpk-text\b/g, replacement: "@include bpk-mixins.bpk-text" },
    {
      pattern: /@include\s+bpk-heading-\d+\b/g,
      replacement: (match: string) => match.replace("@include ", "@include bpk-mixins."),
    },

    // RTL mixins
    { pattern: /@include\s+bpk-rtl\b/g, replacement: "@include bpk-mixins.bpk-rtl" },
    {
      pattern: /@include\s+bpk-margin-leading\b/g,
      replacement: "@include bpk-mixins.bpk-margin-leading",
    },
    {
      pattern: /@include\s+bpk-margin-trailing\b/g,
      replacement: "@include bpk-mixins.bpk-margin-trailing",
    },
    {
      pattern: /@include\s+bpk-padding-leading\b/g,
      replacement: "@include bpk-mixins.bpk-padding-leading",
    },
    {
      pattern: /@include\s+bpk-padding-trailing\b/g,
      replacement: "@include bpk-mixins.bpk-padding-trailing",
    },
  ];

  for (const { pattern, replacement } of mixinPatterns) {
    if (pattern.test(transformedCode)) {
      modified = true;
      // Reset regex lastIndex after test
      pattern.lastIndex = 0;
      if (typeof replacement === "string") {
        transformedCode = transformedCode.replace(pattern, replacement);
      } else {
        transformedCode = transformedCode.replace(pattern, replacement);
      }
    }
  }

  return {
    code: transformedCode,
    modified,
  };
}
