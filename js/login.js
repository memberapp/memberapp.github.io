"use strict";

var pubkey = ""; //Public Key (Legacy)
var privkey = ""; //Private Key
var qpubkey = ""; //Public Key (q style address)
var mutedwords = new Array();
let tq = new TransactionQueue(updateStatus);
//let currentTopic = ""; //Be careful, current Topic can contain anything, including code.
var defaulttip = 1000;
var oneclicktip = 0;
var maxfee = 5;
//var twitterEmbeds=new Array();

var localStorageSafe = null;
try { var localStorageSafe = localStorage; } catch (err) { }

//var ShowdownConverter = new showdown.Converter({extensions: ['youtube']});
var ShowdownConverter = new showdown.Converter();
ShowdownConverter.setFlavor('github');
ShowdownConverter.setOption('simpleLineBreaks', true);
ShowdownConverter.setOption('simplifiedAutoLink', true);
ShowdownConverter.setOption('openLinksInNewWindow', true);
ShowdownConverter.setOption('ghMentions', false);

//literalMidWordUnderscores

//Create warning if user tries to reload or exit while transactions are in progress or queued.
window.onbeforeunload = function () {
    if (tq.isTransactionInProgress())
        return "Are you sure? There are still transaction(s) in progress. They will be lost if you close the page or reload via the browser.";
};

function init() {
    //check local app storage for key

    //Show message if dev version in use
    if (document.location.href.indexOf('freetrade.github.io/memberdev') != -1) {
        document.getElementById('developmentversion').style.display = 'block';
    }
    var loginprivkey = localStorageGet(localStorageSafe, "privkey");
    var loginpubkey = localStorageGet(localStorageSafe, "pubkey");

    if (loginprivkey != "null" && loginprivkey != null && loginprivkey != "") {
        trylogin(loginprivkey);
        return;
    } else if (loginpubkey != "null" && loginpubkey != null && loginpubkey != "") {
        trylogin(loginpubkey);
        return;
    }
    displayContentBasedOnURLParameters();
}

function trylogin(loginkey) {
    try {
        login(loginkey);
    } catch (error) {
        document.getElementById('loginerror').innerHTML = error.message;
        console.log(error);
        updateStatus(error.message);
        return;
    }
    //document.location.href="#posts?type=all&amp;start=0&amp;limit=25";
    getAndPopulateTopicList(false);
    displayContentBasedOnURLParameters();
}

function login(loginkey) {

    //check valid private or public key
    var publicaddress = "";
    if (loginkey.startsWith("L") || loginkey.startsWith("K")) {
        var privaddress = new bch.PrivateKey(loginkey);
        publicaddress = privaddress.toAddress();

        privkey = loginkey;
        document.getElementById('loginkey').value = "";
        localStorageSet(localStorageSafe, "privkey", privkey);
    } else if (loginkey.startsWith("5")) {
        /*
        var privaddress=new bch.PrivateKey(loginkey);
        publicaddress = privaddress.toAddress();

        privkey=loginkey;
        document.getElementById('loginkey').value="";
        */
        document.getElementById('loginkey').value = "";
        alert("Uncompressed WIF not supported yet, please use a compressed WIF (starts with 'L' or 'K')");
        return;
    } else if (loginkey.startsWith("q")) {
        const Address = bch.Address;
        publicaddress = new Address.fromString('bitcoincash:' + loginkey, 'livenet', 'pubkeyhash', bch.Address.CashAddrFormat);
    } else if (loginkey.startsWith("b")) {
        const Address = bch.Address;
        publicaddress = new Address.fromString(loginkey, 'livenet', 'pubkeyhash', bch.Address.CashAddrFormat);
    } else if (loginkey.startsWith("1") || loginkey.startsWith("3")) {
        const Address = bch.Address;
        publicaddress = new Address(loginkey);
    } else {
        alert("Key not recognized, please use a compressed WIF (starts with 'L' or 'K')");
        return;
    }

    pubkey = publicaddress.toString();
    qpubkey = publicaddress.toString(bch.Address.CashAddrFormat);


    localStorageSet(localStorageSafe, "pubkey", pubkey);
    tq.addUTXOPool(pubkey, localStorageSafe);
    document.getElementById('loggedin').style.display = "inline";
    document.getElementById('loggedout').style.display = "none";
    getAndPopulateSettings();

    //Set the saved style if available
    let style = localStorageGet(localStorageSafe, "style");
    if (style != undefined && style != null) {
        changeStyle(style);
    }
    return;

}

function createNewAccount() {
    const privateKey = new bch.PrivateKey();
    login(privateKey.toWIF());
    show('settingsanchor');
    alert("Send a small amount of BCH to your address to start using your account. Remember to make a note of your private key to login again.");
}

function logout() {
    if (localStorageSafe != null) {
        localStorageSafe.clear();
    }
    privkey = "";
    pubkey = "";
    document.getElementById('loggedin').style.display = "none";
    document.getElementById('loggedout').style.display = "inline";
    show('loginbox');
}

function changeStyle(newStyle) {
    if (newStyle.indexOf(".css") != -1) {
        //old style, update
        newStyle = "base";
    }
    localStorageSet(localStorageSafe, "style", newStyle);
    var cssArray = newStyle.split(" ");
    if (cssArray[0]){document.getElementById("pagestyle").setAttribute("href", "css/" + cssArray[0] + ".css");}
    else{document.getElementById("pagestyle").setAttribute("href", "css/base.css");}
    if (cssArray[1]){document.getElementById("pagestyle2").setAttribute("href", "css/" + cssArray[1] + ".css");}
    else{document.getElementById("pagestyle2").setAttribute("href", "css/none.css");}
    if (cssArray[2]){document.getElementById("pagestyle3").setAttribute("href", "css/" + cssArray[2] + ".css");}
    else{document.getElementById("pagestyle3").setAttribute("href", "css/none.css");}
}

function setAddonStyle(newStyle) {
    document.getElementById("addonstyle").setAttribute("href", "css/" + newStyle);
}


function refreshPool() {
    tq.utxopools[pubkey].refreshPool();
}