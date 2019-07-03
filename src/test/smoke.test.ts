import {analyze} from '../analyze';
import {createProject} from '../project';

const project = createProject();

test('requestAnimationFrame', () => {
  // expect(
  //   analyze({
  //     source: 'requestAnimationFrame',
  //     project,
  //     include: ['requestAnimationFrame'],
  //   }),
  // ).toEqual([]);

  expect(
    analyze({
      source: 'requestAnimationFrame()',
      project,
      include: ['requestAnimationFrame'],
    }),
  ).toEqual(['requestAnimationFrame']);
});

test('Array.from', () => {
  // expect(
  //   analyze({
  //     source: 'Array.from',
  //     project,
  //     include: ['Array.from'],
  //   }),
  // ).toEqual([]);

  expect(
    analyze({
      source: 'Array.from()',
      project,
      include: ['Array.from'],
    }),
  ).toEqual(['Array.from']);
});

test('Array.prototype.copyWithin', () => {
  // expect(
  //   analyze({
  //     source: 'Array.prototype.copyWithin',
  //     project,
  //     include: ['Array.prototype.copyWithin'],
  //   }),
  // ).toEqual([]);

  // expect(
  //   analyze({
  //     source: '[].copyWithin',
  //     project,
  //     include: ['Array.prototype.copyWithin'],
  //   }),
  // ).toEqual([]);

  expect(
    analyze({
      source: 'Array.prototype.copyWithin()',
      project,
      include: ['Array.prototype.copyWithin'],
    }),
  ).toEqual(['Array.prototype.copyWithin']);

  expect(
    analyze({
      source: '[].copyWithin()',
      project,
      include: ['Array.prototype.copyWithin'],
    }),
  ).toEqual(['Array.prototype.copyWithin']);
});
