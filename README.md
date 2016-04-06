# virtual-node-env
Programmatic virtual environment that makes to run node ^v4.0x app on node v0.10x server.

The primary use case is AWS Lambda.

## Usage
```js
var vne = require("virtual-node-env");
var node = vne.node;
var npm = vne.npm;

node("-v").then(print); // -> v4.4.2

npm("-v").then(print); // -> 2.15.0

function print(o){
  console.log(o.stdout);
}
```

## Installation
```
npm install virtual-node-env --save
```


## Operating Systems
* Linux
* Mac OSX

## Requirements
* wget
* tar

## Switching Versions
You can switch the node version with

```js
var vne = require("virtual-node-env");
vne.version = "v5.10.0";
```

## Fetch Node.js Binary

```js
vne.version = "v5.10.0";
vne.fetch(); // Will be started to fetch node.js v5.10.0 from https://nodejs.org
```

## Apis

#### Properties
* `vne.version`: {String} Node.js version string. Default is `v4.4.2`
* `vne.downloadBaseURL`: {String} BaseUrl for downloading target. Default is `https://nodejs.org/dist`

#### Methods

`vne.node`

Execute node command with the specific options

- parameters
  - cmd: The path that executable .js file or commnad options
  - opts
    - NODE_ROOT: The root directory for node
    - workingDir: The working directory that will be executed node command. default is `process.cwd()`

- returns: Promise object

`vne.npm`

Execute npm command with the specific options

- parameters
  - cmd: The path that executable
  - opts
    - NODE_ROOT: The root directory for node
    - workingDir: The working directory that will be executed npm command. default is `process.cwd()`

- returns: Promise object

`vne.fetch`

Fetch specific Node.js from https://nodejs.org

- parameters
  - dir: The directory that want to put the downloaded Node.js

- returns: Promise object

## License
(The MIT License)

Copyright (c) 2016 Yuki Takei(Noppoman) yuki@miketokyo.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and marthis permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
