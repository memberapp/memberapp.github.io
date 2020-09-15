
"use strict";

//Preferable to grab this from sw.js, but don't know how.
//So must be entered in two places
var version = "4.4.7";

var pubkey = ""; //Public Key (Legacy)
var mnemonic = ""; //Mnemonic BIP39
var privkey = ""; //Private Key
var qpubkey = ""; //Public Key (q style address)
var mutedwords = new Array();
let tq = new TransactionQueue(updateStatus);
//let currentTopic = ""; //Be careful, current Topic can contain anything, including code.
var defaulttip = 1000;
var oneclicktip = 0;
var maxfee = 5;
mapTileProvider = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

//var twitterEmbeds=new Array();

//These should probably all go in a single config object
var settings = {
    "showyoutube": "true",
    "showimgur": "true",
    "showtwitter": "true"
};
var dropdowns = {
    "contentserver": "https://memberjs.org:8123/member.js",
    "txbroadcastserver": "https://memberjs.org:8123/v2/",
    "utxoserver": "https://rest.bitcoin.com/v2/",
    "currencydisplay": "USD"
};
var numbers = {
    "defaulttip": 1000,
    "oneclicktip": 0,
    "maxfee": 2,
    "results": 25,
    "usdrate": 0
}



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
    document.getElementById('version').innerHTML = version;
    setLang((navigator.language || navigator.userLanguage));
    //check local app storage for key

    //Show message if dev version in use
    if (document.location.href.indexOf('freetrade.github.io/memberdev') != -1) {
        document.getElementById('developmentversion').style.display = 'block';
    }
    var loginmnemonic = localStorageGet(localStorageSafe, "mnemonic");
    var loginprivkey = localStorageGet(localStorageSafe, "privkey");
    var loginpubkey = localStorageGet(localStorageSafe, "pubkey");

    if (loginmnemonic != "null" && loginmnemonic != null && loginmnemonic != "") {
        trylogin(loginmnemonic);
        return;
    } if (loginprivkey != "null" && loginprivkey != null && loginprivkey != "") {
        trylogin(loginprivkey);
        return;
    } else if (loginpubkey != "null" && loginpubkey != null && loginpubkey != "") {
        trylogin(loginpubkey);
        return;
    }
    displayContentBasedOnURLParameters();
}

//This method doesn't appear to be in use, also doesn't seem to work
function getAndSetVersion() {
    fetch('/version')
        .then(function (response) {
            return response.text()
        }).then(function (version) {
            console.log("member" + version);
            let ver_split = version.lastIndexOf('.');
            document.getElementById('version').innerHTML = version.substring(0, ver_split) + ".<u>" + version.substring(ver_split + 1) + "</u>";
        });
}

function trylogin(loginkey) {
    try {
        login(loginkey);
        displayNotificationCount();
    } catch (error) {
        document.getElementById('loginerror').innerHTML = error.message;
        console.log(error);
        updateStatus(error.message);
        return;
    }
    getAndPopulateTopicList(false);
    displayContentBasedOnURLParameters();
}

function login(loginkey) {

    loginkey = loginkey.trim();
    //check valid private or public key
    var publicaddress = "";

    if (new BITBOX.Mnemonic().validate(loginkey) == "Valid mnemonic") {

        /* Not sure why this isn't working, but gives different results to read.cash
        // Will change the bitbox method instead
        // create seed buffer from mnemonic
        let seedBuffer = new BITBOX.Mnemonic().toSeed(loginkey);
        // create HDNode from seed buffer
        let hdNode = new BITBOX.HDNode().fromSeed(seedBuffer);
        hdNode = new BITBOX.HDNode().derivePath(hdNode, "m/44'/0'/0'/0");
        // to legacy address
        var newloginkey = new BITBOX.HDNode().toWIF(hdNode);
        */

        var newloginkey = new BITBOX.Mnemonic().toKeypairs(loginkey, 1, false, "44'/0'/0'/0/")[0].privateKeyWIF;
        localStorageSet(localStorageSafe, "mnemonic", loginkey);
        mnemonic = loginkey;
        loginkey = newloginkey;
    }


    if (loginkey.startsWith("L") || loginkey.startsWith("K")) {


        let ecpair = new BITBOX.ECPair().fromWIF(loginkey);
        publicaddress = new BITBOX.ECPair().toLegacyAddress(ecpair);


        privkey = loginkey;
        document.getElementById('loginkey').value = "";
        localStorageSet(localStorageSafe, "privkey", privkey);
    } else if (loginkey.startsWith("5")) {
        document.getElementById('loginkey').value = "";
        alert("Uncompressed WIF not supported yet, please use a compressed WIF (starts with 'L' or 'K')");
        return;
    } else if (loginkey.startsWith("q")) {
        publicaddress = new BITBOX.Address().toLegacyAddress(loginkey);
    } else if (loginkey.startsWith("b")) {
        publicaddress = new BITBOX.Address().toLegacyAddress(loginkey);
    } else if (loginkey.startsWith("1") || loginkey.startsWith("3")) {
        if (new BITBOX.Address().isLegacyAddress(loginkey)) {
            publicaddress = loginkey;
        }
    } else {
        alert("Key not recognized, use a valid 12 word BIP39 seed phrase, or a compressed WIF (starts with 'L' or 'K')");
        return;
    }

    pubkey = publicaddress.toString();
    qpubkey = new BITBOX.Address().toCashAddress(pubkey);

    lastViewOfNotifications = Number(localStorageGet(localStorageSafe, "lastViewOfNotifications"));
    lastViewOfNotificationspm = Number(localStorageGet(localStorageSafe, "lastViewOfNotificationspm"));

    localStorageSet(localStorageSafe, "pubkey", pubkey);
    document.getElementById('loggedin').style.display = "inline";
    document.getElementById('loggedout').style.display = "none";

    document.getElementById('newseedphrasedescription').style.display = "none";
    document.getElementById('newseedphrase').innerText = "";
    document.getElementById('loginkey').value = "";

    getAndPopulateSettings();
    tq.addUTXOPool(pubkey, localStorageSafe, "balance");
    //Get latest rate and update balance
    getLatestUSDrate();
    loadStyle();

    return;

}

function loadStyle() {
    //Set the saved style if available
    let style = localStorageGet(localStorageSafe, "style");
    if (style != undefined && style != null) {
        changeStyle(style, true);
    }
}

function createNewAccount() {
    mnemonic = new BITBOX.Mnemonic().generate(128);
    //var loginkey = new BITBOX.Mnemonic().toKeypairs(mnemonic, 1)[0].privateKeyWIF;
    //login(mnemonic);
    //show('settingsanchor');
    //alert("Send a small amount of BCH to your address to start using your account. Remember to make a note of your private key to login again.");
    document.getElementById('newseedphrasedescription').style.display = "inline";
    document.getElementById('newseedphrase').innerText = mnemonic;
    document.getElementById('loginkey').value = mnemonic;


}

function logout() {
    if (localStorageSafe != null) {
        localStorageSafe.clear();
    }
    privkey = "";
    pubkey = "";
    mnemonic = "";
    document.getElementById('loggedin').style.display = "none";
    document.getElementById('loggedout').style.display = "inline";
    show('loginbox');

    //This clears any personal info that might be left in the html document.
    location.reload();

}

function changeStyle(newStyle, setStorage) {
    if (newStyle.indexOf(".css") != -1 || newStyle == "base" || newStyle == "base nightmode") {
        //old style, update
        //base style will now have value 'base none'
        newStyle = "feels";
    }
    if (setStorage) {
        localStorageSet(localStorageSafe, "style", newStyle);
    }
    var cssArray = newStyle.split(" ");
    if (cssArray[0]) { document.getElementById("pagestyle").setAttribute("href", "css/" + cssArray[0] + ".css"); }
    else { document.getElementById("pagestyle").setAttribute("href", "css/feels.css"); }
    if (cssArray[1]) { document.getElementById("pagestyle2").setAttribute("href", "css/" + cssArray[1] + ".css"); }
    else { document.getElementById("pagestyle2").setAttribute("href", "css/none.css"); }
    if (cssArray[2]) { document.getElementById("pagestyle3").setAttribute("href", "css/" + cssArray[2] + ".css"); }
    else { document.getElementById("pagestyle3").setAttribute("href", "css/none.css"); }
}

function setBodyStyle(newStyle) {
    if (newStyle) {
        document.getElementById("mainbody").setAttribute("class", newStyle);
    }
}


function refreshPool() {
    tq.utxopools[pubkey].refreshPool();
}