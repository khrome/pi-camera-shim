var Camera = require("@zino-hofmann/pi-camera-connect");
var path = require('path');
var fs = require('fs');
var isPi = require('detect-rpi');

var andFail = function(err){ throw err };
var pos = 0; //this is exceptionally lazy and needs an attached reference
//TODO: make it work for more than 1 stream at a time

var loop = function(handler, thePath){
    var backupPath = (
        typeof module.exports.pcMode === 'string' &&
        module.exports.pcMode
    ) || thePath;
    if(module.exports.pcMode || isPi()){
        var streamCamera = new Camera.StreamCamera({
            codec: Camera.Codec.MJPEG,
        });
        streamCamera.startCapture().then(function(){
            streamCamera.takeImage().then(function(image){
                streamCamera.stopCapture().then(function(){
                    setTimeout(function(){
                        var hexBody = image.toString('base64');
                        handler(null, {
                            base64Image : 'data:image/jpg;base64,'+hexBody,
                            image : image
                        }, function(){
                            setTimeout(function(){
                                loop(handler, backupPath);
                            }, 0);
                        }, function(){
                            //todo: terminate
                        });
                    }, 0);
                }).catch(andFail);
            }).catch(andFail);
        }).catch(andFail);
    }else{
        if(!backupPath) throw new Error('No Path Provided, must execute on Pi');
        fs.readdir(backupPath, function(err, list){
            var offset = pos%list.length;
            var files = list.filter(function(name){
                return name[0] !== '.';
            });
            fs.readFile(path.join(backupPath, files[offset]), function(err, body){
                var type = files[offset].split('.').pop().toLowerCase();
                var hexBody = body.toString('base64');
                pos++;
                handler(null, {
                    base64Image : 'data:image/'+type+';base64,'+hexBody
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
    pcMode : false,
    saveFrames: function(directory, cb1, cb2){
        if(!cb1) throw new Error('callback required');
        var callback = cb2 || cb1;
        var count = 0;
        var terminate = (cb2 && cb1) || function(data){
            return count > 100:true:false;
        }
        loop(function(err, data, nextIteration, terminate){
            count++;
            if(err) return callback(err);
            fs.writeFile(path.join(directory, 'image-'+count+'.jpg'), data, function(err){
                if(err) return callback(err);
                if(terminate(data)){
                    callback(null, count);
                    terminate();
                }else{
                    nextIteration();
                }
            });
        });
    },
    pullAndProcessLoop: loop
}
