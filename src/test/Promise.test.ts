import {analyze} from '../analyze';
import {project} from './project';

describe('Promise', () => {
  const polyfills = ['Promise'];

  describe('should match', () => {
    test.each<string>([
      `Promise`,
      `Promise.resolve()`,
      `new Promise()`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.Promise;`,
      `this.Promise;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { function Promise() {}; new Promise(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});

describe('Promise.prototype', () => {
  const polyfills = ['Promise.prototype.finally'];

  describe('should match', () => {
    test.each<string>([
      `Promise.prototype.finally`,
      `Promise.resolve().finally()`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.Promise.prototype.finally;`,
      `this.Promise.prototype.finally;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { function Promise() {}; Promise.prototype.finally = () => {}; new Promise().finally(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
