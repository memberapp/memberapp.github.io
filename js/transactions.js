"use strict";


function checkForUserThatCanWrite() {
    
    if (!pubkeyhex) {
        alert(getSafeTranslation('mustlogin', "You must login to do this."));
        return false;
    }else if (!getRepNetPrivKey() && !window.nostr) {
        alert(getSafeTranslation('readonlymode2', "You may be logged in with a public key in read only mode. Try logging out and logging back in again."));
        return false;
    }
    return true;
}

function checkForNativeUserAndHasBalance() {
    return (getRepNetPrivKey() && tq.getBalance(chainheight) >= nativeCoin.dust);
}

async function sendRating(rating, ratingText, pageName, targetpublickey, bitcoinaddress) {
    if (!checkForUserThatCanWrite()) return false;

    //targetpublickey could be 64 or 66 in length. If 64 it is nostr style key
    //if (!checkForUserThatCanWrite()) return false;
    var comment = "";
    if (ratingText) {
        comment = ratingText.value;
    }
    
    //let addresshandle='';

    //let targetpublickey66=targetpublickey;
    //if(targetpublickey66.length==64){targetpublickey66='02'+targetpublickey66;}//nostr style public key.
    //theAddress=pubkeyhexToLegacy(targetpublickey66);

    //if(targetpublickey.length==64){
    //    addresshandle = window.bech32converter('npub').toBech32('0x'+targetpublickey);
    //}else{
    //    addresshandle = theAddress
    //}   


    
    if (checkForNativeUserAndHasBalance()) {
        rateCallbackAction(rating, comment, targetpublickey, bitcoinaddress);
    }

    //if (isBitCloutUser()) {
    //    sendBitCloutRating("user: @" + pageName + "\nrating:" + rating + "/5\ncomment:" + comment + `\n${pathpermalinks}/ba/` + theAddress, 'rating', null, null, { RatedMember: theAddress, RatingComment: comment, Rating: "" + rating });
    //}
    //let event= await sendNostrRating("user: @" + pageName + "\nrating:" + rating + "/5\ncomment:" + comment + `\n${pathpermalinks}/ba/` + addresshandle, null, targetpublickey, rating, comment);
    //sendWrappedEvent(event);
    
}


//var waitForTransactionToComplete = false;

//is this used anywhere? TODO check
function sendTransaction(tx) {
    tq.queueTransaction(tx);
}

function repost(txid, privkey) {

    //Repost memo 	0x6d0b 	txhash(32), message(184)

    //if (!checkForUserThatCanWrite()) return false;
    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    var tx = {
        data: ["0x6d0b", "0x" + reversetx],
        cash: { key: privkey }
    }

    /*
    if (message != null && message != '') {
        tx = {
            data: ["0x6d0b", "0x" + reversetx, message],
            cash: { key: privkey }
        }
    }*/

    updateStatus(getSafeTranslation('remembering', "Remembering"));
    tq.queueTransaction(tx);
}

function setTrxPic(newName, callback) {
    //if (!checkForNativeUserAndHasBalance()) return false;
    //if (!(newName.startsWith('https://i.imgur.com/') && (newName.endsWith('.jpg') || newName.endsWith('.png')))) {
    //    alert(getSafeTranslation('picformat', "Profile pic must of of the format") + " https://i.imgur.com/XXXXXXXX.jpg");
    //    return;
    //}
    const tx = {
        data: ["0x6d0a", newName],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('settingpic', "Setting Profile Pic"));

    //TODO, on error, this should really enable the text field and text button again
    tq.queueTransaction(tx, callback);
}

function sendWrappedEvent(event, callback) {
    if (!checkForNativeUserAndHasBalance()) return false;
    //serialize and compress event
    const jsonData = JSON.stringify(event);
    const compressedData = pako.gzip(jsonData);
    const tx = {
        data: ["0x6de0", compressedData],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('sendingwrappednostr', "Sending Nostr Event To Nostracoin"));
    tq.queueTransaction(tx, callback);
}




async function setName() {
    if (!checkForUserThatCanWrite()) return false;
    //setNostrProfile('name',newName);
    //let event= await setNostrProfile();
    //sendWrappedEvent(event);

    var newName = document.getElementById('settingsnametext').value;
    
    if (!checkForNativeUserAndHasBalance()) return false;

    document.getElementById('settingsnametextbutton').disabled = true;
    document.getElementById('settingsnametext').disabled = true;

    const tx = {
        data: ["0x6d01", newName],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('settingname', "Setting Name"));

    //TODO, on error, this should really enable the text field and text button again
    tq.queueTransaction(tx);
    
}



async function sendMessageRaw(privatekey, txid, replyHex, waitTimeMilliseconds, divForStatus, completionFunction, messageRecipient, stampAmount) {

    document.getElementById(divForStatus).value = getSafeTranslation('bytesremaining', "Sending Message . . . bytes remaining . .") + replyHex.length / 2;

    var sendHex = "";
    if (replyHex.length > maxhexlength) {
        sendHex = replyHex.substring(0, maxhexlength);
        replyHex = replyHex.substring(maxhexlength);
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
        updateStatus(getSafeTranslation('waiting', "Seconds to wait") + " " + (waitTimeMilliseconds / 1000));
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


function postmemorandumRaw(posttext, postbody, privkey, topic, newpostmemorandumstatus, memorandumpostcompleted, quotetxid) {

    let postTitleHex = new Buffer(posttext).toString('hex');
    let replyHex = new Buffer(postbody).toString('hex');

    var maxPostLength = maxhexlength;
    if (topic) {
        maxPostLength = maxPostLength - 4 - topic.toString('hex').length;
    }
    if (quotetxid) {
        var reversetx = quotetxid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
        maxPostLength = maxPostLength - 4 - reversetx.toString('hex').length;
    }

    //If the title is too long, put the excess in the reply. todo - find a natural breakpoint, see sendreplyraw for code
    if (postTitleHex.length > maxPostLength) {
        replyHex = postTitleHex.substr(maxPostLength) + replyHex;
        postTitleHex = postTitleHex.substr(0, maxPostLength);
    }

    var tx = {
        data: ["0x6d02", "0x" + postTitleHex],
        cash: { key: privkey }
    }

    if (topic) {
        tx = {
            data: ["0x6d0c", topic, "0x" + postTitleHex],
            cash: { key: privkey }
        }
    }

    if (quotetxid) {

        tx = {
            data: ["0x6d0b", "0x" + reversetx, "0x" + postTitleHex],
            cash: { key: privkey }
        }
        if (topic) {
            tx = {
                data: ["0x6d0f", "0x" + reversetx, topic, "0x" + postTitleHex],
                cash: { key: privkey }
            }
        }
        updateStatus(getSafeTranslation('quoting', "Quoting"));
    }


    let finishFunction = memorandumpostcompleted;
    if (replyHex) {
        finishFunction = function (newtxid) { sendReplyRaw(privkey, newtxid, replyHex, 5000, newpostmemorandumstatus, memorandumpostcompleted); };
    }

    tq.queueTransaction(tx, finishFunction, null);
}

/*
function quotepostRaw(posttext, privkey, topic, newpoststatus, memocompleted, txid) {

    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    var tx = {
        data: ["0x6d0b", "0x" + reversetx, posttext],
        cash: { key: privkey }
    }

    if (topic != "") {
        tx = {
            data: ["0x6d0f", "0x" + reversetx, topic, posttext],
            cash: { key: privkey }
        }
    }

    updateStatus(getSafeTranslation('quoting', "Quoting"));

    tq.queueTransaction(tx, memocompleted, null);
}*/

/*
function postRaw(posttext, privkey, topic, newpoststatus, memocompleted, txid) {

    var tx = {
        data: ["0x6d02", posttext],
        cash: { key: privkey }
    }
    console.log(posttext.length);
    if (topic != "") {
        tx = {
            data: ["0x6d0c", topic, posttext],
            cash: { key: privkey }
        }
    }

    tq.queueTransaction(tx, memocompleted, null);
}*/
/*
function postgeoRaw(posttext, privkey, geohash, newpostgeostatus, geocompleted) {

    const tx = {
        data: ["0x6da8", geohash, posttext],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('sendinggeotag', "Sending Geotagged Post"));
    tq.queueTransaction(tx, geocompleted, null);
}*/




async function sendReplyRaw(privatekey, txid, replyHex, waitTimeMilliseconds, divForStatus, completionFunction) {

    document.getElementById(divForStatus).value = getSafeTranslation('bytesremaining', "Sending Reply . . . bytes remaining . . ") + replyHex.length / 2;

    var sendHex = "";

    if (replyHex.length > maxhexlength) {
        //Search for whitespace - try to break at a whitespace
        var whitespaceIndex = maxhexlength - whitespacebreak;
        var spaceIndex = replyHex.lastIndexOf("20", maxhexlength);
        if (spaceIndex % 2 == 0 && spaceIndex > whitespaceIndex) {
            whitespaceIndex = spaceIndex;
        }
        var nlIndex = replyHex.lastIndexOf("0A", maxhexlength);
        if (nlIndex % 2 == 0 && nlIndex > whitespaceIndex) {
            whitespaceIndex = nlIndex;
        }
        var crIndex = replyHex.lastIndexOf("0D", maxhexlength);
        if (crIndex % 2 == 0 && crIndex > whitespaceIndex) {
            whitespaceIndex = crIndex;
        }

        if (whitespaceIndex > maxhexlength - whitespacebreak) {
            sendHex = replyHex.substring(0, whitespaceIndex);
            replyHex = replyHex.substring(whitespaceIndex);
        } else {
            sendHex = replyHex.substring(0, maxhexlength);
            replyHex = replyHex.substring(maxhexlength);
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
        updateStatus(getSafeTranslation('waiting', "Seconds to wait")) + " " + (waitTimeMilliseconds / 1000);
        await sleep(waitTimeMilliseconds);
    }

    //If there is still more to send
    if (replyHex.length > 0) {
        tq.queueTransaction(tx, function (newtxid) { sendReplyRaw(privatekey, newtxid, "7c" + replyHex, 1000, divForStatus, completionFunction); }, null);
    } else {
        //last one
        tq.queueTransaction(tx, completionFunction, null);
    }

}



function sendTipRaw(txid, tipAddress, tipAmount, privkey, successFunction) {
    if (!tipAddress || tipAddress == 'null') {
        alert("No address for tip. Maybe the user needs to set a handle?");
        return;
    }
    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6d04", "0x" + reversetx],
        cash: {
            key: privkey,
            to: [{ address: tipAddress, value: Number(tipAmount) }]
        }
    }
    updateStatus(getSafeTranslation('sendingtip', "Sending Tip"));
    tq.queueTransaction(tx, successFunction, null);
}

function sendLike(txid, privkey) {
    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6d04", "0x" + reversetx],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('sendinglike', "Sending Like"));
    tq.queueTransaction(tx);
}

function memoPinPost(txid, privkey) {
    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6da9", "0x" + reversetx],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('pinningpost', "Pinning Post"));
    tq.queueTransaction(tx);
}

async function setProfile() {
    if (!checkForUserThatCanWrite()) return false;

    //let event= await setNostrProfile();
    //sendWrappedEvent(event);
    
    
    var newProfile = document.getElementById('settingsprofiletext').value;
    
    if (!checkForNativeUserAndHasBalance()) return false;

    document.getElementById('settingsprofiletextbutton2').disabled = true;


    const tx = {
        data: ["0x6d05", newProfile],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('settingprofile', "Setting Profile"));
    tq.queueTransaction(tx);
}


function subTransaction(topicHOSTILE) {

    //if (!checkForNativeUserAndHasBalance()) return false;

    //Remove the clicked element so it can't be clicked again
    event.srcElement.style.display = "none";

    const tx = {
        data: ["0x6d0d", topicHOSTILE],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('sendingsub', "Sending Subscribe"));
    tq.queueTransaction(tx);
}

function unsubTransaction(topicHOSTILE) {
    //if (!checkForNativeUserAndHasBalance()) return false;

    //Remove the clicked element so it can't be clicked again
    event.srcElement.style.display = "none";

    const tx = {
        data: ["0x6d0e", topicHOSTILE],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('sendingunsub', "Sending Unsubscribe"));
    tq.queueTransaction(tx);
}

function addressTransaction(removeElementID, actionCode, statusMessage, targetpublickey, legacyAddress) {
    try {
        //let signedpublickey=getYSignTest(targetpublickey)+targetpublickey;
        //let legacyAddress=await pubkeyhexToLegacy(signedpublickey);
        //document.getElementById(removeElementID).style.display = "none";
        var addressraw = getLegacyToHash160(legacyAddress);
        const tx = {
            data: [actionCode, "0x" + addressraw],
            cash: { key: privkey }
        }
        updateStatus(statusMessage);
        tq.queueTransaction(tx);
    } catch (err) {
        console.log(err);
    }
}

async function follow(targetpublickey,legacyAddress) {
    if (!checkForUserThatCanWrite()) return false;

    //let event= await sendNostrFollow(targetpublickey);
    //sendWrappedEvent(event); 

    
    if (checkForNativeUserAndHasBalance()) {
        addressTransaction('memberfollow', "0x6d06", getSafeTranslation('sendingfollow', "Sending Follow"),targetpublickey,legacyAddress);
    }
    //if (isBitCloutUser()) {
    //    sendBitCloutFollow(targetpublickey);
    //}
    
}

async function unfollow(targetpublickey,legacyAddress) {
    if (!checkForUserThatCanWrite()) return false;

    //let event= await sendNostrUnFollow(targetpublickey);
    //sendWrappedEvent(event);

    
    if (checkForNativeUserAndHasBalance()) {
        addressTransaction('memberfollow', "0x6d07", getSafeTranslation('sendingunfollow', "Sending Unfollow"),targetpublickey,legacyAddress);
    }
    //if(isBitCloutUser()){
    //    sendBitCloutUnFollow(targetpublickey);
    //}
    
}

async function reportspammer(targetpublickey,legacyAddress) {
    if (!checkForUserThatCanWrite()) return false;
    //let event= await sendNostrSpamReport(targetpublickey);
    //sendWrappedEvent(event);

    
    if (checkForNativeUserAndHasBalance()) {
        addressTransaction('memberblock', "0x6d16", getSafeTranslation('sendingmute', "Sending Mute"),targetpublickey,legacyAddress);
    }
    //if(isBitCloutUser()){
    //    sendBitCloutMute(targetpublickey);
    //}
    
}


async function mute(targetpublickey,legacyAddress) {
    if (!checkForUserThatCanWrite()) return false;
    //let event= await sendNostrMute(targetpublickey);
    //sendWrappedEvent(event);

    
    if (checkForNativeUserAndHasBalance()) {
        addressTransaction('memberblock', "0x6d16", getSafeTranslation('sendingmute', "Sending Mute"),targetpublickey,legacyAddress);
    }
    //if(isBitCloutUser()){
    //    sendBitCloutMute(targetpublickey);
    //}
    
}

async function unmute(targetpublickey,legacyAddress) {
    if (!checkForUserThatCanWrite()) return false;
    //let event= await sendNostrUnMute(targetpublickey);
    //sendWrappedEvent(event);

    
    if (checkForNativeUserAndHasBalance()) {
        addressTransaction('memberblock', "0x6d17", getSafeTranslation('sendingunmute', "Sending Unmute"),targetpublickey,legacyAddress);
    }
    //if(isBitCloutUser()){
    //    sendBitCloutUnMute(targetpublickey);
    //}
    
}

async function sub(topicHOSTILE) {
    if (!checkForUserThatCanWrite()) return false;
    
    //let event= await sendNostrSub(topicHOSTILE);
    //sendWrappedEvent(event);

    
    if (checkForNativeUserAndHasBalance()) {
        subTransaction(topicHOSTILE);
    }
    
    //if(isBitCloutUser()){
    //    sendBitCloutSub(topicHOSTILE);
    //}
    
}

async function unsub(topicHOSTILE) {
    if (!checkForUserThatCanWrite()) return false;
    //if (checkForNativeUserAndHasBalance()) {
        unsubTransaction(topicHOSTILE);
    //}
    
    /*
    //let event= await sendNostrUnSub(topicHOSTILE);
    //sendWrappedEvent(event);

    //if(isBitCloutUser()){
    //    sendBitCloutUnSub(topicHOSTILE);
    //}
    */
}





function sendDislike(txid) {
    txidTransaction(txid, "0x6db4", getSafeTranslation('sendingdislike', "Sending Dislike"));
}

function sendHidePost(txid) {
    txidTransaction(txid, "0x6dc5", getSafeTranslation('sendinghidepost', "Sending Hide Post"));
}

function sendSendUnhidePost(txid) {
    txidTransaction(txid, "0x6dc6", getSafeTranslation('sendingunhidepost', "Sending Unhide Post"));
}

function txidTransaction(txid, actionCode, statusMessage) {
    //if (!checkForNativeUserAndHasBalance()) return false;

    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: [actionCode, "0x" + reversetx],
        cash: { key: privkey }
    }
    updateStatus(statusMessage);
    tq.queueTransaction(tx);

}

function rateUser(targetpublickey, rating, ratingcomment, bitcoinaddress) {
    //if (!checkForNativeUserAndHasBalance()) return false;
    if (ratingcomment === undefined) {
        ratingcomment = "";
    }

    var addressraw = getLegacyToHash160(bitcoinaddress);

    var hexRating = "0x" + toHexString([rating]);
    const tx = {
        data: ["0x6da5", "0x" + addressraw, hexRating, ratingcomment],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('sendingrating', "Sending Rating"));
    tq.queueTransaction(tx);
    return true;
}

function designate(qaddress, topicHOSTILE, elementid) {
    addressTopicTransaction(elementid, qaddress, '0x6dc1', getSafeTranslation('sendingaddfilter', "Sending Add Filter"), topicHOSTILE);
}

function dismiss(qaddress, topicHOSTILE, elementid) {
    addressTopicTransaction(elementid, qaddress, '0x6dc2', getSafeTranslation('sendingremovefilter', "Sending Remove Filter"), topicHOSTILE);
}

function hideuser(qaddress, topicHOSTILE, elementid) {
    addressTopicTransaction(elementid, qaddress, '0x6dc3', getSafeTranslation('sendinghidemember', "Sending Hide Member"), topicHOSTILE);
}

function unhideuser(qaddress, topicHOSTILE, elementid) {
    addressTopicTransaction(elementid, qaddress, '0x6dc4', getSafeTranslation('sendingunhidemember', "Sending Unhide Member"), topicHOSTILE);
}


function addressTopicTransaction(removeElementID, qaddress, actionCode, statusMessage, topicHOSTILE) {
    //if (!checkForNativeUserAndHasBalance()) return false;

    document.getElementById(removeElementID).style.display = "none";
    var addressraw = getLegacyToHash160(qaddress);
    const tx = {
        data: [actionCode, "0x" + addressraw, topicHOSTILE],
        cash: { key: privkey }
    }
    updateStatus(statusMessage);
    tq.queueTransaction(tx);
}


