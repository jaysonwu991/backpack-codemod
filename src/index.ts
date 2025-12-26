import { transformBpkButton } from './transforms/bpk-button-v2.js';
import { transformScssUse } from './transforms/scss-use-migration.js';
import { transformBottomSheetPadding } from './transforms/bottom-sheet-padding.js';
import { transformPriceMarkerV2 } from './transforms/price-marker-v2.js';
import { transformBadgeV2 } from './transforms/badge-v2.js';
import { transformLinkImplicit } from './transforms/link-implicit.js';
import { transformBadgeTypes } from './transforms/badge-types.js';

export {
  transformBpkButton,
  transformScssUse,
  transformBottomSheetPadding,
  transformPriceMarkerV2,
  transformBadgeV2,
  transformLinkImplicit,
  transformBadgeTypes,
};

export const transforms = {
  'bpk-button-v2': transformBpkButton,
  'scss-use-migration': transformScssUse,
  'bottom-sheet-padding': transformBottomSheetPadding,
  'price-marker-v2': transformPriceMarkerV2,
  'badge-v2': transformBadgeV2,
  'link-implicit': transformLinkImplicit,
  'badge-types': transformBadgeTypes,
};

export type TransformName = keyof typeof transforms;
