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
      `this.${name};window.${name};self.${name};`,
    );

    const symbols = sourceFile
      .getDescendantsOfKind(ts.SyntaxKind.PropertyAccessExpression)
      .map((expression) => {
        return expression.getSymbol();
      })
      .filter(Boolean) as tsMorph.Symbol[];

    project.removeSourceFile(sourceFile);

    projectCache.set(name, symbols);

    return symbols;
  }

  return projectCache.get(name) as tsMorph.Symbol[];
}
