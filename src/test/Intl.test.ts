import {analyze} from '../analyze';
import {project} from './project';

describe('Intl', () => {
  const polyfills = ['Intl'];

  describe('should match', () => {
    test.each<string>([
      `Intl`,
      `new Intl.NumberFormat()`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.Intl;`,
      `this.Intl;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { const Intl = { NumberFormat(){} }; new Intl.Intl.NumberFormat(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
