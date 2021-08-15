function bitcloutlogin() {
  insertBitcloutIdentityFrame();
  identityWindow = window.open(
    "https://identity.bitclout.com/log-in?accessLevelRequest=3",
    null,
    "toolbar=no, width=800, height=1000, top=0, left=0"
  );
}

function insertBitcloutIdentityFrame() {
  document.getElementById('bitcloutframe').innerHTML = `<iframe id="identity" frameborder="0" class="" src="https://identity.bitclout.com/embed?v=2" style="height: 100vh; width: 100vw; display: none;"></iframe>`;
}

function showBitcloutIdentityFrame() {
  document.getElementById('bitcloutframe').style.display = 'block';
}

function hideBitcloutIdentityFrame() {
  document.getElementById('bitcloutframe').style.display = 'none';
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

    postMessage({
      id: 'testpermissions',
      service: 'identity',
      method: 'info'
    });

    for (const e of pendingRequests) {
      postMessage(e);
    }

    pendingRequests = [];
  }
  respond(e.source, e.data.id, {});
}

function getBitCloutLoginFromLocalStorage() {
  bitCloutUser = localStorageGet(localStorageSafe, "bitcloutuser");
  bitCloutUserData = JSON.parse(localStorageGet(localStorageSafe, "bitcloutuserdata"));

  if (bitCloutUserData) {
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
  console.log(message);

  const {
    data: { id: id, method: method, payload: payload },
  } = message;

  console.log(id);
  console.log(method);
  console.log(payload);
  //localStorage.setItem("identity", JSON.stringify(payload));

  if (method == "initialize") {
    handleInit(message);
  } else if (method == "storageGranted") {
    if (payload.hasStorageAccess == true) {
      hideBitcloutIdentityFrame();
    }
  } else if (id == "testpermissions") {
    if (payload.hasStorageAccess == false) {
      showBitcloutIdentityFrame();
    }
    if (payload.browserSupported == false) {
      alert("This browser does not support BitClout Identity login.");
    }
  } else if (method == "login") {
    handleLoginBitclout(payload);
  } else if (payload && payload.signedTransactionHex) {
    console.log(payload.signedTransactionHex);
    submitSignedTransaction(payload.signedTransactionHex, id);
  } else if (payload && payload.decryptedHexes) {
    for (var key in payload.decryptedHexes) {
      identityresponses.set(id, payload.decryptedHexes[key]);
    }
  } else if (payload && payload.approvalRequired) {
    if (!alertShown) {
      alert("Your OS/Browser may not be compatible with Write Mode BitClout Identity Service - identity.bitclout.com returned error " + JSON.stringify(payload));
      alertShown = true;
    }
    identityresponses.set(id, "identity.bitclout.com returned error " + JSON.stringify(payload));
  } else {
    identityresponses.set(id, JSON.stringify(payload));
  }

});

var alertShown = false;

function submitSignedTransaction(signedTrx, id) {
  var submitpayload = `{"TransactionHex":"` + signedTrx + `"}`;
  var url2 = dropdowns.txbroadcastserver + "bitclout?bcaction=submit-transaction";
  getJSON(url2, "&payload=" + encodeURIComponent(submitpayload)).then(function (data) {
    console.log(data);
    serverresponses.set(id, data.TxnHashHex);
  });
}

async function checkIfBitcloutUser(pubkeyhex1) {
  var bcAddress = await pubkeyToBCaddress(pubkeyhex1);
  var submitpayload = `{"PublicKeyBase58Check":"` + bcAddress + `"}`;
  var url2 = dropdowns.txbroadcastserver + "bitclout?bcaction=get-single-profile";
  getJSON(url2, "&payload=" + encodeURIComponent(submitpayload)).then(function (data) {
    console.log(data);
    if (data.Profile && data.Profile.Username) {
      //This is a BC user
      bitCloutUser = bcAddress;
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




async function putBitCloutDecryptedMessageInElement(message, elementid, publicKeySender) {
  var decryptedMessage = await bitcloutDecryptMessage(message, publicKeySender);
  document.getElementById(elementid).textContent = decryptedMessage;
}

async function bitcloutDecryptMessage(message, publicKeySender) {

  var uniqueid = getRandomInt(1000000000);

  //Not sure if message is v1 or v2, try both and the wrong one should error out harmlessly 

  //v1
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

  //publicKeySender
  let messageObj = {
    EncryptedHex: message,
    IsSender: false,
    PublicKey: await pubkeyToBCaddress(publicKeySender),
    V2: true
  }

  //v2
  postMessage({
    id: uniqueid,
    service: 'identity',
    method: 'decrypt',
    payload: {
      accessLevel: bitCloutUserData.accessLevel,
      accessLevelHmac: bitCloutUserData.accessLevelHmac,
      encryptedSeedHex: bitCloutUserData.encryptedSeedHex,
      encryptedMessages: [
        messageObj
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
  for (var i = 0; i < 250; i++) {
    if (serverresponses.has(key)) {
      return serverresponses.get(key);
    }
    await sleep(200);
  }
  //alert("Error: identity.bitclout.com Service did not return a value.");
  throw Error("Error: bitclout.com Server did not return a value.");
}

async function sendBitCloutTransaction(payload, action, divForStatus) {
  let confirmation='';
  let retrywait=0;
  do{
    if(retrywait>0){
      if (divForStatus) {
        let statusElement = document.getElementById(divForStatus);
        if (statusElement) statusElement.value = "Retry in ms:"+retrywait;
      }  
    }
    await sleep(retrywait);
    try{
      confirmation=await constructAndSendBitCloutTransaction(payload, action, divForStatus);
    }catch(err){
      console.log("error sending:"+err);
      //sometime may error out, means we'll try again.
    }
    retrywait=(retrywait*1.5)+2000;
  }while(!confirmation || confirmation.length!=64); //txid should be 64 chars in length

  return confirmation;
}


async function constructAndSendBitCloutTransaction(payload, action, divForStatus) {

  if (divForStatus) {
    var statusElement = document.getElementById(divForStatus);
  }
  var uniqueid = getRandomInt(1000000000);
  var url = dropdowns.txbroadcastserver + "bitclout?bcaction=" + action;
  //var url = dropdowns.txbroadcastserver + "bitclout";
  if (statusElement) statusElement.value = "Constructing BitClout Tx";
  
  getJSON(url, "&payload=" + encodeURIComponent(payload)).then(async function (data) {
    //Now sign the transaction

    if (bitCloutUserData) {
      //Use identity
      if (statusElement) statusElement.value = "Signing Tx With Identity";
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
    } else {
      //Use privkey to sign
      if (statusElement) statusElement.value = "Signing Tx With Key";
      var signedTx = await signTransaction(data.TransactionHex);
      submitSignedTransaction(signedTx, uniqueid, divForStatus);
    }
  }).catch(err => serverresponses.set(uniqueid, err.message));
  
  return await waitForServerResponse(uniqueid);
}

async function bitCloutLikePost(likedPostHashHex) {
  //First get the unsigned tx
  var payload = `{"ReaderPublicKeyBase58Check":"` + bitCloutUser + `","LikedPostHashHex":"` + likedPostHashHex + `","IsUnlike":false,"MinFeeRateNanosPerKB":1000}`;
  return await sendBitCloutTransaction(payload, "create-like-stateless");
}

async function bitCloutPinPost(pinPostHashHex,pubkey) {
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: pinPostHashHex,
    BodyObj: { Body: `pinpost https://member.cash/ba/${pubkey}`},
    IsHidden: true,
    MinFeeRateNanosPerKB: 1000
  };
  payload.PostExtraData = { Pinpost: "true" };

  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", null);
}


async function sendBitCloutFollow(followpubkey) {
  var payload = `{
      "FollowerPublicKeyBase58Check":"`+ bitCloutUser + `",
      "FollowedPublicKeyBase58Check":"`+ await pubkeyToBCaddress(followpubkey) + `",
      "IsUnfollow      ":false,
      "MinFeeRateNanosPerKB":1000
    }`;
  return await sendBitCloutTransaction(payload, "create-follow-txn-stateless");
}

async function sendBitCloutUnFollow(unfollowpubkey) {
  var payload = `{
      "FollowerPublicKeyBase58Check":"`+ bitCloutUser + `",
      "FollowedPublicKeyBase58Check":"`+ await pubkeyToBCaddress(unfollowpubkey) + `",
      "IsUnfollow":true,
      "MinFeeRateNanosPerKB":1000
    }`;
  return await sendBitCloutTransaction(payload, "create-follow-txn-stateless");
}


async function sendBitCloutSub(topicHOSTILE) {
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: 'b943df7fb091a3b403d8f2d33ffa7f5331d54b340aa8e5641eb8d0a65a9068d3',
    BodyObj: { Body: 'subscribe ' + topicHOSTILE },
    IsHidden: true,
    MinFeeRateNanosPerKB: 1000
  };
  payload.PostExtraData = { Subscribe: topicHOSTILE };

  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", null);
}

async function sendBitCloutUnSub(topicHOSTILE) {
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: 'b943df7fb091a3b403d8f2d33ffa7f5331d54b340aa8e5641eb8d0a65a9068d3',
    BodyObj: { Body: 'unsubscribe ' + topicHOSTILE },
    IsHidden: true,
    MinFeeRateNanosPerKB: 1000
  };
  payload.PostExtraData = { Unsubscribe: topicHOSTILE };

  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", null);
}



async function sendBitCloutMute(followpubkey) {
  var bcAddress = await pubkeyToBCaddress(followpubkey);
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: 'b943df7fb091a3b403d8f2d33ffa7f5331d54b340aa8e5641eb8d0a65a9068d3',
    BodyObj: { Body: 'mute ' + bcAddress },
    IsHidden: true,
    MinFeeRateNanosPerKB: 1000
  };
  payload.PostExtraData = { Mute: bcAddress };

  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", null);
}

async function sendBitCloutUnMute(followpubkey) {
  var bcAddress = await pubkeyToBCaddress(followpubkey);
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: 'b943df7fb091a3b403d8f2d33ffa7f5331d54b340aa8e5641eb8d0a65a9068d3',
    BodyObj: { Body: 'unmute ' + bcAddress },
    IsHidden: true,
    MinFeeRateNanosPerKB: 1000
  };
  payload.PostExtraData = { UnMute: bcAddress };

  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", null);
}

async function sendBitCloutRating(posttext, topic, divForStatus, successFunction, postExtraData) {
  //var bcAddress=pubkeyToBCaddress(followpubkey);
  if (topic) {
    posttext = posttext + " #" + topic;
  }
  var body = { Body: posttext, ImageURLs: [] };
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: 'b943df7fb091a3b403d8f2d33ffa7f5331d54b340aa8e5641eb8d0a65a9068d3',
    BodyObj: body,
    IsHidden: true,
    MinFeeRateNanosPerKB: 1000
  };
  payload.PostExtraData = postExtraData;

  return await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", null);
}



async function sendBitCloutReply(txid, replytext, divForStatus, successFunction, parentSourceNetwork) {
  var body = { Body: replytext, ImageURLs: [] };
  let postExtraData;
  if(parentSourceNetwork!=1){
    //Bitclout does not allow a reply to post that does not exist on its network
    //We'll send reply to a different post, and make a note of the real reply below
    postExtraData={ Overideretxid: txid };
    txid='b943df7fb091a3b403d8f2d33ffa7f5331d54b340aa8e5641eb8d0a65a9068d3';
  }
  var payload = {
    UpdaterPublicKeyBase58Check: bitCloutUser,
    ParentStakeID: txid,
    BodyObj: body,
    IsHidden: false,
    MinFeeRateNanosPerKB: 1000
  };
  if(parentSourceNetwork!=1){
    payload.PostExtraData = postExtraData;
  }

  var txid = await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", divForStatus);
  if (successFunction) { successFunction(txid, replytext) };
  return txid;
}


//todo check if special characters work in posttext
async function sendBitCloutPost(posttext, topic, divForStatus, successFunction, postExtraData) {
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

  if (postExtraData) {
    payload.PostExtraData = postExtraData;
  }
  var txid = await sendBitCloutTransaction(JSON.stringify(payload), "submit-post", divForStatus);
  if (successFunction) { successFunction(txid, posttext) };
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
  if (successFunction) { successFunction(txid, posttext) };
  return txid;
}

async function sendBitCloutPostLong(posttext, postbody, topic, divForStatus, successFunction) {
  var txid = await sendBitCloutPost(posttext, topic, divForStatus, null, null);
  if (postbody) {
    return await sendBitCloutReply(txid, postbody, divForStatus, successFunction);
  } else {
    if (successFunction) { successFunction(txid, posttext) };
    return txid;
  }
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


async function sendBitCloutPrivateMessage(messageRecipientpubkey, text, divForStatus, successFunction, preEncryptedMessage) {

  let recipient = await pubkeyToBCaddress(messageRecipientpubkey);
  let payload;
  let encryptedMessage;
  
  if(preEncryptedMessage){
    encryptedMessage=preEncryptedMessage;
  }else if (bitCloutUserData) {
    //First encrypt the message with identity
    let uniqueid = getRandomInt(1000000000);
    if (statusElement) statusElement.value = "Encrypting Message With Identity";
    postMessage({
      id: uniqueid,
      service: 'identity',
      method: 'encrypt',
      payload: {
        accessLevel: bitCloutUserData.accessLevel,
        accessLevelHmac: bitCloutUserData.accessLevelHmac,
        encryptedSeedHex: bitCloutUserData.encryptedSeedHex,
        recipientPublicKey: recipient,
        message: text
      }
    });
    //Wait for reply
    encryptedMessage = await waitForServerResponse(uniqueid);
  }

  payload = {
    SenderPublicKeyBase58Check: bitCloutUser,
    RecipientPublicKeyBase58Check: recipient,
    EncryptedMessageText: encryptedMessage,
    MinFeeRateNanosPerKB: 1000
  };

  /*} else {
    //message signed by server with recpients public key only - 
    payload = {
      SenderPublicKeyBase58Check: bitCloutUser,
      RecipientPublicKeyBase58Check: recipient,
      MessageText: text,
      MinFeeRateNanosPerKB: 1000
    };
  }*/

  var txid = await sendBitCloutTransaction(JSON.stringify(payload), "send-message-stateless", divForStatus);
  if (successFunction) { successFunction(txid, '') };
  return txid;
}

async function pubkeyToBCaddress(publickey) {
  if (!bitboxSdk) { await loadScript("js/lib/bitboxsdk.js"); } //need this for bs58check
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

function isBitCloutUser() {
  return (bitCloutUser);
}

function isBitCloutIdentityUser() {
  return (bitCloutUserData);
}
