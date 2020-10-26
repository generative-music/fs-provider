'use strict';

const { expect } = require('chai');
const mockFs = require('mock-fs');
const has = require('./has');

describe('has', () => {
  beforeEach(mockFs.restore);
  after(mockFs.restore);

  it('should resolve to true if all the paths are readable', () => {
    const paths = ['/first/path', '/second/path'];
    mockFs(
      paths.reduce((o, path) => {
        o[path] = '';
        return o;
      }, {})
    );
    return has(paths).then((result) => expect(result).to.be.true);
  });

  it('should resolve to false if any path is not readable', () => {
    const paths = ['first/path', 'second/path'];
    mockFs(
      paths.reduce((o, path) => {
        o[path] = '';
        return o;
      }, {})
    );
    return has(paths.concat(['/nope'])).then(
      (result) => expect(result).to.be.false
    );
  });
});
