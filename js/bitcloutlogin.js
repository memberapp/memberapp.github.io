function bitcloutlogin() {
    identityWindow = window.open(
      "https://identity.bitclout.com/log-in?accessLevelRequest=3",
      null,
      "toolbar=no, width=800, height=1000, top=0, left=0"
    );
  }
  
  function bitcloutlogout() {
    /*identityWindow = window.open(
      "https://identity.bitclout.com/logout?publicKey="+bitCloutUser,
      null,
      "toolbar=no, width=800, height=1000, top=0, left=0"
    );*/
    bitCloutUser = null;
    bitCloutUserData = null;
  }

  function handleInit(e) {
    if (!bcinit) {
      bcinit = true;
      iframe = document.getElementById("identity");
      uniqueid = e.data.id;

      for (const e of pendingRequests) {
        postMessage(e);
      }
  
      pendingRequests = [];
    }
    respond(e.source, e.data.id, {});
  }
  
  function handleLogin(payload) {
    bitCloutUser=payload.publicKeyAdded;
    bitCloutUserData=payload.users[bitCloutUser];
    trylogin(payload.publicKeyAdded);
    console.log(payload);
    if (identityWindow) {
      identityWindow.close();
      identityWindow = null;
  
      //var element = document.getElementById("loggedin");
      //element.innerText = "Logged in as " + payload.publicKeyAdded;
    }
  }
  
  function respond(e, t, n) {
    e.postMessage(
      {
        id: t,
        service: "identity",
        payload: n,
      },
      "*"
    );
  }
  
  function postMessage(e) {
    console.log("post message: ");
    console.log(e);
    
    bcinit
      ? this.iframe.contentWindow.postMessage(e, "*")
      : pendingRequests.push(e);
  }
  
  // const childWindow = document.getElementById('identity').contentWindow;
  window.addEventListener("message", (message) => {
    console.log("message: ");
    // console.log(message);
  
    const {
      data: { id: id, method: method, payload: payload },
    } = message;
  
    console.log(id);
    console.log(method);
    console.log(payload);
    localStorage.setItem("identity", JSON.stringify(payload));
  
    if (method == "initialize") {
      handleInit(message);
    } else if (method == "login") {
      handleLogin(payload);
    }
  });
  
  var bcinit = false;
  var iframe = null;
  var pendingRequests = [];
  var identityWindow = null;

  var bitCloutUser = null;
  var bitCloutUserData = null;
  var uniqueid = null;

  async function testAPI(){
    /*
    var payload=`{"ReaderPublicKeyBase58Check":"BC1YLjB3jPJNF4K7yXUVfaewL1hyU8t4iKVsmg6eCm3QcKzic6RTBJt","LikedPostHashHex":"25176ab9dbb0476941b128afeb19c62f7dcb0d5fbf12d9be13555cd773ce8444","IsUnlike":false,"MinFeeRateNanosPerKB":1000}`;
    var url="http://127.0.0.1:3123/v2/bitclout?bcaction=create-like-stateless&payload="+encodeURIComponent(payload);

    getJSON(url).then(function (data) {
      alert(data.TransactionHex);
    });
    */
                

    //const response = await fetch('http://127.0.0.1:3123/v2/bitclout' + '?' + new URLSearchParams({ bcaction:'create-like-stateless', payload: payload}), { method: 'get', headers: { 'Content-Type': 'application/json' } });
  
    //alert(response);
    /*
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://127.0.0.1:3123/api/v0/create-like-stateless?bcaction=create-like-stateless", true);
    xhttp.setRequestHeader("Content-type", "content-type: application/json");
    //xhttp.setRequestHeader('referrer-policy', 'no-referrer');
    xhttp.send(`{"ReaderPublicKeyBase58Check":"BC1YLjB3jPJNF4K7yXUVfaewL1hyU8t4iKVsmg6eCm3QcKzic6RTBJt","LikedPostHashHex":"25176ab9dbb0476941b128afeb19c62f7dcb0d5fbf12d9be13555cd773ce8444","IsUnlike":false,"MinFeeRateNanosPerKB":1000}`);
    */
  }
  
  async function bitcloutDecryptMessage(message){
    postMessage({
      id: uniqueid,
      service: 'identity',
      method: 'decrypt',
      payload: {
          accessLevel: bitCloutUserData.accessLevel,
          accessLevelHmac: bitCloutUserData.accessLevelHmac,
          encryptedSeedHex: bitCloutUserData.encryptedSeedHex,
          encryptedHexes: [
            message
          ]
        }
    });
    return 'test';
  }

  function bitCloutLikePost(likedPostHashHex){
    /*postMessage({
      id: 'test2',
      service: 'identity',
      method: 'info'
    });*/

    //First get the unsigned tx
    var payload=`{"ReaderPublicKeyBase58Check":"`+bitCloutUser+`","LikedPostHashHex":"`+likedPostHashHex+`","IsUnlike":false,"MinFeeRateNanosPerKB":1000}`;
    var url="https://member.cash/v2/bitclout?bcaction=create-like-stateless&payload="+encodeURIComponent(payload);
    getJSON(url).then(function (data) {

      //Now sign the transaction
      console.log(data.TransactionHex);
      postMessage({
        id: uniqueid,
        service: 'identity',
        method: 'sign',
        payload: {
            accessLevel: bitCloutUserData.accessLevel,
            accessLevelHmac: bitCloutUserData.accessLevelHmac,
            encryptedSeedHex: bitCloutUserData.encryptedSeedHex,
            transactionHex: data.TransactionHex
          }
      });

    });
        
  }


