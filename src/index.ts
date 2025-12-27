import { transformBpkButton } from "./transforms/bpk-button-v2.js";
import { transformScssUse } from "./transforms/scss-use-migration.js";
import { transformBottomSheetPadding } from "./transforms/bottom-sheet-padding.js";
import { transformPriceMarkerV2 } from "./transforms/price-marker-v2.js";
import { transformBadgeV2 } from "./transforms/badge-v2.js";
import { transformLinkImplicit } from "./transforms/link-implicit.js";
import { transformBadgeTypes } from "./transforms/badge-types.js";

export {
  transformBpkButton,
  transformScssUse,
  transformBottomSheetPadding,
  transformPriceMarkerV2,
  transformBadgeV2,
  transformLinkImplicit,
  transformBadgeTypes,
};

export interface TransformDefinition {
  name: string;
  description: string;
  version: string;
  extensions: string[];
  transform: (code: string, filename: string) => { code: string; modified: boolean };
}

export const transformRegistry = {
  "bpk-button-v2": {
    name: "bpk-button-v2",
    description: "Migrate BpkButton V1 to BpkButtonV2",
    version: "41.0.0",
    extensions: ["ts", "tsx", "js", "jsx"],
    transform: transformBpkButton,
  },
  "scss-use-migration": {
    name: "scss-use-migration",
    description: "Migrate SCSS @import to @use for Backpack mixins",
    version: "39.0.0",
    extensions: ["scss", "sass"],
    transform: transformScssUse,
  },
  "bottom-sheet-padding": {
    name: "bottom-sheet-padding",
    description: 'Add paddingType="compact" to BpkBottomSheet',
    version: "40.0.0",
    extensions: ["ts", "tsx", "js", "jsx"],
    transform: transformBottomSheetPadding,
  },
  "price-marker-v2": {
    name: "price-marker-v2",
    description: "Consolidate BpkPriceMarkerV2 into BpkPriceMarker",
    version: "38.0.0",
    extensions: ["ts", "tsx", "js", "jsx"],
    transform: transformPriceMarkerV2,
  },
  "badge-v2": {
    name: "badge-v2",
    description: "Migrate BpkBadgeV2 to BpkBadge",
    version: "32.0.0",
    extensions: ["ts", "tsx", "js", "jsx"],
    transform: transformBadgeV2,
  },
  "link-implicit": {
    name: "link-implicit",
    description: "Add implicit prop to BpkLink to preserve old style",
    version: "37.0.0",
    extensions: ["ts", "tsx", "js", "jsx"],
    transform: transformLinkImplicit,
  },
  "badge-types": {
    name: "badge-types",
    description: "Rename legacy BADGE_TYPES and Badge type values",
    version: "18.0.0",
    extensions: ["ts", "tsx", "js", "jsx"],
    transform: transformBadgeTypes,
  },
} as const;

export type TransformName = keyof typeof transformRegistry;

export const transforms = Object.fromEntries(
  Object.entries(transformRegistry).map(([name, def]) => [name, def.transform]),
) as Record<TransformName, TransformDefinition["transform"]>;
