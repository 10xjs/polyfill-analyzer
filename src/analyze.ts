import * as tsMorph from 'ts-morph';

import allPolyfills from './polyfills';
import {createProject} from './project';
import {getPatterns, matchPattern} from './pattern';

export function analyze(options: {
  source: string;
  project?: tsMorph.Project;
  include?: string[];
  exclude?: string[];
}) {
  const {
    source,
    project = createProject(),
    include = allPolyfills,
    exclude = [],
  } = options;

  const polyfills = include.filter((polyfill) => !exclude.includes(polyfill));

  const patterns = getPatterns(project, polyfills);

  const sourceFile = project.createSourceFile('source.ts', source);

  let matched: Set<string> = new Set();

  function walk(node: tsMorph.Node) {
    for (const [polyfill, polyfillPatterns] of patterns) {
      if (matched.has(polyfill)) {
        continue;
      }

      for (const pattern of polyfillPatterns) {
        if (matchPattern(node, pattern)) {
          matched.add(polyfill);
        }
      }
    }

    for (const childNode of node.getChildren()) {
      walk(childNode);
    }
  }

  walk(sourceFile);

  project.removeSourceFile(sourceFile);

  return Array.from(matched);
}
