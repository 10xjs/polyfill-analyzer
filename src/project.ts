import * as tsMorph from 'ts-morph';
import ts from 'typescript';

export function createProject() {
  return new tsMorph.Project({
    compilerOptions: {
      target: ts.ScriptTarget.Latest,
    },
  });
}
