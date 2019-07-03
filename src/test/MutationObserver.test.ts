import {analyze} from '../analyze';
import {project} from './project';

describe('MutationObserver', () => {
  const polyfills = ['MutationObserver'];

  describe('should match', () => {
    test.each<string>([
      `MutationObserver`,
      `new MutationObserver()`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.MutationObserver;`,
      `this.MutationObserver;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { function MutationObserver() {}; new MutationObserver(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
