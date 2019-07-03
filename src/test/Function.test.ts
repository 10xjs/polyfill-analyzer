import {analyze} from '../analyze';
import {project} from './project';

describe('Function.prototype', () => {
  const polyfills = ['Function.prototype.bind'];

  describe('should match', () => {
    test.each<string>([
      `Function.prototype.bind;`,
      `console.log.bind();`,
      `function foo(){}; foo.bind();`,
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.Function.prototype.bind;`,
      `this.Function.prototype.bind;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([`(() => { var foo = { bind(){} }; foo.bind(); })()`])(
      '`%s`',
      (source) => {
        expect(analyze({source, project, include: polyfills})).toEqual([]);
      },
    );
  });
});
