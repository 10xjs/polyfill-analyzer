import {analyze} from '../analyze';
import {project} from './project';

describe('RegExp.prototype', () => {
  const polyfills = ['RegExp.prototype.flags'];

  describe('should match', () => {
    test.each<string>([
      `RegExp.prototype.flags;`,
      `/foo/.flags;`,
      `var foo = /foo/; foo.flags;`,
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.RegExp.prototype.flags;`,
      `this.RegExp.prototype.flags;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([`(() => {var foo = { flags: '' }; foo.flags; })()`])(
      '`%s`',
      (source) => {
        expect(analyze({source, project, include: polyfills})).toEqual([]);
      },
    );
  });
});
