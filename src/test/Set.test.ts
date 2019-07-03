import {analyze} from '../analyze';
import {project} from './project';

describe('Set', () => {
  const polyfills = ['Set'];

  describe('should match', () => {
    test.each<string>([
      `Set`,
      `new Set()`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.Set();`,
      `new this.Set;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { function Set(){}; new Set(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
