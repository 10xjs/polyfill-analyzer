import {analyze} from '../analyze';
import {project} from './project';

describe('Array.prototype', () => {
  const polyfills = ['Array.prototype.copyWithin'];

  describe('should match', () => {
    test.each<string>([
      `Array.prototype.copyWithin;`,
      `[].copyWithin();`,
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.Array.prototype.copyWithin;`,
      `this.Array.prototype.copyWithin;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      `(() => {var foo = { copyWithin(){} }; foo.copyWithin();})()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});

describe('Array static', () => {
  const polyfills = ['Array.from'];

  describe('should match', () => {
    test.each<string>([
      `Array.from`,
      `Array.from()`,
      `var foo = Array.from; foo();`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.Array.from();`,
      `this.Array.from();`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([
        'Array.from',
      ]);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { var Array = { from(){ return undefined; } }; Array.from(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
