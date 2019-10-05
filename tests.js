'use strict';

const { expect } = require('chai');
const fs = require('fs-extra');
const replacer = require('./lib/replacer');
const lockfile = require('@yarnpkg/lockfile');
const execa = require('execa');

const FIXTURES = `${__dirname}`;

describe('yarnlock-hostname-changer', function() {
  it('has a working replacer', function() {
    const original = fs.readFileSync(`/${FIXTURES}/yarn.lock`, 'UTF8');
    const parsed = lockfile.parse(original);

    expect(original).to.contain('https://registry.yarnpkg.com')
    expect(original).to.not.contain('http://registry.iamstef.net');

    const {
      result,
      total,
      replaced
    } = replacer(original, 'https://registry.yarnpkg.com', 'http://registry.iamstef.net');

    expect(result).to.not.contain('https://registry.yarnpkg.com');
    expect(result).to.contain('http://registry.iamstef.net');
    expect(replaced).to.eql(132);
    expect(total).to.eql(132);
  });

  it('also works for target url with pathname', function() {
    const original = fs.readFileSync(`/${FIXTURES}/yarn.lock`, 'UTF8');
    const parsed = lockfile.parse(original);

    expect(original).to.contain('https://registry.yarnpkg.com')
    expect(original).to.not.contain('http://registry.iamstef.net/hey/stef');

    const {
      result,
      total,
      replaced
    } = replacer(original, 'https://registry.yarnpkg.com', 'http://registry.iamstef.net/hey/stef');

    expect(result).to.not.contain('https://registry.yarnpkg.com');
    expect(result).to.contain('http://registry.iamstef.net/hey/stef');
    expect(replaced).to.eql(132);
    expect(total).to.eql(132);
  });

  it('test CLI', function() {
    const TMP = __dirname + '/tmp';

    fs.removeSync(TMP);
    fs.mkdirSync(TMP)
    fs.writeFileSync(`${TMP}/yarn.lock`, fs.readFileSync(`${FIXTURES}/yarn.lock`));

    const child = execa.sync( `${__dirname}/bin/yarnlock-origin-changer`, [
      `${TMP}/yarn.lock`,
      'https://registry.yarnpkg.com',
      'http://registry.iamstef.net'
    ]);

    expect(child.stdout).to.eql(`yarn-lock-origin-changer: 132 of 132 entries have been migrated from: 'https://registry.yarnpkg.com' to: 'http://registry.iamstef.net'`);

    expect(child.stderr).to.eql('');
    expect(child.code).to.eql(0);
  });
});
