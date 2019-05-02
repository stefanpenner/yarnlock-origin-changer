'use strict';
const lockfile = require('@yarnpkg/lockfile');

module.exports = function replaceOriginal(original, from, to) {
  const parsed = lockfile.parse(original);

  from = new URL(from);
  to = new URL(to);

  for (const [name, meta] of Object.entries(parsed.object)) {
    const url = new URL(meta.resolved);

    if (url.origin === from.origin) {
      url.host = to.host;
      url.protocol = to.protocol;
      meta.resolved = url.toString();
    }
  }

  return lockfile.stringify(parsed.object);
};
