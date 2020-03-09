import {getSymbols} from '../symbol';

import {supportedPolyfills} from '../analyze';
import {project} from './project';

test('getSymbols should return the correct map of polyfill to AST symbols', () => {
  const symbolMap = Array.from(getSymbols(project, supportedPolyfills)).map(
    ([polyfill, symbols]) => {
      return [
        polyfill,
        symbols.map((symbol) => {
          // Use `getFullyQualifiedName` to "hash" each symbol so that it can be
          // rendered to a Jest snapshot.
          return symbol.getFullyQualifiedName();
        }),
      ];
    },
  );

  expect(symbolMap).toMatchInlineSnapshot(`
    Array [
      Array [
        "AbortController",
        Array [
          "AbortController",
        ],
      ],
      Array [
        "Array.from",
        Array [
          "ArrayConstructor.from",
        ],
      ],
      Array [
        "Array.isArray",
        Array [
          "ArrayConstructor.isArray",
        ],
      ],
      Array [
        "Array.of",
        Array [
          "ArrayConstructor.of",
        ],
      ],
      Array [
        "Array.prototype.@@iterator",
        Array [
          "Array.[Symbol.iterator]",
        ],
      ],
      Array [
        "Array.prototype.copyWithin",
        Array [
          "Array.copyWithin",
        ],
      ],
      Array [
        "Array.prototype.entries",
        Array [
          "Array.entries",
        ],
      ],
      Array [
        "Array.prototype.every",
        Array [
          "Array.every",
        ],
      ],
      Array [
        "Array.prototype.fill",
        Array [
          "Array.fill",
        ],
      ],
      Array [
        "Array.prototype.filter",
        Array [
          "Array.filter",
        ],
      ],
      Array [
        "Array.prototype.find",
        Array [
          "Array.find",
        ],
      ],
      Array [
        "Array.prototype.findIndex",
        Array [
          "Array.findIndex",
        ],
      ],
      Array [
        "Array.prototype.flat",
        Array [
          "Array.flat",
        ],
      ],
      Array [
        "Array.prototype.flatMap",
        Array [
          "Array.flatMap",
        ],
      ],
      Array [
        "Array.prototype.forEach",
        Array [
          "Array.forEach",
        ],
      ],
      Array [
        "Array.prototype.includes",
        Array [
          "Array.includes",
        ],
      ],
      Array [
        "Array.prototype.indexOf",
        Array [
          "Array.indexOf",
        ],
      ],
      Array [
        "Array.prototype.keys",
        Array [
          "Array.keys",
        ],
      ],
      Array [
        "Array.prototype.lastIndexOf",
        Array [
          "Array.lastIndexOf",
        ],
      ],
      Array [
        "Array.prototype.map",
        Array [
          "Array.map",
        ],
      ],
      Array [
        "Array.prototype.reduce",
        Array [
          "Array.reduce",
        ],
      ],
      Array [
        "Array.prototype.reduceRight",
        Array [
          "Array.reduceRight",
        ],
      ],
      Array [
        "Array.prototype.some",
        Array [
          "Array.some",
        ],
      ],
      Array [
        "Array.prototype.values",
        Array [
          "Array.values",
        ],
      ],
      Array [
        "AudioContext",
        Array [
          "AudioContext",
        ],
      ],
      Array [
        "Blob",
        Array [
          "Blob",
        ],
      ],
      Array [
        "CustomEvent",
        Array [
          "CustomEvent",
        ],
      ],
      Array [
        "DOMRect",
        Array [
          "DOMRect",
        ],
      ],
      Array [
        "DOMTokenList",
        Array [
          "DOMTokenList",
        ],
      ],
      Array [
        "DOMTokenList.prototype.@@iterator",
        Array [
          "DOMTokenList.[Symbol.iterator]",
        ],
      ],
      Array [
        "Date.now",
        Array [
          "DateConstructor.now",
        ],
      ],
      Array [
        "Date.prototype.toISOString",
        Array [
          "Date.toISOString",
        ],
      ],
      Array [
        "DocumentFragment",
        Array [
          "DocumentFragment",
        ],
      ],
      Array [
        "DocumentFragment.prototype.append",
        Array [
          "ParentNode.append",
        ],
      ],
      Array [
        "DocumentFragment.prototype.prepend",
        Array [
          "ParentNode.prepend",
        ],
      ],
      Array [
        "Element",
        Array [
          "Element",
        ],
      ],
      Array [
        "Element.prototype.after",
        Array [
          "ChildNode.after",
        ],
      ],
      Array [
        "Element.prototype.append",
        Array [
          "ParentNode.append",
        ],
      ],
      Array [
        "Element.prototype.before",
        Array [
          "ChildNode.before",
        ],
      ],
      Array [
        "Element.prototype.classList",
        Array [
          "Element.classList",
        ],
      ],
      Array [
        "Element.prototype.cloneNode",
        Array [
          "Node.cloneNode",
        ],
      ],
      Array [
        "Element.prototype.closest",
        Array [
          "Element.closest",
        ],
      ],
      Array [
        "Element.prototype.dataset",
        Array [
          "HTMLOrSVGElement.dataset",
        ],
      ],
      Array [
        "Element.prototype.matches",
        Array [
          "Element.matches",
        ],
      ],
      Array [
        "Element.prototype.nextElementSibling",
        Array [
          "NonDocumentTypeChildNode.nextElementSibling",
        ],
      ],
      Array [
        "Element.prototype.placeholder",
        Array [
          "HTMLOrSVGElement.dataset",
        ],
      ],
      Array [
        "Element.prototype.prepend",
        Array [
          "ParentNode.prepend",
        ],
      ],
      Array [
        "Element.prototype.previousElementSibling",
        Array [
          "NonDocumentTypeChildNode.previousElementSibling",
        ],
      ],
      Array [
        "Element.prototype.remove",
        Array [
          "ChildNode.remove",
        ],
      ],
      Array [
        "Element.prototype.replaceWith",
        Array [
          "ChildNode.replaceWith",
        ],
      ],
      Array [
        "Element.prototype.toggleAttribute",
        Array [
          "Element.toggleAttribute",
        ],
      ],
      Array [
        "Event",
        Array [
          "Event",
        ],
      ],
      Array [
        "EventSource",
        Array [
          "EventSource",
        ],
      ],
      Array [
        "Function.prototype.bind",
        Array [
          "Function.bind",
        ],
      ],
      Array [
        "Function.prototype.name",
        Array [
          "Function.name",
        ],
      ],
      Array [
        "HTMLCanvasElement.prototype.toBlob",
        Array [
          "HTMLCanvasElement.toBlob",
        ],
      ],
      Array [
        "HTMLDocument",
        Array [
          "HTMLDocument",
        ],
      ],
      Array [
        "HTMLPictureElement",
        Array [
          "HTMLPictureElement",
        ],
      ],
      Array [
        "HTMLTemplateElement",
        Array [
          "HTMLTemplateElement",
        ],
      ],
      Array [
        "IntersectionObserver",
        Array [
          "IntersectionObserver",
        ],
      ],
      Array [
        "IntersectionObserverEntry",
        Array [
          "IntersectionObserverEntry",
        ],
      ],
      Array [
        "Intl",
        Array [
          "Intl",
        ],
      ],
      Array [
        "Intl.PluralRules",
        Array [
          "Intl.PluralRules",
        ],
      ],
      Array [
        "JSON",
        Array [
          "JSON",
        ],
      ],
      Array [
        "Map",
        Array [
          "Map",
        ],
      ],
      Array [
        "Math.acosh",
        Array [
          "Math.acosh",
        ],
      ],
      Array [
        "Math.asinh",
        Array [
          "Math.asinh",
        ],
      ],
      Array [
        "Math.atanh",
        Array [
          "Math.atanh",
        ],
      ],
      Array [
        "Math.cbrt",
        Array [
          "Math.cbrt",
        ],
      ],
      Array [
        "Math.clz32",
        Array [
          "Math.clz32",
        ],
      ],
      Array [
        "Math.cosh",
        Array [
          "Math.cosh",
        ],
      ],
      Array [
        "Math.expm1",
        Array [
          "Math.expm1",
        ],
      ],
      Array [
        "Math.fround",
        Array [
          "Math.fround",
        ],
      ],
      Array [
        "Math.hypot",
        Array [
          "Math.hypot",
        ],
      ],
      Array [
        "Math.imul",
        Array [
          "Math.imul",
        ],
      ],
      Array [
        "Math.log10",
        Array [
          "Math.log10",
        ],
      ],
      Array [
        "Math.log1p",
        Array [
          "Math.log1p",
        ],
      ],
      Array [
        "Math.log2",
        Array [
          "Math.log2",
        ],
      ],
      Array [
        "Math.sign",
        Array [
          "Math.sign",
        ],
      ],
      Array [
        "Math.sinh",
        Array [
          "Math.sinh",
        ],
      ],
      Array [
        "Math.tanh",
        Array [
          "Math.tanh",
        ],
      ],
      Array [
        "Math.trunc",
        Array [
          "Math.trunc",
        ],
      ],
      Array [
        "MutationObserver",
        Array [
          "MutationObserver",
        ],
      ],
      Array [
        "Node.prototype.contains",
        Array [
          "Node.contains",
        ],
      ],
      Array [
        "NodeList.prototype.@@iterator",
        Array [
          "NodeList.[Symbol.iterator]",
        ],
      ],
      Array [
        "NodeList.prototype.forEach",
        Array [
          "NodeList.forEach",
        ],
      ],
      Array [
        "Number.Epsilon",
        Array [
          "NumberConstructor.EPSILON",
        ],
      ],
      Array [
        "Number.MAX_SAFE_INTEGER",
        Array [
          "NumberConstructor.MAX_SAFE_INTEGER",
        ],
      ],
      Array [
        "Number.MIN_SAFE_INTEGER",
        Array [
          "NumberConstructor.MIN_SAFE_INTEGER",
        ],
      ],
      Array [
        "Number.isFinite",
        Array [
          "NumberConstructor.isFinite",
        ],
      ],
      Array [
        "Number.isInteger",
        Array [
          "NumberConstructor.isInteger",
        ],
      ],
      Array [
        "Number.isNaN",
        Array [
          "NumberConstructor.isNaN",
        ],
      ],
      Array [
        "Number.isSafeInteger",
        Array [
          "NumberConstructor.isSafeInteger",
        ],
      ],
      Array [
        "Number.parseFloat",
        Array [
          "NumberConstructor.parseFloat",
        ],
      ],
      Array [
        "Number.parseInt",
        Array [
          "NumberConstructor.parseInt",
        ],
      ],
      Array [
        "Object.assign",
        Array [
          "ObjectConstructor.assign",
        ],
      ],
      Array [
        "Object.create",
        Array [
          "ObjectConstructor.create",
        ],
      ],
      Array [
        "Object.defineProperties",
        Array [
          "ObjectConstructor.defineProperties",
        ],
      ],
      Array [
        "Object.defineProperty",
        Array [
          "ObjectConstructor.defineProperty",
        ],
      ],
      Array [
        "Object.entries",
        Array [
          "ObjectConstructor.entries",
        ],
      ],
      Array [
        "Object.freeze",
        Array [
          "ObjectConstructor.freeze",
        ],
      ],
      Array [
        "Object.fromEntries",
        Array [
          "ObjectConstructor.fromEntries",
        ],
      ],
      Array [
        "Object.getOwnPropertyDescriptor",
        Array [
          "ObjectConstructor.getOwnPropertyDescriptor",
        ],
      ],
      Array [
        "Object.getOwnPropertyDescriptors",
        Array [
          "ObjectConstructor.getOwnPropertyDescriptors",
        ],
      ],
      Array [
        "Object.getOwnPropertyNames",
        Array [
          "ObjectConstructor.getOwnPropertyNames",
        ],
      ],
      Array [
        "Object.getPrototypeOf",
        Array [
          "ObjectConstructor.getPrototypeOf",
        ],
      ],
      Array [
        "Object.is",
        Array [
          "ObjectConstructor.is",
        ],
      ],
      Array [
        "Object.isExtensible",
        Array [
          "ObjectConstructor.isExtensible",
        ],
      ],
      Array [
        "Object.isFrozen",
        Array [
          "ObjectConstructor.isFrozen",
        ],
      ],
      Array [
        "Object.isSealed",
        Array [
          "ObjectConstructor.isSealed",
        ],
      ],
      Array [
        "Object.keys",
        Array [
          "ObjectConstructor.keys",
        ],
      ],
      Array [
        "Object.preventExtensions",
        Array [
          "ObjectConstructor.preventExtensions",
        ],
      ],
      Array [
        "Object.seal",
        Array [
          "ObjectConstructor.seal",
        ],
      ],
      Array [
        "Object.setPrototypeOf",
        Array [
          "ObjectConstructor.setPrototypeOf",
        ],
      ],
      Array [
        "Object.values",
        Array [
          "ObjectConstructor.values",
        ],
      ],
      Array [
        "Promise",
        Array [
          "Promise",
        ],
      ],
      Array [
        "Promise.prototype.finally",
        Array [
          "Promise.finally",
        ],
      ],
      Array [
        "Reflect",
        Array [
          "Reflect",
        ],
      ],
      Array [
        "Reflect.apply",
        Array [
          "Reflect.apply",
        ],
      ],
      Array [
        "Reflect.construct",
        Array [
          "Reflect.construct",
        ],
      ],
      Array [
        "Reflect.defineProperty",
        Array [
          "Reflect.defineProperty",
        ],
      ],
      Array [
        "Reflect.deleteProperty",
        Array [
          "Reflect.deleteProperty",
        ],
      ],
      Array [
        "Reflect.get",
        Array [
          "Reflect.get",
        ],
      ],
      Array [
        "Reflect.getOwnPropertyDescriptor",
        Array [
          "Reflect.getOwnPropertyDescriptor",
        ],
      ],
      Array [
        "Reflect.getPrototypeOf",
        Array [
          "Reflect.getPrototypeOf",
        ],
      ],
      Array [
        "Reflect.has",
        Array [
          "Reflect.has",
        ],
      ],
      Array [
        "Reflect.isExtensible",
        Array [
          "Reflect.isExtensible",
        ],
      ],
      Array [
        "Reflect.ownKeys",
        Array [
          "Reflect.ownKeys",
        ],
      ],
      Array [
        "Reflect.preventExtensions",
        Array [
          "Reflect.preventExtensions",
        ],
      ],
      Array [
        "Reflect.set",
        Array [
          "Reflect.set",
        ],
      ],
      Array [
        "Reflect.setPrototypeOf",
        Array [
          "Reflect.setPrototypeOf",
        ],
      ],
      Array [
        "RegExp.prototype.flags",
        Array [
          "RegExp.flags",
        ],
      ],
      Array [
        "Set",
        Array [
          "Set",
        ],
      ],
      Array [
        "String.fromCodePoint",
        Array [
          "StringConstructor.fromCodePoint",
        ],
      ],
      Array [
        "String.prototype.@@iterator",
        Array [
          "String.[Symbol.iterator]",
        ],
      ],
      Array [
        "String.prototype.anchor",
        Array [
          "String.anchor",
        ],
      ],
      Array [
        "String.prototype.big",
        Array [
          "String.big",
        ],
      ],
      Array [
        "String.prototype.blink",
        Array [
          "String.blink",
        ],
      ],
      Array [
        "String.prototype.bold",
        Array [
          "String.bold",
        ],
      ],
      Array [
        "String.prototype.codePointAt",
        Array [
          "String.codePointAt",
        ],
      ],
      Array [
        "String.prototype.endsWith",
        Array [
          "String.endsWith",
        ],
      ],
      Array [
        "String.prototype.fixed",
        Array [
          "String.fixed",
        ],
      ],
      Array [
        "String.prototype.fontcolor",
        Array [
          "String.fontcolor",
        ],
      ],
      Array [
        "String.prototype.fontsize",
        Array [
          "String.fontsize",
        ],
      ],
      Array [
        "String.prototype.includes",
        Array [
          "String.includes",
        ],
      ],
      Array [
        "String.prototype.italics",
        Array [
          "String.italics",
        ],
      ],
      Array [
        "String.prototype.link",
        Array [
          "String.link",
        ],
      ],
      Array [
        "String.prototype.normalize",
        Array [
          "String.normalize",
        ],
      ],
      Array [
        "String.prototype.padEnd",
        Array [
          "String.padEnd",
        ],
      ],
      Array [
        "String.prototype.padStart",
        Array [
          "String.padStart",
        ],
      ],
      Array [
        "String.prototype.repeat",
        Array [
          "String.repeat",
        ],
      ],
      Array [
        "String.prototype.small",
        Array [
          "String.small",
        ],
      ],
      Array [
        "String.prototype.startsWith",
        Array [
          "String.startsWith",
        ],
      ],
      Array [
        "String.prototype.strike",
        Array [
          "String.strike",
        ],
      ],
      Array [
        "String.prototype.sub",
        Array [
          "String.sub",
        ],
      ],
      Array [
        "String.prototype.sup",
        Array [
          "String.sup",
        ],
      ],
      Array [
        "String.prototype.trim",
        Array [
          "String.trim",
        ],
      ],
      Array [
        "String.prototype.trimEnd",
        Array [
          "String.trimEnd",
        ],
      ],
      Array [
        "String.prototype.trimStart",
        Array [
          "String.trimStart",
        ],
      ],
      Array [
        "String.raw",
        Array [
          "StringConstructor.raw",
        ],
      ],
      Array [
        "Symbol",
        Array [
          "Symbol",
        ],
      ],
      Array [
        "Symbol.asyncIterator",
        Array [
          "SymbolConstructor.asyncIterator",
        ],
      ],
      Array [
        "Symbol.hasInstance",
        Array [
          "SymbolConstructor.hasInstance",
        ],
      ],
      Array [
        "Symbol.isConcatSpreadable",
        Array [
          "SymbolConstructor.isConcatSpreadable",
        ],
      ],
      Array [
        "Symbol.iterator",
        Array [
          "SymbolConstructor.iterator",
        ],
      ],
      Array [
        "Symbol.match",
        Array [
          "SymbolConstructor.match",
        ],
      ],
      Array [
        "Symbol.prototype.description",
        Array [
          "Symbol.description",
        ],
      ],
      Array [
        "Symbol.replace",
        Array [
          "SymbolConstructor.replace",
        ],
      ],
      Array [
        "Symbol.search",
        Array [
          "SymbolConstructor.search",
        ],
      ],
      Array [
        "Symbol.species",
        Array [
          "SymbolConstructor.species",
        ],
      ],
      Array [
        "Symbol.split",
        Array [
          "SymbolConstructor.split",
        ],
      ],
      Array [
        "Symbol.toPrimitive",
        Array [
          "SymbolConstructor.toPrimitive",
        ],
      ],
      Array [
        "Symbol.toStringTag",
        Array [
          "SymbolConstructor.toStringTag",
        ],
      ],
      Array [
        "Symbol.unscopables",
        Array [
          "SymbolConstructor.unscopables",
        ],
      ],
      Array [
        "URL",
        Array [
          "URL",
        ],
      ],
      Array [
        "UserTiming",
        Array [
          "performance",
          "performance",
          "Performance",
          "PerformanceEntry",
          "PerformanceMark",
          "PerformanceMeasure",
        ],
      ],
      Array [
        "WeakMap",
        Array [
          "WeakMap",
        ],
      ],
      Array [
        "WeakSet",
        Array [
          "WeakSet",
        ],
      ],
      Array [
        "WebAnimations",
        Array [
          "Animation",
          "AnimationEffect",
          "AnimationEvent",
          "AnimationTimeline",
          "AnimationPlaybackEvent",
          "DocumentTimeline",
          "KeyframeEffect",
        ],
      ],
      Array [
        "Window",
        Array [
          "Window",
        ],
      ],
      Array [
        "XMLHttpRequest",
        Array [
          "XMLHttpRequest",
        ],
      ],
      Array [
        "atob",
        Array [
          "atob",
          "atob",
        ],
      ],
      Array [
        "console",
        Array [
          "console",
          "console",
        ],
      ],
      Array [
        "console.assert",
        Array [
          "Console.assert",
        ],
      ],
      Array [
        "console.clear",
        Array [
          "Console.clear",
        ],
      ],
      Array [
        "console.count",
        Array [
          "Console.count",
        ],
      ],
      Array [
        "console.debug",
        Array [
          "Console.debug",
        ],
      ],
      Array [
        "console.dir",
        Array [
          "Console.dir",
        ],
      ],
      Array [
        "console.dirxml",
        Array [
          "Console.dirxml",
        ],
      ],
      Array [
        "console.error",
        Array [
          "Console.error",
        ],
      ],
      Array [
        "console.exception",
        Array [
          "Console.exception",
        ],
      ],
      Array [
        "console.group",
        Array [
          "Console.group",
        ],
      ],
      Array [
        "console.groupCollapsed",
        Array [
          "Console.groupCollapsed",
        ],
      ],
      Array [
        "console.groupEnd",
        Array [
          "Console.groupEnd",
        ],
      ],
      Array [
        "console.info",
        Array [
          "Console.info",
        ],
      ],
      Array [
        "console.log",
        Array [
          "Console.log",
        ],
      ],
      Array [
        "console.markTimeline",
        Array [
          "Console.markTimeline",
        ],
      ],
      Array [
        "console.profile",
        Array [
          "Console.profile",
        ],
      ],
      Array [
        "console.profileEnd",
        Array [
          "Console.profileEnd",
        ],
      ],
      Array [
        "console.table",
        Array [
          "Console.table",
        ],
      ],
      Array [
        "console.time",
        Array [
          "Console.time",
        ],
      ],
      Array [
        "console.timeEnd",
        Array [
          "Console.timeEnd",
        ],
      ],
      Array [
        "console.timeStamp",
        Array [
          "Console.timeStamp",
        ],
      ],
      Array [
        "console.timeline",
        Array [
          "Console.timeline",
        ],
      ],
      Array [
        "console.timelineEnd",
        Array [
          "Console.timelineEnd",
        ],
      ],
      Array [
        "console.trace",
        Array [
          "Console.trace",
        ],
      ],
      Array [
        "console.warn",
        Array [
          "Console.warn",
        ],
      ],
      Array [
        "devicePixelRatio",
        Array [
          "devicePixelRatio",
          "devicePixelRatio",
        ],
      ],
      Array [
        "document",
        Array [
          "document",
          "document",
        ],
      ],
      Array [
        "document.currentScript",
        Array [
          "Document.currentScript",
        ],
      ],
      Array [
        "document.getElementsByClassName",
        Array [
          "Document.getElementsByClassName",
        ],
      ],
      Array [
        "document.head",
        Array [
          "Document.head",
        ],
      ],
      Array [
        "document.querySelector",
        Array [
          "ParentNode.querySelector",
        ],
      ],
      Array [
        "document.visibilityState",
        Array [
          "Document.visibilityState",
        ],
      ],
      Array [
        "fetch",
        Array [
          "fetch",
          "fetch",
        ],
      ],
      Array [
        "getComputedStyle",
        Array [
          "getComputedStyle",
          "getComputedStyle",
        ],
      ],
      Array [
        "globalThis",
        Array [
          "globalThis",
        ],
      ],
      Array [
        "localStorage",
        Array [
          "localStorage",
          "localStorage",
        ],
      ],
      Array [
        "location.origin",
        Array [
          "Location.origin",
        ],
      ],
      Array [
        "matchMedia",
        Array [
          "matchMedia",
          "matchMedia",
        ],
      ],
      Array [
        "navigator.geolocation",
        Array [
          "Navigator.geolocation",
        ],
      ],
      Array [
        "navigator.sendBeacon",
        Array [
          "NavigatorBeacon.sendBeacon",
        ],
      ],
      Array [
        "performance.now",
        Array [
          "Performance.now",
        ],
      ],
      Array [
        "queueMicrotask",
        Array [
          "queueMicrotask",
          "queueMicrotask",
        ],
      ],
      Array [
        "requestAnimationFrame",
        Array [
          "requestAnimationFrame",
          "requestAnimationFrame",
        ],
      ],
      Array [
        "screen.orientation",
        Array [
          "Screen.orientation",
        ],
      ],
      Array [
        "setImmediate",
        Array [
          "setImmediate",
        ],
      ],
      Array [
        "~viewport",
        Array [
          "scrollX",
          "scrollX",
          "scrollY",
          "scrollY",
          "innerWidth",
          "innerWidth",
          "innerHeight",
          "innerHeight",
          "pageXOffset",
          "pageXOffset",
          "pageYOffset",
          "pageYOffset",
        ],
      ],
    ]
  `);
});
