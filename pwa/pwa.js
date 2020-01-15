if (location.protocol === 'https:' || location.hostname === 'localhost'){
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('sw.js').then(function (registration) {
                // Registration was successful
                console.log('[Service Worker Registration] Registered!');
            }, function (err) {
                // registration failed :(
                console.log('[Service Worker Registration] Registration failed: ', err);
            }).catch(function (err) {
                console.log(err);
            });
        });
    } else {
        console.log('[Service Worker Registration] Not Supported');
    }
} else {
    console.log('[Service Worker Registration]  Skipping');
}