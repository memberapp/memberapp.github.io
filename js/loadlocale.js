(function () {
    'use strict';

     var language = (window.navigator.language || window.browserLanguage || window.userLanguage).toLowerCase();
	[
	  language,
	  language.split('-')[0]
	].forEach(function(src) {
          console.log('loading: ' + src);
	  var script = document.createElement('script');
          script.setAttribute('type', 'application/json');
	  script.setAttribute('src', './locale/' + src + '.json');
          script.setAttribute('data-vavilon-dict', src);
	  script.async = true;
	  document.head.appendChild(script);
	});

}());
	  
