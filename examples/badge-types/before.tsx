import React from "react";
import { BADGE_TYPES, BpkBadge } from "@skyscanner/backpack-web";

export const Example = () => (
  <>
    <BpkBadge type={BADGE_TYPES.destructive}>Disruption</BpkBadge>
    <BpkBadge type="light">Low fare</BpkBadge>
  </>
);
