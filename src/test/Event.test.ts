import {analyze} from '../analyze';
import {project} from './project';

describe('Event', () => {
  const polyfills = ['Event'];

  describe('should match', () => {
    test.each<string>([
      `Event`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.Event;`,
      `this.Event;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { function Event() {}; new Event(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
