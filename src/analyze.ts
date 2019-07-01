import ts from 'typescript';
import * as tsMorph from 'ts-morph';

import allPolyfills from './polyfills';

interface Match {
  kind?: ts.SyntaxKind;
  operatorTokenKind?: ts.SyntaxKind;
  typeSymbolName?: string;
  symbolName?: string;
  expression?: Match;
  name?: Match;
  initializer?: Match;
  left?: Match;
  right?: Match;
}

export function analyze(options: {
  source: string;
  include?: string[];
  exclude?: string[];
}) {
  const {source, include = allPolyfills, exclude = []} = options;

  const polyfills = include.filter((polyfill) => !exclude.includes(polyfill));

  const matches: [string, Match][] = [];

  polyfills.forEach((polyfill: string) => {
    const parts = polyfill.split('.');

    if (parts.length === 1) {
      if (/^[a-z]/.test(polyfill)) {
        // foobar()
        matches.push([
          polyfill,
          {
            kind: ts.SyntaxKind.CallExpression,
            expression: {
              typeSymbolName: polyfill,
            },
          },
        ]);
        // foo = foobar
        // matches.push([
        //   polyfill,
        //   {
        //     kind: ts.SyntaxKind.BinaryExpression,
        //     right: {
        //       typeSymbolName: polyfill,
        //     },
        //   },
        // ]);
        // var foo = foobar
        // matches.push([
        //   polyfill,
        //   {
        //     kind: ts.SyntaxKind.VariableDeclaration,
        //     initializer: {
        //       typeSymbolName: polyfill,
        //     },
        //   },
        // ]);
      } else {
        // new Foobar()
        matches.push([
          polyfill,
          {
            kind: ts.SyntaxKind.NewExpression,
            expression: {
              typeSymbolName: polyfill,
            },
          },
        ]);
        // Foobar.foobar()
        matches.push([
          polyfill,
          {
            kind: ts.SyntaxKind.PropertyAccessExpression,
            expression: {
              typeSymbolName: polyfill,
            },
          },
        ]);
        // Foobar instanceof Object
        matches.push([
          polyfill,
          {
            kind: ts.SyntaxKind.BinaryExpression,
            left: {
              typeSymbolName: polyfill,
            },
          },
        ]);
      }
    }
    // else if (parts.length == 2) {
    //   match.push({
    //     symbol: parts[1],
    //     parent: {symbol: parts[0] + 'Constructor'},
    //   });
    // } else if (parts.length === 3) {
    //   if (/^@@/.test(parts[2])) {
    //     // match.push({
    //     // })
    //     // match.push({
    //     //   symbol: parts[2].slice(2),
    //     //   parent: {
    //     //     symbol: 'SymbolConstructor',
    //     //     parent:
    //     //   },
    //     // });
    //   }

    //   if (parts[1] === 'prototype') {
    //     match.push({
    //       symbol: parts[2],
    //       parent: {symbol: parts[0]},
    //     });
    //   }
    // }
  });

  const project = new tsMorph.Project({
    compilerOptions: {
      target: ts.ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile('file.ts', source);

  function isSymbolMatch(
    targetWithSymbol: {getSymbol(): tsMorph.Symbol | undefined},
    symbolName: string,
  ) {
    const symbol = targetWithSymbol.getSymbol();
    return symbol && symbol.getName() === symbolName;
  }

  function isTypeSymbolMatch(node: tsMorph.Node, typeSymbolName: string) {
    return isSymbolMatch(node.getType(), typeSymbolName);
  }

  function isMatch(node: tsMorph.Node, match: Match) {
    if (match.kind && match.kind !== node.getKind()) {
      return false;
    }

    if (
      match.typeSymbolName &&
      !isTypeSymbolMatch(node, match.typeSymbolName)
    ) {
      return false;
    }

    if (match.symbolName && !isSymbolMatch(node, match.symbolName)) {
      return false;
    }

    if (match.initializer) {
      if (!(node as any).getInitializer) {
        return false;
      }

      if (!isMatch((node as any).getInitializer(), match.initializer)) {
        return false;
      }
    }

    if (match.expression) {
      if (!tsMorph.TypeGuards.hasExpression(node)) {
        return false;
      }

      if (!isMatch(node.getExpression(), match.expression)) {
        return false;
      }
    }

    if (match.name) {
      if (!tsMorph.TypeGuards.hasName(node)) {
        return false;
      }

      if (!isMatch(node.getNameNode(), match.name)) {
        return false;
      }
    }

    if (match.left) {
      if (!(node as any).getLeft) {
        return false;
      }

      if (!isMatch((node as any).getLeft(), match.left)) {
        return false;
      }
    }

    if (match.right) {
      if (!(node as any).getRight) {
        return false;
      }

      if (!isMatch((node as any).getRight(), match.right)) {
        return false;
      }
    }

    return true;
  }

  let results: Set<string> = new Set();

  function walk(node: tsMorph.Node) {
    for (const [polyfill, match] of matches) {
      if (!results.has(polyfill) && isMatch(node, match)) {
        // results.push({
        // polyfill,
        // nodeText: node.getText(),
        // });
        results.add(polyfill);
      }
    }

    for (let i = 0; i < node.getChildCount(); i++) {
      walk(node.getChildAtIndex(i));
    }
  }

  walk(sourceFile);

  return Array.from(results);
}
