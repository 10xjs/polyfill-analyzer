import {analyze} from '../analyze';
import {project} from './project';

describe('JSON', () => {
  const polyfills = ['JSON'];

  describe('should match', () => {
    test.each<string>([
      `JSON`,
      `JSON.parse()`,
      `JSON.stringify()`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.JSON;`,
      `this.JSON;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { const JSON = { parse(){}, stringify(){}}; JSON.parse(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
