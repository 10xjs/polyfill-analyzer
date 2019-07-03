import {analyze} from '../analyze';
import {project} from './project';

describe('Object static', () => {
  const polyfills = ['Object.assign'];

  describe('should match', () => {
    test.each<string>([
      `Object.assign`,
      `Object.assign()`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.Object.assign;`,
      `this.Object.assign();`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { const Object = { assign(){} }; Object.assign(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
