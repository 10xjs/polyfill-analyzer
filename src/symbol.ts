import * as tsMorph from 'ts-morph';
import ts from 'typescript';

const symbolCache = new WeakMap<
  tsMorph.Project,
  Map<string, tsMorph.Symbol | undefined>
>();

function getProjectCache(project: tsMorph.Project) {
  if (!symbolCache.has(project)) {
    const cache = new Map<string, tsMorph.Symbol | undefined>();

    symbolCache.set(project, cache);

    return cache;
  }

  return symbolCache.get(project) as Map<string, tsMorph.Symbol | undefined>;
}

export function getGlobalSymbol(project: tsMorph.Project, name: string) {
  const projectCache = getProjectCache(project);

  if (!projectCache.has(name)) {
    const sourceFile = project.createSourceFile('__global_temp__.ts', name);

    const symbol = sourceFile
      .set({statements: [name], kind: tsMorph.StructureKind.SourceFile})
      .getFirstDescendantByKindOrThrow(ts.SyntaxKind.Identifier)
      .getSymbol();

    project.removeSourceFile(sourceFile);

    projectCache.set(name, symbol);

    return symbol;
  }

  return projectCache.get(name);
}
