import {getPatterns, printPattern} from '../pattern';

import {createProject} from '../project';

const project = createProject();

describe('getPatterns', () => {
  test('single global identifier', () => {
    const patterns = Array.from(
      getPatterns(project, [
        'Array.from',
        'Array.isArray',
        'Array.prototype.copyWithin',
        'Array.prototype.entries',
        'AudioContext',
        'Blob',
        'CustomEvent',
        'DOMTokenList',
      ]),
    ).map(([polyfill, patterns]) => [polyfill, patterns.map(printPattern)]);

    console.log(patterns);

    // expect(getPatterns(project, ['Array'])).toMatchInlineSnapshot(`Array []`);
  });
});
