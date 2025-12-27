# Changelog

All notable changes to the Backpack codemod will be documented in this file.

## [1.0.0] - 2025-12-26

### Added

- Initial release of Backpack codemod with 3 transforms
- `bpk-button-v2` transform for migrating from BpkButton V1 to BpkButtonV2
- `scss-use-migration` transform for SCSS @import → @use migration
- `bottom-sheet-padding` transform for BpkBottomSheet padding updates
- Support for both `@skyscanner/backpack-web` and `backpack-react-native` packages
- CLI tool with dry-run mode, verbose output, and customizable file extensions
- Comprehensive test suite with 26 test cases (all passing)
- Support for TypeScript, JavaScript, and SCSS files (`.ts`, `.tsx`, `.js`, `.jsx`, `.scss`)
- AST-based parsing using SWC for reliable detection
- Detailed use cases documentation ([TRANSFORM_USE_CASES.md](./TRANSFORM_USE_CASES.md))
- Examples directory with before/after transformations

### Features

- **BpkButton V1 → V2**: Automatic import and JSX element transformation
- **SCSS Migration**: Converts @import to @use with namespace support for mixins
- **BpkBottomSheet**: Adds paddingType="compact" to maintain old 16px padding
- Self-closing JSX element support
- Preserves code formatting and structure
- Error handling and detailed reporting
- Batch processing of multiple files
- Programmatic API for library integration

### Technical

- Built with TypeScript 5.9+
- Powered by SWC for fast AST parsing
- Vite for optimized builds
- Vitest for comprehensive testing
- pnpm for efficient package management
- Reorganized folder structure (removed `__tests__` prefix for cleaner organization)

## Breaking Changes Addressed

This codemod addresses breaking changes from Backpack releases:

### v41.0.0 (Dec 16, 2024)

- BpkButton V1 fully removed; all usages must migrate to BpkButtonV2
- Link/linkOnDark styling updates

### v40.0.0 (Oct 29, 2024)

- BpkBottomSheet default padding increased from 16px to 24px
- BpkCardList padding/margin changes

### v39.0.0 (Oct 29, 2024)

- SCSS @import deprecated in favor of @use
- unstable\_\_bpk-mixins replaced with bpk-mixins
