import React from "react";
import {
  BADGE_TYPES,
  BpkBadge,
  BpkBottomSheet,
  BpkButtonV2,
  BpkCard,
  BpkLink,
  BpkText,
} from "@skyscanner/backpack-web";
import { BpkPriceMarker } from "@skyscanner/backpack-web/bpk-component-price-marker";

interface Props {
  onSubmit: () => void;
  onCancel: () => void;
  onDismiss: () => void;
}

export const MyComponent: React.FC<Props> = ({ onSubmit, onCancel, onDismiss }) => {
  const urgencyBadge = BADGE_TYPES.critical;

  return (
    <BpkCard>
      <BpkText>Welcome to Backpack!</BpkText>
      <BpkText>
        Read our{" "}
        <BpkLink href="/terms" implicit>
          terms
        </BpkLink>{" "}
        before continuing.
      </BpkText>
      <div className="button-group">
        <BpkButtonV2 onClick={onSubmit} type="primary">
          Submit
        </BpkButtonV2>
        <BpkButtonV2 onClick={onCancel} type="secondary">
          Cancel
        </BpkButtonV2>
      </div>
      <div className="status-group">
        <BpkBadge type={urgencyBadge}>Disruption</BpkBadge>
        <BpkBadge type="normal">Low fare</BpkBadge>
      </div>
      <BpkPriceMarker price="$120" leadingTitle="NYC to LON" />
      <BpkBottomSheet isOpen onClose={onDismiss} ariaLabel="Trip details" paddingType="compact">
        <BpkText>Seats are limited for this route.</BpkText>
      </BpkBottomSheet>
    </BpkCard>
  );
};

export const SimpleButton = () => <BpkButtonV2 onClick={() => console.log("clicked")} />;
