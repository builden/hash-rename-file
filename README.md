# hash-rename-file
hash and rename file, support (tp, fnt) type

## How to use
```js
var hrf = require('hash-rename-file');
var opt = {
  base: 'res', // destPath retain src dir info
  type: 'tp',  // file type, support ('tp', 'fnt', 'spine', 'normal'), default: 'normal'
  num: 7       // append hash bit num to filename, such as: filename_1234567.png
};
hrf(srcGlob, destPath, opt, function(err) {
  if (err) {
    console.error(err);
  }
});
```

## Installation
```sh
npm install --save hash-rename-file
```

## Tests
```sh
npm install
npm test
```