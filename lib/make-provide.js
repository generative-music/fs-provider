'use strict';

const fs = require('fs');
const transform = require('@generative-music/sample-index-transformer');

const fsp = fs.promises;

const bufferToArrayBuffer = (buffer) =>
  buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

const makeReadAndDecodeFilePath = (audioContext) => (filePath) =>
  fsp
    .readFile(filePath)
    .then((buffer) =>
      audioContext.decodeAudioData(bufferToArrayBuffer(buffer))
    );

const makeProvide = (dependencyIndex = {}) => (
  dependencyNames = [],
  audioContext
) =>
  transform(
    dependencyIndex,
    dependencyNames,
    makeReadAndDecodeFilePath(audioContext)
  );

module.exports = makeProvide;
