import {analyze} from '../../analyze';
import {createProject} from '../../project';

describe('requestAnimationFrame', () => {
  const project = createProject();

  describe('should match', () => {
    test.each<string>([
      `requestAnimationFrame`,
      `requestAnimationFrame()`,
      `var foo = requestAnimationFrame; foo();`,
      `window.requestAnimationFrame();`,
      `this.requestAnimationFrame();`,
    ])('`%s`', (source) => {
      expect(
        analyze({source, project, include: ['requestAnimationFrame']}),
      ).toEqual(['requestAnimationFrame']);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      `var foo = {requestAnimationFrame(){}};foo.requestAnimationFrame();`,
      `(function (w) { w.requestAnimationFrame() })()`,
      `({foo(){this.requestAnimationFrame()}}).foo()`,
    ])('`%s`', (source) => {
      expect(
        analyze({source, project, include: ['requestAnimationFrame']}),
      ).toEqual([]);
    });
  });
});
