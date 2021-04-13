var Camera = require("@zino-hofmann/pi-camera-connect");
var path = require('path');
var fs = require('fs');
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
                        var hexBody = image.toString('base64');
                        handler(null, {
                            base64Image : 'data:image/jpg;base64,'+hexBody
                        }, function(){
                            loop(handler, backupPath);
                        }, function(){
                            //todo: terminate
                        });
                    }, 0);
                }).catch(andFail);
            }).catch(andFail);
        }).catch(andFail);
    }else{
        fs.readdir(backupPath, function(err, list){
            var offset = pos%list.length;
            var files = list.filter(function(name){
                return name[0] !== '.';
            });
            fs.readFile(path.join(backupPath, files[offset]), function(err, body){
                var hexBody = body.toString('base64');
                pos++;
                handler(null, {
                    base64Image : 'data:image/gif;base64,'+hexBody
                }, function(){
                    setTimeout(function(){ loop(handler, backupPath) }, 100);
                }, function(){
                    //todo: terminate
                });
            });
        })
    }
}


module.exports = {
    pullAndProcessLoop: loop
}
