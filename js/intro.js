var Intro = (function() {

    'use strict';

    var init = function($) {
        addIntroListeners();
    };

    var addIntroListeners = function(){
        $('body').on('click', '#btn-start', onGetStarted);
    };

    var onGetStarted = function(){
        console.log('get started');
        $('body').off('click', '#btn-start', onGetStarted);
        $('#intro-container').removeClass('active');
        $('#capture-container').addClass('active');
        Capture.setCapturePhase("camera"); //first we need a photo of the user before we shoot video
        Detection.init();
    };

    return {
        init: init
    };

})(jQuery);
