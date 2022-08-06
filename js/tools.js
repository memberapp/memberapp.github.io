"use strict";

var globalusersearchtimeoutcount = 0;
var previousSearchTermHOSTILE = "";
async function userSearchChanged(searchbox, targetelement) {

    var searchtermHOSTILE = document.getElementById(searchbox).value;

    if (searchtermHOSTILE.length < 3) {
        return;
    }

    //Show search results
    updateStatus(targetelement);
    var resultsElement = document.getElementById(targetelement);
    updateStatus(resultsElement);
    updateStatus(resultsElement.style.display);
    resultsElement.style.display = "block";
    updateStatus(resultsElement.style.display);
    //cover behind search results
    var ddcover = document.getElementById('ddcover');
    updateStatus(ddcover);

    ddcover.style.display = 'block';
    ddcover.onclick = resultsElement.onclick = function () { resultsElement.style.display = ddcover.style.display = 'none'; };

    //onblur event was causing a new search making clicking on results impossible
    if (searchtermHOSTILE == previousSearchTermHOSTILE) {
        return;
    }
    previousSearchTermHOSTILE = searchtermHOSTILE;

    var localCountTimeOut = ++globalusersearchtimeoutcount;
    //Show loading animation
    document.getElementById(targetelement).innerHTML = document.getElementById("loading").innerHTML;
    await sleep(500);

    //Check if there has been a more recent request (from later keypress)
    if (localCountTimeOut != globalusersearchtimeoutcount) {
        return;
    }

    //Request content from the server and display it when received
    var theURL = dropdowns.contentserver + '?action=usersearch&address=' + pubkey + '&searchterm=' + encodeURIComponent(searchtermHOSTILE);
    getJSON(theURL).then(function (data) {

        var test = data;
        //var contents = `<label for="usersearchresults">` + getSafeTranslation('results', 'Results') + `</label>`;
        var contents = '';
        for (var i = 0; i < data.length; i++) {
            contents = contents + getDivClassHTML('usersearchresult', userFromDataBasic(data[i], i + searchbox + data[i].address, 16));
        }
        document.getElementById(targetelement).innerHTML = contents;
        addDynamicHTMLElements(data);

    }, function (status) { //error detection....
        showErrorMessage(status, null, theURL);
    });
}



/*
function createSurrogate() {
    var surrogateName = document.getElementById('surrogatename').value;
    createSurrogateUser(surrogateName, 'createsurrogatebutton', 'surrogatelink');
}*/

async function postprivatemessage() {

    var text = document.getElementById('newposttamessage').value;
    if (!text) {
        alert(getSafeTranslation('noprivatemessagefound', "Message cannot be empty!"));
        return;
    }

    document.getElementById('newpostmessagebutton').disabled = true;


    var status = "newpostmessagebutton";
    var stampAmount = document.getElementById("stampamount").value;
    if (stampAmount < 547) stampAmount = 547;

    var messageRecipient = document.getElementById("messageaddress").textContent;
    var publickey = document.getElementById("messagepublickey").textContent;

    let preEncryptedMessage;
    if (privateKeyBuf) {
        // Encrypt the message
        const pubKeyBuf = Buffer.from(publickey, 'hex');
        const data = Buffer.from(text);
        //const structuredEj = await eccryptoJs.encrypt(pubKeyBuf, data);
        //const encryptedMessage = eccryptoJs.serialize(structuredEj).toString('hex');
        let uncompressedPublicKeySender = Buffer.from(window.ec.keyFromPublic(pubKeyBuf, 'hex').getPublic(false, 'hex'), 'hex');
        preEncryptedMessage = bcencryptShared(privateKeyBuf, uncompressedPublicKeySender, data, null).toString('hex');
    }

    var successFunction = privateMessagePosted;
    if (checkForNativeUserAndHasBalance()) {
        sendMessageRaw(privkey, null, preEncryptedMessage, 1000, status, successFunction, messageRecipient, stampAmount);
        successFunction = null;
    }

    if (isBitCloutUser()) {
        sendBitCloutPrivateMessage(publickey, text, status, successFunction, preEncryptedMessage);
    }
}

function privateMessagePosted() {
    document.getElementById('newpostmessagebutton').disabled = false;
    document.getElementById('newpostmessagebutton').value = getSafeTranslation('sendmessage', "Send Message");
    document.getElementById('newposttamessage').value = "";
    document.getElementById('newpostmessagecompleted').textContent = getSafeTranslation('messagesent', "Message Sent");

}

function addRSSFeed(type,buttonelement) {
    let rssURL;
    document.getElementById(buttonelement).style.visibility = 'hidden';
    if(type=='twitter') rssURL = 'https://nitter.net/'+document.getElementById("twitterfeed").value.replace('@','');
    if(type=='plain') rssURL = document.getElementById("rssfeed").value;

    
    updateStatus("Fetching RSS");
    getJSON(dropdowns.txbroadcastserver + 'rss/add?address=' + encodeURIComponent(rssURL)).then(function (data) {
        updateStatus(sane(data.userid));
        window.location.href = "#show?order=new&qaddress=" + sane(data.userid);
    }, function (status) { });
}

function sendFundsAmountChanged() {
    var sendAmount = Number(document.getElementById("fundsamount").value);
    var usdAmount = ((Number(sendAmount) * numbers.usdrate) / 100000000).toFixed(2);
    document.getElementById("sendusd").textContent = "($" + usdAmount + ")";
}

async function sendfunds() {
    var sendAmount = Number(document.getElementById("fundsamount").value);
    if (sendAmount < 547) {
        alert(getSafeTranslation('547orlarger', "Amount has to be 547 satoshis or larger."));
        return;
    }
    var totalAmountPossible = tq.updateBalance(pubkey, chainheight);
    if (sendAmount > totalAmountPossible) {
        alert(getSafeTranslation('largerthanbalance', "This amount is larger than your balance.") + ' ' + totalAmountPossible);
        return;
    }

    var sendAddress = document.getElementById("sendfundsaddress").value.trim();
    if (sendAddress == "") {
        alert(getSafeTranslation('enteranaddress', "Make sure to enter an address to send to."));
    }

    if (sendAddress.startsWith("q")) {
        sendAddress = "member:" + sendAddress;
    }

    //sendAddress = sendAddress.replace("membercoin:", "bitcoincash:");
    if (sendAddress.startsWith("member:")) {
        sendAddress = await membercoinToLegacy(sendAddress);
    }

    document.getElementById("fundsamount").disabled = true;
    document.getElementById("sendfundsaddress").disabled = true;
    document.getElementById("sendfundsbutton").disabled = true;

    //maybe move to transactions.js
    const tx = {
        cash: {
            key: privkey,
            to: [{ address: sendAddress, value: sendAmount }]
        }
    }
    //updateStatus("Sending Funds To Surrogate Account");
    tq.queueTransaction(tx, sendFundsComplete);

}

function sendFundsComplete() {
    document.getElementById("fundsamount").value = "";
    document.getElementById("sendfundsaddress").value = "";
    document.getElementById("fundsamount").disabled = false;
    document.getElementById("sendfundsaddress").disabled = false;
    document.getElementById("sendfundsbutton").disabled = false;

}

function membercoinToLegacy(address) {
    const { prefix, type, hash } = cashaddr.decode(address);
    let hashhex = Buffer.from(hash).toString('hex');
    let toencode = new Buffer('00' + hashhex, 'hex');
    return window.bs58check.encode(toencode);
}

function legacyToMembercoin(pubkey) {
    let hash = Buffer.from(window.bs58check.decode(pubkey)).slice(1);
    return cashaddr.encode('member', 'P2PKH', hash)

    //const { prefix, type, hash } = cashaddr.decode(address);
    //let hashhex = Buffer.from(hash).toString('hex');
    //let toencode = new Buffer('00' + hashhex, 'hex');
    //return window.bs58check.encode(toencode);
    //return 'not defined yet';
}

function getLegacyToHash160(address) {
    let hash = Buffer.from(window.bs58check.decode(address)).slice(1);
    return hash.toString('hex');
}

function setBalanceWithInterest() {
    try {
        if(chainheighttime==0){
            return;
        }
        let elapsed = (new Date().getTime() - chainheighttime) / (78 * 1000);
        let membalance = tq.updateBalance(pubkey, chainheight + elapsed);
        let mem = (membalance / 100000000) + "";
        while (mem.length < 10) {
            mem = mem + "0";
        }
        //M̈ m̈
        //document.getElementById("membalance").textContent=mem.substring(0,10);
        document.getElementById("membalance").innerHTML = `<strong>m̈</strong>` + mem.substring(0, 10);
    } catch (err) {
        //console.log(err);
        //Error probably caused by trying to set balance before UTXO set is loaded
    }
}

setInterval(setBalanceWithInterest, 500);





