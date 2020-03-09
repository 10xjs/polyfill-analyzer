# @10xjs/polyfill-analyzer

> Analyze a javascript file to determine which polyfills are necessary to run it. Designed for use with [`polyfill-library`](https://github.com/Financial-Times/polyfill-library).

## Usage

Polyfill analyzer statically analyzes a string of javascript and returns an array of polyfill feature names compatible with with [`polyfill-library`](https://github.com/Financial-Times/polyfill-library).

```js
import fs from 'fs';
import {analyze} from '@10xjs/polyfill-analyzer';

const features = analyze({
  source: s.readFileSync('./bundle.js', 'utf-8'),
  // `include` is a list of feature names to detect. Without a value provided,
  // `analyze` will default to detecting all possible features (using
  // `polyfillLibrary.listAllPolyfills()`). If you know your browser support 
  // target, `include` should be provided as the list of only the polyfills
  // possibly needed for the targeted browsers.
  include: [
    'Symbol',
    'Symbol.toStringTag',
    'Symbol.iterator',
    'Array.from',
    'Object.entries',
    'Array.prototype.findIndex',
    'Object.keys',
    'Object.getOwnPropertyDescriptor',
    'Object.getOwnPropertyDescriptors',
  ],
  // Configure the behavior when an an entry in the `include` array is not a
  // detectable polyfill. (Not all features listed by
  // polyfillLibrary.listAllPolyfills()` can be detected.)
  // Allowed values are "ignore", "warn", and "error";
  unsupportedPolyfill: 'ignore',
});

// Returns an array of feature names which can be used to generate a custom
// polyfill bundle using `polyfillLibrary.getPolyfillString()`.

// [
//   'Symbol',
//   'Symbol.toStringTag',
//   'Array.from',
//   'Object.keys',
//   'Object.getOwnPropertyDescriptor',
//   'Object.getOwnPropertyDescriptors',
// ]

```

## API

### `analyze(options)`
Get a list of polyfills necessary for running a string of javascript.

- `@param {string} [options.source]` Javascript source code.
- `@param {string[]} [options.include]` List of polyfills (from polyfill-library) to detect. Defaults to all detectable polyfills.
- `@param {string[]} [options.exclude=[]]` List of polyfills to ignore. The exclude list has precedence over the include list.
- `@param {"ignore"|"warn"|"error"} [options.unsupportedPolyfill="error"]` Specify the behavior when an included unsupported polyfill is encountered in the `options.include` list.
 