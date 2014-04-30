var Detection = (function() {

    'use strict';

    var init = function($) {
        detectStreaming();
    };

    var detectStreaming = function() {
        console.log('detect streaming');
        if (!!options){
            getUserMedia(options,onUserMediaSuccess,onDeviceError);
        } else {
            console.log('no options specified');
        }
    };

    var getUserMediaDebug = function(){
        console.log('debug');
    };

    var getUserMediaCapture = function(){
        console.log('capture');
        window.webcam.save();
    };

    var getUserMediaTick = function(){
        console.log('tick');
    };

    var getUserMediaSave = function(data){
        console.log('save',data);
        var col = data.split(";"),
            img = App.image,
            tmp = null,
            w = this.width,
            h = this.height;

        for (var i = 0; i < w; i++) {
            tmp = parseInt(col[i], 10);
            img.data[App.pos + 0] = (tmp >> 16) & 0xff;
            img.data[App.pos + 1] = (tmp >> 8) & 0xff;
            img.data[App.pos + 2] = tmp & 0xff;
            img.data[App.pos + 3] = 0xff;
            App.pos += 4;
        }

        if (App.pos >= 4 * w * h) {
            App.ctx.putImageData(img, 0, 0);
            App.pos = 0;
        }

    };

    var getUserMediaLoad = function(){
        console.log('load');
    };

    var options = {
        "audio" : true, //FF nightly throws an error
        "video": true,
        el : "webcam",
        extern: null,
        append: true,
        width: 320,
        height: 240,
        mode: "callback",
        swffile: "js/libs/getusermedia/fallback/jscam_canvas_only.swf",
        quality: 85,
        context: "",
        debug: getUserMediaDebug,
        onCapture: getUserMediaCapture,
        onTick: getUserMediaTick,
        onSave: getUserMediaSave,
        onLoad: getUserMediaLoad
    };

    var onUserMediaSuccess = function(stream){
        console.log('user media success',stream);

        Capture.setCaptureContext(options.context);

        if (options.context === 'webrtc') {
            console.log('webrtc');
            var video = options.videoEl;

            if ((typeof MediaStream !== "undefined" && MediaStream !== null) && stream instanceof MediaStream) {
                console.log('user media native');
                if (video.mozSrcObject !== undefined) { //FF18a
                    video.mozSrcObject = stream;
                } else { //FF16a, 17a
                    video.src = stream;
                }
                //return Capture.playStream();
            } else {
                console.log('user media prefixed');
                var vendorURL = window.URL || window.webkitURL;
                video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;

            };

            Capture.video = video;
            Capture.stream = stream;
            Capture.setCaptureType('stream');

            video.onerror = function () {
                console.log('streaming error');
                stream.stop();
                streamError();
            };


        } else{
            console.log('using flash for getusermedia',options.context); //MH - Flash takes over. No action required(?)
        };


        if (Capture.captureVars.capturePhase == "camera"){
            Capture.initCameraPhase();
        };

    };

    var onDeviceError = function(error){
        console.log('device error');
        var isIOS = navigator.userAgent.match(/ipad|iphone|ipod/i);
        if (isIOS){
            Capture.setCaptureType('file');
            Capture.initCameraPhase();
        } else {
            var hasFlash = detectFlash();
            if (hasFlash){
                console.log('browser has flash, check for other errors');
            } else {
                $('#noflash').show();
            }
        };

    };

    var detectFlash = function(){
        var hasFlash = false;
        try {
            var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            if(fo){
                hasFlash = true;
            };
        } catch(e){
            if (navigator.mimeTypes ["application/x-shockwave-flash"] != undefined){
                hasFlash = true;
            }
        }
        return hasFlash;
    }

    return {
        init: init
    };

})(jQuery);
