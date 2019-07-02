import ts from 'typescript';
import * as tsMorph from 'ts-morph';

// @ts-ignore
import {getSyntaxKindName} from 'ts-morph/dist/utils';

import {getGlobalSymbols} from './symbol';

export interface Pattern {
  // symbol?: tsMorph.Symbol;
  kind?: ts.SyntaxKind;
  typeSymbol?: tsMorph.Symbol;

  // CallExpression
  // PropertyAccessExpression
  // NewExpression
  expression?: Pattern;

  // PropertyAccessExpression
  name?: string;

  // BinaryExpression
  operatorToken?: Pattern;
  left?: Pattern;
  right?: Pattern;
}

export function getPatterns(
  project: tsMorph.Project,
  polyfills: string[],
  loose: boolean = false,
) {
  function getTargetPatterns(parts: string[]): Pattern[] {
    const identifier = parts[0];
    const globalSymbols = getGlobalSymbols(project, identifier);

    if (!globalSymbols.length) {
      throw new Error(`Failed to retrieve global symbol for ${identifier}`);
    }

    if (parts.length === 3 && parts[1] === 'prototype') {
      const member = parts[2];

      return globalSymbols.map((symbol) => {
        return {
          kind: ts.SyntaxKind.PropertyAccessExpression,
          expression: {
            typeSymbol: symbol,
          },
          name: member,
        };
      });
    }

    if (parts.length === 2) {
      const member = parts[1];

      return globalSymbols.map((symbol) => {
        return {
          kind: ts.SyntaxKind.PropertyAccessExpression,
          expression: {
            typeSymbol: symbol,
          },
          name: member,
        };
      });
    }

    if (parts.length === 1) {
      return globalSymbols.map((symbol) => {
        return {
          typeSymbol: symbol,
        };
      });
    }

    return [];
  }

  const patterns = new Map<string, Pattern[]>();

  polyfills.forEach((polyfill) => {
    const polyfillPatterns: Pattern[] = [];

    const parts = polyfill.split('.');

    if (parts[0] === 'Intl') {
      return;
    }

    if (parts[0] === 'Event') {
      return;
    }

    if (parts[0][0] === '_') {
      return;
    }

    const targetPatterns = getTargetPatterns(parts);

    if (!targetPatterns.length) {
      throw new Error(`Invalid ${polyfill}`);
    }

    if (loose) {
      targetPatterns.forEach((targetPattern) => {
        polyfillPatterns.push(targetPattern);
      });
    } else {
      targetPatterns.forEach((targetPattern) => {
        // identifier()
        polyfillPatterns.push({
          kind: ts.SyntaxKind.CallExpression,
          expression: targetPattern,
        });

        // identifier.property
        polyfillPatterns.push({
          kind: ts.SyntaxKind.PropertyAccessExpression,
          expression: targetPattern,
        });

        // identifier instanceof foo
        polyfillPatterns.push({
          kind: ts.SyntaxKind.BinaryExpression,
          operatorToken: {
            kind: ts.SyntaxKind.InstanceOfKeyword,
          },
          left: targetPattern,
        });

        // foo instanceof identifier
        polyfillPatterns.push({
          kind: ts.SyntaxKind.BinaryExpression,
          operatorToken: {
            kind: ts.SyntaxKind.InstanceOfKeyword,
          },
          right: targetPattern,
        });

        // new Identifier()
        polyfillPatterns.push({
          kind: ts.SyntaxKind.NewExpression,
          expression: targetPattern,
        });
      });
    }

    patterns.set(polyfill, polyfillPatterns);
  });

  return patterns;
}

export function matchPattern(node: tsMorph.Node, pattern: Pattern) {
  // if (pattern.symbol !== undefined && node.getSymbol() !== pattern.symbol) {
  //   return false;
  // }

  if (pattern.kind !== undefined && node.getKind() !== pattern.kind) {
    return false;
  }

  if (
    pattern.typeSymbol !== undefined &&
    node.getType().getSymbol() !== pattern.typeSymbol
  ) {
    return false;
  }

  if (pattern.expression !== undefined) {
    if (!tsMorph.TypeGuards.hasExpression(node)) {
      return false;
    }

    if (!matchPattern(node.getExpression(), pattern.expression)) {
      return false;
    }
  }

  if (pattern.name !== undefined) {
    if (!tsMorph.TypeGuards.hasName(node)) {
      return false;
    }

    if (node.getName() !== pattern.name) {
      return false;
    }
  }

  if (pattern.left !== undefined) {
    if (!tsMorph.TypeGuards.isBinaryExpression(node)) {
      return false;
    }

    if (!matchPattern(node.getLeft(), pattern.left)) {
      return false;
    }
  }

  if (pattern.operatorToken !== undefined) {
    if (!tsMorph.TypeGuards.isBinaryExpression(node)) {
      return false;
    }

    if (!matchPattern(node.getOperatorToken(), pattern.operatorToken)) {
      return false;
    }
  }

  if (pattern.right !== undefined) {
    if (!tsMorph.TypeGuards.isBinaryExpression(node)) {
      return false;
    }

    if (!matchPattern(node.getRight(), pattern.right)) {
      return false;
    }
  }

  return true;
}

export function printPattern(pattern: Pattern) {
  const {
    // symbol,
    kind,
    typeSymbol,
    expression,
    operatorToken,
    left,
    right,
    name,
    text,
  } = pattern;

  const result: Record<string, any> = {};

  // if (symbol !== undefined) {
  //   result.symbol = symbol.getFullyQualifiedName();
  // }
  if (kind !== undefined) {
    result.kind = getSyntaxKindName(kind);
  }
  if (typeSymbol !== undefined) {
    result.typeSymbol = typeSymbol.getFullyQualifiedName();
  }
  if (expression !== undefined) {
    result.expression = printPattern(expression);
  }
  if (name !== undefined) {
    result.name = name;
  }
  if (left !== undefined) {
    result.left = printPattern(left);
  }
  if (operatorToken !== undefined) {
    result.operatorToken = printPattern(operatorToken);
  }
  if (right !== undefined) {
    result.right = printPattern(right);
  }

  return result;
}

export function printPatterns(patterns: Map<string, Pattern[]>) {
  return Array.from(patterns).map(([polyfill, patterns]) => [
    polyfill,
    patterns.map(printPattern),
  ]);
}
