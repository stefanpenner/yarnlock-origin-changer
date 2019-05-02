## yarnlock origin changer

A simple CLI which allows updating of an origin's within a yarn.lock file

### Installation
```sh
yarn global add yarnlock-origin-changer
```

### Usage

The following command will rewrite the contents of `./yarn.lock` resolved href origins from `https://registry.yarnpkg.com` to `http://registry.iamstef.net`

```sh
yarnlock-origin-changer ./yarn.lock https://registry.yarnpkg.com http://registry.iamstef.net
```
