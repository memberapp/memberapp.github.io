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
    try{
      updateStatus(getSafeTranslation('requestingpermission',"Requesting permission"));
      const permission = await window.Notification.requestPermission();
      updateStatus("controller:"+navigator.serviceWorker.controller);
      navigator.serviceWorker.controller.postMessage(pubkey);
      // value of permission can be 'granted', 'default', 'denied'
      // granted: user has accepted the request
      // default: user has dismissed the notification permission popup by clicking on x
      // denied: user has denied the request.
      if (permission !== 'granted') {
        updateStatus(getSafeTranslation('permissionnotgranted','Permission not granted for Notification'));
        throw new Error('Permission not granted for Notification')
      }else{
        updateStatus(getSafeTranslation('subscribing','Subscribing'));
        navigator.serviceWorker.controller.postMessage('subscribe');
      }
    }catch(err){
      updateStatus(err);
      //alert(err);
    }
  }
  
  const main = async () => {
    check()
    //const swRegistration = await registerServiceWorker()
    //const permission = await requestNotificationPermission()
  }
   main(); 

function serviceWorkerLogout(){
  try{
    navigator.serviceWorker.controller.postMessage('');
  }catch(err){}
}