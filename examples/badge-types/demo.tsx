import React from "react";
import { BADGE_TYPES, BpkBadge } from "@skyscanner/backpack-web";

export const Demo = () => (
  <>
    <BpkBadge type={BADGE_TYPES.critical}>Disruption</BpkBadge>
    <BpkBadge type="normal">Low fare</BpkBadge>
  </>
);
