import * as tsMorph from 'ts-morph';

import allPolyfills from './polyfills';
import {createProject} from './project';
import {getSymbols, matchSymbol} from './symbol';

/**
 * A filtered list of polyfill names from `polyfill-library` whose target
 * features can be identified in the TypesScript AST.
 */
export const supportedPolyfills = allPolyfills.filter((polyfill) => {
  // Ignore Intl local polyfills.
  if (/^Intl\.~locale\./.test(polyfill)) {
    return false;
  }

  // Ignore internal polyfills. These are provided by polyfill-library only as
  // shared dependencies for other exposed polyfills.
  if (/^_/.test(polyfill)) {
    return false;
  }

  // Event types don't represent global compiler symbols. Checking for them
  // will require a different AST matching approach.
  if (
    polyfill === 'Event.focusin' ||
    polyfill === 'Event.focusout' ||
    polyfill === 'Event.hashchange'
  ) {
    // TODO: Create AST match patterns for events.
    // Maybe match on `<Component onFocusIn={}/>` and on
    // `Element.addEventListener('focusin')`?
    return false;
  }

  // Ignore `console.profiles()` polyfill. I can't find any documentation on
  // what this feature is or which environments natively support it. The
  // polyfill source in polyfill-library is
  // `this.console.profiles = function profiles() {};` - which doesn't help
  // explain what the feature actually is.
  // see https://github.com/Financial-Times/polyfill-service/pull/570
  if (polyfill === 'console.profiles') {
    return false;
  }

  // The dom lib does not include `requestIdleCallback` since it is an
  // "experimental" API.
  // see: https://github.com/microsoft/TypeScript/issues/21309
  if (polyfill === 'requestIdleCallback') {
    return false;
  }

  // Ignore the html5 element polyfill (which resolves to html5shiv).
  if (polyfill === '~html5-elements') {
    // TODO: Look into ways to detect use of html5 elements. Potentially
    // match on `document.createElement('section')` and JSX `<section>`.
    // Unfortuantely `createElement('section')` can't be matched reliably.
    // Also maybe match on `HTMLSectionElement`?
    return false;
  }

  return true;
});

export function isSupportedPolyfill(polyfill: string) {
  return supportedPolyfills.includes(polyfill);
}

export function isSupportedPolyfillOrThrow(polyfill: string) {
  if (isSupportedPolyfill(polyfill)) {
    return true;
  }

  throw new Error(`Encountered non-supported polyfill: ${polyfill}`);
}

export function isSupportedPolyfillOrWarn(polyfill: string) {
  if (isSupportedPolyfill(polyfill)) {
    return true;
  }

  console.warn(`Encountered non-supported polyfill: ${polyfill}`);

  return false;
}

/**
 *
 * @param options.source TypeScript source code.
 * @param options.project Provide an existing project instance to improve performance of multiple calls to analyze.
 * @param options.include List of polyfills (from polyfill-library) to detect.
 * @param options.exclude List of polyfills to ignore. The exclude list has precedence over the include list.
 * @param options.strict TypeScript source code.
 * @param options.unsupportedPolyfill Specify the behavior when an included unsupported polyfill is encountered.
 */
export function analyze(options: {
  source: string;
  project?: tsMorph.Project;
  include?: string[];
  exclude?: string[];
  unsupportedPolyfill?: 'throw' | 'warn' | 'ignore';
}) {
  const {
    source,
    project = createProject(),
    include = supportedPolyfills,
    exclude = [],
    unsupportedPolyfill = 'throw',
  } = options;

  const filteredPolyfills =
    include === supportedPolyfills
      ? include
      : unsupportedPolyfill === 'throw'
      ? include.filter(isSupportedPolyfillOrThrow)
      : unsupportedPolyfill === 'warn'
      ? include.filter(isSupportedPolyfillOrWarn)
      : include.filter(isSupportedPolyfill);

  const polyfills = filteredPolyfills.filter(
    (polyfill) => !exclude.includes(polyfill),
  );

  const symbols = getSymbols(project, polyfills);

  const sourceFile = project.createSourceFile('source.ts', source);

  let matched: Set<string> = new Set();

  function walk(node: tsMorph.Node) {
    for (const [polyfill, polyfillSymbols] of symbols) {
      if (matched.has(polyfill)) {
        continue;
      }

      for (const pattern of polyfillSymbols) {
        if (matchSymbol(node, pattern)) {
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
