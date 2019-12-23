(function () {
    'use strict';

    var language = (window.navigator.language || window.browserLanguage || window.userLanguage).toLowerCase();
    [
        // a short substring is used here in order to
        language.substring(0,3).split('-')[0]
    ].forEach(function (src) {
        console.log('loading: ' + src);
        let script = document.createElement('script');
        script.setAttribute('type', 'application/json');
        script.setAttribute('src', './locale/' + src + '.json');
        script.setAttribute('data-vavilon-dict', src);
        script.async = false;
        document.head.appendChild(script);
    });

}());
	  
