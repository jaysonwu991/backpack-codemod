# Backpack Codemod Transformation Use Cases

## Comprehensive Analysis of All Breaking Changes (v1.0.0 - v41.2.0)

This document catalogs **ALL** transformation use cases identified from analyzing 27 pages of Backpack releases, grouped by priority and type.

---

## 📊 Breaking Changes Summary

**Total Breaking Releases Analyzed:** 27+ major versions
**Breaking Changes Identified:** 50+
**Deprecations Tracked:** 15+
**Current Transforms Implemented:** 7 ✅

---

## 🎯 Priority 1: Critical Breaking Changes (Implemented)

### ✅ 1.1 BpkButton V1 → V2 Migration

**Version:** 41.0.0 (Dec 16, 2024)
**Status:** ✅ **IMPLEMENTED**
**Impact:** HIGH - Component completely removed

**Changes:**

- `BpkButton` V1 completely removed
- Must migrate to `BpkButtonV2`
- Link/linkOnDark types: new underline behavior
- 8px automatic gap between text and icons

**Transform:** `bpk-button-v2`

---

### ✅ 1.2 SCSS @import → @use Migration

**Version:** 39.0.0 (Oct 29, 2024)
**Status:** ✅ **IMPLEMENTED**
**Impact:** HIGH - SCSS compilation breaking change

**Changes:**

- `@import` deprecated in favor of `@use`
- `unstable__bpk-mixins` → `bpk-mixins`
- Namespace required for mixin usage

**Transform:** `scss-use-migration`

---

### ✅ 1.3 BpkBottomSheet Padding Update

**Version:** 40.0.0 (Oct 29, 2024)
**Status:** ✅ **IMPLEMENTED**
**Impact:** MEDIUM-HIGH - Visual breaking change

**Changes:**

- Default padding: 16px → 24px
- Requires `paddingType="compact"` to maintain old behavior

**Transform:** `bottom-sheet-padding`

---

## 🔥 Priority 2: High-Impact Breaking Changes (In Progress)

### ✅ 2.1 BpkPriceMarker V2 Consolidation

**Version:** 38.0.0 (Jul 16, 2025)
**Status:** ✅ **IMPLEMENTED**
**Impact:** HIGH

**Changes:**

- `BpkPriceMarkerV2` merged into `BpkPriceMarker`
- Import path: `'bpk-component-price-marker-v2'` → `'bpk-component-price-marker'`

**Transform:** `price-marker-v2`

```tsx
// Before
import { BpkPriceMarkerV2 } from '@skyscanner/backpack-web/bpk-component-price-marker-v2';

// After
import { BpkPriceMarker } from '@skyscanner/backpack-web/bpk-component-price-marker';
```

---

### ✅ 2.2 BpkLink Implicit Prop Required

**Version:** 37.0.0 (Apr 10, 2025)
**Status:** ✅ **IMPLEMENTED**
**Impact:** HIGH - Visual breaking change

**Changes:**

- New explicit style is default
- Old style requires `implicit` boolean prop

**Transform:** `link-implicit`

```tsx
// Before (old default style)
<BpkLink href="/path">Link</BpkLink>

// After (to maintain old style)
<BpkLink href="/path" implicit>Link</BpkLink>
```

---

### 🔧 2.3 BpkTooltip Migration to floating-ui

**Version:** 37.0.0 (Apr 10, 2025)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** HIGH - API breaking change

**Removed Properties:**

- `TooltipPortal` component
- `renderTarget`
- `portalStyle`
- `portalClassName`
- `popperModifiers`
- `className`

---

### 🔧 2.4 BpkSwitch Label Removal

**Version:** 35.0.0 (Aug 28)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** HIGH

**Changes:**

- `label` property removed
- Users must provide custom layout and text positioning

---

### 🔧 2.5 BpkNudger API Simplification

**Version:** 35.0.0 (Aug 28)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM-HIGH

**Changes:**

- Number-only types
- `onChange` → `onValueChange`
- `BpkConfigurableNudger` removed

---

### 🔧 2.6 BpkSplitInput API Change

**Version:** 35.0.0 (Aug 28)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM

**Changes:**

- `onChange` → `onInputChange`

---

### 🔧 2.7 BpkDividedCard Min Width/Height Removal

**Version:** 36.0.0 (Oct 31)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM - Layout breaking change

**Changes:**

- Removed minimum width and height constraints

---

### 🔧 2.8 BpkBottomSheetV2 API Simplification

**Version:** 33.0.0 (Mar 12)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM

**Removed Properties:**

- `getApplicationElement`
- `renderTarget`

---

### ✅ 2.9 BpkBadge V2 Migration

**Version:** 32.0.0 (Feb 16)
**Status:** ✅ **IMPLEMENTED**
**Impact:** MEDIUM

**Changes:**

- `BpkBadgeV2` becomes default `BpkBadge`
- Remove V2 suffix from imports

**Transform:** `badge-v2`

---

### 🔧 2.10 BpkSlider Accessibility Labels Required

**Version:** 34.0.0 (May 9)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM - Accessibility

**Changes:**

- `ariaLabel` and `ariaValuetext` now required (arrays of strings)

---

### 🔧 2.11 BpkPopover Migration (v2 API)

**Version:** 34.0.0 (May 9)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** HIGH - Library migration

**Changes:**

- Migrated to new underlying library
- Simplified API (see migration guide)

---

### 🔧 2.12 BpkBarChart className Removal

**Version:** 34.0.0 (May 9)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** LOW-MEDIUM

**Changes:**

- `className` prop removed

---

### 🔧 2.13 Icon SCSS Imports Removed

**Version:** 31.0.0 (Oct 26)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** HIGH - Build breaking

**Changes:**

- SCSS icon functions removed (`@include bpk-icon()`)
- Must use JS components: `bpk-component-icon` or `bpk-component-spinner`

---

### 🔧 2.14 react-transition-group Peer Dependency

**Version:** 30.0.0 (Oct 19)
**Status:** 📝 **DOCUMENTATION**
**Impact:** HIGH - Build breaking

**Changes:**

- Now a peer dependency
- Users must install and manage independently

---

### 🔧 2.15 BpkNudgerRow Component Removal

**Version:** 28.0.0 (Aug 15)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM

**Changes:**

- Component removed
- Use props: `title`, `subtitle`, `icon` on nudger component

---

### 🔧 2.16 Icon aria-hidden Addition

**Version:** 26.0.0 (Aug 7)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM - Accessibility

**Changes:**

- All icons now have `aria-hidden` property by default

---

### 🔧 2.17 BpkOverlay API Update

**Version:** 25.0.0 (Jun 8)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM

**Changes:**

- Overlay component API updated
- Check migration guide for details

---

### 🔧 2.18 BpkText weight/bold Props Removal

**Version:** 24.0.0 (Jun 2)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** HIGH

**Changes:**

- `weight` and `bold` props removed
- Migration guide available

---

### 🔧 2.19 BpkLoadingButton Type Prop Change

**Version:** 33.8.0 (May 6)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM

**Changes:**

- `type="submit"` no longer works
- Use `submit` boolean prop instead
- `type` now controls styling only

---

### 🔧 2.20 BpkCalendarGrid Selection Color

**Version:** 29.0.0 (Sep 1)
**Status:** 📝 **VISUAL CHANGE**
**Impact:** LOW - Visual only

**Changes:**

- Selection color updated to surface-subtle

---

### 🔧 2.21 Slider Large Variant Removal

**Version:** 22.0.0 (Mar 17)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM

**Changes:**

- Large slider variant eliminated

---

### 🔧 2.22 BpkButton onClick Wrapper Removal

**Version:** 21.0.0 (Feb 28)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM

**Changes:**

- onClick wrapper removed

---

### 🔧 2.23 Massive Props Cleanup (v20.0.0)

**Version:** 20.0.0 (Feb 22)
**Status:** 🔧 **NEEDS MULTIPLE TRANSFORMS**
**Impact:** CRITICAL - Multiple breaking changes

**Removed:**

- `white` property
- `width` and `height` properties
- Grid component (entirely)
- Button alignment aliases
- `BpkButtonOutline` and `outline` prop
- `type` property
- `borderRadiusStyle` property
- `alternate` property
- Old uppercase input types
- Event banner alert component
- Deprecated calendar props

---

### 🔧 2.24 Price API Update

**Version:** 19.0.0 (Feb 17)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM

**Changes:**

- Price API updated
- React imports removal

---

### 🔧 2.25 Badge API Changes

**Version:** 18.0.0 (Jan 31)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM

**Changes:**

- Default badge: Warning → Normal
- `BADGE_TYPES.destructive` → `BADGE_TYPES.critical`
- `BADGE_TYPES.light` → `BADGE_TYPES.normal`

---

### 🔧 2.26 BpkContentContainer Removal

**Version:** 17.0.0 (Jan 9)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM

**Changes:**

- Component completely removed

---

### 🔧 2.27 Small Icons Size Update

**Version:** 16.0.0 (Dec 13)
**Status:** 📝 **VISUAL CHANGE**
**Impact:** LOW - Visual only

---

### 🔧 2.28 Popper.js v1 → v2 Migration

**Version:** 3.0.0 (Jun 10)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** HIGH

**Changes:**

- `popperModifiers` now accepts array of objects (not object)
- Modifiers format changed

---

### 🔧 2.29 BpkRating Size Value Change

**Version:** 2.0.1 (May 31)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** LOW

**Changes:**

- `RATING_SIZES`: `lg` → `large`

---

## 🟡 Priority 3: React Pattern Updates

### 🔧 3.1 Remove defaultProps Pattern

**Version:** 38.13.0 (Sep 23)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM - React 18 deprecation

**Components Affected:**

- BpkSkipLink
- BpkThemeProvider
- BpkFieldset
- Many others

**Transformation Needed:**

```tsx
// Before
const MyComponent = ({ size, color }) => { ... };
MyComponent.defaultProps = { size: 'medium', color: 'blue' };

// After
const MyComponent = ({ size = 'medium', color = 'blue' }) => { ... };
```

---

### 🔧 3.2 React 18 Support

**Version:** 35.0.0 (Aug 28)
**Status:** ✅ **COMPLETED** (Library level)
**Impact:** HIGH - Now supports React 17-18

---

### 🔧 3.3 React Unsafe APIs Removal

**Version:** 38.17.0 (Oct 13)
**Status:** 🔧 **NEEDS TRANSFORM**
**Impact:** MEDIUM

**Components:**

- BpkInfoBanner
- BpkBannerAlert
- AnimateHeight
- BpkBackgroundImage
- WithInfiniteScroll

**Removed:**

- `UNSAFE_componentWillReceiveProps`
- Usage moved to safer lifecycle methods

---

## 📦 Priority 4: Component Renames & Consolidations

### 🔧 4.1 Component V2 → Default Migrations

| Component      | Version  | Status    | Import Change                 |
| -------------- | -------- | --------- | ----------------------------- |
| BpkButton      | 41.0.0   | ✅ Done   | V1 removed, V2 is now default |
| BpkPriceMarker | 38.0.0   | ✅ Done   | V2 → default                  |
| BpkBadge       | 32.0.0   | ✅ Done   | V2 → default                  |
| BpkModal       | Multiple | 🔧 Needed | V2 variants                   |

---

## 🎨 Priority 5: Deprecations (Non-Breaking)

### 📝 5.1 Component Deprecations

| Component          | Version | Status        | Replacement         |
| ------------------ | ------- | ------------- | ------------------- |
| BpkTicket          | 35.5.1  | 📝 Deprecated | Alternative needed  |
| Portal             | 34.13.0 | 📝 Deprecated | Native portal APIs  |
| BpkDataTableColumn | 29.3.1  | 📝 Deprecated | New property format |
| Navigation Stack   | 6.0.0   | 📝 Deprecated | Alternative needed  |

---

## 🔍 Priority 6: TypeScript Migrations (Backward Compatible)

**Status:** ✅ **NO ACTION REQUIRED** (All backward compatible)

**Components Migrated (v38-40):**

- BpkFieldset, BpkCheckbox, BpkContentCards, BpkBreadcrumb
- BpkBlockQuote, BpkTextArea, BpkLink, BpkButton
- And 20+ more components

---

## 📊 Transform Implementation Matrix

| Transform            | Priority | Status     | Tests | Version | Complexity |
| -------------------- | -------- | ---------- | ----- | ------- | ---------- |
| bpk-button-v2        | P1       | ✅ Done    | 9/9   | 41.0.0  | Medium     |
| scss-use-migration   | P1       | ✅ Done    | 8/8   | 39.0.0  | Medium     |
| bottom-sheet-padding | P1       | ✅ Done    | 9/9   | 40.0.0  | Low        |
| price-marker-v2      | P2       | ✅ Done    | 8/8   | 38.0.0  | Low        |
| link-implicit        | P2       | ✅ Done    | 9/9   | 37.0.0  | Low        |
| tooltip-floating-ui  | P2       | 🔧 Planned | 0/?   | 37.0.0  | High       |
| switch-label-removal | P2       | 🔧 Planned | 0/?   | 35.0.0  | Medium     |
| nudger-api-change    | P2       | 🔧 Planned | 0/?   | 35.0.0  | Medium     |
| split-input-api      | P2       | 🔧 Planned | 0/?   | 35.0.0  | Low        |
| badge-v2             | P2       | ✅ Done    | 8/8   | 32.0.0  | Low        |
| slider-aria-labels   | P2       | 🔧 Planned | 0/?   | 34.0.0  | Medium     |
| popover-v2-migration | P2       | 🔧 Planned | 0/?   | 34.0.0  | High       |
| icon-scss-removal    | P2       | 🔧 Planned | 0/?   | 31.0.0  | High       |
| text-props-removal   | P2       | 🔧 Planned | 0/?   | 24.0.0  | Medium     |
| badge-types          | P2       | ✅ Done    | 10/10 | 18.0.0  | Low        |
| remove-default-props | P3       | 🔧 Planned | 0/?   | 38.13.0 | Medium     |
| react-unsafe-apis    | P3       | 🔧 Planned | 0/?   | 38.17.0 | Medium     |
| v20-props-cleanup    | P2       | 🔧 Planned | 0/?   | 20.0.0  | High       |

**Total Transforms Identified:** 40+
**Currently Implemented:** 7 (~17.5%)
**High Priority Remaining:** 12+
**Medium Priority:** 20+
**Low Priority (Visual/Docs):** 5+

---

## 🚀 Recommended Implementation Phases

### Phase 1: Critical API Changes (Completed ✅)

1. ✅ BpkButton V1 → V2
2. ✅ SCSS @import → @use
3. ✅ BpkBottomSheet padding

### Phase 2: Component Consolidations (Completed ✅)

4. ✅ BpkPriceMarker V2
5. ✅ BpkBadge V2
6. ✅ BpkLink implicit prop
7. ✅ Badge types rename

### Phase 3: API Simplifications

8. 🔧 BpkNudger onChange → onValueChange
9. 🔧 BpkSplitInput onChange → onInputChange
10. 🔧 BpkSwitch label removal
11. 🔧 BpkLoadingButton type → submit

### Phase 4: Library Migrations

12. 🔧 BpkTooltip → floating-ui
13. 🔧 BpkPopover v2
14. 🔧 Popper.js v1 → v2

### Phase 5: React Patterns

15. 🔧 Remove defaultProps pattern
16. 🔧 Remove React unsafe APIs

### Phase 6: Major Cleanups

17. 🔧 v20.0.0 massive props cleanup
18. 🔧 Icon SCSS → JS components
19. 🔧 BpkText weight/bold removal

---

## 📚 Resources

- [Backpack Releases](https://github.com/Skyscanner/backpack/releases)
- [Migration Guides](https://github.com/Skyscanner/backpack/tree/main/docs/migrations)
- [Component Documentation](https://backpack.github.io/)

---

## 🤝 Contributing New Transforms

1. Identify breaking change from releases
2. Create transform in `src/transforms/`
3. Add comprehensive tests in `src/tests/`
4. Update this document
5. Update CLI and exports

---

**Last Updated:** 2025-12-27
**Releases Analyzed:** v1.0.0 through v41.2.0 (27 pages)
**Total Breaking Changes Tracked:** 50+
