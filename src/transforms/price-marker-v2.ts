import { parseSync } from '@swc/core';

export interface TransformResult {
  code: string;
  modified: boolean;
}

/**
 * Transform BpkPriceMarker V2 consolidation (Backpack v38.0.0)
 * - Replaces BpkPriceMarkerV2 with BpkPriceMarker
 * - Updates import paths from bpk-component-price-marker-v2 to bpk-component-price-marker
 */
export function transformPriceMarkerV2(code: string, filename: string): TransformResult {
  // Only process TypeScript/JavaScript files
  if (!filename.endsWith('.ts') && !filename.endsWith('.tsx') &&
      !filename.endsWith('.js') && !filename.endsWith('.jsx')) {
    return { code, modified: false };
  }

  // Check if file has BpkPriceMarkerV2
  if (!code.includes('BpkPriceMarkerV2')) {
    return { code, modified: false };
  }

  let transformedCode = code;
  let modified = true;

  // 1. Replace specific component import path
  transformedCode = transformedCode.replace(
    /from\s+(['"])@skyscanner\/backpack-web\/bpk-component-price-marker-v2\1/g,
    "from $1@skyscanner/backpack-web/bpk-component-price-marker$1"
  );

  // 2. Replace all occurrences of BpkPriceMarkerV2 with BpkPriceMarker
  transformedCode = transformedCode.replace(/\bBpkPriceMarkerV2\b/g, 'BpkPriceMarker');

  return {
    code: transformedCode,
    modified,
  };
}
