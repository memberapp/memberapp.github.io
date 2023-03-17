"use strict";

function checkForPrivKey() {
    if (isBitCloutUser()) {
        return true;
    }
    return checkForNativeUser();
}

function checkForNativeUser() {
    if (privkey == "" && pubkey != "") {
        alert(getSafeTranslation('readonlymode2', "You may be logged in with a public key in read only mode. Try logging out and logging back in again."));
        return false;
    } else if (privkey == "" && !window.nostr) {
        alert(getSafeTranslation('mustlogin', "You must login to do this."));
        return false;
    }

    //if (tq.getBalance(chainheight) < nativeCoin.dust) {
    //    alert(getSafeTranslation('notenough2', "You do not have enough satoshis to do this. You can click on your balance to refresh it. Try logging out and logging back in again if you keep getting this message."));
    //    return false;
    //}

    return true;
}

function checkForNativeUserAndHasBalance() {
    //return (privkey && tq.getBalance(chainheight) >= nativeCoin.dust);
    return false;
}

function sendRating(rating, ratingText, pageName, targetpublickey) {
    
    //targetpublickey could be 64 or 66 in length. If 64 it is nostr style key

    //if (!checkForPrivKey()) return false;
    var comment = "";
    if (ratingText) {
        comment = ratingText.value;
    }
    
    let addresshandle='';
    let targetpublickey66=targetpublickey;
    if(targetpublickey66.length==64){targetpublickey66='02'+targetpublickey66;}//nostr style public key.
    theAddress=pubkeyhexToLegacy(targetpublickey66);

    if(targetpublickey.length==64){
        addresshandle = window.bech32converter('npub').toBech32('0x'+targetpublickey);
    }else{
        addresshandle = theAddress
    }   

    sendNostrRating("user: @" + pageName + "\nrating:" + rating + "/5\ncomment:" + comment + "\nhttps://member.cash/ba/" + addresshandle, null, targetpublickey, true, rating, comment);

    
    if (checkForNativeUserAndHasBalance()) {
        rateCallbackAction(rating, comment, theAddress);
    }

    if (isBitCloutUser()) {
        sendBitCloutRating("user: @" + pageName + "\nrating:" + rating + "/5\ncomment:" + comment + "\nhttps://member.cash/ba/" + theAddress, 'rating', null, null, { RatedMember: theAddress, RatingComment: comment, Rating: "" + rating });
    }

    
}


//var waitForTransactionToComplete = false;

//is this used anywhere? TODO check
function sendTransaction(tx) {
    tq.queueTransaction(tx);
}

function repost(txid, privkey) {

    //Repost memo 	0x6d0b 	txhash(32), message(184)

    //if (!checkForPrivKey()) return false;
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
    if (!checkForNativeUserAndHasBalance()) return false;
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


function setName() {
    var newName = document.getElementById('settingsnametext').value;

    //setNostrProfile('name',newName);
    setNostrProfile();

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

function setProfile() {

    var newProfile = document.getElementById('settingsprofiletext').value;
    setNostrProfile();
    //setNostrProfile('about',newProfile);

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

    if (!checkForNativeUserAndHasBalance()) return false;

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
    if (!checkForNativeUserAndHasBalance()) return false;

    //Remove the clicked element so it can't be clicked again
    event.srcElement.style.display = "none";

    const tx = {
        data: ["0x6d0e", topicHOSTILE],
        cash: { key: privkey }
    }
    updateStatus(getSafeTranslation('sendingunsub', "Sending Unsubscribe"));
    tq.queueTransaction(tx);
}

function addressTransaction(removeElementID, actionCode, statusMessage, targetpublickey) {
    //if(!qaddress){
    let qaddress=getImpliedBitcoinAddress(targetpublickey);
    //}
    try {
        //document.getElementById(removeElementID).style.display = "none";
        var addressraw = getLegacyToHash160(qaddress);
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

function follow(targetpublickey) {
    //if (!checkForPrivKey()) return false;

    sendNostrFollow(targetpublickey); 
    if(targetpublickey.length==64){targetpublickey='02'+targetpublickey;}//nostr style public key.

    if (checkForNativeUserAndHasBalance()) {
        addressTransaction('memberfollow', "0x6d06", getSafeTranslation('sendingfollow', "Sending Follow"),targetpublickey);
    }
    if (isBitCloutUser()) {
        sendBitCloutFollow(targetpublickey);
    }
    
}

function unfollow(targetpublickey) {
    //if (!checkForPrivKey()) return false;

    sendNostrUnFollow(targetpublickey);
    if(targetpublickey.length==64){targetpublickey='02'+targetpublickey;}//nostr style public key.

    if (checkForNativeUserAndHasBalance()) {
        addressTransaction('memberfollow', "0x6d07", getSafeTranslation('sendingunfollow', "Sending Unfollow"),targetpublickey);
    }
    if(isBitCloutUser()){
        sendBitCloutUnFollow(targetpublickey);
    }
    
}

function mute(targetpublickey) {
    //if (!checkForPrivKey()) return false;
    sendNostrMute(targetpublickey);
    if(targetpublickey.length==64){targetpublickey='02'+targetpublickey;}//nostr style public key.

    if (checkForNativeUserAndHasBalance()) {
        addressTransaction('memberblock', "0x6d16", getSafeTranslation('sendingmute', "Sending Mute"),targetpublickey);
    }
    //if(isBitCloutUser()){
    //    sendBitCloutMute(targetpublickey);
    //}
}

function unmute(targetpublickey) {
    //if (!checkForPrivKey()) return false;
    sendNostrUnMute(targetpublickey);
    if(targetpublickey.length==64){targetpublickey='02'+targetpublickey;}//nostr style public key.

    if (checkForNativeUserAndHasBalance()) {
        addressTransaction('memberblock', "0x6d17", getSafeTranslation('sendingunmute', "Sending Unmute"),targetpublickey);
    }
    //if(isBitCloutUser()){
    //    sendBitCloutUnMute(targetpublickey);
    //}
}

function sub(topicHOSTILE) {
    //if (!checkForPrivKey()) return false;
    
    if (checkForNativeUserAndHasBalance()) {
        subTransaction(topicHOSTILE);
    }
    sendNostrSub(topicHOSTILE);
    //if(isBitCloutUser()){
    //    sendBitCloutSub(topicHOSTILE);
    //}
}

function unsub(topicHOSTILE) {
    //if (!checkForPrivKey()) return false;
    if (checkForNativeUserAndHasBalance()) {
        unsubTransaction(topicHOSTILE);
    }
    sendNostrUnSub(topicHOSTILE);

    //if(isBitCloutUser()){
    //    sendBitCloutUnSub(topicHOSTILE);
    //}
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
    if (!checkForNativeUserAndHasBalance()) return false;

    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: [actionCode, "0x" + reversetx],
        cash: { key: privkey }
    }
    updateStatus(statusMessage);
    tq.queueTransaction(tx);

}

function rateUser(qaddress, rating, ratingcomment) {
    if (!checkForNativeUserAndHasBalance()) return false;
    if (ratingcomment === undefined) {
        ratingcomment = "";
    }

    var addressraw = getLegacyToHash160(qaddress);

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
    if (!checkForNativeUserAndHasBalance()) return false;

    document.getElementById(removeElementID).style.display = "none";
    var addressraw = getLegacyToHash160(qaddress);
    const tx = {
        data: [actionCode, "0x" + addressraw, topicHOSTILE],
        cash: { key: privkey }
    }
    updateStatus(statusMessage);
    tq.queueTransaction(tx);
}


