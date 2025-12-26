import { describe, it, expect } from 'vitest';
import { transformPriceMarkerV2 } from '../transforms/price-marker-v2.js';

describe('transformPriceMarkerV2', () => {
  it('should replace BpkPriceMarkerV2 import with BpkPriceMarker', () => {
    const input = `import { BpkPriceMarkerV2 } from '@skyscanner/backpack-web';`;

    const result = transformPriceMarkerV2(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('BpkPriceMarker');
    expect(result.code).not.toMatch(/\bBpkPriceMarkerV2\b/);
  });

  it('should replace component-specific import path', () => {
    const input = `import { BpkPriceMarkerV2 } from '@skyscanner/backpack-web/bpk-component-price-marker-v2';`;

    const result = transformPriceMarkerV2(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('bpk-component-price-marker');
    expect(result.code).not.toContain('bpk-component-price-marker-v2');
    expect(result.code).toContain('BpkPriceMarker');
  });

  it('should replace BpkPriceMarkerV2 in JSX', () => {
    const input = `
import { BpkPriceMarkerV2 } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <BpkPriceMarkerV2 price="100" currency="USD">
      Price
    </BpkPriceMarkerV2>
  );
}`;

    const result = transformPriceMarkerV2(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('<BpkPriceMarker');
    expect(result.code).toContain('</BpkPriceMarker>');
    expect(result.code).not.toMatch(/<BpkPriceMarkerV2/);
  });

  it('should handle self-closing JSX', () => {
    const input = `
import { BpkPriceMarkerV2 } from '@skyscanner/backpack-web';

const marker = <BpkPriceMarkerV2 price="100" />;`;

    const result = transformPriceMarkerV2(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('<BpkPriceMarker');
    expect(result.code).not.toMatch(/BpkPriceMarkerV2/);
  });

  it('should handle multiple imports', () => {
    const input = `import { BpkPriceMarkerV2, BpkText } from '@skyscanner/backpack-web';`;

    const result = transformPriceMarkerV2(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('BpkPriceMarker');
    expect(result.code).toContain('BpkText');
    expect(result.code).not.toMatch(/BpkPriceMarkerV2/);
  });

  it('should replace type references', () => {
    const input = `
import { BpkPriceMarkerV2 } from '@skyscanner/backpack-web';

type Props = {
  marker: typeof BpkPriceMarkerV2;
};`;

    const result = transformPriceMarkerV2(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('typeof BpkPriceMarker');
    expect(result.code).not.toMatch(/BpkPriceMarkerV2/);
  });

  it('should not modify files without BpkPriceMarkerV2', () => {
    const input = `
import { BpkButton } from '@skyscanner/backpack-web';

function MyComponent() {
  return <BpkButton>Click</BpkButton>;
}`;

    const result = transformPriceMarkerV2(input, 'test.tsx');

    expect(result.modified).toBe(false);
    expect(result.code).toBe(input);
  });

  it('should not process non-JSX files', () => {
    const input = `import { BpkPriceMarkerV2 } from '@skyscanner/backpack-web';`;

    const result = transformPriceMarkerV2(input, 'test.json');

    expect(result.modified).toBe(false);
    expect(result.code).toBe(input);
  });
});
