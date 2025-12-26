import { parseSync } from '@swc/core';

export interface TransformResult {
  code: string;
  modified: boolean;
}

const BACKPACK_PACKAGE = 'backpack-react-native';
const BACKPACK_WEB_PACKAGE = '@skyscanner/backpack-web';

/**
 * Transform BpkBottomSheet padding (Backpack v40.0.0)
 * - Adds paddingType="compact" to maintain old 16px padding behavior
 * - Adds PADDING_TYPE import if needed
 *
 * Note: Default padding increased from 16px to 24px in v40.0.0
 */
export function transformBottomSheetPadding(code: string, filename: string): TransformResult {
  try {
    // Only process TypeScript/JavaScript files
    const isTypeScript = filename.endsWith('.ts') || filename.endsWith('.tsx');
    const isJSX = filename.endsWith('.tsx') || filename.endsWith('.jsx');

    if (!isJSX && !filename.endsWith('.js')) {
      return { code, modified: false };
    }

    // Parse to check if file has BpkBottomSheet
    const ast = parseSync(code, {
      syntax: isTypeScript ? 'typescript' : 'ecmascript',
      tsx: isJSX,
      decorators: true,
    });

    let hasBpkBottomSheet = false;

    // Check imports for BpkBottomSheet
    for (const node of ast.body) {
      if (node.type === 'ImportDeclaration') {
        const isBackpackImport =
          node.source.value === BACKPACK_PACKAGE ||
          node.source.value === BACKPACK_WEB_PACKAGE ||
          node.source.value === '@skyscanner/backpack-web/bpk-component-bottom-sheet';

        if (isBackpackImport && node.specifiers) {
          for (const spec of node.specifiers) {
            // Check named imports
            if (spec.type === 'ImportSpecifier') {
              const importedName = spec.imported?.value || spec.local.value;
              if (importedName === 'BpkBottomSheet') {
                hasBpkBottomSheet = true;
                break;
              }
            }
            // Check default imports (e.g., import BpkBottomSheet from '...')
            if (spec.type === 'ImportDefaultSpecifier' && spec.local.value === 'BpkBottomSheet') {
              hasBpkBottomSheet = true;
              break;
            }
          }
        }
      }
      if (hasBpkBottomSheet) break;
    }

    if (!hasBpkBottomSheet) {
      return { code, modified: false };
    }

    let transformedCode = code;
    let modified = false;

    // Match BpkBottomSheet components without paddingType prop
    // Handle both with props and without props
    const bottomSheetPattern = /<BpkBottomSheet(\s+([^>]*?))?>/g;

    transformedCode = transformedCode.replace(bottomSheetPattern, (match, _whitespaceAndProps, props) => {
      // Skip if paddingType already exists
      if (props && /paddingType\s*=/.test(props)) {
        return match;
      }

      modified = true;

      // Add paddingType="compact" to maintain old behavior
      if (props && props.trim()) {
        return `<BpkBottomSheet ${props.trim()} paddingType="compact">`;
      } else {
        return `<BpkBottomSheet paddingType="compact">`;
      }
    });

    return {
      code: transformedCode,
      modified,
    };
  } catch (error) {
    console.error(`Error transforming ${filename}:`, error);
    return { code, modified: false };
  }
}
