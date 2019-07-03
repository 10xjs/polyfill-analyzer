import {analyze} from '../analyze';
import {project} from './project';

describe('EventSource', () => {
  const polyfills = ['EventSource'];

  describe('should match', () => {
    test.each<string>([
      `EventSource`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.EventSource;`,
      `this.EventSource;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { function EventSource() {} new EventSource(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
