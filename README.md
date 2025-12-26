# Backpack Codemod

A codemod tool for migrating Backpack breaking changes (v41.0.0+) using AST transformations powered by SWC.

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
- 🧪 Well-tested with comprehensive test coverage
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

## Usage

### CLI

```bash
# Run transformation
node dist/cli.js --transform bpk-button-v2 --path ./src

# Run SCSS migration
node dist/cli.js --transform scss-use-migration --path ./src

# Run BpkBottomSheet padding transform
node dist/cli.js --transform bottom-sheet-padding --path ./src

# Dry run (see what would change without modifying files)
node dist/cli.js --transform bpk-button-v2 --path ./src --dry

# Verbose output
node dist/cli.js --transform bpk-button-v2 --path ./src --verbose

# Custom file extensions
node dist/cli.js --transform bpk-button-v2 --path ./src --extensions ts tsx

# Short aliases
node dist/cli.js -t bpk-button-v2 -p ./src -d -v
```

### CLI Options

- `-t, --transform` - Transform to apply (required): `bpk-button-v2`, `scss-use-migration`, `bottom-sheet-padding`
- `-p, --path` - Path to files or directory (default: `./src`)
- `-e, --extensions` - File extensions to process (default: `['ts', 'tsx', 'js', 'jsx']`)
- `-d, --dry` - Dry run mode (no files will be modified)
- `-v, --verbose` - Verbose output
- `-h, --help` - Show help

### Programmatic API

```typescript
import { transformBpkButton, transformScssUse, transformBottomSheetPadding } from 'backpack-codemod';

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
│   │   └── bottom-sheet-padding.ts # BpkBottomSheet padding
│   ├── utils/                     # Helper utilities
│   │   └── ast-helpers.ts
│   ├── tests/                     # Test files
│   │   ├── bpk-button-v2.test.ts
│   │   ├── scss-use-migration.test.ts
│   │   └── bottom-sheet-padding.test.ts
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
- **Vitest** - Fast unit testing (26 tests, all passing)
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

See [TRANSFORM_USE_CASES.md](./TRANSFORM_USE_CASES.md) for complete details.

## Contributing

1. Add new transforms in `src/transforms/`
2. Add corresponding tests in `src/__tests__/`
3. Export transform in `src/index.ts`
4. Update this README with usage examples

## License

MIT
