import { parseSync } from '@swc/core';

export interface TransformResult {
  code: string;
  modified: boolean;
}

const BACKPACK_PACKAGE = 'backpack-react-native';
const BACKPACK_WEB_PACKAGE = '@skyscanner/backpack-web';

/**
 * Transform BpkLink to add implicit prop (Backpack v37.0.0)
 * - Adds implicit prop to maintain old default style
 * - New explicit style is now default; old style requires implicit prop
 *
 * Note: This is conservative - only adds implicit to links without it
 */
export function transformLinkImplicit(code: string, filename: string): TransformResult {
  try {
    // Only process TypeScript/JavaScript files with JSX
    const isTypeScript = filename.endsWith('.ts') || filename.endsWith('.tsx');
    const isJSX = filename.endsWith('.tsx') || filename.endsWith('.jsx');

    if (!isJSX) {
      return { code, modified: false };
    }

    // Parse to check if file has BpkLink
    const ast = parseSync(code, {
      syntax: isTypeScript ? 'typescript' : 'ecmascript',
      tsx: isJSX,
      decorators: true,
    });

    let hasBpkLink = false;

    // Check imports for BpkLink
    for (const node of ast.body) {
      if (node.type === 'ImportDeclaration') {
        const isBackpackImport =
          node.source.value === BACKPACK_PACKAGE ||
          node.source.value === BACKPACK_WEB_PACKAGE ||
          node.source.value.includes('bpk-component-link');

        if (isBackpackImport && node.specifiers) {
          for (const spec of node.specifiers) {
            if (spec.type === 'ImportSpecifier' || spec.type === 'ImportDefaultSpecifier') {
              const importedName = spec.type === 'ImportSpecifier'
                ? (spec.imported?.value || spec.local.value)
                : spec.local.value;
              if (importedName === 'BpkLink') {
                hasBpkLink = true;
                break;
              }
            }
          }
        }
      }
      if (hasBpkLink) break;
    }

    if (!hasBpkLink) {
      return { code, modified: false };
    }

    let transformedCode = code;
    let modified = false;

    // Match BpkLink components without implicit prop
    // Handle both with props and without props
    const linkPattern = /<BpkLink(\s+([^>]*?))?>/g;

    transformedCode = transformedCode.replace(linkPattern, (match, _whitespaceAndProps, props) => {
      // Skip if implicit already exists
      if (props && /\bimplicit\b/.test(props)) {
        return match;
      }

      modified = true;

      // Add implicit prop to maintain old style
      if (props && props.trim()) {
        return `<BpkLink ${props.trim()} implicit>`;
      } else {
        return `<BpkLink implicit>`;
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
