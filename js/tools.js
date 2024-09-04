"use strict";

var globalusersearchtimeoutcount = 0;
var previousSearchTermHOSTILE = "";
async function userSearchChanged(searchbox, targetelement) {

    var searchtermHOSTILE = document.getElementById(searchbox).value;

    if (searchtermHOSTILE.length < 1) {
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
    var theURL = dropdowns.contentserver + '?action=usersearch&address=' + (pubkeyhex?pubkeyhex.slice(0, 16):'') + '&searchterm=' + encodeURIComponent(searchtermHOSTILE);
    getJSON(theURL).then(function (data) {

        var test = data;
        //var contents = `<label for="usersearchresults">` + getSafeTranslation('results', 'Results') + `</label>`;
        var contents = '';
        for (var i = 0; i < data.length; i++) {
            contents = contents + getDivClassHTML('usersearchresult', userFromDataBasic(data[i], i + searchbox + data[i].address));
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
    if (stampAmount < nativeCoin.dust) stampAmount = nativeCoin.dust;

    var messageRecipient = document.getElementById("messageaddress").textContent;
    var publickey = document.getElementById("messagepublickey").textContent;

    let preEncryptedMessage;
    if (privkey) {
        // Encrypt the message
        const pubKeyBuf = Buffer.from(publickey, 'hex');
        const data = Buffer.from(text);
        //const structuredEj = await eccryptoJs.encrypt(pubKeyBuf, data);
        //const encryptedMessage = eccryptoJs.serialize(structuredEj).toString('hex');
        let uncompressedPublicKeySender = Buffer.from(window.ec.keyFromPublic(pubKeyBuf, 'hex').getPublic(false, 'hex'), 'hex');
        preEncryptedMessage = bcencryptShared(Buffer.from(privkeyhex, 'hex'), uncompressedPublicKeySender, data, null).toString('hex');
    }

    var successFunction = privateMessagePosted;
    if (checkForNativeUserAndHasBalance()) {
        sendMessageRaw(getRepNetPrivKey(), null, preEncryptedMessage, 1000, status, successFunction, messageRecipient, stampAmount);
        successFunction = null;
    }

    if (isBitCloutUser()) {
        sendBitCloutPrivateMessage(publickey, text, status, successFunction, preEncryptedMessage);
        successFunction = null;
    }

    sendNostrPrivateMessage(publickey, text, status, successFunction);
    
}

function privateMessagePosted() {
    document.getElementById('newpostmessagebutton').disabled = false;
    document.getElementById('newpostmessagebutton').value = getSafeTranslation('sendmessage', "Send Message");
    document.getElementById('newposttamessage').value = "";
    document.getElementById('newpostmessagecompleted').textContent = getSafeTranslation('messagesent', "Message Sent");

}

function addRSSFeed(type, buttonelement) {
    let rssURL;
    document.getElementById(buttonelement).style.visibility = 'hidden';
    if (type == 'twitter') rssURL = 'https://nitter.net/' + document.getElementById("twitterfeed").value.replace('@', '');
    if (type == 'plain') rssURL = document.getElementById("rssfeed").value;


    updateStatus("Fetching RSS");
    getJSON(dropdowns.txbroadcastserver + 'rss/add?address=' + encodeURIComponent(rssURL)).then(function (data) {
        updateStatus(sane(data.userid));
        window.location.href = "#show?order=new&qaddress=" + sane(data.userid);
    }, function (status) { });
}

function sendFundsAmountChanged() {
    var sendAmount = Number(document.getElementById("fundsamount").value);
    var usdAmount = ((Number(sendAmount) * numbers.usdrate)).toFixed(2);
    document.getElementById("sendusd").textContent = "($" + usdAmount + ")";
}

async function sendfunds() {
    var sendAmount = Number(document.getElementById("fundsamount").value)*100000000;
    if (sendAmount < nativeCoin.dust) {
        alert(nativeCoin.dust + getSafeTranslation('547orlarger', " satoshis or larger."));
        return;
    }
    var totalAmountPossible = updateBalance(chainheight);
    if (sendAmount > totalAmountPossible) {
        alert(getSafeTranslation('largerthanbalance', "This amount is larger than your balance.") + ' ' + totalAmountPossible);
        return;
    }

    var sendAddress = document.getElementById("sendfundsaddress").value.trim();
    if (sendAddress == "") {
        alert(getSafeTranslation('enteranaddress', "Make sure to enter an address to send to."));
    }

    if (sendAddress.startsWith("q")) {
        sendAddress = nativeCoin.addressprefix + sendAddress;
    }

    //sendAddress = sendAddress.replace("membercoin:", "bitcoincash:");
    if (sendAddress.startsWith(nativeCoin.addressprefix)) {
        sendAddress = await cashaddrToLegacy(sendAddress);
    }

    if (sendAddress.startsWith("D")) {
        sendAddress = await dogecoinToLegacy(sendAddress);
    }

    document.getElementById("fundsamount").disabled = true;
    document.getElementById("sendfundsaddress").disabled = true;
    document.getElementById("sendfundsbutton").disabled = true;

    //maybe move to transactions.js
    const tx = {
        cash: {
            key: getRepNetPrivKey(),
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

/*
function legacyToNativeCoin(pubkey) {
    if (nativeCoin.name == "Nostracoin") {
        return legacyToNostracoin(pubkey);
    } else if (nativeCoin.name == "Dogecoin") {
        return legacyToDogecoin(pubkey);
    }
}

function legacyToDogecoin(pubkey) {
    let result = window.bs58check.decode(pubkey);
    result[0] = 0x1E; //Dogecoin
    let hash = Buffer.from(result);
    let toencode = new Buffer(hash, 'hex');
    return window.bs58check.encode(toencode);
}

function dogecoinToLegacy(pubkey) {
    let result = window.bs58check.decode(pubkey);
    result[0] = 0x00; //Bitcoin
    let hash = Buffer.from(result);
    let toencode = new Buffer(hash, 'hex');
    return window.bs58check.encode(toencode);
}
*/

function cashaddrToLegacy(address) {
    const { prefix, type, hash } = cashaddr.decode(address);
    let hashhex = Buffer.from(hash).toString('hex');
    let toencode = new Buffer('00' + hashhex, 'hex');
    return window.bs58check.encode(toencode);
}

async function unsignedpubkeyhexToNostracoinLegacy(pubkeyhex2) {
    return null; //temporary, can remove this
    if(pubkeyhex2.length!=64){
        throw Error("Pubkey must be 64 chars in length 2");
    }
    let hash = getYSign(pubkeyhex2)+pubkeyhex2;
    return await pubkeyhexToLegacy(hash);

}

async function pubkeyhexToLegacy(pubkeyhex2) {
    if(pubkeyhex2.length!=66 && pubkeyhex2.length!=130){
        throw Error("pubkeyhex wrong length");
    }
    if (!window.bitcoinjs) await loadScript(bitcoinjslib);
    //if(window.bitcoinjs){
        //var ecpair = new window.bitcoinjs.ECPair.fromPublicKey(Buffer.from(pubkeyhex2,'hex'));
        var ecpair = new window.bitcoinjs.ECPair.fromPublicKey(Buffer.from(pubkeyhex2,'hex')); //,{ compressed: false }, //For uncompressed key login '5...' type wif
        return window.bitcoinjs.payments.p2pkh({ pubkey: ecpair.publicKey }).address;
    //}else{
    //    console.log("Problem with pub key hex, bitcoinjs not loaded yet 4534663");
    //    return null;
    //}
    //return window.bitcoinjs.payments.p2pkh({ pubkey: Buffer.from(pubkeyhex2) }).address;
}

async function pubkeyTonpub(pubkey) {
    if(pubkey.length!=64){
        throw Error("Pubkey must be 64 chars in length");
    }
    if (!window.bech32converter) await loadScript("js/lib/bech32-converting-1.0.9.min.js");
    return window.bech32converter('npub').toBech32('0x' + pubkey);

}

async function npubToPubKey(npubkey){
    if (!window.bech32converter) await loadScript("js/lib/bech32-converting-1.0.9.min.js");
    return window.bech32converter('npub').toHex(npubkey).slice(2).toLowerCase();
}

async function pubkeyToRepNet(pubkey) {
    /*if(pubkey.length!=64){
        throw Error("Pubkey must be 64 chars in length");
    }
    let hash = getYSign(pubkey)+pubkey;*/
    return legacyToRepNet(await pubkeyhexToLegacy(pubkey));
}

function legacyToRepNet(pubkey) {
    let hash = Buffer.from(window.bs58check.decode(pubkey)).slice(1);
    return cashaddr.encode('repnet', 'P2PKH', hash);
}

function getLegacyToHash160(address) {
    let hash = Buffer.from(window.bs58check.decode(address)).slice(1);
    return hash.toString('hex');
}

function bitcloutToLegacy(bitcloutaddress) {
    var preslice = window.bs58check.decode(bitcloutaddress);
    var bcpublicKey = preslice.slice(3);
    var ecpair = new window.bitcoinjs.ECPair.fromPublicKey(Buffer.from(bcpublicKey));
    return window.bitcoinjs.payments.p2pkh({ pubkey: ecpair.publicKey }).address;
}

function setBalanceWithInterest() {
    try {
        if (tq.chainheighttime == 0) {
            return;
        }
        let elapsed = (new Date().getTime() - tq.chainheighttime) / (78 * 1000);
        let membalance = updateBalance(tq.chainheight + elapsed);
        let mem = (membalance / 100000000) + "";
        while (mem.length < 10) {
            mem = mem + "0";
        }
        //M̈ m̈
        //document.getElementById("membalance").textContent=mem.substring(0,10);
        if(membalance){ //only show balance if it is not zero
            document.getElementById("membalance").innerHTML = `<strong>${nativeCoin.symbol}</strong>` + mem.substring(0, 10);
        }
    } catch (err) {
        //console.log(err);
        //Error probably caused by trying to set balance before UTXO set is loaded
    }
}

//This just set visual display of balance plus interest earned
setInterval(setBalanceWithInterest, 500);


//utxopool will call this after utxos updated
function updateChainHeight(chainHeight, chainHeightTime) {
    updateBalance(null, true);
}

var showwarning = true;
function updateBalance(dynamicChainHeight, showLowFunds = false) {

    if (!dynamicChainHeight) {
        //dynamicChainHeight = tq.chainheighttime;
        //makes no sense to use a time instead of a blockheight here.
        return;
    }
    var total = tq.getBalance(dynamicChainHeight);
    document.getElementById('balancesatoshis').innerHTML = Math.round(total);
    document.getElementById('balancebch').innerHTML = (total / 100000000).toFixed(5);

    var usd = ((Number(total) * numbers.usdrate) / 100000000).toFixed(2);
    if (usd < 1) {
        document.getElementById('balanceusd').innerHTML = (usd * 100).toFixed(0) + "¢";
    } else {
        document.getElementById('balanceusd').innerHTML = "$" + usd;
    }

    if (document.getElementById('satoshiamount'))
        document.getElementById('satoshiamount').innerHTML = total;

    showLowFunds=false; //remove to show low funds warning
    if (showLowFunds && total < 2000 && showwarning) {
        var lowfundsElement = document.getElementById('lowfundswarning');
        if (lowfundsElement) {
            document.getElementById('lowfundswarning').style.display = 'block';
            //showQRCode('lowfundsaddress', 100);
            //only show this message once per app load
            showwarning = false;
        }
    }
    if (total >= 2000) {
        document.getElementById('lowfundswarning').style.display = 'none';
    }

    return total;
}


// Consts for secp256k1 curve.
// https://en.bitcoin.it/wiki/Secp256k1


function getYSign( comp ) {
    /*let prime = new bigInt('fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f', 16),
    pIdent = prime.add(1).divide(4);
    let x = new bigInt(comp, 16);
    console.log(x);
    // y mod p = +-(x^3 + 7)^((p+1)/4) mod p
    let y = x.modPow(3, prime).add(7).mod(prime).modPow( pIdent, prime );
    // If the parity doesn't match it's the *other* root
    console.log(y);
    console.log(prime.subtract( y ));
    console.log((prime.subtract( y ).subtract(y)>0));

    if(y.mod(2).toJSNumber()!=0){
        return '03';
    }else{
        return '02';
    }*/
    return '02';
}


function pad_with_zeroes(number, length) {
    var retval = '' + number;
    while (retval.length < length) {
        retval = '0' + retval;
    }
    return retval;
}

// Consts for secp256k1 curve. Adjust accordingly
// https://en.bitcoin.it/wiki/Secp256k1
const prime = new bigInt('fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f', 16),
pIdent = prime.add(1).divide(4);

/**
 * Point decompress secp256k1 curve
 * @param {string} Compressed representation in hex string
 * @return {string} Uncompressed representation in hex string
 */
function ECPointDecompress( comp ) {
    var signY = new Number(comp[1]) - 2;
    var x = new bigInt(comp.substring(2), 16);
    // y mod p = +-(x^3 + 7)^((p+1)/4) mod p
    var y = x.modPow(3, prime).add(7).mod(prime).modPow( pIdent, prime );
    // If the parity doesn't match it's the *other* root
    if( y.mod(2).toJSNumber() !== signY ) {
        // y = prime - y
        y = prime.subtract( y );
    }
    return '04' + pad_with_zeroes(x.toString(16), 64) + pad_with_zeroes(y.toString(16), 64);
}

