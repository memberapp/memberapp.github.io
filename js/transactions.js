"use strict";

function checkForPrivKey() {
    if (privkey == "") {
        alert("You must login to do this.");
        return false;
    }
    return true;
}


//var waitForTransactionToComplete = false;

//is this used anywhere? TODO check
function sendTransaction(tx) {
    tq.queueTransaction(tx);
}

function repost(txid, message) {
    
    //Repost memo 	0x6d0b 	txhash(32), message(184)

    if (!checkForPrivKey()) return false;
    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    var tx = {
        data: ["0x6d0b", "0x" + reversetx],
        cash: { key: privkey }
    }

    if(message!=null && message!=''){
        tx = {
            data: ["0x6d0b", "0x" + reversetx, message],
            cash: { key: privkey }
        }
    }

    updateStatus("Reposting");
    tq.queueTransaction(tx);
}

function setName() {
    if (!checkForPrivKey()) return false;


    document.getElementById('settingsnametextbutton').disabled = true;
    document.getElementById('settingsnametext').disabled = true;

    var newName = document.getElementById('settingsnametext').value;

    const tx = {
        data: ["0x6d01", newName],
        cash: { key: privkey }
    }
    updateStatus("Setting Name");

    //TODO, on error, this should really enable the text field and text button again
    tq.queueTransaction(tx);
}



async function sendMessageRaw(privatekey, txid, replyHex, waitTimeMilliseconds, divForStatus, completionFunction, messageRecipient, stampAmount) {

    document.getElementById(divForStatus).value = "Sending Message . . . " + replyHex.length / 2 + " bytes remaining.";

    var sendHex = "";
    if (replyHex.length > 368) {
        sendHex = replyHex.substring(0, 368);
        replyHex = replyHex.substring(368);
    } else {
        sendHex = replyHex;
        replyHex = "";
    }

    var tx;
    if (txid == null) {
        //start of message
        tx = {
            data: ["0x6dd0", "0x" + sendHex],
            cash: {
                key: privatekey,
                to: [{ address: messageRecipient, value: Number(stampAmount) }]
            }
        }
    } else {
        var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
        tx = {
            data: ["0x6dd1", "0x" + reversetx, "0x" + sendHex],
            cash: { key: privatekey }
        }
    }

    //await sleep(500); // Wait a little to show message
    if (waitTimeMilliseconds > 0) {
        updateStatus("Waiting " + (waitTimeMilliseconds / 1000) + " Seconds");
        await sleep(waitTimeMilliseconds);
    }

    //If there is still more to send
    if (replyHex.length > 0) {
        tq.queueTransaction(tx, function (newtxid) { sendMessageRaw(privatekey, newtxid, replyHex, 1000, divForStatus, completionFunction); }, null);
    } else {
        //last one
        tq.queueTransaction(tx, completionFunction, null);
    }

}


function postmemorandumRaw(posttext, postbody, privkey, topic, newpostmemorandumstatus, memorandumpostcompleted) {

    var tx = {
        data: ["0x6d02", posttext],
        cash: { key: privkey }
    }

    if (topic != "") {
        tx = {
            data: ["0x6d0c", topic, posttext],
            cash: { key: privkey }
        }
    }

    const replyHex = new Buffer(postbody).toString('hex');

    tq.queueTransaction(tx, function (newtxid) { sendReplyRaw(privkey, newtxid, replyHex, 5000, newpostmemorandumstatus, memorandumpostcompleted); }, null);
}


function postRaw(posttext, privkey, topic, newpoststatus, memocompleted) {

    var tx = {
        data: ["0x6d02", posttext],
        cash: { key: privkey }
    }

    if (topic != "") {
        tx = {
            data: ["0x6d0c", topic, posttext],
            cash: { key: privkey }
        }
    }

    tq.queueTransaction(tx, memocompleted, null);
}

function postgeoRaw(posttext, privkey, geohash, newpostgeostatus, geocompleted) {

    const tx = {
        data: ["0x6da8", geohash, posttext],
        cash: { key: privkey }
    }
    updateStatus("Sending Geotagged Post");
    tq.queueTransaction(tx, geocompleted, null);
}



async function sendReplyRaw(privatekey, txid, replyHex, waitTimeMilliseconds, divForStatus, completionFunction) {

    document.getElementById(divForStatus).value = "Sending Reply . . . " + replyHex.length / 2 + " bytes remaining.";

    var sendHex = "";
    if (replyHex.length > 368) {
        //Search for whitespace - try to break at a whitespace
        var whitespaceIndex = 348;
        var spaceIndex = replyHex.lastIndexOf("20", 368);
        if (spaceIndex % 2 == 0 && spaceIndex > whitespaceIndex) {
            whitespaceIndex = spaceIndex;
        }
        var nlIndex = replyHex.lastIndexOf("0A", 368);
        if (nlIndex % 2 == 0 && nlIndex > whitespaceIndex) {
            whitespaceIndex = nlIndex;
        }
        var crIndex = replyHex.lastIndexOf("0D", 368);
        if (crIndex % 2 == 0 && crIndex > whitespaceIndex) {
            whitespaceIndex = crIndex;
        }

        if (whitespaceIndex > 348) {
            sendHex = replyHex.substring(0, whitespaceIndex);
            replyHex = replyHex.substring(whitespaceIndex);
        } else {
            sendHex = replyHex.substring(0, 368);
            replyHex = replyHex.substring(368);
        }
    } else {
        sendHex = replyHex;
        replyHex = "";
    }

    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6d03", "0x" + reversetx, "0x" + sendHex],
        cash: { key: privatekey }
    }

    //await sleep(500); // Wait a little to show message
    if (waitTimeMilliseconds > 0) {
        updateStatus("Waiting " + (waitTimeMilliseconds / 1000) + " Seconds");
        await sleep(waitTimeMilliseconds);
    }

    //If there is still more to send
    if (replyHex.length > 0) {
        tq.queueTransaction(tx, function (newtxid) { sendReplyRaw(privatekey, newtxid, replyHex, 1000, divForStatus, completionFunction); }, null);
    } else {
        //last one
        tq.queueTransaction(tx, completionFunction, null);
    }

}



function sendTipRaw(txid, tipAddress, tipAmount, privkey, successFunction) {

    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6d04", "0x" + reversetx],
        cash: {
            key: privkey,
            to: [{ address: tipAddress, value: Number(tipAmount) }]
        }
    }
    updateStatus("Sending Tip");
    tq.queueTransaction(tx, successFunction, null);
}

function sendLike(txid) {
    if (!checkForPrivKey()) return false;

    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6d04", "0x" + reversetx],
        cash: { key: privkey }
    }
    updateStatus("Sending Like");
    tq.queueTransaction(tx);
}

function setProfile() {
    if (!checkForPrivKey()) return false;


    document.getElementById('settingsprofiletextbutton').disabled = true;
    var newProfile = document.getElementById('settingsprofiletext').value;

    const tx = {
        data: ["0x6d05", newProfile],
        cash: { key: privkey }
    }
    updateStatus("Setting Profile");
    tq.queueTransaction(tx);
}


function sub(topicHOSTILE) {

    if (!checkForPrivKey()) return false;

    //Remove the clicked element so it can't be clicked again
    event.srcElement.style.display = "none";

    const tx = {
        data: ["0x6d0d", topicHOSTILE],
        cash: { key: privkey }
    }
    updateStatus("Sending Subscribe");
    tq.queueTransaction(tx);
}

function unsub(topicHOSTILE) {
    if (!checkForPrivKey()) return false;

    //Remove the clicked element so it can't be clicked again
    event.srcElement.style.display = "none";

    const tx = {
        data: ["0x6d0e", topicHOSTILE],
        cash: { key: privkey }
    }
    updateStatus("Sending Unsubscribe");
    tq.queueTransaction(tx);
}

function addressTransaction(removeElementID, qaddress, actionCode, statusMessage) {
    if (!checkForPrivKey()) return false;

    document.getElementById(removeElementID).style.display = "none";
    var addressraw = new BITBOX.Address().legacyToHash160(qaddress);
    const tx = {
        data: [actionCode, "0x" + addressraw],
        cash: { key: privkey }
    }
    updateStatus(statusMessage);
    tq.queueTransaction(tx);
}

function follow(qaddress) {
    addressTransaction('memberfollow', qaddress, "0x6d06", "Sending Follow");
}

function unfollow(qaddress) {
    addressTransaction('memberfollow', qaddress, "0x6d07", "Sending Unfollow");
}

function mute(qaddress) {
    addressTransaction('memberblock', qaddress, "0x6d16", "Sending Mute");
}

function unmute(qaddress) {
    addressTransaction('memberblock', qaddress, "0x6d17", "Sending Unmute");
}

function sendDislike(txid) {
    txidTransaction(txid, "0x6db4", "Sending Dislike");
}

function sendHidePost(txid) {
    txidTransaction(txid, "0x6dc5", "Sending Hide Post");
}

function sendSendUnhidePost(txid) {
    txidTransaction(txid, "0x6dc6", "Sending Unhide Post");
}

function txidTransaction(txid, actionCode, statusMessage) {
    if (!checkForPrivKey()) return false;

    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: [actionCode, "0x" + reversetx],
        cash: { key: privkey }
    }
    updateStatus(statusMessage);
    tq.queueTransaction(tx);

}

function rateUser(qaddress, rating, ratingcomment) {
    if (!checkForPrivKey()) return false;
    if (ratingcomment === undefined) {
        ratingcomment = "";
    }

    var addressraw = new BITBOX.Address().legacyToHash160(qaddress);

    var hexRating = "0x" + toHexString([rating]);
    const tx = {
        data: ["0x6da5", "0x" + addressraw, hexRating, ratingcomment],
        cash: { key: privkey }
    }
    updateStatus("Sending Rating");
    tq.queueTransaction(tx);
    return true;
}

function designate(qaddress, topicHOSTILE, elementid) {
    addressTopicTransaction(elementid, qaddress, '0x6dc1', "Sending Add Filter", topicHOSTILE);
}

function dismiss(qaddress, topicHOSTILE, elementid) {
    addressTopicTransaction(elementid, qaddress, '0x6dc2', "Sending Remove Filter", topicHOSTILE);
}

function hideuser(qaddress, topicHOSTILE, elementid) {
    addressTopicTransaction(elementid, qaddress, '0x6dc3', "Sending Hide Member", topicHOSTILE);
}

function unhideuser(qaddress, topicHOSTILE, elementid) {
    addressTopicTransaction(elementid, qaddress, '0x6dc4', "Sending Unhide Member", topicHOSTILE);
}


function addressTopicTransaction(removeElementID, qaddress, actionCode, statusMessage, topicHOSTILE) {
    if (!checkForPrivKey()) return false;

    document.getElementById(removeElementID).style.display = "none";
    var addressraw = new BITBOX.Address().legacyToHash160(qaddress);
    const tx = {
        data: [actionCode, "0x" + addressraw, topicHOSTILE],
        cash: { key: privkey }
    }
    updateStatus(statusMessage);
    tq.queueTransaction(tx);
}

async function createSurrogateUser(name, buttonElement, surrogatelink) {

    //Clear old link if there is one
    var surrogateLinkElement = document.getElementById(surrogatelink);
    surrogateLinkElement.innerHTML = "";

    //Disable button
    var buttonElement = document.getElementById(buttonElement);
    buttonElement.disabled = true;
    buttonElement.innerText = "Creating Private Key";

    //Send sufficient funds to new account to create name

    //create new random private key
    let smnemonic = new BITBOX.Mnemonic().generate(128);
    var sprivkey = new BITBOX.Mnemonic().toKeypairs(smnemonic, 1, false, "44'/0'/0'/0/")[0].privateKeyWIF;
    let ecpair = new BITBOX.ECPair().fromWIF(sprivkey);
    let publicaddress = new BITBOX.ECPair().toLegacyAddress(ecpair);
    console.log(publicaddress);

    const tx = {
        cash: {
            key: privkey,
            to: [{ address: publicaddress, value: 547 }]
        }
    }
    //updateStatus("Sending Funds To Surrogate Account");
    tq.queueTransaction(tx);

    //Wait a while for tx to enter mempool
    buttonElement.innerText = "Wait a few seconds for funds to arrive";
    await sleep(3 * 1000);

    //Try to set new name 
    let newName = name + " (Surrogate)";
    buttonElement.innerText = "Try to set surrogate name - " + newName;

    buttonElement.innerText = "Fetch UTXOs";
    tq.addUTXOPool(publicaddress);
    await sleep(3 * 1000);


    const tx2 = {
        data: ["0x6d01", newName],
        cash: { key: sprivkey }
    }

    buttonElement.innerText = "Fetch UTXOs";

    tq.queueTransaction(tx2,
        function () {
            buttonElement.innerText = "Create Surrogate Account";
            buttonElement.disabled = false;
            surrogateLinkElement.innerHTML = userHTML(publicaddress, newName, "none", 0, 16);
        }
    );


    //TODO: send change back to original address
    //TODO: cleanup extra utxopool - destroy, free up memory, storage
    //TODO: disable, send updates to button text, re-enable button and create link to surrogate profile, update version

}

