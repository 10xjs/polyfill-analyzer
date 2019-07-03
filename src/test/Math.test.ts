import {analyze} from '../analyze';
import {project} from './project';

describe('Math static', () => {
  const polyfills = ['Math.clz32'];

  describe('should match', () => {
    test.each<string>([
      `Math.clz32`,
      `Math.clz32()`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.Math.clz32;`,
      `this.Math.clz32();`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { const Math = { clz32(){} }; Math.clz32(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
