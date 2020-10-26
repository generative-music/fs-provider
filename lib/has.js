'use strict';

const {
  promises: fsp,
  constants: { R_OK },
} = require('fs');

const isReadable = (path) =>
  fsp
    .access(path, R_OK)
    .then(() => true)
    .catch(() => false);

const has = (paths) =>
  Promise.all(paths.map(isReadable)).then((results) =>
    results.every((val) => val)
  );

module.exports = has;
