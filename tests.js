'use strict';

const { expect } = require('chai');
const fs = require('fs');
const replacer = require('./lib/replacer');

describe('yarnlock-hostname-changer', function() {
  it('has a working replacer', function() {
    const original = fs.readFileSync(__dirname + '/yarn.lock', 'UTF8');

    expect(original).to.contain('https://registry.yarnpkg.com')
    expect(original).to.not.contain('http://registry.iamstef.net');
    const updated = replacer(original, 'https://registry.yarnpkg.com', 'http://registry.iamstef.net');
    expect(updated).to.not.contain('https://registry.yarnpkg.com');
    expect(updated).to.contain('http://registry.iamstef.net');
  });
});
