'use strict';

const path = require('path');
const { promises: fsp } = require('fs');
const audioBufferToWav = require('audiobuffer-to-wav');

const save = (entries) =>
  Promise.all(
    entries.map(([filepath, audioBuffer]) => {
      const dir = path.dirname(filepath);
      const wavData = audioBufferToWav(audioBuffer);
      return fsp
        .mkdir(dir, { recursive: true })
        .then(() => fsp.writeFile(filepath, Buffer.from(wavData)));
    })
  );

module.exports = save;
