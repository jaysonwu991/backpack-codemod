import type { Module } from "@swc/types";

export interface TransformResult {
  code: string;
  modified: boolean;
}

export const BACKPACK_PACKAGE = "backpack-react-native";
export const BACKPACK_WEB_PACKAGE = "@skyscanner/backpack-web";

export function isJsLike(filename: string): boolean {
  return (
    filename.endsWith(".ts") ||
    filename.endsWith(".tsx") ||
    filename.endsWith(".js") ||
    filename.endsWith(".jsx")
  );
}

export function isJsxLike(filename: string): boolean {
  return filename.endsWith(".tsx") || filename.endsWith(".jsx") || filename.endsWith(".js");
}

export function isScssLike(filename: string): boolean {
  return filename.endsWith(".scss") || filename.endsWith(".sass");
}

export function isFromPackage(
  sourceValue: string,
  packages: string[],
  matchSubpath = false,
): boolean {
  return packages.some((pkg) => (matchSubpath ? sourceValue.includes(pkg) : sourceValue === pkg));
}

export function hasImport(
  ast: Module,
  importName: string,
  packages: string[],
  options?: { includeDefault?: boolean; matchSubpath?: boolean },
): boolean {
  const includeDefault = options?.includeDefault ?? false;
  const matchSubpath = options?.matchSubpath ?? false;

  for (const node of ast.body) {
    if (node.type !== "ImportDeclaration") continue;
    if (!isFromPackage(node.source.value, packages, matchSubpath)) continue;
    if (!node.specifiers) continue;

    for (const spec of node.specifiers) {
      if (spec.type === "ImportSpecifier") {
        const importedName = spec.imported?.value || spec.local.value;
        if (importedName === importName) return true;
      }
      if (includeDefault && spec.type === "ImportDefaultSpecifier") {
        if (spec.local.value === importName) return true;
      }
    }
  }

  return false;
}
