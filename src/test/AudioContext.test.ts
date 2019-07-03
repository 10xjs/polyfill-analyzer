import {analyze} from '../analyze';
import {project} from './project';

describe('AudioContext', () => {
  const polyfills = ['AudioContext'];

  describe('should match', () => {
    test.each<string>([
      `AudioContext`,
      `new AudioContext()`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.AudioContext();`,
      `new this.AudioContext;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { function AudioContext(){}; new AudioContext(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
