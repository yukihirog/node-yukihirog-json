# node-yukihirog-json

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE) [![Build Status](https://app.travis-ci.com/yukihirog/node-yukihirog-json.svg?branch=main)](https://app.travis-ci.com/yukihirog/node-yukihirog-json)

read/write *.json

# Installation

```
npm install --save-dev node-yukihirog-json
```

## Usage

```js
// import
import yukihirogJson from 'node-yukihirog-json';


/* Read */

/* async */
yukihirogJson.read('./foo.json').then(result => { console.log(['read', result]) });
// { path: './foo.json', data: { foo: 'bar' }, json: '{"foo":"bar"}' }

yukihirogJson.readAll(['./foo.json', './bar.json']).then(result => { console.log(['readAll', result]) });
// [{ path: './foo.json', data: { foo: 'bar' }, json: '{"foo":"bar"}' }, { path: './bar.json', data: { bar: 'baz' }, json: '{"bar":"baz"}' }]

yukihirogJson.readMerge(['./foo.json', './bar.json']).then(result => { console.log(['readMerge', result]) });
// { path: ['./foo.json', './bar.json'], data: { foo: 'bar', bar: 'baz' }, json: ['{"foo":"bar"}', '{"bar":"baz"}'] }


/* sync */
console.log(yukihirogJson.readSync('./foo.json'));
// { foo: 'bar' }

console.log(yukihirogJson.readAllSync(['./foo.json', './bar.json']));
// [{ foo: 'bar' }, { bar: 'baz' }]

console.log(yukihirogJson.readMergeSync(['./foo.json', './bar.json']));
// { foo: 'bar', bar: 'baz' }
// ! it use Object.assign (not deep-merge) !


/* Write */
const data = { prop: 'value' };

/* async */
yukihirogJson.write('./foo.json', data);

yukihirogJson.writeAll([{ path: './foo.json', data: data }, { path: './bar.json', data: data }]);


/* sync */
yukihirogJson.writeSync('./foo.json', data);

yukihirogJson.writeAllSync([{ path: './foo.json', data: data }, { path: './bar.json', data: data }]);
```
