"use strict";

var pubkey = ""; //Public Key (Legacy)
var privkey = ""; //Private Key
var qpubkey = ""; //Public Key (q style address)
var mutedwords = new Array();
let tq = new TransactionQueue(updateStatus);
let currentTopic = ""; //Be careful, current Topic can contain anything, including code.
var defaulttip = 1000;
var oneclicktip = 0;
var maxfee = 5;


function init() {
    //check local app storage for key

    if (typeof Storage !== void (0)) {
        var loginprivkey = localStorage.getItem("privkey");
        var loginpubkey = localStorage.getItem("pubkey");

        if (loginprivkey != "null" && loginprivkey != null && loginprivkey != "") {
            trylogin(loginprivkey);
        } else if (loginpubkey != "null" && loginpubkey != null && loginpubkey != "") {
            trylogin(loginpubkey);
        } else {
            displayContentBasedOnURLParameters();
        }
    }
}

function trylogin(loginkey) {
    try {
        login(loginkey);
    } catch (error) {
        document.getElementById('loginerror').innerHTML = error.message;
        return;
    }
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
        if (typeof Storage !== void (0)) {
            localStorage.setItem("privkey", privkey);
        }
    } else if (loginkey.startsWith("5")) {
        /*
        var privaddress=new bch.PrivateKey(loginkey);
        publicaddress = privaddress.toAddress();

        privkey=loginkey;
        document.getElementById('loginkey').value="";
        if(typeof Storage !== void(0)){
            localStorage.setItem("privkey",privkey);
        }*/
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

    if (typeof Storage !== void (0)) {
        localStorage.setItem("pubkey", pubkey);
    }
    document.getElementById('loggedin').style.display = "inline";
    document.getElementById('loggedout').style.display = "none";
    getAndPopulateSettings();

    //Set the saved style if available
    var style = localStorage.getItem("style");
    if (style != undefined && style != null) {
        changeStyle(style);
    }
    return;

}

function createNewAccount() {
    const privateKey = new bch.PrivateKey();
    login(privateKey.toWIF());
    show('settings');
    alert("Send a small amount of BCH to your address to start using your account. Remember to make a note of your private key to login again.");
}

function logout() {
    if (typeof Storage !== void (0)) {
        localStorage.setItem("privkey", null);
        localStorage.setItem("pubkey", null);
    }
    privkey = "";
    pubkey = "";
    document.getElementById('loggedin').style.display = "none";
    document.getElementById('loggedout').style.display = "block";
    show('loginbox');
}

function changeStyle(newStyle) {
    localStorage.setItem("style", newStyle);
    document.getElementById("pagestyle").setAttribute("href", "css/" + newStyle);
}