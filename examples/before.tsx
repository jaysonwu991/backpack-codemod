import React from "react";
import {
  BADGE_TYPES,
  BpkBadgeV2,
  BpkBottomSheet,
  BpkButton,
  BpkCard,
  BpkLink,
  BpkText,
} from "@skyscanner/backpack-web";
import { BpkPriceMarkerV2 } from "@skyscanner/backpack-web/bpk-component-price-marker-v2";

interface Props {
  onSubmit: () => void;
  onCancel: () => void;
  onDismiss: () => void;
}

export const MyComponent: React.FC<Props> = ({ onSubmit, onCancel, onDismiss }) => {
  const urgencyBadge = BADGE_TYPES.destructive;

  return (
    <BpkCard>
      <BpkText>Welcome to Backpack!</BpkText>
      <BpkText>
        Read our <BpkLink href="/terms">terms</BpkLink> before continuing.
      </BpkText>
      <div className="button-group">
        <BpkButton onClick={onSubmit} type="primary">
          Submit
        </BpkButton>
        <BpkButton onClick={onCancel} type="secondary">
          Cancel
        </BpkButton>
      </div>
      <div className="status-group">
        <BpkBadgeV2 type={urgencyBadge}>Disruption</BpkBadgeV2>
        <BpkBadgeV2 type="light">Low fare</BpkBadgeV2>
      </div>
      <BpkPriceMarkerV2 price="$120" leadingTitle="NYC to LON" />
      <BpkBottomSheet isOpen onClose={onDismiss} ariaLabel="Trip details">
        <BpkText>Seats are limited for this route.</BpkText>
      </BpkBottomSheet>
    </BpkCard>
  );
};

export const SimpleButton = () => <BpkButton onClick={() => console.log("clicked")} />;
