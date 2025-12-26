import React from 'react';
import { BpkButtonV2, BpkText, BpkCard } from '@skyscanner/backpack-web';

interface Props {
  onSubmit: () => void;
  onCancel: () => void;
}

export const MyComponent: React.FC<Props> = ({ onSubmit, onCancel }) => {
  return (
    <BpkCard>
      <BpkText>Welcome to Backpack!</BpkText>
      <div className="button-group">
        <BpkButtonV2 onClick={onSubmit} type="primary">
          Submit
        </BpkButtonV2>
        <BpkButtonV2 onClick={onCancel} type="secondary">
          Cancel
        </BpkButtonV2>
      </div>
    </BpkCard>
  );
};

export const SimpleButton = () => (
  <BpkButtonV2 onClick={() => console.log('clicked')} />
);
