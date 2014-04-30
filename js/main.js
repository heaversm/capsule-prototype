
(function () {
    'use strict';

    var App = {
        init: function(){
            Intro.init();
        }
    };

    window.onload = function(){
        setTimeout(App.init,500);
    }

})();

