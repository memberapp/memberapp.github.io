
"use strict";

//Preferable to grab this from sw.js, but don't know how.
//So must be entered in two places
var version = "5.0.8";

var pubkey = ""; //Public Key (Legacy)
var mnemonic = ""; //Mnemonic BIP39
var privkey = ""; //Private Key
var privkeyhex = "";
var privateKeyBuf;

var qpubkey = ""; //Public Key (q style address)
var pubkeyhex = ""; //Public Key, full hex
let tq = new TransactionQueue(updateStatus);
//let currentTopic = ""; //Be careful, current Topic can contain anything, including code.
var bitboxSdk = null;
//var twitterEmbeds=new Array();


var localStorageSafe = null;
try { var localStorageSafe = localStorage; } catch (err) { }

//var ShowdownConverter = new showdown.Converter({extensions: ['youtube']});
var ShowdownConverter = new showdown.Converter();
ShowdownConverter.setFlavor('github');
ShowdownConverter.setOption('simpleLineBreaks', true);
ShowdownConverter.setOption('simplifiedAutoLink', true);
ShowdownConverter.setOption('openLinksInNewWindow', true);
ShowdownConverter.setOption('ghMentions', true);
ShowdownConverter.setOption('ghMentionsLink', "#member?pagingid={u}");

//Create warning if user tries to reload or exit while transactions are in progress or queued.
window.onbeforeunload = function () {
    if (tq.isTransactionInProgress())
        return getSafeTranslation('warnonexit', 'Are you sure? There are still transaction(s) in progress. They will be lost if you close the page or reload via the browser.');
};



function replaceName(match, p1, p2, p3, offset, string) {
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    return '"' + p2 + '" : ' + p3 + ',';
}

function setLanguage() {
    dictionary.live = dictionary.en;
    dictionary.fallback = dictionary.en;

    var storedLanguage = localStorageGet(localStorageSafe, "languageselector");
    if (storedLanguage && dictionary[storedLanguage]) {
        dictionary.live = dictionary[storedLanguage];
    } else {
        //guesslanguage
        var langcode = getBrowserLanguageCode();
        if (dictionary[langcode]) {
            dictionary.live = dictionary[langcode];
        }
    }
}

function init() {

    setLanguage();

    document.getElementById('previewcontent').style.display = 'none';
    document.getElementById('mainbodywrapper').innerHTML = mainbodyHTML;
    document.getElementById('header').innerHTML = headerHTML;
    document.getElementById('footer').innerHTML = footerHTML;
    document.getElementById('version').innerHTML = version;
    //setLang((navigator.language || navigator.userLanguage));
    //check local app storage for key

    if (document.location.host != 'member.cash') {
        siteTitle = "Member";
        document.title = siteTitle;
    }

    //Show message if dev version in use
    if (document.location.href.indexOf('freetrade.github.io/memberdev') != -1) {
        document.getElementById('developmentversion').style.display = 'block';
        profilepicbase = 'https://member.cash/img/profilepics/';
    }
    var loginmnemonic = localStorageGet(localStorageSafe, "mnemonic");
    var loginprivkey = localStorageGet(localStorageSafe, "privkey");
    var loginpubkey = localStorageGet(localStorageSafe, "pubkey");

    document.getElementById('loginbox').innerHTML = loginboxHTML;

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

    loadBigLibs();
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
        loadBigLibs();
        return;
    }
    getAndPopulateTopicList(false);
    displayContentBasedOnURLParameters();
    //make sure these get loaded
    setTimeout(loadBigLibs, 10000);

}

var loadBigLibsStarted = false;
async function loadBigLibs() {
    if (loadBigLibsStarted) return;
    loadBigLibsStarted = true;
    //Load big libraries that may not be immediately needed.
    if (!bitboxSdk) loadScript("js/lib/bitboxsdk.js");
    if (!L) loadScript("js/lib/leaflet/leaflet.js");
    if (!eccryptoJs) loadScript("js/lib/eccrypto-js.js");
    if (!SimpleMDE) loadScript("js/lib/mde/simplemde.1.11.2.min.js");
}


async function login(loginkey) {

    mnemonic = localStorageGet(localStorageSafe, "mnemonic");
    privkey = localStorageGet(localStorageSafe, "privkey");
    pubkey = localStorageGet(localStorageSafe, "pubkey");
    qpubkey = localStorageGet(localStorageSafe, "qpubkey");
    pubkeyhex = localStorageGet(localStorageSafe, "pubkeyhex");
    privkeyhex = localStorageGet(localStorageSafe, "privkeyhex");


    if (!(pubkey && qpubkey) || (privkey && !privkeyhex)) {
        //slow login.
        //note, mnemonic not available to all users for fast login
        //note, user may be logged in in public key mode
        //note, pubkeyhex won't be available in public key mode

        loginkey = loginkey.trim();
        //check valid private or public key
        var publicaddress = "";

        if (!bitboxSdk) { await loadScript("js/lib/bitboxsdk.js"); }

        if (new bitboxSdk.Mnemonic().validate(loginkey) == "Valid mnemonic") {

            /* Not sure why this isn't working, but gives different results to read.cash
            // Will change the bitbox method instead
            // create seed buffer from mnemonic
            let seedBuffer = new bitboxSdk.Mnemonic().toSeed(loginkey);
            // create HDNode from seed buffer
            let hdNode = new bitboxSdk.HDNode().fromSeed(seedBuffer);
            hdNode = new bitboxSdk.HDNode().derivePath(hdNode, "m/44'/0'/0'/0");
            // to legacy address
            var newloginkey = new bitboxSdk.HDNode().toWIF(hdNode);
            */

            var newloginkey = new bitboxSdk.Mnemonic().toKeypairs(loginkey, 1, false, "44'/0'/0'/0/")[0].privateKeyWIF;
            localStorageSet(localStorageSafe, "mnemonic", loginkey);
            mnemonic = loginkey;
            loginkey = newloginkey;
        }


        if (loginkey.startsWith("L") || loginkey.startsWith("K")) {

            let ecpair = new bitboxSdk.ECPair().fromWIF(loginkey);
            publicaddress = new bitboxSdk.ECPair().toLegacyAddress(ecpair);

            privkey = loginkey;
            document.getElementById('loginkey').value = "";

        } else if (loginkey.startsWith("5")) {
            document.getElementById('loginkey').value = "";
            alert(getSafeTranslation('uncompressed', "Uncompressed WIF not supported yet, please use a compressed WIF (starts with 'L' or 'K')"));
            return;
        } else if (loginkey.startsWith("q")) {
            publicaddress = new bitboxSdk.Address().toLegacyAddress(loginkey);
        } else if (loginkey.startsWith("b")) {
            publicaddress = new bitboxSdk.Address().toLegacyAddress(loginkey);
        } else if (loginkey.startsWith("1") || loginkey.startsWith("3")) {
            if (new bitboxSdk.Address().isLegacyAddress(loginkey)) {
                publicaddress = loginkey;
            }
        } else {
            alert(getSafeTranslation('keynotrecognized', "Key not recognized, use a valid 12 word BIP39 seed phrase, or a compressed WIF (starts with 'L' or 'K')"));
            return;
        }

        pubkey = publicaddress.toString();
        qpubkey = new bitboxSdk.Address().toCashAddress(pubkey);
        localStorageSet(localStorageSafe, "pubkey", pubkey);
        localStorageSet(localStorageSafe, "qpubkey", qpubkey);

        if (privkey) {
            let ecpair = new bitboxSdk.ECPair().fromWIF(privkey);
            pubkeyhex = ecpair.getPublicKeyBuffer().toString('hex');
            privkeyhex = ecpair.d.toHex();



            localStorageSet(localStorageSafe, "privkey", privkey);
            localStorageSet(localStorageSafe, "pubkeyhex", pubkeyhex);
            localStorageSet(localStorageSafe, "privkeyhex", privkeyhex);
            //dropdowns.utxoserver
        }


    }

    if (privkey) {
        privateKeyBuf = Buffer.from(privkeyhex, 'hex');
    }


    lastViewOfNotifications = Number(localStorageGet(localStorageSafe, "lastViewOfNotifications"));
    lastViewOfNotificationspm = Number(localStorageGet(localStorageSafe, "lastViewOfNotificationspm"));

    document.getElementById('loggedin').style.display = "inline";
    document.getElementById('loggedout').style.display = "none";
    document.getElementById('newseedphrasedescription').style.display = "none";
    document.getElementById('newseedphrase').innerText = "";
    document.getElementById('loginkey').value = "";

    if (privkey == "") {
        alert(getSafeTranslation('publickeymode', "You are logging in with a public key. This is a read-only mode. You won't be able to make posts or likes etc."));
    }

    document.getElementById('settingsanchor').innerHTML = templateReplace(pages.settings, {}, true);
    updateSettings();
    getAndPopulateSettings();

    //Register public key with utxo server so that utxos can be cached    
    getJSON(dropdowns.utxoserver + 'reg/' + pubkeyhex + '?a=100').then(function (data) { }, function (status) { });


    tq.addUTXOPool(pubkey, qpubkey, localStorageSafe, "balance");
    //Get latest rate and update balance
    loadStyle();

    if (theStyle == 'nifty') {
        //document.getElementById('header').innerHTML = niftyHeaderHTML;
    }
    document.getElementById('loggedin').style.display = "inline";
    document.getElementById('loggedout').style.display = "none";
    getLatestUSDrate();


    document.getElementById('messagesanchor').innerHTML = messagesanchorHTML;
    document.getElementById('newpost').innerHTML = newpostHTML;
    document.getElementById('toolsanchor').innerHTML = toolsanchorHTML;
    document.getElementById('lowfundswarning').innerHTML = lowfundswarningHTML;

    return;

}

function loadStyle() {
    //Set the saved style if available
    let style = localStorageGet(localStorageSafe, "style2");
    if (style != undefined && style != null) {
        changeStyle(style, true);
    }
}

function createNewAccount() {
    mnemonic = new bitboxSdk.Mnemonic().generate(128);
    //var loginkey = new bitboxSdk.Mnemonic().toKeypairs(mnemonic, 1)[0].privateKeyWIF;
    //login(mnemonic);
    //show('settingsanchor');
    //alert("Send a small amount of BCH to your address to start using your account. Remember to make a note of your private key to login again.");
    document.getElementById('newseedphrasedescription').style.display = "inline";
    document.getElementById('newseedphrase').innerText = mnemonic;
    document.getElementById('loginkey').value = mnemonic;


}

function logout() {

    var exitreally = confirm(getSafeTranslation('areyousure', `Are you sure you want to logout? 
    Make sure you have written down your 12 word seed phrase or private key to login again. 
    There is no other way to recover your seed phrase. It is on the settings page.
    Click Cancel if you need to do that now.
    Click OK to logout.`));
    if (!exitreally) {
        return;
    }

    if (localStorageSafe != null) {
        localStorageSafe.clear();
    }
    privkey = "";
    pubkey = "";
    mnemonic = "";
    document.getElementById('loggedin').style.display = "none";
    document.getElementById('loggedout').style.display = "inline";


    try {
        serviceWorkerLogout();
    } catch (err) {
        console.log(err);
    }

    show('loginbox');
    //This clears any personal info that might be left in the html document.
    location.reload();

}

function changeStyle(newStyle, setStorage) {
    theStyle = newStyle;
    if (setStorage) {
        localStorageSet(localStorageSafe, "style2", newStyle);
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