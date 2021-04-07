var Camera = require("@zino-hofmann/pi-camera-connect");
var path = require('path');
var isPi = require('detect-rpi');

var andFail = function(err){ throw err };
var pos = 0; //this is exceptionally lazy and needs an attached reference
//TODO: make it work for more than 1 stream at a time

var loop = function(handler, backupPath){
    if(isPi()){
        var streamCamera = new Camera.StreamCamera({
            codec: Camera.Codec.MJPEG,
        });
        streamCamera.startCapture().then(function(){
            streamCamera.takeImage().then(function(image){
                streamCamera.stopCapture().then(function(){
                    setTimeout(function(){
                        handler(image, function(){
                            loop(handler);
                        });
                    }, 0);
                }).catch(andFail);
            }).catch(andFail);
        }).catch(andFail);
    }else{
        fs.readdir(backupPath, function(err, list){
            var files = list.filter(function(name){
                return name[0] !== '.';
            });
            fs.readFile(path.join(backupPath, list[pos], function(err, body){
                handler(body, function(){
                    loop(handler);
                });
            }));
        })
        fs.readFile()
    }
}


module.exports = {
    pullAndProcessLoop: loop
}
