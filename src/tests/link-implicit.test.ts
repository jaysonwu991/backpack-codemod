import { describe, it, expect } from "vitest";
import { transformLinkImplicit } from "../transforms/link-implicit";

describe("transformLinkImplicit", () => {
  it("should add implicit prop to BpkLink", () => {
    const input = `
import { BpkLink } from '@skyscanner/backpack-web';

function MyComponent() {
  return <BpkLink href="/path">Link</BpkLink>;
}`;

    const result = transformLinkImplicit(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain('<BpkLink href="/path" implicit>');
  });

  it("should not add implicit if already present", () => {
    const input = `
import { BpkLink } from '@skyscanner/backpack-web';

function MyComponent() {
  return <BpkLink href="/path" implicit>Link</BpkLink>;
}`;

    const result = transformLinkImplicit(input, "test.tsx");

    expect(result.modified).toBe(false);
    expect(result.code).toBe(input);
  });

  it("should handle BpkLink with no props", () => {
    const input = `
import { BpkLink } from '@skyscanner/backpack-web';

const link = <BpkLink>Link</BpkLink>;`;

    const result = transformLinkImplicit(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("<BpkLink implicit>");
  });

  it("should handle multiple BpkLink instances", () => {
    const input = `
import { BpkLink } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <div>
      <BpkLink href="/home">Home</BpkLink>
      <BpkLink href="/about">About</BpkLink>
      <BpkLink href="/contact">Contact</BpkLink>
    </div>
  );
}`;

    const result = transformLinkImplicit(input, "test.tsx");

    expect(result.modified).toBe(true);
    const implicitCount = (result.code.match(/implicit/g) || []).length;
    expect(implicitCount).toBe(3);
  });

  it("should handle BpkLink with multiple props", () => {
    const input = `
import { BpkLink } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <BpkLink
      href="/path"
      className="custom"
      onClick={handleClick}
    >
      Link
    </BpkLink>
  );
}`;

    const result = transformLinkImplicit(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("implicit>");
    expect(result.code).toContain('className="custom"');
    expect(result.code).toContain("onClick={handleClick}");
  });

  it("should handle component-specific import", () => {
    const input = `
import BpkLink from '@skyscanner/backpack-web/bpk-component-link';

const link = <BpkLink href="/test">Test</BpkLink>;`;

    const result = transformLinkImplicit(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("implicit>");
  });

  it("should not modify files without BpkLink", () => {
    const input = `
import { BpkButton } from '@skyscanner/backpack-web';

function MyComponent() {
  return <BpkButton>Click</BpkButton>;
}`;

    const result = transformLinkImplicit(input, "test.tsx");

    expect(result.modified).toBe(false);
    expect(result.code).toBe(input);
  });

  it("should not process non-JSX files", () => {
    const input = `
import { BpkLink } from '@skyscanner/backpack-web';

export const config = { link: BpkLink };`;

    const result = transformLinkImplicit(input, "test.ts");

    expect(result.modified).toBe(false);
  });

  it("should handle mix of implicit and non-implicit links", () => {
    const input = `
import { BpkLink } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <div>
      <BpkLink href="/path1">Link 1</BpkLink>
      <BpkLink href="/path2" implicit>Link 2</BpkLink>
      <BpkLink href="/path3">Link 3</BpkLink>
    </div>
  );
}`;

    const result = transformLinkImplicit(input, "test.tsx");

    expect(result.modified).toBe(true);
    const implicitCount = (result.code.match(/implicit/g) || []).length;
    expect(implicitCount).toBe(3); // Original 1 + 2 new
  });
});
