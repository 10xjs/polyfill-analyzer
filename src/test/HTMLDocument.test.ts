import {analyze} from '../analyze';
import {project} from './project';

describe('HTMLDocument', () => {
  const polyfills = ['HTMLDocument'];

  describe('should match', () => {
    test.each<string>([
      `HTMLDocument`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.HTMLDocument;`,
      `this.HTMLDocument;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { function HTMLDocument() {}; new HTMLDocument(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
