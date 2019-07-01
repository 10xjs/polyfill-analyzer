import {analyze} from '../analyze';

describe('requestAnimationFrame', () => {
  describe('negative matches', () => {
    test.each<string>([
      `requestAnimationFrame`,
      `this.requestAnimationFrame`,
      `foo = requestAnimationFrame`,
      `typeof requestAnimationFrame`,
      `var foo = {requestAnimationFrame(){}};foo.requestAnimationFrame();`,
      `(function (w) { w.requestAnimationFrame() })()`,
      `({foo(){this.requestAnimationFrame()}}).foo()`,
    ])('`%s`', async (source) => {
      expect(await analyze(source)).toEqual([]);
    });
  });

  describe('positive matches', () => {
    test.each<string>([
      `requestAnimationFrame()`,
      `requestAnimationFrame instanceof foo`,
      `var foo = requestAnimationFrame; foo();`,
      `window.requestAnimationFrame();`,
      `this.requestAnimationFrame();`,
      `(() => { this.requestAnimationFrame() })`,
      `(function (w) { w.requestAnimationFrame() })(this)`,
    ])('`%s`', async (source) => {
      expect(await analyze(source)).toEqual(['requestAnimationFrame']);
    });
  });
});
