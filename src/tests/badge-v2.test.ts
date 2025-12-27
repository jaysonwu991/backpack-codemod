import { describe, it, expect } from "vitest";
import { transformBadgeV2 } from "../transforms/badge-v2";

describe("transformBadgeV2", () => {
  it("should replace BpkBadgeV2 import with BpkBadge", () => {
    const input = `import { BpkBadgeV2 } from '@skyscanner/backpack-web';`;

    const result = transformBadgeV2(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("BpkBadge");
    expect(result.code).not.toMatch(/\bBpkBadgeV2\b/);
  });

  it("should replace BpkBadgeV2 in JSX", () => {
    const input = `
import { BpkBadgeV2 } from '@skyscanner/backpack-web';

function MyComponent() {
  return <BpkBadgeV2 type="success">New</BpkBadgeV2>;
}`;

    const result = transformBadgeV2(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("<BpkBadge");
    expect(result.code).toContain("</BpkBadge>");
    expect(result.code).not.toMatch(/BpkBadgeV2/);
  });

  it("should handle self-closing JSX", () => {
    const input = `
import { BpkBadgeV2 } from '@skyscanner/backpack-web';

const badge = <BpkBadgeV2 type="warning" />;`;

    const result = transformBadgeV2(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("<BpkBadge");
    expect(result.code).not.toMatch(/BpkBadgeV2/);
  });

  it("should handle multiple imports", () => {
    const input = `import { BpkBadgeV2, BpkText, BpkButton } from '@skyscanner/backpack-web';`;

    const result = transformBadgeV2(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("BpkBadge");
    expect(result.code).toContain("BpkText");
    expect(result.code).toContain("BpkButton");
    expect(result.code).not.toMatch(/BpkBadgeV2/);
  });

  it("should replace type references", () => {
    const input = `
import { BpkBadgeV2 } from '@skyscanner/backpack-web';

const BadgeComponent: typeof BpkBadgeV2 = BpkBadgeV2;`;

    const result = transformBadgeV2(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("typeof BpkBadge");
    expect(result.code).toContain("= BpkBadge");
    expect(result.code).not.toMatch(/BpkBadgeV2/);
  });

  it("should handle complex components", () => {
    const input = `
import { BpkBadgeV2 } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <div>
      <BpkBadgeV2 type="success">Active</BpkBadgeV2>
      <BpkBadgeV2 type="warning">Pending</BpkBadgeV2>
      <BpkBadgeV2 type="critical">Error</BpkBadgeV2>
    </div>
  );
}`;

    const result = transformBadgeV2(input, "test.tsx");

    expect(result.modified).toBe(true);
    const badgeCount = (result.code.match(/BpkBadge/g) || []).length;
    expect(badgeCount).toBeGreaterThanOrEqual(3);
    expect(result.code).not.toMatch(/BpkBadgeV2/);
  });

  it("should not modify files without BpkBadgeV2", () => {
    const input = `
import { BpkButton } from '@skyscanner/backpack-web';

function MyComponent() {
  return <BpkButton>Click</BpkButton>;
}`;

    const result = transformBadgeV2(input, "test.tsx");

    expect(result.modified).toBe(false);
    expect(result.code).toBe(input);
  });

  it("should not process non-JSX/JS files", () => {
    const input = `import { BpkBadgeV2 } from '@skyscanner/backpack-web';`;

    const result = transformBadgeV2(input, "test.css");

    expect(result.modified).toBe(false);
    expect(result.code).toBe(input);
  });
});
