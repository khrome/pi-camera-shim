pi-camera-shim
==============
Use a camera when local to pi, use test data(still images) when on a local system.

Usage
-----

In an app:

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

In a test suite, to force the app into test mode in the directory provided in the call:
```js
shim.pcMode = true;
```

In a test suite, to force the app into a specific directory
```js
shim.pcMode = '/path/to/the/dir';
```

To save 100 images from the Camera:
```js
shim.saveFrames('path/to/test/image/directory', function(err, count){
    //done, frames in path/to/test/image/directory/image-0.jpg - image-<count>.jpg
});
```
