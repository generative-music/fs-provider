'use strict'

const makeCanProvide = require('./make-can-provide');
const makeProvide = require('./make-provide');

const makeProvider = (dependencyIndex = {}) => ({
  canProvide: makeCanProvide(dependencyIndex),
  provide: makeProvide(dependencyIndex),
});

module.exports = makeProvider;
