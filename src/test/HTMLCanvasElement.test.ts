import {analyze} from '../analyze';
import {project} from './project';

describe('HTMLCanvasElement.prototype', () => {
  const polyfills = ['HTMLCanvasElement.prototype.toBlob'];

  describe('should match', () => {
    test.each<string>([
      `HTMLCanvasElement.prototype.toBlob;`,
      `new HTMLCanvasElement().toBlob`,
      `var canvas = new HTMLCanvasElement(); canvas.toBlob()`,
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.HTMLCanvasElement.prototype.toBlob;`,
      `this.HTMLCanvasElement.prototype.toBlob;`,
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
      `(() => { var foo = { toBlob(){} }; foo.toBlob(); })()`,
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
