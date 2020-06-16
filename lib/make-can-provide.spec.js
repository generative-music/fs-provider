'use strict';

const { expect } = require('chai');
const mockFs = require('mock-fs');
const makeCanProvide = require('./make-can-provide');

const mockIndex = {
  dep1: {
    path1: './dep1/path-1',
    path2: './dep1/path-2',
  },
  dep2: ['./dep2/path-1', './dep2/path-2'],
};

const canProvide = makeCanProvide(mockIndex);

describe('canProvide', () => {
  afterEach(() => {
    mockFs.restore();
  });
  it("should return a promise that resolves to false if any of the dependency paths don't exist", () => {
    mockFs({
      [mockIndex.dep1.path1]: '',
      [mockIndex.dep1.path2]: '',
      [mockIndex.dep2[0]]: '',
    });
    return canProvide(['dep1', 'dep2']).then((result) => {
      expect(result).to.be.false;
    });
  });
  it('should return a promise that resolves to false if any of the dependencies are not defined in the specified index', () => {
    return canProvide(['unknownDep']).then((result) => {
      expect(result).to.be.false;
    });
  });
  it('should return a promise that resolves to true if all the dependency paths exist and are readable', () => {
    mockFs({
      [mockIndex.dep1.path1]: '',
      [mockIndex.dep1.path2]: '',
      [mockIndex.dep2[0]]: '',
      [mockIndex.dep2[1]]: '',
    });
    return canProvide(['dep1', 'dep2']).then((result) => {
      expect(result).to.be.true;
    });
  });
});
