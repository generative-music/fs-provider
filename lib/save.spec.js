'use strict';

const { promises: fsp } = require('fs');
const { expect } = require('chai');
const mockFs = require('mock-fs');
const { fromBuffer } = require('file-type');
const save = require('./save');

const createMockAudioBuffer = () => ({
  numberOfChannels: 2,
  sampleRate: 48000,
  getChannelData: () => Float32Array.from({ length: 10 }, () => 0),
});

describe('save', () => {
  beforeEach(mockFs.restore);
  after(mockFs.restore);
  it('should save the AudioBuffers at the specified paths', () => {
    mockFs();
    const entries = [
      ['first/path', createMockAudioBuffer()],
      ['second/path', createMockAudioBuffer()],
    ];
    return save(entries)
      .then(() =>
        Promise.all(
          entries.map(([filepath]) => fsp.readFile(filepath).then(fromBuffer))
        )
      )
      .then((results) => {
        expect(
          results.every(
            ({ ext, mime }) => ext === 'wav' && mime === 'audio/vnd.wave'
          )
        ).to.be.true;
      });
  });
});
