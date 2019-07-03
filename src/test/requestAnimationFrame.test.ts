import {analyze} from '../analyze';
import {project} from './project';

describe('requestAnimationFrame', () => {
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
      // It should not match when shadowed.
      `(() => { var requestAnimationFrame = () => {}; requestAnimationFrame(); })()`,
      `var foo = { requestAnimationFrame(){} }; foo.requestAnimationFrame();`,
    ])('`%s`', (source) => {
      expect(
        analyze({source, project, include: ['requestAnimationFrame']}),
      ).toEqual([]);
    });
  });
});
