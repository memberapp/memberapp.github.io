function bitcloutlogin() {
  insertBitcloutIdentityFrame();
  identityWindow = window.open(
    "https://identity.bitclout.com/log-in?accessLevelRequest=3",
    null,
    "toolbar=no, width=800, height=1000, top=0, left=0"
  );
}

function insertBitcloutIdentityFrame() {
  document.getElementById('bitcloutframe').innerHTML = `<iframe id="identity" frameborder="0" class="" src="https://identity.bitclout.com/embed?v=2" style="width:1px; height:1px; display: none;"></iframe>`;
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
    //uniqueid = e.data.id;

    for (const e of pendingRequests) {
      postMessage(e);
    }

    pendingRequests = [];
  }
  respond(e.source, e.data.id, {});
}

function getBitCloutLoginFromLocalStorage(){
    bitCloutUser = localStorageGet(localStorageSafe, "bitcloutuser");
    bitCloutUserData = JSON.parse(localStorageGet(localStorageSafe, "bitcloutuserdata"));

    if(bitCloutUserData){
        insertBitcloutIdentityFrame();
    }
}

function handleLoginBitclout(payload) {
  console.log("Handle Login");
  console.log(payload);

  if (identityWindow) {
    identityWindow.close();
    identityWindow = null;
  }

  if (payload && payload.publicKeyAdded) {
    bitCloutUser = payload.publicKeyAdded;
    bitCloutUserData = payload.users[bitCloutUser];
    localStorageSet(localStorageSafe, "bitcloutuser", bitCloutUser);
    localStorageSet(localStorageSafe, "bitcloutuserdata", JSON.stringify(bitCloutUserData));
    trylogin(payload.publicKeyAdded);
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
  //localStorage.setItem("identity", JSON.stringify(payload));

  if (method == "initialize") {
    handleInit(message);
  } else if (method == "login") {
    handleLoginBitclout(payload);
  } else if (payload && payload.signedTransactionHex) {
    console.log(payload.signedTransactionHex);
    submitSignedTransaction(payload.signedTransactionHex, id);
  } else if (payload && payload.decryptedHexes) {
    console.log(payload.decryptedHexes);
    for (var i = 0; i < payload.length; i++) {
      identityresponses.set(id, decryptedHexes[i][1]);
    }
  } else if (payload && payload.approvalRequired) {
      alert("identity.bitclout.com returned error "+JSON.stringify(payload));
      identityresponses.set(id, "identity.bitclout.com returned error "+JSON.stringify(payload));  
  } else {
    identityresponses.set(id, JSON.stringify(payload));
  }

});

function submitSignedTransaction(signedTrx,id) {
  var submitpayload = `{"TransactionHex":"` + signedTrx + `"}`;
  var url2 = "https://member.cash/v2/bitclout?bcaction=submit-transaction&payload=" + encodeURIComponent(submitpayload);
  getJSON(url2).then(function (data) {
    console.log(data);
    serverresponses.set(id, data.TxnHashHex);
  });
}

function checkIfBitcloutUser(pubkeyhex1) {
  var bcAddress=pubkeyToBCaddress(pubkeyhex1);
  var submitpayload = `{"PublicKeyBase58Check":"` + bcAddress + `"}`;
  var url2 = "https://member.cash/v2/bitclout?bcaction=get-single-profile&payload=" + encodeURIComponent(submitpayload);
  getJSON(url2).then(function (data) {
    console.log(data);
    if(data.Profile && data.Profile.Username){
      //This is a BC user
      bitCloutUser=bcAddress;
      localStorageSet(localStorageSafe, "bitcloutuser", bitCloutUser);
    }
  });
}

var bcinit = false;
var iframe = null;
var pendingRequests = [];
var identityWindow = null;

var bitCloutUser = null;
var bitCloutUserData = null;

let identityresponses = new Map();
let serverresponses = new Map();




async function putBitCloutDecryptedMessageInElement(message, elementid) {
  var decryptedMessage = await bitcloutDecryptMessage(message);
  document.getElementById(elementid).textContent = decryptedMessage;
}

async function bitcloutDecryptMessage(message) {

  var uniqueid = getRandomInt(1000000000);
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

  return await waitForResponse(uniqueid);

}

async function waitForResponse(key) {
  for (var i = 0; i < 15; i++) {
    if (identityresponses.has(key)) {
      return identityresponses.get(key);
    }
    await sleep(200);
  }
  //alert("Error: identity.bitclout.com Service did not return a value.");
  throw Error("Error: identity.bitclout.com Service did not return a value.");
}

async function waitForServerResponse(key) {
  for (var i = 0; i < 50; i++) {
    if (serverresponses.has(key)) {
      return serverresponses.get(key);
    }
    await sleep(200);
  }
  //alert("Error: identity.bitclout.com Service did not return a value.");
  throw Error("Error: bitclout.com Server did not return a value.");
}



async function sendBitCloutTransaction(payload, action, divForStatus) {

  if(divForStatus){
    var statusElement=document.getElementById(divForStatus);
  }
  var uniqueid = getRandomInt(1000000000);
  var url = "https://member.cash/v2/bitclout?bcaction=" + action + "&payload=" + encodeURIComponent(payload);
  if(statusElement)statusElement.value = "Constructing BitClout Tx";
  getJSON(url).then(async function (data) {
    //Now sign the transaction
    
    if(bitCloutUserData){
      //Use identity
      if(statusElement)statusElement.value = "Signing Tx With Identity";
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
    }else{
      //Use privkey to sign
      if(statusElement)statusElement.value = "Signing Tx With Key";
      var signedTx = await signTransaction(data.TransactionHex);
      submitSignedTransaction(signedTx, uniqueid, divForStatus);
    }

    
  });
  return await waitForServerResponse(uniqueid);
}

async function bitCloutLikePost(likedPostHashHex) {
  /*postMessage({
    id: 'test2',
    service: 'identity',
    method: 'info'
  });*/

  //First get the unsigned tx
  var payload = `{"ReaderPublicKeyBase58Check":"` + bitCloutUser + `","LikedPostHashHex":"` + likedPostHashHex + `","IsUnlike":false,"MinFeeRateNanosPerKB":1000}`;
  return await sendBitCloutTransaction(payload, "create-like-stateless");
}

//todo need to change the qaddress to bcaddress somehow
async function sendBitCloutFollow(followpubkey) {
  var payload = `{
      "FollowerPublicKeyBase58Check":"`+ bitCloutUser + `",
      "FollowedPublicKeyBase58Check":"`+ pubkeyToBCaddress(followpubkey) + `",
      "IsUnfollow      ":false,
      "MinFeeRateNanosPerKB":1000
    }`;
  return await sendBitCloutTransaction(payload, "create-follow-txn-stateless");
}

async function sendBitCloutUnFollow(unfollowpubkey) {
  var payload = `{
      "FollowerPublicKeyBase58Check":"`+ bitCloutUser + `",
      "FollowedPublicKeyBase58Check":"`+ pubkeyToBCaddress(unfollowpubkey) + `",
      "IsUnfollow      ":true,
      "MinFeeRateNanosPerKB":1000
    }`;
  return await sendBitCloutTransaction(payload, "create-follow-txn-stateless");
}

async function sendBitCloutReply(txid, replytext, divForStatus, successFunction) {
  var body = { Body: replytext, ImageURLs: [] };
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: txid,
    BodyObj: body,
    IsHidden: false,
    MinFeeRateNanosPerKB: 1000
  };
  var txid = await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", divForStatus);
  if(successFunction){successFunction()};
  return txid;
}


//todo check if special characters work in posttext
async function sendBitCloutPost(posttext, topic, divForStatus, successFunction) {
  if (topic) {
    posttext = posttext + " #" + topic;
  }
  var body = { Body: posttext, ImageURLs: [] };
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    BodyObj: body,
    IsHidden: false,
    MinFeeRateNanosPerKB: 1000
  };
  var txid = await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", divForStatus);
  if(successFunction){successFunction()};
  return txid;
}

async function sendBitCloutQuotePost(posttext, topic, txid, divForStatus, successFunction) {
  if (topic) {
    posttext = posttext + " #" + topic;
  }
  var body = { Body: posttext, ImageURLs: [] };

  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    RecloutedPostHashHex: txid,
    BodyObj: body,
    IsHidden: false,
    MinFeeRateNanosPerKB: 1000
  };
  var txid = await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", divForStatus);
  if(successFunction){successFunction()};
  return txid;
}

async function sendBitCloutPostLong(posttext, postbody, topic, divForStatus, successFunction) {
  var txid = await sendBitCloutPost(posttext, topic, divForStatus, null);
  return await sendBitCloutReply(txid, postbody, divForStatus, successFunction);
}

async function bitCloutRePost(txid) {
  var body = {};
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    RecloutedPostHashHex: txid,
    BodyObj: body,
    IsHidden: false,
    MinFeeRateNanosPerKB: 1000
  };
  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post");
}


async function sendBitCloutPrivateMessage(messageRecipient, text, divForStatus, successFunction) {
  var payload = {
    SenderPublicKeyBase58Check: bitCloutUser,
    RecipientPublicKeyBase58Check: pubkeyToBCaddress(messageRecipient),
    MessageText: text,
    MinFeeRateNanosPerKB: 1000
  };
  
  var txid = await sendBitCloutTransaction(JSON.stringify(payload), "send-message-stateless", divForStatus);
  if(successFunction){successFunction()};
  return txid;
}

function pubkeyToBCaddress(publickey) {
  return window.bs58check.encode(new Buffer('cd1400' + san(publickey), 'hex'));
}

uvarint64ToBuf = function (uint) {
  var result = [];
  while (uint >= 0x80) {
    result.push((uint & 0xFF) | 0x80);
    uint >>>= 7;
  }
  result.push(uint | 0);
  return new Buffer(result);
};

async function signTransaction(transactionHex) {
  if (!eccryptoJs) {
    await loadScript("js/lib/eccrypto-js.js");
  }
  //might be possible to remove this lib and use the eccryptoJs lib instead
  if (!window.elliptic) {
    await loadScript("js/lib/elliptic.min.js");
  }

  var ec = new window.elliptic.ec('secp256k1');
  privateKey = ec.keyFromPrivate(privkeyhex);

  var transactionBytes = new Buffer(transactionHex, 'hex');
  var transactionHash = await eccryptoJs.sha256(await eccryptoJs.sha256(transactionBytes));

  var signature = privateKey.sign(transactionHash);
  var signatureBytes = new Buffer(signature.toDER());
  var signatureLength = uvarint64ToBuf(signatureBytes.length);
  var signedTransactionBytes = Buffer.concat([
    transactionBytes.slice(0, -1),
    signatureLength,
    signatureBytes,
  ]);
  return signedTransactionBytes.toString('hex');
};

function isBitCloutUser(){
  return  (bitCloutUser);
}

function isBitCloutIdentityUser(){
  return  (bitCloutUserData);
}
