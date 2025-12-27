import { parseSync, printSync } from "@swc/core";
import type { Module, ImportDeclaration, ExportNamedDeclaration } from "@swc/types";

export interface TransformResult {
  code: string;
  modified: boolean;
}

export function parseCode(code: string, filename: string): Module {
  return parseSync(code, {
    syntax: filename.endsWith(".tsx") || filename.endsWith(".ts") ? "typescript" : "ecmascript",
    tsx: filename.endsWith(".tsx"),
    decorators: true,
  });
}

export function printCode(ast: Module): string {
  return printSync(ast).code;
}

export function isImportFromPackage(node: ImportDeclaration, packageName: string): boolean {
  return node.source.value === packageName;
}

export function isExportFromPackage(node: ExportNamedDeclaration, packageName: string): boolean {
  if (node.type === "ExportNamedDeclaration" && node.source) {
    return node.source.value === packageName;
  }
  return false;
}

export function hasImportSpecifier(node: ImportDeclaration, specifierName: string): boolean {
  if (!node.specifiers) return false;

  return node.specifiers.some((spec) => {
    if (spec.type === "ImportSpecifier") {
      return spec.imported?.value === specifierName || spec.local.value === specifierName;
    }
    return false;
  });
}

export function removeImportSpecifier(
  node: ImportDeclaration,
  specifierName: string,
): ImportDeclaration {
  if (!node.specifiers) return node;

  return {
    ...node,
    specifiers: node.specifiers.filter((spec) => {
      if (spec.type === "ImportSpecifier") {
        return spec.imported?.value !== specifierName && spec.local.value !== specifierName;
      }
      return true;
    }),
  };
}

export function addImportSpecifier(
  node: ImportDeclaration,
  specifierName: string,
  alias?: string,
): ImportDeclaration {
  const newSpecifier = {
    type: "ImportSpecifier" as const,
    span: { start: 0, end: 0, ctxt: 0 },
    local: {
      type: "Identifier" as const,
      span: { start: 0, end: 0, ctxt: 0 },
      value: alias || specifierName,
      optional: false,
    },
    imported: alias
      ? {
          type: "Identifier" as const,
          span: { start: 0, end: 0, ctxt: 0 },
          value: specifierName,
          optional: false,
        }
      : undefined,
    isTypeOnly: false,
  };

  return {
    ...node,
    specifiers: [...(node.specifiers || []), newSpecifier],
  };
}
