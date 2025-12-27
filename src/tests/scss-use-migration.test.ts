import { describe, it, expect } from "vitest";
import { transformScssUse } from "../transforms/scss-use-migration";

describe("transformScssUse", () => {
  it("should transform @import to @use", () => {
    const input = `@import '~@skyscanner/backpack-web/bpk-mixins';`;
    const expected = `@use '~@skyscanner/backpack-web/bpk-mixins';`;

    const result = transformScssUse(input, "test.scss");

    expect(result.modified).toBe(true);
    expect(result.code).toBe(expected);
  });

  it("should replace unstable__bpk-mixins with bpk-mixins", () => {
    const input = `@import '~@skyscanner/backpack-web/unstable__bpk-mixins';`;

    const result = transformScssUse(input, "test.scss");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("bpk-mixins");
    expect(result.code).not.toContain("unstable__bpk-mixins");
  });

  it("should add namespace to mixin usage", () => {
    const input = `
@import '~@skyscanner/backpack-web/bpk-mixins';

.my-component {
  @include bpk-border-radius-sm;
  @include bpk-margin(16px);
}`;

    const result = transformScssUse(input, "test.scss");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("@include bpk-mixins.bpk-border-radius-sm");
    expect(result.code).toContain("@include bpk-mixins.bpk-margin");
  });

  it("should handle multiple imports and mixins", () => {
    const input = `
@import '~@skyscanner/backpack-web/unstable__bpk-mixins';
@import '~@skyscanner/backpack-web/bpk-tokens';

.card {
  @include bpk-border-radius-md;
  @include bpk-padding(24px);
  @include bpk-rtl {
    margin-left: 16px;
  }
}`;

    const result = transformScssUse(input, "test.scss");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("@use '~@skyscanner/backpack-web/bpk-mixins'");
    expect(result.code).toContain("@use '~@skyscanner/backpack-web/bpk-tokens'");
    expect(result.code).toContain("@include bpk-mixins.bpk-border-radius-md");
    expect(result.code).toContain("@include bpk-mixins.bpk-padding");
    expect(result.code).toContain("@include bpk-mixins.bpk-rtl");
    expect(result.code).not.toContain("unstable__bpk-mixins");
  });

  it("should handle RTL mixins", () => {
    const input = `
@import '~@skyscanner/backpack-web/bpk-mixins';

.component {
  @include bpk-margin-leading(16px);
  @include bpk-padding-trailing(8px);
}`;

    const result = transformScssUse(input, "test.scss");

    expect(result.modified).toBe(true);
    expect(result.code).toContain("@include bpk-mixins.bpk-margin-leading");
    expect(result.code).toContain("@include bpk-mixins.bpk-padding-trailing");
  });

  it("should not modify non-SCSS files", () => {
    const input = `@import '~@skyscanner/backpack-web/bpk-mixins';`;

    const result = transformScssUse(input, "test.ts");

    expect(result.modified).toBe(false);
    expect(result.code).toBe(input);
  });

  it("should not modify files without backpack imports", () => {
    const input = `
.my-component {
  color: red;
  padding: 10px;
}`;

    const result = transformScssUse(input, "test.scss");

    expect(result.modified).toBe(false);
    expect(result.code).toBe(input);
  });

  it("should handle imports without tilde prefix", () => {
    const input = `@import '@skyscanner/backpack-web/bpk-mixins';`;
    const expected = `@use '~@skyscanner/backpack-web/bpk-mixins';`;

    const result = transformScssUse(input, "test.scss");

    expect(result.modified).toBe(true);
    expect(result.code).toBe(expected);
  });
});
