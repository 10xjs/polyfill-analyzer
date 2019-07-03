import {analyze} from '../analyze';
import {project} from './project';

describe('String.prototype', () => {
  const polyfills = ['String.prototype.padStart'];

  describe('should match', () => {
    test.each<string>([
      `String.prototype.padStart;`,
      `''.padStart();`,
      `var foo = ''; foo.padStart();`,
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.String.prototype.padStart;`,
      `this.String.prototype.padStart;`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual(polyfills);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      `(() => {var foo = { padStart(){} }; foo.padStart();})()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});

describe('String static', () => {
  const polyfills = ['String.fromCodePoint'];

  describe('should match', () => {
    test.each<string>([
      `String.fromCodePoint`,
      `String.fromCodePoint()`,
      // Some global declarations are missing on Window
      // https://github.com/Microsoft/TypeScript/issues/19816
      // `window.String.fromCodePoint();`,
      `this.String.fromCodePoint();`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([
        'String.fromCodePoint',
      ]);
    });
  });

  describe('should not match', () => {
    test.each<string>([
      // It should not match when shadowed.
      `(() => { var String = { fromCodePoint(){ return undefined; } }; String.fromCodePoint(); })()`,
    ])('`%s`', (source) => {
      expect(analyze({source, project, include: polyfills})).toEqual([]);
    });
  });
});
