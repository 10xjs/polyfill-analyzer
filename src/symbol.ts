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
/**
 * Get a list of TypeScript checker symbol instances for a global identifier.
 * This function returns a list as opposed to a single symbol as some global
 * identifiers are defined multiple times in the TypeScript core lib
 * definitions.
 *
 * i.e. `window.requestAnimationFrame` is not equal to
 * `globalThis.requestAnimationFrame` inside the checker.
 * @param project
 * @param name
 */
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

/**
 * Get a list of TypeScript checker symbol instances for a global identifier or
 * throw an error if no symbols are found.
 * @param project
 * @param name
 */
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

/**
 * Test the equality of two TypeScript checker symbols.
 *
 * 🚨🚨🚨 HACK ALERT 🚨🚨🚨
 * TypeScript seems to create multiple SymbolObject instances for the same
 * logical symbol under circumstances that I have yet to analyze. This function
 * falls back to * comparing properties which aren't publicly exposed by the
 * compiler.
 * @param a
 * @param b
 */
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

/**
 * Map a supported polyfill-library polyfill name to a list of global TypeScript
 * identifier. Most polyfill names can be used as literal identifiers. Any
 * exceptions are handled here.
 * @param polyfill
 */
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

/**
 * Map a supported polyfill-library name to list of TypeScript checker symbol
 * instances.
 * @param project
 * @param polyfill
 */
function getPolyfillSymbols(project: tsMorph.Project, polyfill: string) {
  let symbols: tsMorph.Symbol[] = [];

  const symbolNames = getPolyfillSymbolNames(polyfill);
  symbolNames.forEach((name) => {
    symbols = symbols.concat(getGlobalSymbolsOrThrow(project, name));
  });

  return symbols;
}

/**
 * Map a list of supported polyfill-library names to map of TypeScript checker
 * symbol instances.
 * @param project
 * @param polyfill
 */
export function getSymbols(project: tsMorph.Project, polyfills: string[]) {
  const symbols = new Map<string, tsMorph.Symbol[]>();

  polyfills.forEach((polyfill) => {
    symbols.set(polyfill, getPolyfillSymbols(project, polyfill));
  });

  return symbols;
}

/**
 * Check if a TypeScript AST node represents a checker symbol instance.
 * @param symbol
 */
export function matchSymbol(node: tsMorph.Node, symbol: tsMorph.Symbol) {
  const nodeSymbol = node.getSymbol();
  return nodeSymbol !== undefined && areSameSymbol(nodeSymbol, symbol);
}
