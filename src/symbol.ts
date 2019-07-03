import * as tsMorph from 'ts-morph';
import ts from 'typescript';

const symbolCache = new WeakMap<
  tsMorph.Project,
  Map<string, tsMorph.Symbol[]>
>();

function getProjectCache(project: tsMorph.Project) {
  if (!symbolCache.has(project)) {
    const cache = new Map<string, tsMorph.Symbol[]>();

    symbolCache.set(project, cache);

    return cache;
  }

  return symbolCache.get(project) as Map<string, tsMorph.Symbol[]>;
}

export function getGlobalSymbols(project: tsMorph.Project, name: string) {
  const projectCache = getProjectCache(project);

  if (!projectCache.has(name)) {
    const sourceFile = project.createSourceFile(
      '__global__.ts',
      `${name};this.${name};window.${name};self.${name};`,
    );

    const symbols = sourceFile
      .getDescendantsOfKind(ts.SyntaxKind.ExpressionStatement)
      .map((expression) => {
        const symbol = expression.getExpression().getSymbol();

        if (symbol) {
          return symbol;
        }

        const typeSymbol = expression
          .getExpression()
          .getType()
          .getSymbol();

        if (typeSymbol) {
          return typeSymbol;
        }

        return undefined;
      })
      .filter((symbol, index, self) => {
        return symbol && self.indexOf(symbol) === index;
      }) as tsMorph.Symbol[];

    project.removeSourceFile(sourceFile);

    projectCache.set(name, symbols);

    return symbols;
  }

  return projectCache.get(name) as tsMorph.Symbol[];
}

export function getGlobalSymbolsOrThrow(
  project: tsMorph.Project,
  name: string,
) {
  const symbols = getGlobalSymbols(project, name);
  if (symbols.length === 0) {
    throw new Error(`Failed to retrieve global symbol for ${name}`);
  }
  return symbols;
}

// 🚨🚨🚨 HACK ALERT 🚨🚨🚨
// TypeScript seems to create multiple SymbolObject instances for the same
// logical symbol under unknown circumstances. Checking for symbol equality
// instead by comparing properties which aren't publicly exposed.
export function areSameSymbol(a: tsMorph.Symbol, b: tsMorph.Symbol): boolean {
  if (a === b) {
    return true;
  }

  const symbolA = a.compilerSymbol as any;
  const symbolB = b.compilerSymbol as any;

  if (symbolA.declaration !== symbolB.declaration) {
    return false;
  }

  if (symbolA.parent !== symbolB.parent) {
    return false;
  }

  if (a.compilerSymbol.name !== b.compilerSymbol.name) {
    return false;
  }

  if (
    a.compilerSymbol.declarations.length !==
    b.compilerSymbol.declarations.length
  ) {
    return false;
  }

  const equalDeclarations = a.compilerSymbol.declarations.every(
    (declaration, index) => {
      return b.compilerSymbol.declarations[index] === declaration;
    },
  );

  if (!equalDeclarations) {
    return false;
  }

  return true;
}

function getPolyfillSymbolNames(polyfill: string) {
  const esSymbolMemberMatch = /^([A-Z][a-zA-Z]+\.prototype)\.@@([a-z]+)$/.exec(
    polyfill,
  );
  if (esSymbolMemberMatch) {
    return [`${esSymbolMemberMatch[1]}[Symbol.${esSymbolMemberMatch[2]}]`];
  }

  if (polyfill === 'Element.prototype.dataset') {
    return ['HTMLElement.prototype.dataset'];
  }

  if (polyfill === 'Element.prototype.placeholder') {
    return ['HTMLInputElement.prototype.dataset'];
  }

  if (polyfill === 'Number.Epsilon') {
    return ['Number.EPSILON'];
  }

  if (polyfill === 'UserTiming') {
    return [
      'performance',
      'Performance',
      'PerformanceEntry',
      'PerformanceMark',
      'PerformanceMeasure',
    ];
  }

  if (polyfill === 'WebAnimations') {
    // TODO: Test Element.prototype.animate, document.timeline
    return [
      'Animation',
      'AnimationEffect',
      'AnimationEvent',
      'AnimationTimeline',
      'AnimationPlaybackEvent',
      'DocumentTimeline',
      'KeyframeEffect',
    ];
  }

  if (polyfill === `~viewport`) {
    return [
      'scrollX',
      'scrollY',
      'innerWidth',
      'innerHeight',
      'pageXOffset',
      'pageYOffset',
    ];
  }

  return [polyfill];
}

function getPolyfillSymbols(project: tsMorph.Project, polyfill: string) {
  let symbols: tsMorph.Symbol[] = [];

  const symbolNames = getPolyfillSymbolNames(polyfill);
  symbolNames.forEach((name) => {
    symbols = symbols.concat(getGlobalSymbolsOrThrow(project, name));
  });

  return symbols;
}

export function getSymbols(project: tsMorph.Project, polyfills: string[]) {
  const symbols = new Map<string, tsMorph.Symbol[]>();

  polyfills.forEach((polyfill) => {
    symbols.set(polyfill, getPolyfillSymbols(project, polyfill));
  });

  return symbols;
}

export function matchSymbol(node: tsMorph.Node, symbol: tsMorph.Symbol) {
  const nodeSymbol = node.getSymbol();
  return nodeSymbol !== undefined && areSameSymbol(nodeSymbol, symbol);
}
