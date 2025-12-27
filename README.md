# Backpack Codemod

A codemod tool for migrating Backpack breaking changes (v18.0.0+) using AST transformations powered by SWC.

## Quick Start

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run on your codebase (dry run first!)
node dist/cli.js --transform bpk-button-v2 --path ./src --dry

# Apply transformations
node dist/cli.js --transform bpk-button-v2 --path ./src
```

## Features

- 🚀 Fast AST-based transformations using SWC
- 🔍 Automatic detection and transformation of deprecated APIs
- 🧪 Well-tested with comprehensive test coverage (61 tests)
- 📦 Built with TypeScript, Vite, and Vitest
- 🎯 Support for TypeScript and JavaScript (`.ts`, `.tsx`, `.js`, `.jsx`)

## Installation

```bash
# Using pnpm
pnpm install

# Build the project
pnpm build
```

## Available Transforms

### `bpk-button-v2`

Migrates from legacy `BpkButton` (V1) to `BpkButtonV2`.

**Version:** Backpack v41.0.0 (Dec 16, 2024)

**What it does:**

- Replaces `BpkButton` imports with `BpkButtonV2`
- Updates all JSX usage from `<BpkButton>` to `<BpkButtonV2>`
- Handles both self-closing and regular JSX elements
- Works with both `@skyscanner/backpack-web` and `backpack-react-native` packages

**Before:**

```tsx
import { BpkButton } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <BpkButton onClick={handleClick}>
      Click me
    </BpkButton>
  );
}
```

**After:**

```tsx
import { BpkButtonV2 } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <BpkButtonV2 onClick={handleClick}>
      Click me
    </BpkButtonV2>
  );
}
```

---

### `scss-use-migration`

Migrates SCSS from `@import` to `@use` syntax (Backpack v39.0.0).

**Version:** Backpack v39.0.0 (Oct 29, 2024)

**What it does:**

- Replaces `@import` with `@use` for Backpack SCSS files
- Updates `unstable__bpk-mixins` to `bpk-mixins`
- Adds namespace to mixin usage (e.g., `bpk-mixins.bpk-border-radius-sm`)

**Before:**

```scss
@import '~@skyscanner/backpack-web/unstable__bpk-mixins';

.my-component {
  @include bpk-border-radius-sm;
  @include bpk-margin(16px);
}
```

**After:**

```scss
@use '~@skyscanner/backpack-web/bpk-mixins';

.my-component {
  @include bpk-mixins.bpk-border-radius-sm;
  @include bpk-mixins.bpk-margin(16px);
}
```

---

### `bottom-sheet-padding`

Adds `paddingType="compact"` to `BpkBottomSheet` to maintain old padding behavior.

**Version:** Backpack v40.0.0 (Oct 29, 2024)

**What it does:**

- Adds `paddingType="compact"` prop to existing `BpkBottomSheet` components
- Maintains the old 16px padding (default changed to 24px in v40.0.0)
- Skips components that already have `paddingType` prop

**Before:**

```tsx
import { BpkBottomSheet } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <BpkBottomSheet onClose={handleClose}>
      <div>Content</div>
    </BpkBottomSheet>
  );
}
```

**After:**

```tsx
import { BpkBottomSheet } from '@skyscanner/backpack-web';

function MyComponent() {
  return (
    <BpkBottomSheet onClose={handleClose} paddingType="compact">
      <div>Content</div>
    </BpkBottomSheet>
  );
}
```

**Note:** If you want to adopt the new 24px padding, use `paddingType="default"` or remove the transform.

---

### `price-marker-v2`

Migrates `BpkPriceMarkerV2` to `BpkPriceMarker`.

**Version:** Backpack v38.0.0 (Jul 16, 2025)

**What it does:**

- Renames `BpkPriceMarkerV2` to `BpkPriceMarker`
- Updates imports from `bpk-component-price-marker-v2` to `bpk-component-price-marker`

**Before:**

```tsx
import { BpkPriceMarkerV2 } from '@skyscanner/backpack-web/bpk-component-price-marker-v2';
```

**After:**

```tsx
import { BpkPriceMarker } from '@skyscanner/backpack-web/bpk-component-price-marker';
```

---

### `link-implicit`

Adds the `implicit` prop to `BpkLink` to maintain the pre-v37 visual style.

**Version:** Backpack v37.0.0 (Apr 10, 2025)

**What it does:**

- Adds `implicit` to `<BpkLink>` without the prop
- Leaves existing `implicit` usage untouched

**Before:**

```tsx
<BpkLink href="/path">Link</BpkLink>
```

**After:**

```tsx
<BpkLink href="/path" implicit>Link</BpkLink>
```

---

### `badge-v2`

Migrates `BpkBadgeV2` to `BpkBadge`.

**Version:** Backpack v32.0.0 (Feb 16, 2025)

**What it does:**

- Renames `BpkBadgeV2` to `BpkBadge` in code and JSX

---

### `badge-types`

Updates renamed badge type constants and props.

**Version:** Backpack v18.0.0

**What it does:**

- `BADGE_TYPES.destructive` → `BADGE_TYPES.critical`
- `BADGE_TYPES.light` → `BADGE_TYPES.normal`
- Updates `type="destructive"` and `type="light"` string props

---

## Usage

### CLI

```bash
# Run transformation
node dist/cli.js --transform bpk-button-v2 --path ./src

# Run SCSS migration
node dist/cli.js --transform scss-use-migration --path ./src

# Run BpkBottomSheet padding transform
node dist/cli.js --transform bottom-sheet-padding --path ./src

# Run multiple transforms together
node dist/cli.js --transform bpk-button-v2 --transform link-implicit --path ./src

# Run all available transforms
node dist/cli.js --transform all --path ./src

# Filter transforms by Backpack version range
node dist/cli.js --transform all --from 32.0.0 --to 41.0.0 --path ./src

# Dry run (see what would change without modifying files)
node dist/cli.js --transform bpk-button-v2 --path ./src --dry

# Verbose output
node dist/cli.js --transform bpk-button-v2 --path ./src --verbose

# Custom file extensions
node dist/cli.js --transform bpk-button-v2 --path ./src --extensions ts tsx

# Short aliases
node dist/cli.js -t bpk-button-v2 -p ./src -d -v

# List available transforms
node dist/cli.js --list
```

### CLI Options

- `-t, --transform` - Transform(s) to apply, supports multiple values or `all`
- `-p, --path` - Path to files or directory (default: `./src`)
- `-e, --extensions` - File extensions to process (defaults to selected transform extensions)
- `-d, --dry` - Dry run mode (no files will be modified)
- `-v, --verbose` - Verbose output
- `--from` - Backpack version you are upgrading from (exclusive lower bound)
- `--to` - Backpack version you are upgrading to (inclusive upper bound)
- `--list` - List available transforms and exit
- `-h, --help` - Show help

### Programmatic API

```typescript
import {
  transformBpkButton,
  transformScssUse,
  transformBottomSheetPadding,
  transformPriceMarkerV2,
  transformLinkImplicit,
  transformBadgeV2,
  transformBadgeTypes,
} from 'backpack-codemod';

const code = `
import { BpkButton } from '@skyscanner/backpack-web';

export const MyButton = () => <BpkButton>Click</BpkButton>;
`;

const result = transformBpkButton(code, 'MyComponent.tsx');

console.log(result.code); // Transformed code
console.log(result.modified); // true if changes were made
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Build
pnpm build

# Build and watch for changes
pnpm dev
```

## Project Structure

```
backpack-codemod/
├── src/
│   ├── transforms/                 # Transform implementations
│   │   ├── bpk-button-v2.ts       # BpkButton V1 → V2
│   │   ├── scss-use-migration.ts  # SCSS @import → @use
│   │   ├── bottom-sheet-padding.ts # BpkBottomSheet padding
│   │   ├── price-marker-v2.ts     # BpkPriceMarker V2 → default
│   │   ├── link-implicit.ts       # BpkLink implicit prop
│   │   ├── badge-v2.ts            # BpkBadge V2 → default
│   │   └── badge-types.ts         # Badge type renames
│   ├── utils/                     # Helper utilities
│   │   └── ast-helpers.ts
│   ├── tests/                     # Test files
│   │   ├── bpk-button-v2.test.ts
│   │   ├── scss-use-migration.test.ts
│   │   ├── bottom-sheet-padding.test.ts
│   │   ├── price-marker-v2.test.ts
│   │   ├── link-implicit.test.ts
│   │   ├── badge-v2.test.ts
│   │   └── badge-types.test.ts
│   ├── index.ts                   # Main exports
│   └── cli.ts                     # CLI implementation
├── examples/                      # Example transformations
├── dist/                          # Built files
├── TRANSFORM_USE_CASES.md         # Detailed use cases documentation
├── CHANGELOG.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── README.md
```

## Technology Stack

- **TypeScript** - Type-safe code
- **SWC** - Fast JavaScript/TypeScript compiler for AST parsing
- **Vite** - Fast build tool
- **Vitest** - Fast unit testing (61 tests, all passing)
- **pnpm** - Fast, disk space efficient package manager

## Breaking Changes Addressed

This codemod addresses breaking changes from multiple Backpack releases:

### v41.0.0 (Dec 16, 2024)

- **BpkButton V1 Removal**: Legacy BpkButton removed; use BpkButtonV2
- **Link Styling**: Updated underline behavior for link/linkOnDark types

### v40.0.0 (Oct 29, 2024)

- **BpkBottomSheet**: Default padding increased from 16px to 24px
- **BpkCardList**: Padding/margin changes

### v39.0.0 (Oct 29, 2024)

- **SCSS Migration**: Deprecated `@import` in favor of `@use`

### v38.0.0 (Jul 16, 2025)

- **BpkPriceMarker V2 Removal**: Consolidated into `BpkPriceMarker`

### v37.0.0 (Apr 10, 2025)

- **BpkLink Styling Change**: Old default now requires `implicit`

### v32.0.0 (Feb 16, 2025)

- **BpkBadge V2 Removal**: `BpkBadgeV2` consolidated into `BpkBadge`

### v18.0.0 (Jan 31, 2024)

- **Badge Type Renames**: `destructive` → `critical`, `light` → `normal`

See [TRANSFORM_USE_CASES.md](./TRANSFORM_USE_CASES.md) for complete details.

## Contributing

1. Add new transforms in `src/transforms/`
2. Add corresponding tests in `src/__tests__/`
3. Export transform in `src/index.ts`
4. Update this README with usage examples

## License

MIT
