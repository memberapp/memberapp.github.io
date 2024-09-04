
"use strict";

var pubkey = ""; //Public Key (Legacy)
var mnemonic = ""; //Mnemonic BIP39
var privkey = ""; //Private Key
var privkeyhex = "";
var nostracoinprivkey = null;
var pubkeyhexsigned = ""; //Public Key, full hex
var pubkeyhex = ""; //Public Key, minus sign
var bitcloutaddress = ""; //Bitclout address

let tq = null;
var chainheight = 0;
var chainheighttime = 0;

//let currentTopic = ""; //Be careful, current Topic can contain anything, including code.
var cytoscape = null;
var bip39 = null;
var pako = null;
//var twitterEmbeds=new Array();
var profilepic = "";
var Buffer = buffer.Buffer;




var localStorageSafe = null;
try { var localStorageSafe = localStorage; } catch (err) { }

//var ShowdownConverter = new showdown.Converter({extensions: ['youtube']});
var ShowdownConverter = new showdown.Converter();
ShowdownConverter.setFlavor('github');
ShowdownConverter.setOption('simpleLineBreaks', true);
ShowdownConverter.setOption('simplifiedAutoLink', true);
ShowdownConverter.setOption('openLinksInNewWindow', true);
ShowdownConverter.setOption('ghMentions', false);

var turndownService = new TurndownService();
TurndownService.prototype.escape = function (text) { return text; };


//ShowdownConverter.setOption('ghMentionsLink', "#member?pagingid={u}");

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

async function init() {

    if (window.location.protocol == "file:") {
        await loadScript("configlocal.js?" + version);
    }

    setLanguage();

    document.getElementById('previewcontent').style.display = 'none';
    document.getElementById('mainbodywrapper').innerHTML = mainbodyHTML;
    //document.getElementById('header').innerHTML = headerHTML;
    document.getElementById('header').innerHTML = templateReplace(headerHTML, { logowide: logowide, logoicon: logoicon }, true);

    document.getElementById('hamburgermenu').innerHTML = hamburgerMenuHTML;
    document.getElementById('pagetitle').innerHTML = pageTitleHTML;
    document.getElementById('majornavbuttons').innerHTML = majorNavButtonsHTML;
    document.getElementById('usersearch').innerHTML = userSearchHTML;


    document.getElementById('footer').innerHTML = footerHTML;
    document.getElementById('version').innerHTML = version;
    //setLang((navigator.language || navigator.userLanguage));
    //check local app storage for key

    if (document.location.host != siteTitle) {
        siteTitle = "Member";
        document.title = siteTitle;
    }

    //Show message if dev version in use
    if (document.location.href.indexOf('freetrade.github.io/memberdev') != -1) {
        document.getElementById('developmentversion').style.display = 'block';
        profilepicbase = `${pathpermalinks}/img/profilepics/`;
    }

    document.getElementById('loginbox').innerHTML = loginboxHTML;

    await trylogin();
    

    //displayContentBasedOnURLParameters();
    //loadBigLibs();
}

//This method doesn't appear to be in use, also doesn't seem to work
/*
function getAndSetVersion() {
    fetch('/version')
        .then(function (response) {
            return response.text()
        }).then(function (version) {
            console.log("member" + version);
            let ver_split = version.lastIndexOf('.');
            document.getElementById('version').innerHTML = version.substring(0, ver_split) + ".<u>" + version.substring(ver_split + 1) + "</u>";
        });
}*/

async function nos2xlogin() {
    let pubKeyToUse;
    try {
        if (!window.nostr) {
            alert('nos2x browser extension not found.');
            return;
        }
        pubKeyToUse = await window.nostr.getPublicKey();
        if (!window.bech32converter) await loadScript("js/lib/bech32-converting-1.0.9.min.js");//require bech32
        pubKeyToUse = window.bech32converter('npub').toBech32('0x' + pubKeyToUse);

    } catch (error) {
        document.getElementById('loginerror').innerHTML = "nos2x error:" + error.message;
        console.log(error);
    }
    if (pubKeyToUse) {
        trylogin(pubKeyToUse, '#mypeople');
    } else {
        alert('nos2x public key not provided.');
    }
}

async function trylogin(loginkey, nextpage) {
    try {
        await login(loginkey);
        displayNotificationCount();
    } catch (error) {
        document.getElementById('loginerror').innerHTML = error.message;
        console.log(error);
        updateStatus(error.message);
        loadBigLibs();
        return;
    }

    showReadOnlyVersion();
    //may take a while for window.nostr to show up so, we'll run again after a few seconds
    setTimeout(showReadOnlyVersion,3000);

    if (newlygeneratedaccount) {
        displayContentBasedOnURLParameters('#settings');
    } else {
        displayContentBasedOnURLParameters(nextpage);
    }
    loadBigLibs();
    //make sure these get loaded
    setTimeout(loadBigLibs, 5000);

}

function showReadOnlyVersion(){
    //Show message if in read only mode
    if (!privkey && !window.nostr) {
        document.getElementById('readonlyversion').style.display = 'block';
    } else {
        document.getElementById('readonlyversion').style.display = 'none';
    }
}

var loadBigLibsStarted = false;
async function loadBigLibs() {
    if (loadBigLibsStarted) return;
    loadBigLibsStarted = true;
    //Load big libraries that may not be immediately needed.

    if (!bip39) loadScript("js/lib/bip39.browser.js");
    if (!window.bitcoinjs) loadScript(bitcoinjslib);
    if (!window.NostrTools) loadScript("js/lib/nostr.bundle.1.0.1.js");
    if (!window.bech32converter) loadScript("js/lib/bech32-converting-1.0.9.min.js");
    if (!eccryptoJs) loadScript("js/lib/eccrypto-js.js");
    if (!window.elliptic) loadScript("js/lib/elliptic.min.js");
    if (!pako) loadScript("js/lib/pako.2.0.4.min.js");
    loadMDE();
    if (!cytoscape) loadScript("js/lib/cytoscape3.19.patched.min.js");
    if (!bcdecrypt) loadScript("js/lib/identityencryption.js");
    loadMap();
}


async function login(loginkey) { //login should throw error if not successful

    mnemonic = localStorageGet(localStorageSafe, "mnemonic");
    privkey = localStorageGet(localStorageSafe, "privkey");
    privkeyhex = localStorageGet(localStorageSafe, "privkeyhex");
    nostracoinprivkey = localStorageGet(localStorageSafe, "nostracoinprivkey");
    pubkeyhexsigned = localStorageGet(localStorageSafe, "pubkeyhexsigned");
    pubkeyhex = localStorageGet(localStorageSafe, "pubkeyhex");
    //bitCloutUser = localStorageGet(localStorageSafe, "bitcloutuser");





    if (!pubkeyhexsigned) { //no info for this user, full login
        if (!loginkey) return; //no login key
        loginkey = loginkey.trim();

        //slow login.
        //note, mnemonic not available to all users for fast login
        //note, user may be logged in in public key mode

        //check valid private or public key


        if (!bip39) { await loadScript("js/lib/bip39.browser.js"); }
        if (!window.bitcoinjs) { await loadScript(bitcoinjslib); }


        if (loginkey.startsWith("nsec")) {
            //Nostr bech32 encoded private key
            if (!window.bech32converter) await loadScript("js/lib/bech32-converting-1.0.9.min.js");
            let hexkey = window.bech32converter('nsec').toHex(loginkey).slice(2).toLowerCase();
            let ecpair = new window.bitcoinjs.ECPair.fromPrivateKey(Buffer.from(hexkey, 'hex'));
            loginkey = ecpair.toWIF();
        }

        let loginkeylowercase = loginkey.toLowerCase();

        /*
        if (loginkeylowercase.startsWith("npub")) {
            //Nostr bech32 encoded public key
            if (!window.bech32converter)  await loadScript("js/lib/bech32-converting-1.0.9.min.js");
            nostrPubKeyHex = window.bech32converter('npub').toHex(loginkey).slice(2).toLowerCase();
            //Generate a new seed phrase
            if (!bip39) { await loadScript("js/lib/bip39.browser.js"); }
            loginkeylowercase = bip39.generateMnemonic();
        }*/

        if (bip39.validateMnemonic(loginkeylowercase)) {
            let seed = bip39.mnemonicToSeedSync(loginkeylowercase);
            let root = window.bitcoinjs.bip32.fromSeed(seed);
            let child1 = root.derivePath("44'/0'/0'/0/0");
            //let child1 = root.derivePath("44'/60'/0'/0/0"); - eth derivation, unsure why this was added, maybe as a test
            
            let newloginkey = child1.toWIF();
            localStorageSet(localStorageSafe, "mnemonic", loginkeylowercase);
            mnemonic = loginkeylowercase;
            loginkey = newloginkey;
        }

        //Login will now either be a wif, or a public key, or a user name, or an error

        try {
            if (loginkey.startsWith("L") || loginkey.startsWith("K")) { //compressed public keys
                //|| loginkey.startsWith("5") - uncompressed keys difficult to handle
                privkey = loginkey;
                document.getElementById('loginkey').value = "";
            } else if (loginkey.startsWith("npub")) {
                //Nostr bech32 encoded public key
                let temphex = await npubToPubKey(loginkey);
                pubkeyhexsigned = getYSign(temphex) + temphex;
            } else if(loginkey.length==64){
                const hexPattern = /^[0-9a-fA-F]+$/;
                // Test the input string against the pattern
                if(hexPattern.test(loginkey)){
                    pubkeyhexsigned = '02'+loginkey;
                }
            }

            // other wise try logging in with other types of public keys, bitclout, memo, hive etc 
            /*else if (loginkey.startsWith("BC1")) {
                var preslice = window.bs58check.decode(loginkey);
                var bcpublicKey = preslice.slice(3);
                checkIfBitcloutUser(new Buffer(bcpublicKey).toString('hex'));
            }*/
            else {
                throw Error('No login key recognized');
            }
        } catch (err) {
            if (loginkey.length < 20) {
                var theURL = dropdowns.contentserver + '?action=usersearch&searchterm=' + encodeURIComponent(loginkey);
                getJSON(theURL).then(function (data) {
                    if (data && data.length > 0) {
                        let namepubkey = data[0].publickey;
                        if (namepubkey && namepubkey.length == 64) {
                            trylogin(window.bech32converter('npub').toBech32('0x' + namepubkey), '#mypeople');
                        }
                        return;
                    } else {
                        alert(getSafeTranslation('keynotrecognized', "Key/Handle not recognized, use a valid handle or 12 word BIP39 seed phrase, or a compressed WIF (starts with L or K)"));
                        return;
                    }
                }, function (status) { //error detection....
                    alert(getSafeTranslation('keynotrecognized', "Key/Handle not recognized, use a valid handle or 12 word BIP39 seed phrase, or a compressed WIF (starts with L or K)"));
                });
            } else {
                alert(getSafeTranslation('keynotrecognized', "Key/Handle not recognized, use a valid handle or 12 word BIP39 seed phrase, or a compressed WIF (starts with L or K)"));
            }

            return;
        }

        //set the signed, compressed public key
        if (privkey) {
            let ecpair = new window.bitcoinjs.ECPair.fromWIF(privkey);
            privkeyhex = ecpair.privateKey.toString('hex');
            localStorageSet(localStorageSafe, "privkey", privkey);
            localStorageSet(localStorageSafe, "privkeyhex", privkeyhex);
            pubkeyhexsigned = ecpair.publicKey.toString('hex');

            //Nostracoin privkey is the key that corresponds to a compressed publickey that starts with a '02'
            nostracoinprivkey = privkey;
            if (pubkeyhexsigned.startsWith('03')) {
                nostracoinprivkey = getAlternativePrivKey(privkeyhex);
            }
            localStorageSet(localStorageSafe, "nostracoinprivkey", nostracoinprivkey);
        }

        /*
 if(allowBitcloutUser){
     checkIfBitcloutUser(pubkeyhex);
 }
 //bitCloutUser=pubkeyToBCaddress(pubkeyhex);
 */

    }

    pubkeyhex = pubkeyhexsigned.slice(2);
    localStorageSet(localStorageSafe, "pubkeyhexsigned", pubkeyhexsigned);
    localStorageSet(localStorageSafe, "pubkeyhex", pubkeyhex);

    lastViewOfNotifications = Number(localStorageGet(localStorageSafe, "lastViewOfNotifications"));
    lastViewOfNotificationspm = Number(localStorageGet(localStorageSafe, "lastViewOfNotificationspm"));

    document.getElementById('loggedin').style.display = "flex";
    document.getElementById('profilebutton').style.display = "flex";
    document.getElementById('walletbutton').style.display = "flex";
    document.getElementById('logoutbutton').style.display = "flex";

    document.getElementById('loggedout').style.display = "none";
    document.getElementById('newseedphrasedescription').style.display = "none";
    document.getElementById('newseedphrase').textContent = "";
    document.getElementById('loginkey').value = "";

    //, nostrpubkey:nostrPubKeyHex bech32 lib may not be available yet
    document.getElementById('settingsanchor').innerHTML = templateReplace(pages.settings, { version: version, dust: nativeCoin.dust, maxprofilelength: maxprofilelength, siteTitle: siteTitle, pathpermalinks: pathpermalinks }, true);
    //document.getElementById('lowfundswarning').innerHTML = templateReplace(lowfundswarningHTML, { coinname:nativeCoin.name, version:version, bcaddress: pubkey, cashaddress: legacyToNativeCoin(pubkey) }, true);

    updateSettings();
    getAndPopulateSettings();

    //Register public key hex with utxo server so that utxos can be cached    
    //getJSON(dropdowns.utxoserver + 'reg/' + pubkeyhex + '?a=100').then(function (data) { }, function (status) { });

    //Register public key with content server to prepare feeds faster    
    getJSON(dropdowns.txbroadcastserver + 'regk/' + pubkeyhex + '?a=100').then(function (data) { }, function (status) { });

    loadStyle();

    //Transaction queue requires bitcoinjs library to be loaded which may slow things down for a fast login on page reload
    if (!window.bitcoinjs) { await loadScript(bitcoinjslib); }
    tq = new TransactionQueue(await pubkeyhexToLegacy(pubkeyhexsigned), privkey, dropdowns.mcutxoserver + "address/utxo/", updateStatus, getSafeTranslation, updateChainHeight, null, window.bitcoinjs, dropdowns.txbroadcastserver + "rawtransactions/sendRawTransactionPost", nativeCoin.satsPerByte, nativeCoin.interestExponent, nativeCoin.dust);
    tq.refreshPool();

    if (!privkey) {
        //tq.utxopools[pubkey].showwarning = false;
        //document.getElementById('lowfundswarning').style.display = 'none';
        updateStatus(getSafeTranslation('publickeymode', "You are logging in with a public key. This is a read-only mode. You won't be able to make posts or likes etc."));
    }

    document.getElementById('messagesanchor').innerHTML = templateReplace(messagesanchorHTML, { dust: nativeCoin.dust }, true);
    //document.getElementById('newpost').innerHTML = newpostHTML;
    document.getElementById('newpost').innerHTML = templateReplace(newpostHTML, { postid:(Math.floor(Math.random() * 100000)+100000), fileuploadurl: dropdowns.imageuploadserver + "uploadfile", defaulttag: defaultTag, maxlength: maxlength }, true);



    populateTools();

    return;

}

function loadStyle() {
    //Set the saved style if available
    let style = localStorageGet(localStorageSafe, "style2");
    if (style) {
        changeStyle(style, true);
    } else {
        changeStyle(theStyle, true);
    }
}

function getAlternativePrivKey(nostracoinprivkey2) {
    //let order = window.ec.n; //hard code so don't rely on library for value
    let l = new bigInt("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141", 16);
    let pkbn = new bigInt(nostracoinprivkey2, 16);
    let altprivkey = l.subtract(pkbn);
    let zeropad = pad_with_zeroes(altprivkey.toString(16), 64);
    let ecpair = new window.bitcoinjs.ECPair.fromPrivateKey(Buffer.from(zeropad, 'hex'));
    return ecpair.toWIF();
}

function getRepNetPrivKey() {
    /*
    if (nostracoinprivkey && nostracoinprivkey != "undefined")
        return nostracoinprivkey;
    else
        return null;*/
    return privkey;
}



var newlygeneratedaccount = false;
async function createNewAccount() {
    if (!bip39) { await loadScript("js/lib/bip39.browser.js"); }
    let mnemonictemp = null;
    let pkhs = null;
    do {
        mnemonictemp = bip39.generateMnemonic();
        let seed = bip39.mnemonicToSeedSync(mnemonictemp);
        let root = window.bitcoinjs.bip32.fromSeed(seed);
        let child1 = root.derivePath("44'/0'/0'/0/0");
        let newloginkey = child1.toWIF();
        let ecpair = new window.bitcoinjs.ECPair.fromWIF(newloginkey);
        pkhs = ecpair.publicKey.toString('hex');
    } while (pkhs.startsWith('03')) //generally prefer public keys that begin with 02 for simplicity 

    document.getElementById('newseedphrasedescription').style.display = "inline";
    document.getElementById('newseedphrase').textContent = mnemonictemp;
    document.getElementById('loginkey').value = mnemonictemp;
    newlygeneratedaccount = true;
}

/*function setNostrKeys(nostrKey){
    nostrPrivKeyHex = nostrKey.privateKey.toString('hex');
    nostrPubKeyHex = nostrKey.publicKey.toString('hex').slice(2);
    localStorageSet(localStorageSafe, "nostrprivkeyhex", nostrPrivKeyHex);
    localStorageSet(localStorageSafe, "nostrpubkeyhex", nostrPubKeyHex);
    let keyelement = document.getElementById('linknostraccount');
    if(keyelement){
      keyelement.value=nostrPubKeyHex;
    }
}*/

function logout() {

    if (privkey) {//only warn if there is a privkey
        var exitreally = confirm(getSafeTranslation('areyousure', `Are you sure you want to logout? 
    Make sure you have written down your 12 word seed phrase or private key to login again. 
    There is no other way to recover your seed phrase. It is on the wallet page.
    Click Cancel if you need to do that now.
    Click OK to logout.`));
        if (!exitreally) {
            return;
        }
    }

    if (localStorageSafe != null) {
        localStorageSafe.clear();
    }

    bitcloutlogout();

    privkey = "";
    privkeyhex = "";
    nostracoinprivkey = "";
    pubkeyhexsigned = ""
    pubkey = "";
    mnemonic = "";
    privateKeyBuf = "";
    pubkeyhex = ""; //Public Key, full hex
    //pubkeyhexsign = ""; //Public Key, full hex
    bitcloutaddress = ""; //Bitclout address
    tq = null;

    document.getElementById('loggedout').style.display = "flex";
    document.getElementById('loggedin').style.display = "none";
    document.getElementById('profilebutton').style.display = "none";
    document.getElementById('walletbutton').style.display = "none";
    document.getElementById('logoutbutton').style.display = "none";


    try {
        serviceWorkerLogout();
    } catch (err) {
        console.log(err);
    }

    location.href = "#login";
    //This clears any personal info that might be left in the html document.
    location.reload();

}

function changeStyle(newStyle, setStorage) {
    theStyle = newStyle;
    if (setStorage) {
        localStorageSet(localStorageSafe, "style2", newStyle);
    }
    var cssArray = newStyle.split(" ");
    if (cssArray[0]) { document.getElementById("pagestyle").setAttribute("href", "css/" + cssArray[0] + ".css?" + version); }
    else { document.getElementById("pagestyle").setAttribute("href", "css/feels.css?" + version); }
    if (cssArray[1]) { document.getElementById("pagestyle2").setAttribute("href", "css/" + cssArray[1] + ".css?" + version); }
    else { document.getElementById("pagestyle2").setAttribute("href", "css/none.css?" + version); }
    if (cssArray[2]) { document.getElementById("pagestyle3").setAttribute("href", "css/" + cssArray[2] + ".css?" + version); }
    else { document.getElementById("pagestyle3").setAttribute("href", "css/none.css?" + version); }
}

function setBodyStyle(newStyle) {
    if (newStyle) {
        document.getElementById("mainbody").setAttribute("class", newStyle);
    }
}


function refreshPool() {
    tq.refreshPool();
}