import { describe, it, expect } from 'vitest';
import { transformBadgeTypes } from '../transforms/badge-types.js';

describe('transformBadgeTypes', () => {
  it('should replace BADGE_TYPES.destructive with BADGE_TYPES.critical', () => {
    const input = `
import { BADGE_TYPES } from '@skyscanner/backpack-web';

const type = BADGE_TYPES.destructive;`;

    const result = transformBadgeTypes(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('BADGE_TYPES.critical');
    expect(result.code).not.toContain('BADGE_TYPES.destructive');
  });

  it('should replace BADGE_TYPES.light with BADGE_TYPES.normal', () => {
    const input = `
import { BADGE_TYPES } from '@skyscanner/backpack-web';

const type = BADGE_TYPES.light;`;

    const result = transformBadgeTypes(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('BADGE_TYPES.normal');
    expect(result.code).not.toContain('BADGE_TYPES.light');
  });

  it('should replace type="destructive" with type="critical"', () => {
    const input = `
import { BpkBadge } from '@skyscanner/backpack-web';

const badge = <BpkBadge type="destructive">Error</BpkBadge>;`;

    const result = transformBadgeTypes(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('type="critical"');
    expect(result.code).not.toContain('type="destructive"');
  });

  it('should replace type="light" with type="normal"', () => {
    const input = `
import { BpkBadge } from '@skyscanner/backpack-web';

const badge = <BpkBadge type="light">Info</BpkBadge>;`;

    const result = transformBadgeTypes(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('type="normal"');
    expect(result.code).not.toContain('type="light"');
  });

  it('should handle single quotes', () => {
    const input = `
import { BpkBadge } from '@skyscanner/backpack-web';

const badge = <BpkBadge type='destructive'>Error</BpkBadge>;`;

    const result = transformBadgeTypes(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain("type='critical'");
    expect(result.code).not.toContain("type='destructive'");
  });

  it('should handle multiple occurrences', () => {
    const input = `
import { BADGE_TYPES, BpkBadge } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <div>
      <BpkBadge type={BADGE_TYPES.destructive}>Error 1</BpkBadge>
      <BpkBadge type="destructive">Error 2</BpkBadge>
      <BpkBadge type={BADGE_TYPES.light}>Info 1</BpkBadge>
      <BpkBadge type="light">Info 2</BpkBadge>
    </div>
  );
}`;

    const result = transformBadgeTypes(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('BADGE_TYPES.critical');
    expect(result.code).toContain('type="critical"');
    expect(result.code).toContain('BADGE_TYPES.normal');
    expect(result.code).toContain('type="normal"');
    expect(result.code).not.toContain('destructive');
    expect(result.code).not.toMatch(/BADGE_TYPES\.light/);
  });

  it('should handle both enum and string literal forms together', () => {
    const input = `
const config = {
  error: BADGE_TYPES.destructive,
  info: BADGE_TYPES.light,
};

const Badge1 = <BpkBadge type="destructive" />;
const Badge2 = <BpkBadge type="light" />;`;

    const result = transformBadgeTypes(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('BADGE_TYPES.critical');
    expect(result.code).toContain('BADGE_TYPES.normal');
    expect(result.code).toContain('type="critical"');
    expect(result.code).toContain('type="normal"');
  });

  it('should not modify other BADGE_TYPES values', () => {
    const input = `
import { BADGE_TYPES } from '@skyscanner/backpack-web';

const types = {
  success: BADGE_TYPES.success,
  warning: BADGE_TYPES.warning,
  destructive: BADGE_TYPES.destructive,
};`;

    const result = transformBadgeTypes(input, 'test.tsx');

    expect(result.modified).toBe(true);
    expect(result.code).toContain('BADGE_TYPES.success');
    expect(result.code).toContain('BADGE_TYPES.warning');
    expect(result.code).toContain('BADGE_TYPES.critical');
  });

  it('should not modify files without BADGE_TYPES', () => {
    const input = `
import { BpkButton } from '@skyscanner/backpack-web';

function MyComponent() {
  return <BpkButton>Click</BpkButton>;
}`;

    const result = transformBadgeTypes(input, 'test.tsx');

    expect(result.modified).toBe(false);
    expect(result.code).toBe(input);
  });

  it('should not process non-JS/TS files', () => {
    const input = `BADGE_TYPES.destructive`;

    const result = transformBadgeTypes(input, 'test.css');

    expect(result.modified).toBe(false);
    expect(result.code).toBe(input);
  });
});
