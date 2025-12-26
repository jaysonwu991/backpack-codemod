import { describe, it, expect } from 'vitest';
import { transformBottomSheetPadding } from '../transforms/bottom-sheet-padding.js';

describe('transformBottomSheetPadding', () => {
  it('should add paddingType="compact" to BpkBottomSheet', () => {
    const input = `
import { BpkBottomSheet } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <BpkBottomSheet onClose={handleClose}>
      <div>Content</div>
    </BpkBottomSheet>
  );
}`;

    const result = transformBottomSheetPadding(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('<BpkBottomSheet onClose={handleClose} paddingType="compact">');
  });

  it('should not modify BpkBottomSheet that already has paddingType', () => {
    const input = `
import { BpkBottomSheet } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <BpkBottomSheet paddingType="default" onClose={handleClose}>
      <div>Content</div>
    </BpkBottomSheet>
  );
}`;

    const result = transformBottomSheetPadding(input, 'test.tsx');

    expect(result.modified).toBe(false);
    expect(result.code).toBe(input);
  });

  it('should handle BpkBottomSheet with no props', () => {
    const input = `
import { BpkBottomSheet } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <BpkBottomSheet>
      <div>Content</div>
    </BpkBottomSheet>
  );
}`;

    const result = transformBottomSheetPadding(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('<BpkBottomSheet paddingType="compact">');
  });

  it('should handle multiple BpkBottomSheet instances', () => {
    const input = `
import { BpkBottomSheet } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <>
      <BpkBottomSheet onClose={handleClose1}>
        <div>Sheet 1</div>
      </BpkBottomSheet>
      <BpkBottomSheet onClose={handleClose2} isOpen={true}>
        <div>Sheet 2</div>
      </BpkBottomSheet>
    </>
  );
}`;

    const result = transformBottomSheetPadding(input, 'test.tsx');

    expect(result.modified).toBe(true);
    const matches = result.code.match(/paddingType="compact"/g);
    expect(matches).toHaveLength(2);
  });

  it('should handle component-specific import path', () => {
    const input = `
import BpkBottomSheet from '@skyscanner/backpack-web/bpk-component-bottom-sheet';

function MyComponent() {
  return <BpkBottomSheet onClose={handleClose}>Content</BpkBottomSheet>;
}`;

    const result = transformBottomSheetPadding(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('paddingType="compact"');
  });

  it('should handle backpack-react-native package', () => {
    const input = `
import { BpkBottomSheet } from 'backpack-react-native';

function MyComponent() {
  return <BpkBottomSheet onClose={handleClose}>Content</BpkBottomSheet>;
}`;

    const result = transformBottomSheetPadding(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('paddingType="compact"');
  });

  it('should not modify files without BpkBottomSheet', () => {
    const input = `
import { BpkButton } from '@skyscanner/backpack-web';

function MyComponent() {
  return <BpkButton>Click me</BpkButton>;
}`;

    const result = transformBottomSheetPadding(input, 'test.tsx');

    expect(result.modified).toBe(false);
    expect(result.code).toBe(input);
  });

  it('should not modify non-JSX files', () => {
    const input = `
import { BpkBottomSheet } from '@skyscanner/backpack-web';
export const config = { component: BpkBottomSheet };
`;

    const result = transformBottomSheetPadding(input, 'test.ts');

    expect(result.modified).toBe(false);
  });

  it('should handle complex props with multiline formatting', () => {
    const input = `
import { BpkBottomSheet } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <BpkBottomSheet
      onClose={handleClose}
      isOpen={isOpen}
      title="My Sheet"
      className="custom-sheet"
    >
      <div>Content</div>
    </BpkBottomSheet>
  );
}`;

    const result = transformBottomSheetPadding(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('paddingType="compact"');
  });
});
