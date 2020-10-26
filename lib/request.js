'use strict';

const { promises: fsp } = require('fs');

const bufferToArrayBuffer = (nodeBuffer) =>
  nodeBuffer.buffer.slice(
    nodeBuffer.byteOffset,
    nodeBuffer.byteOffset + nodeBuffer.byteLength
  );

const request = (audioContext, paths) =>
  Promise.all(
    paths.map((filepath) =>
      fsp
        .readFile(filepath)
        .then((buffer) =>
          audioContext.decodeAudioData(bufferToArrayBuffer(buffer))
        )
        .catch(() => null)
    )
  );

module.exports = request;
