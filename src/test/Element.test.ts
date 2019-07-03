import {analyze} from '../analyze';
import {project} from './project';

describe('Element.prototype', () => {
  const polyfills = ['Element.prototype.classList'];

  describe('should match', () => {
    test.each<string>([
      `Element.prototype.classList;`,
      // It should match Classes extending Element.
      `HTMLDivElement.prototype.classList;`,
      `document.createElement('').classList();`,
      `var foo = document.createElement(''); foo.classList();`,
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.Element.prototype.classList;`,
      `this.Element.prototype.classList;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => {var foo = { classList(){} }; foo.classList();})()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
