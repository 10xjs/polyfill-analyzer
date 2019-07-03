import {analyze} from '../analyze';
import {project} from './project';

describe('Map', () => {
  const polyfills = ['Map'];

  describe('should match', () => {
    test.each<string>([
      `Map`,
      `new Map()`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.Map();`,
      `new this.Map;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { function Map(){}; new Map(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
