'use strict';

const fs = require('fs');

const fsp = fs.promises;
const { R_OK } = fs.constants;

const isReadable = (path) =>
  fsp
    .access(path, R_OK)
    .then(() => true)
    .catch(() => false);

const makeCanProvide = (dependencyIndex = {}) => (dependencyNames = []) => {
  const requestedDependencies = dependencyNames.map(
    (dependencyName) => dependencyIndex[dependencyName]
  );
  const wasUnknownDependencyRequested = requestedDependencies.some(
    (dependency) => typeof dependency === 'undefined'
  );
  if (wasUnknownDependencyRequested) {
    return Promise.resolve(false);
  }
  return Promise.all(
    requestedDependencies.reduce((isReadablePromises, dependency) => {
      const paths = Array.isArray(dependency)
        ? dependency
        : Object.values(dependency);
      return isReadablePromises.concat(paths.map(isReadable));
    }, [])
  ).then((results) => results.every((val) => val));
};

module.exports = makeCanProvide;
