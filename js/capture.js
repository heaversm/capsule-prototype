var Capture = (function($) {

    'use strict';

    //CONFIGURATION VARS
    var captureVars = {
        captureType: null, //file or stream
        captureContext: null, //flash or webrtc
        capturePhase: null, //camera or camcorder
        capturing: false, //currently recording
        capturedQuestions: 0, //questions for which user answered
        currentQuestion: 0, //array position of current question
        capturedSize: 0, //file size of all captured files
    }

    var questions = [
        "Question 1",
        "Question 2",
        "Question 3"
    ];

    var mediaBlob, mediaRecorder = null, audioRecorder = null, audioBlob;

    var setCaptureType = function(type){
        captureVars.captureType = type;
    };

    var setCapturePhase = function(phase){
        captureVars.capturePhase = phase;
    };

    var setCaptureContext = function(context){
        captureVars.captureContext = context;
    };

    var playStream = function(){
        console.log('play stream');
        Capture.stream.play();
    };

    var stopStream = function(){
        console.log('stop stream');
        Capture.stream.stop();
    }

    var initFileCapture = function(){
        console.log('initFileCapture');

        $('#file-buttons').addClass('active');

        if (captureVars.capturePhase == "camera"){
            $('#file-camera').addClass('active');
            addFileCameraListeners();
            removeFileCamcorderListeners();
        } else if (captureVars.capturePhase == "camcorder"){
            $('#file-camcorder').addClass('active');
            $('#file-camcorder-submit').addClass('active');
            addFileCamcorderListeners();
            removeFileCameraListeners();
        };

    };

    var initStreamCapture = function(){
        console.log('initStreamCapture');

        $('#stream-buttons').addClass('active');

        if (captureVars.capturePhase == "camera"){
            $('#stream-camera').addClass('active');
            $('#stream-camcorder').removeClass('active');
            addStreamCameraListeners();
            removeStreamCamcorderListeners();
        } else if (captureVars.capturePhase == "camcorder"){
            $('#stream-camcorder').addClass('active');
            $('#stream-camera').removeClass('active');
            addStreamCamcorderListeners();
            removeStreamCameraListeners();
        };

    };

    var initCameraPhase = function(){
        console.log('initCameraPhase',captureVars.captureType);
        switch (captureVars.captureType){
            case 'file' :
                initFileCapture();
                break;
            case 'stream' :
                initStreamCapture();
                break;
        }
    };

    var onStartStreamCamera = function(){
        captureVars.capturing = true;
        console.log('start camera');
        $('#photo-canvas').addClass('active');
        takeStreamPicture();
    };

    var takeStreamPicture = function(){

        if (captureVars.captureContext === 'webrtc') {
            var video = document.getElementsByTagName('video')[0];
            var $canvas = $('#photo-canvas')[0];
            $canvas.width = video.videoWidth;
            $canvas.height = video.videoHeight;
            $canvas.getContext('2d').drawImage(video, 0, 0);

        } else if(captureVars.captureContext === 'flash'){
            window.webcam.capture();
        }
        else{
            console.log('No context was supplied');
        }

        endStreamCamera();

    };

    var endStreamCamera = function(){
        captureVars.capturing = false;
        removeStreamCameraListeners();
        $('#stream-camera').removeClass('active');
        setCapturePhase('camcorder');
        initStreamCapture();
    };


    var onEndCamera = function(){
        console.log('end camera');
    };

    var onClickStreamCamcorder = function(){
        if (captureVars.capturing == false){
            recordStream();
        } else {
            endRecordStream();
        };
    };

    var recordStream = function(){

        captureVars.capturing = true;
        $('#stream-camcorder').addClass('recording');
        console.log('start camcorder');

        var IsChrome = !!navigator.webkitGetUserMedia;

        if (IsChrome){
            audioRecorder = new MediaStreamRecorder(Capture.stream);
            audioRecorder.mimeType = 'audio/ogg';
            addAudioRecorderListeners();
            audioRecorder.start();

            mediaRecorder = new MediaStreamRecorder(Capture.stream);
            mediaRecorder.mimeType = 'video/webm';
            addMediaRecorderListeners();
            mediaRecorder.start();
        } else {
            mediaRecorder = new MediaStreamRecorder(Capture.stream);
            mediaRecorder.mimeType = 'video/webm';
            addMediaRecorderListeners();
            mediaRecorder.start();
        }

    };

    var addMediaRecorderListeners = function(){
        console.log('add video listeners');

        mediaRecorder.ondataavailable = function (blob) {
            console.log('video data available');
            mediaBlob = blob;
            saveAs(blob,'video.webm');
            var mediaURL = URL.createObjectURL(mediaBlob);
            var $recording = $('<a href="' + mediaURL + '" target="_blank">Video File</a><br/>');
            $('#output-container').append($recording);
        };

    };


    var addAudioRecorderListeners = function(){
        console.log('add audio listeners');
        audioRecorder.ondataavailable = function (blob) {
            console.log('audio data available');
            audioBlob = blob;
            saveAs(blob,'audio.wav');
            var mediaURL = URL.createObjectURL(audioBlob);
            var $recording = $('<a href="' + mediaURL + '" target="_blank">Audio File</a><br/>');
            $('#output-container').append($recording);
        };
    }

    var endRecordStream = function(){
        captureVars.capturing = false;
        $('#stream-camcorder').removeClass('recording');
        console.log('stop camcorder');

        if (mediaRecorder != null){
            mediaRecorder.stop();
        }

        if (audioRecorder != null){
            audioRecorder.stop();
        }

        stopStream();
    };

    var onEndCamcorder = function(){
        captureVars.capturing = false;
        $('#stream-camcorder').removeClass('recording');
        console.log('end camcorder');
    };

    var onStartFileCamera = function(){
        console.log('start file camera');
    };

    var onEndFileCamera = function(e){

        console.log('end file camera', e);
        var $fileRef = $('#file-camera')[0];
        var file = $fileRef.files[0];
        var blobURLref = URL.createObjectURL(file);
        var img = new Image();
        img.src = blobURLref;
        img.style.width = '320px';
        img.style.height = 'auto';
        $('#output-container').append(img);

        captureVars.capturing = false;
        removeFileCameraListeners();
        $('#file-camera').removeClass('active');
        setCapturePhase('camcorder');
        initFileCapture();
    };

    var onStartFileCamcorder = function(){
        console.log('start file camcorder');
    };

    var onEndFileCamcorder = function(e){
        console.log('end file camcorder', e);
        var $fileRef = $('#file-camcorder')[0];
        var file = $fileRef.files[0];
        console.log(file);
        var blobURLref = URL.createObjectURL(file);
        //var $fileLink = $('<a href="' + blobURLref + '">Video Link</a>');
        //saveAs(blobURLref,'video.mov');
        //$('#output-container').append($fileLink);




/*        var fileType = 'video'; // or "audio"
        var fileName = 'video.mov';  // or "wav" or "ogg"

        var formData = new FormData();
        formData.append(fileType + '-filename', fileName);
        formData.append(fileType + '-blob', blobURLref);

        xhr('save.php', formData, function (fileURL) {
            window.open(fileURL);
        });

        function xhr(url, data, callback) {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    callback(location.href + request.responseText);
                }
            };
            request.open('POST', url);
            request.send(data);
        }*/


        /*var blob = new Blob([file], {type: "video/quicktime"});
        console.log(blob);
        var $fileLink = $('<a href="' + blob + '">Video Link</a>');
        saveAs(blob,'video.mov');
        $('#output-container').append($fileLink);*/

        captureVars.capturing = false;
        removeFileCamcorderListeners();
        $('#file-camcorder').removeClass('active');

    };

    /* LISTENERS */

    var addFileCameraListeners = function(){
        $('body').on('click', '#file-camera', onStartFileCamera);
        $('body').on('change','#file-camera',onEndFileCamera);
    };

    var removeFileCameraListeners = function(){
        $('body').off('click', '#file-camera', onStartFileCamera);
        $('body').off('change','#file-camera',onEndFileCamera);
    };

    var addFileCamcorderListeners = function(){
        $('body').on('click', '#file-camcorder', onStartFileCamcorder);
        $('body').on('change','#file-camcorder',onEndFileCamcorder);
    };

    var removeFileCamcorderListeners = function(){
        $('body').off('click', '#file-camcorder', onStartFileCamcorder);
        $('body').off('change','#file-camcorder',onEndFileCamcorder);
    };

    var addStreamCameraListeners = function(){
        $('body').on('click', '#stream-camera', onStartStreamCamera);
    };

    var removeStreamCameraListeners = function(){
        $('body').off('click', '#stream-camera', onStartStreamCamera);
    };

    var addStreamCamcorderListeners = function(){
            $('body').on('click', '#stream-camcorder', onClickStreamCamcorder);
    };

    var removeStreamCamcorderListeners = function(){
        $('body').off('click', '#stream-camcorder');
    };

    /* PUBLIC VARS AND FUNCTIONS */

    return {
        playStream: playStream,
        setCaptureType: setCaptureType,
        setCapturePhase: setCapturePhase,
        setCaptureContext: setCaptureContext,
        initCameraPhase: initCameraPhase,
        captureVars: captureVars
    };

})(jQuery);
