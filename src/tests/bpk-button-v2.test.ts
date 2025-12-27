import { describe, it, expect } from "vitest";
import { transformBpkButton } from "../transforms/bpk-button-v2";

describe("transformBpkButton", () => {
  it("should transform BpkButton import to BpkButtonV2", () => {
    const input = `import { BpkButton } from '@skyscanner/backpack-web';`;

    const result = transformBpkButton(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("BpkButtonV2");
    expect(result.code).not.toContain("BpkButton,");
  });

  it("should transform multiple imports including BpkButton", () => {
    const input = `import { BpkButton, BpkText } from '@skyscanner/backpack-web';`;

    const result = transformBpkButton(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("BpkButtonV2");
    expect(result.code).toContain("BpkText");
  });

  it("should transform JSX BpkButton elements to BpkButtonV2", () => {
    const input = `
import { BpkButton } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <BpkButton onClick={handleClick}>
      Click me
    </BpkButton>
  );
}`;

    const result = transformBpkButton(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("<BpkButtonV2");
    expect(result.code).toContain("</BpkButtonV2>");
    expect(result.code).not.toMatch(/<BpkButton[^V]/); // Ensure no <BpkButton without V2
  });

  it("should transform self-closing BpkButton elements", () => {
    const input = `
import { BpkButton } from '@skyscanner/backpack-web';

function MyComponent() {
  return <BpkButton onClick={handleClick} />;
}`;

    const result = transformBpkButton(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("<BpkButtonV2");
    expect(result.code).not.toMatch(/<BpkButton[^V]/); // Ensure no <BpkButton without V2
  });

  it("should handle backpack-react-native package", () => {
    const input = `import { BpkButton } from 'backpack-react-native';`;

    const result = transformBpkButton(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("BpkButtonV2");
  });

  it("should not modify files without BpkButton", () => {
    const input = `
import { BpkText } from '@skyscanner/backpack-web';

function MyComponent() {
  return <BpkText>Hello</BpkText>;
}`;

    const result = transformBpkButton(input, "test.tsx");

    expect(result.modified).toBe(false);
    expect(result.code).toBe(input);
  });

  it("should handle complex component with multiple BpkButton instances", () => {
    const input = `
import { BpkButton, BpkCard } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <BpkCard>
      <BpkButton primary>Primary</BpkButton>
      <BpkButton secondary>Secondary</BpkButton>
      <BpkButton>Default</BpkButton>
    </BpkCard>
  );
}`;

    const result = transformBpkButton(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("BpkButtonV2");
    expect(result.code).toContain("BpkCard");
    const buttonV2Count = (result.code.match(/BpkButtonV2/g) || []).length;
    expect(buttonV2Count).toBeGreaterThan(3); // At least import + 3 usages
  });

  it("should not modify non-Backpack imports", () => {
    const input = `import { Button } from 'react-native';`;

    const result = transformBpkButton(input, "test.tsx");

    expect(result.modified).toBe(false);
    expect(result.code).toBe(input);
  });

  it("should handle TypeScript files", () => {
    const input = `
import { BpkButton } from '@skyscanner/backpack-web';

const MyComponent: React.FC = () => {
  return <BpkButton onClick={() => {}}>Click</BpkButton>;
};`;

    const result = transformBpkButton(input, "test.tsx");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("BpkButtonV2");
  });
});
