import React from "react";
import { BpkBottomSheet } from "@skyscanner/backpack-web";

export const Demo = () => (
  <BpkBottomSheet isOpen onClose={() => {}} ariaLabel="Trip details" paddingType="compact">
    <div>Content</div>
  </BpkBottomSheet>
);
