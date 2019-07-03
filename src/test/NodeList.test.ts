import {analyze} from '../analyze';
import {project} from './project';

describe('NodeList.prototype', () => {
  const polyfills = ['NodeList.prototype.forEach'];

  describe('should match', () => {
    test.each<string>([
      `NodeList.prototype.forEach;`,
      // TODO: FIX THIS!
      // `document.body.childNodes.forEach()`,

      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.NodeList.prototype.forEach;`,
      `this.NodeList.prototype.forEach;`,
    ])('`%s`', (source) => {
      expect(
        analyze({
          source,
          project,
          include: polyfills,
        }),
      ).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      `(() => { var foo = { forEach(){} }; foo.forEach(); })()`,
    ])('`%s`', (source) => {
      expect(
        analyze({
          source,
          project,
          include: polyfills,
        }),
      ).toEqual([]);
    });
  });
});
