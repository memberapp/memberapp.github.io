function checkForPrivKey() {
    if (privkey == "") {
        alert("This requires a transaction. You must login to do this.");
        return false;
    }
    return true;
}

//var waitForTransactionToComplete = false;

//is this used anywhere? TODO check
function sendTransaction(tx) {
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


function postmemorandumRaw(posttext, postbody, privkey, topic, newpostmemorandumstatus, memorandumpostcompleted) {

    var tx = {
        data: ["0x6d02", posttext],
        cash: { key: privkey }
    }

    if(topic!=""){
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

    if(topic!=""){
        tx = {
            data: ["0x6d0c", topic, posttext],
            cash: { key: privkey }
        }   
    }

    tq.queueTransaction(tx, memocompleted, null);
}

function geopost(lat, long) {
    if (!checkForPrivKey()) return false;

    document.getElementById('newgeopostbutton').style.display = "none";
    var txtarea = document.getElementById('newgeopostta');
    var posttext = txtarea.value;
    var geohash = encodeGeoHash(document.getElementById("lat").value, document.getElementById("lon").value);
    const tx = {
        data: ["0x6da8", geohash, posttext],
        cash: { key: privkey }
    }
    updateStatus("Sending Geotagged Post");
    tq.queueTransaction(tx);
}



async function sendReplyRaw(privatekey, txid, replyHex, waitTimeMilliseconds, divForStatus, completionFunction) {

    document.getElementById(divForStatus).value = "Sending Reply . . . " + replyHex.length/2 + "B remaining.";

    var sendHex = "";
    if (replyHex.length > 368) {
        sendHex = replyHex.substring(0, 368);
        replyHex = replyHex.substring(368);
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



function sendTipRaw(txid, tipAddress, page, tipAmount, privkey, successFunction) {

    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6d04", "0x" + reversetx],
        cash: {
            key: privkey,
            to: [{ address: tipAddress, value: tipAmount }]
        }
    }
    updateStatus("Sending Tip");
    tq.queueTransaction(tx, successFunction, null);
}

function likePost(txid) {
    if (!checkForPrivKey()) return false;

    document.getElementById('upvote' + txid).style.display = "none";
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

function follow(qaddress) {
    if (!checkForPrivKey()) return false;

    document.getElementById('memberfollow').style.display = "none";
    var addressraw = toHexString(bch.deps.bs58.decode(qaddress)).substring(2);
    addressraw = addressraw.substring(0, addressraw.length - 8);

    const tx = {
        data: ["0x6d06", "0x" + addressraw],
        cash: { key: privkey }
    }
    updateStatus("Sending Follow");
    tq.queueTransaction(tx);
}

function unfollow(qaddress) {
    if (!checkForPrivKey()) return false;

    document.getElementById('memberfollow').style.display = "none";
    var addressraw = toHexString(bch.deps.bs58.decode(qaddress)).substring(2);
    addressraw = addressraw.substring(0, addressraw.length - 8);

    const tx = {
        data: ["0x6d07", "0x" + addressraw],
        cash: { key: privkey }
    }
    updateStatus("Sending unfollow");
    tq.queueTransaction(tx);
}

function block(qaddress) {
    if (!checkForPrivKey()) return false;

    document.getElementById('memberblock').style.display = "none";
    var addressraw = toHexString(bch.deps.bs58.decode(qaddress)).substring(2);
    addressraw = addressraw.substring(0, addressraw.length - 8);

    const tx = {
        data: ["0x6d16", "0x" + addressraw],
        cash: { key: privkey }
    }
    updateStatus("Sending Block");
    tq.queueTransaction(tx);
}

function unblock(qaddress) {
    if (!checkForPrivKey()) return false;

    document.getElementById('memberblock').style.display = "none";
    var addressraw = toHexString(bch.deps.bs58.decode(qaddress)).substring(2);
    addressraw = addressraw.substring(0, addressraw.length - 8);

    const tx = {
        data: ["0x6d17", "0x" + addressraw],
        cash: { key: privkey }
    }
    updateStatus("Sending unblock");
    tq.queueTransaction(tx);
}

function dislikePost(txid) {
    if (!checkForPrivKey()) return false;

    document.getElementById('downvote' + txid).style.display = "none";
    var reversetx = txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6db4", "0x" + reversetx],
        cash: { key: privkey }
    }
    updateStatus("Sending Dislike");
    tq.queueTransaction(tx);
}

function rateUser(qaddress, rating, ratingcomment) {
    if (!checkForPrivKey()) return false;
    if (ratingcomment === undefined) {
        ratingcomment = "";
    }

    var addressraw = toHexString(bch.deps.bs58.decode(qaddress)).substring(2);
    addressraw = addressraw.substring(0, addressraw.length - 8);

    var hexRating = "0x" + toHexString([rating]);
    const tx = {
        data: ["0x6da5", "0x" + addressraw, hexRating, ratingcomment],
        cash: { key: privkey }
    }
    updateStatus("Sending Rating");
    tq.queueTransaction(tx);
    return true;
}

