'use strict';

const { expect } = require('chai');
const mockFs = require('mock-fs');
const request = require('./request');

const markDecoded = (arrayBuffer) => {
  const decoder = new TextDecoder();
  const decoded = decoder.decode(arrayBuffer);
  return `${decoded}::DECODED`;
};

const mockAudioContext = {
  decodeAudioData: markDecoded,
};

describe('request', () => {
  beforeEach(mockFs.restore);
  after(mockFs.restore);

  it('should return read each file and convert it to an AudioBuffer', () => {
    const paths = ['first/path', 'second/path'];
    mockFs(
      paths.reduce((o, path) => {
        o[path] = path;
        return o;
      }, {})
    );
    return request(mockAudioContext, paths).then((audioBuffers) => {
      expect(audioBuffers).to.eql(
        paths.map((path) => markDecoded(Buffer.from(path)))
      );
    });
  });

  it("should resolve with a null value for any file that doesn't exist or can't be read", () => {
    const paths = ['first/path', 'second/path'];
    mockFs(
      paths.reduce((o, path) => {
        o[path] = path;
        return o;
      }, {})
    );
    return request(mockAudioContext, paths.concat(['nope'])).then(
      (audioBuffers) => {
        expect(audioBuffers).to.eql(
          paths.map((path) => markDecoded(Buffer.from(path))).concat([null])
        );
      }
    );
  });
});
