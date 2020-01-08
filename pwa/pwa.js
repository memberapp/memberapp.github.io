if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        /*navigator.serviceWorker.register('sw.js?version=3.5.2').then(function (registration) {
            // Registration was successful
            console.log('Registered!');
        }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        }).catch(function (err) {
            console.log(err);
        });*/
        navigator.serviceWorker.getRegistrations().then(

            function(registrations) {
        
                for(let registration of registrations) {  
                    registration.unregister();
        
                }
        
        });
    });
} else {
    console.log('service worker is not supported');
}




