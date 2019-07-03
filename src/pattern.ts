import ts from 'typescript';
import * as tsMorph from 'ts-morph';

// @ts-ignore
import {getSyntaxKindName} from 'ts-morph/dist/utils';

import {getGlobalSymbolsOrThrow, areSameSymbol} from './symbol';

export interface Pattern {
  symbol?: tsMorph.Symbol;
  kind?: ts.SyntaxKind;

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

export function getPatterns(project: tsMorph.Project, polyfills: string[]) {
  const patterns = new Map<string, Pattern[]>();

  polyfills.forEach((polyfill) => {
    /**
     * Match top-level interfaces.
     * Examples:
     *   requestAnimationFrame
     *   getComputedStyle
     *   fetch
     *   localStorage
     */
    if (/^[a-z][a-zA-Z]+$/.test(polyfill)) {
      const symbols = getGlobalSymbolsOrThrow(project, polyfill);

      patterns.set(
        polyfill,
        symbols.map((symbol) => {
          return {
            symbol,
          };
        }),
      );
      return;
    }

    /**
     * Match statics.
     * Examples:
     *   Array.from
     *   Date.now
     *   Number.isNaN
     *   Object.is
     */
    if (/^[A-Z][a-zA-Z]+\.[a-z][a-zA-Z]+$/.test(polyfill)) {
      const symbols = getGlobalSymbolsOrThrow(project, polyfill);

      console.log(symbols[0].getFullyQualifiedName());

      patterns.set(
        polyfill,
        symbols.map((symbol) => {
          return {
            symbol,
          };
        }),
      );
      return;
    }

    /**
     * Match prototypes.
     * Examples:
     *   Array.prototype.entries
     *   String.prototype.padStart
     */
    if (/^[A-Z][a-zA-Z]+\.prototype\.[a-z][a-zA-Z]+$/.test(polyfill)) {
      const symbols = getGlobalSymbolsOrThrow(project, polyfill);

      patterns.set(
        polyfill,
        symbols.map((symbol) => {
          return {
            symbol,
          };
        }),
      );
      return;
    }

    throw new Error(`Failed to create pattern for ${polyfill}`);
  });

  return patterns;
}

export function matchPattern(node: tsMorph.Node, pattern: Pattern) {
  if (pattern.symbol !== undefined) {
    const symbol = node.getSymbol();

    if (symbol === undefined || !areSameSymbol(pattern.symbol, symbol)) {
      return false;
    }
  }

  if (pattern.kind !== undefined && node.getKind() !== pattern.kind) {
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
  const {symbol, kind, expression, operatorToken, left, right, name} = pattern;

  const result: Record<string, any> = {};

  if (symbol !== undefined) {
    result.symbol = symbol.getFullyQualifiedName();
  }
  if (kind !== undefined) {
    result.kind = getSyntaxKindName(kind);
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
