pi-camera-shim
==============
Use a camera when local to pi, use test data(currently just still gif frames) when on a local system.

Usage
-----

```js
var shim = require('pi-camera-shim');
shim.pullAndProcessLoop(function(err, image, advance, terminate){
    //set the actual bytes to something
    el.setAttribute('src', image.base64Image);
    //pull another image
    advance();
    //todo: process image
}, 'path/to/test/image/directory');
```
