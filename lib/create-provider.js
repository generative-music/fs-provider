'use strict';

const has = require('./has');
const request = require('./request');
const save = require('./save');

const createProvider = () => ({
  has,
  request,
  save,
});

module.exports = createProvider;
