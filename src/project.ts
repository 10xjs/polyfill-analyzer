import * as tsMorph from 'ts-morph';
import ts from 'typescript';

/**
 * Get a tsMorph.Project instance to be used by `analyze`.
 */
export function createProject() {
  return new tsMorph.Project({
    compilerOptions: {
      target: ts.ScriptTarget.Latest,
    },
  });
}
