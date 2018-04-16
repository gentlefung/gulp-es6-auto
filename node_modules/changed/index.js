#!/usr/bin/env node

var changed = require('./src/changed');

if (module.parent) {
  module.exports = changed;
  return;
}

if (process.argv.length !== 3) {
  console.error('Expecting package name');
  process.exit(1);
}

changed(process.argv[2]);