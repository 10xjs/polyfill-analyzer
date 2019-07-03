import {analyze} from '../analyze';
import {project} from './project';

describe('IntersectionObserver', () => {
  const polyfills = ['IntersectionObserver'];

  describe('should match', () => {
    test.each<string>([
      `IntersectionObserver`,
      `new IntersectionObserver()`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.IntersectionObserver;`,
      `this.IntersectionObserver;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { function IntersectionObserver() {}; new IntersectionObserver(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
