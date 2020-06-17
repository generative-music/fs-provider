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
      [mockIndex.dep1.path1]: Buffer.from(mockIndex.dep1.path1),
      [mockIndex.dep1.path2]: Buffer.from(mockIndex.dep1.path2),
      [mockIndex.dep2[0]]: Buffer.from(mockIndex.dep2[0]),
      [mockIndex.dep2[1]]: Buffer.from(mockIndex.dep2[1]),
    });

    const mockAudioContext = {
      decodeAudioData: (arrayBuffer) => {
        arrayBuffer.__decoded = true;
        return arrayBuffer;
      },
    };

    return provide(['dep1', 'dep2'], mockAudioContext).then((result) => {
      expect(Object.values(result.dep1).every(({ __decoded }) => __decoded));
      expect(result.dep2.every(({ __decoded }) => __decoded));
    });
  });
  it('should convert the files to ArrayBuffers before passing them to audioContext.decodeAudioData', () => {
    mockFs({
      [mockIndex.dep1.path1]: Buffer.from(mockIndex.dep1.path1),
      [mockIndex.dep1.path2]: Buffer.from(mockIndex.dep1.path2),
    });

    const mockAudioContext = {
      decodeAudioData: (input) => {
        mockAudioContext.decodeAudioData.called = true;
        expect(input).to.be.an.instanceOf(ArrayBuffer);
      },
    };

    return provide(['dep1'], mockAudioContext).then(() => {
      expect(mockAudioContext.decodeAudioData).to.have.property('called', true);
    });
  });
});
