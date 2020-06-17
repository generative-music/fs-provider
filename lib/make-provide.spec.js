'use strict';

const { expect } = require('chai');
const mockFs = require('mock-fs');
const makeProvide = require('./make-provide');

const mockIndex = {
  dep1: {
    path1: './dep1/path-1',
    path2: './dep1/path-2',
  },
  dep2: ['./dep2/path-1', './dep2/path-2'],
};

const provide = makeProvide(mockIndex);

describe('provide', () => {
  afterEach(() => {
    mockFs.restore();
  });
  it('should return a promise with the specified dependencies decoded', () => {
    mockFs({
      [mockIndex.dep1.path1]: mockIndex.dep1.path1,
      [mockIndex.dep1.path2]: mockIndex.dep1.path2,
      [mockIndex.dep2[0]]: mockIndex.dep2[0],
      [mockIndex.dep2[1]]: mockIndex.dep2[1],
    });

    return provide(['dep1', 'dep2']).then((result) => {});
  });
});
