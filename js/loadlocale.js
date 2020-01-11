(function () {
    'use strict';
    const zhTraditional = ["zh-hk", "zh-tw", "zh-hant"];
    const zhSimplified = ["zh-cn", "zh-sg", "zh-hans"];
    const allowedInput = ["af", "an", "ar", "as", "azb", "az", "bal", "bel",
        "bg", "bn", "bo", "bs", "ca", "ckb", "cs", "cy", "da", "de", "el",
        "en", "eo", "es", "et", "eu", "fa", "fi", "fo", "fr", "fy", "ga", "gd",
        "gl", "gu", "haz", "he", "hi", "hr", "hsb", "hu", "id", "is", "it",
        "ja", "jv", "kab", "ka", "kir", "kk", "km", "kmr", "kn", "ko", "lt",
        "lv", "me", "mg", "mk", "ml", "mn", "mr", "ms", "mya", "nb", "ne",
        "nl", "nn", "os", "pa", "pl", "ps", "pt", "ro", "ru", "si", "sk",
        "skr", "sl", "snd", "so", "sq", "sr", "sv", "sw", "szl", "ta", "te",
        "th", "tl", "tr", "ug", "uk", "ur", "uz", "vi", "zh", "zht"];
    var language = (window.navigator.language || window.browserLanguage).toLowerCase();

    if (zhSimplified.includes(language)) {
        language = 'zh'
    } else if (zhTraditional.includes(language)) {
        language = 'zht'
    } else {
        language = language.substring(0, 3).split('-')[0]
    }
    // As the language is controlled by the users browser,
    // the input is restricted to a known set of possibilities
    const src = allowedInput.includes(language) ? language : 'en';

    if (location.protocol === 'https:' || location.protocol === 'http:') {
        console.log('[Localization] loading: ' + './locale/' + src + '.json');
        let script = document.createElement('script');
        script.setAttribute('type', 'application/json');
        script.setAttribute('src', './locale/' + src + '.json');
        script.setAttribute('data-vavilon-dict', src);
        script.async = false;
        document.head.appendChild(script);
    }


}());
	  
