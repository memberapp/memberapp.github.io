if (location.protocol === 'https:' || location.hostname === 'localhost') {
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


const check = () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('No Service Worker support!')
    }
    if (!('PushManager' in window)) {
      throw new Error('No Push API Support!')
    }
  }
  
  /*const registerServiceWorker = async () => {
    const swRegistration = await navigator.serviceWorker.register('service.js')
    return swRegistration
  }*/
  
  const requestNotificationPermission = async () => {
    //console.log(navigator.serviceWorker);
    navigator.serviceWorker.controller.postMessage(pubkey);
    const permission = await window.Notification.requestPermission();
    // value of permission can be 'granted', 'default', 'denied'
    // granted: user has accepted the request
    // default: user has dismissed the notification permission popup by clicking on x
    // denied: user has denied the request.
    if (permission !== 'granted') {
      throw new Error('Permission not granted for Notification')
    }else{
        navigator.serviceWorker.controller.postMessage('subscribe');
    }
  }
  
  const main = async () => {
    check()
    //const swRegistration = await registerServiceWorker()
    //const permission = await requestNotificationPermission()
  }
   main(); 

function serviceWorkerLogout(){
    navigator.serviceWorker.controller.postMessage('');
}