'use strict';
const lockfile = require('@yarnpkg/lockfile');
const URL = require('whatwg-url').URL;

module.exports = function replaceOriginal(original, from, to) {
  const parsed = lockfile.parse(original);
  let replaced = 0;
  let total = 0;

  from = new URL(from);
  to = new URL(to);

  const uniqueEntries = new Set();
  for (const [name, meta] of Object.entries(parsed.object)) {
    const url = new URL(meta.resolved);
    total++;

    if (uniqueEntries.has(meta)) {
      continue;
    } else {
      uniqueEntries.add(meta)
    }

    if (url.origin === from.origin) {
      url.host = to.host;
      url.protocol = to.protocol;
      url.pathname = to.pathname;
      meta.resolved = url.toString();
      replaced++;
    }
  }

  return {
    total: uniqueEntries.size,
    replaced,
    result: lockfile.stringify(parsed.object)
  }
};
