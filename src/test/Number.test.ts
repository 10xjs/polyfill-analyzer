import {analyze} from '../analyze';
import {project} from './project';

describe('Number static', () => {
  const polyfills = ['Number.isFinite'];

  describe('should match', () => {
    test.each<string>([
      `Number.isFinite`,
      `Number.isFinite()`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.Number.isFinite;`,
      `this.Number.isFinite();`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { const Number = { isFinite(){} }; Number.isFinite(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
