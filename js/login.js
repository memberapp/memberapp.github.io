
"use strict";

var pubkey = ""; //Public Key (Legacy)
var mnemonic = ""; //Mnemonic BIP39
var privkey = ""; //Private Key
var privkeyhex = "";
var privateKeyBuf;
var nostrPrivKeyHex = "";
var nostrPubKeyHex = "";

var chainheight = 0;
var chainheighttime = 0;

//var qpubkey = ""; //Public Key (q style address)
var pubkeyhex = ""; //Public Key, full hex
var bitcloutaddress = ""; //Bitclout address

let tq = null;
//let currentTopic = ""; //Be careful, current Topic can contain anything, including code.
var cytoscape = null;
var bip39 = null;
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
        await loadScript("configlocal.js?"+version);
    }

    setLanguage();

    document.getElementById('previewcontent').style.display = 'none';
    document.getElementById('mainbodywrapper').innerHTML = mainbodyHTML;
    //document.getElementById('header').innerHTML = headerHTML;
    document.getElementById('header').innerHTML = templateReplace(headerHTML, {logowide:logowide, logoicon:logoicon}, true);

    document.getElementById('hamburgermenu').innerHTML = hamburgerMenuHTML;
    document.getElementById('pagetitle').innerHTML = pageTitleHTML;
    document.getElementById('majornavbuttons').innerHTML = majorNavButtonsHTML;
    document.getElementById('usersearch').innerHTML = userSearchHTML;


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

    getBitCloutLoginFromLocalStorage();

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


    
    displayContentBasedOnURLParameters();
    loadBigLibs();
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

async function nos2xlogin(){
    let pubKeyToUse;
    try{
        pubKeyToUse=await window.nostr.getPublicKey();
        if (!window.bech32converter) await loadScript("js/lib/bech32-converting-1.0.9.min.js");//require bech32
        pubKeyToUse = window.bech32converter('npub').toBech32('0x'+pubKeyToUse);

    }catch(error){
        document.getElementById('loginerror').innerHTML = "nos2x error:"+error.message;
        console.log(error);
    }
    trylogin(pubKeyToUse);
}

function trylogin(loginkey, nextpage) {
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

    //Show message if in read only mode
    if (!privkey && !window.nostr) {
        document.getElementById('readonlyversion').style.display = 'block';
    }

    //getAndPopulateTopicList(false);
    if(newlygeneratedaccount){
        displayContentBasedOnURLParameters('#settings');
    }else{
        displayContentBasedOnURLParameters(nextpage);
    }
    //make sure these get loaded
    setTimeout(loadBigLibs, 5000);

}

var loadBigLibsStarted = false;
async function loadBigLibs() {
    if (loadBigLibsStarted) return;
    loadBigLibsStarted = true;
    //Load big libraries that may not be immediately needed.

    if (!bip39) loadScript("js/lib/bip39.browser.js");
    if (!window.bitcoinjs) loadScript(bitcoinjslib);
    if (!window.NostrTools)  loadScript("js/lib/nostr.bundle.1.0.1.js");
    if (!window.bech32converter)  loadScript("js/lib/bech32-converting-1.0.9.min.js");
    if (!eccryptoJs) loadScript("js/lib/eccrypto-js.js");
    if (!window.elliptic) loadScript("js/lib/elliptic.min.js");
    loadMDE();
    if (!cytoscape) loadScript("js/lib/cytoscape3.19.patched.min.js");
    if (!bcdecrypt) loadScript("js/lib/identityencryption.js");
    loadMap();
}


async function login(loginkey) {

    mnemonic = localStorageGet(localStorageSafe, "mnemonic");
    privkey = localStorageGet(localStorageSafe, "privkey");
    pubkey = localStorageGet(localStorageSafe, "pubkey");
    //qpubkey = localStorageGet(localStorageSafe, "qpubkey");
    pubkeyhex = localStorageGet(localStorageSafe, "pubkeyhex");
    privkeyhex = localStorageGet(localStorageSafe, "privkeyhex");
    bitCloutUser = localStorageGet(localStorageSafe, "bitcloutuser");
    nostrPrivKeyHex = localStorageGet(localStorageSafe, "nostrprivkeyhex");
    nostrPubKeyHex = localStorageGet(localStorageSafe, "nostrpubkeyhex");


    if (!(pubkey) || (privkey && !privkeyhex) || (mnemonic && !nostrPrivKeyHex)) {
        //slow login.
        //note, mnemonic not available to all users for fast login
        //note, user may be logged in in public key mode
        //note, pubkeyhex won't be available in public key mode

        loginkey = loginkey.trim();
        //check valid private or public key
        var publicaddress = "";

        if (!bip39) { await loadScript("js/lib/bip39.browser.js"); }
        if (!window.bitcoinjs) { await loadScript(bitcoinjslib); }

        let userLoggedInWithnsec = false;
        if (loginkey.startsWith("nsec")) {
            userLoggedInWithnsec = true;
            //Nostr bech32 encoded private key
            if (!window.bech32converter)  await loadScript("js/lib/bech32-converting-1.0.9.min.js");
            let hexkey = window.bech32converter('nsec').toHex(loginkey).slice(2).toLowerCase();
            let ecpair = new window.bitcoinjs.ECPair.fromPrivateKey(Buffer.from(hexkey,'hex'));
            setNostrKeys(ecpair);
            //Note, cannot use this key directly as it is used for EDDSA, 
            //There is a theoretical risk if also using for ECDSA sigs
            //Hash the key, use as a source of entropy to generate mnemonic
            if (!eccryptoJs) {await loadScript("js/lib/eccrypto-js.js");}
            let hashprivkey = await eccryptoJs.sha256(await eccryptoJs.sha256(new Buffer(nostrPrivKeyHex,'hex')));
            hashprivkey = hashprivkey.toString('hex');
            hashprivkey = hashprivkey.slice(0,32);
            loginkey = bip39.entropyToMnemonic(new Buffer(hashprivkey,'hex'));
        }

        let loginkeylowercase=loginkey.toLowerCase();
        if (bip39.validateMnemonic(loginkeylowercase)) {
            let seed = bip39.mnemonicToSeedSync(loginkeylowercase);
            let root = window.bitcoinjs.bip32.fromSeed(seed);
            let child1 = root.derivePath("44'/0'/0'/0/0");
            let newloginkey = child1.toWIF();
            localStorageSet(localStorageSafe, "mnemonic", loginkeylowercase);
            mnemonic = loginkeylowercase;
            loginkey = newloginkey;

            if(!nostrPrivKeyHex){ //if the user logged in with an nsec, the priv/pub keys are already set!
                let nostrKey = root.derivePath("44'/1237'/0'/0/0");
                setNostrKeys(nostrKey);
            }




            //pubkeyhex = ecpair.publicKey.toString('hex');
            //privkeyhex = ecpair.privateKey.toString('hex');
            
        }

        try {
            if (loginkey.startsWith("q")) { //Note, not possible to be a valid seed phrase here, so shouldn't interfere with that, could be a username starting with q
                loginkey = "member:" + loginkey;
            }

            if (loginkey.startsWith("member:") || loginkey.startsWith("bitcoincash:")) {
                publicaddress = membercoinToLegacy(loginkey);
            } 
            else if (loginkey.startsWith("npub")) {
                //Nostr bech32 encoded public key
                if (!window.bech32converter)  await loadScript("js/lib/bech32-converting-1.0.9.min.js");
                let hexkey = window.bech32converter('npub').toHex(loginkey).slice(2).toLowerCase();
                publicaddress = window.bitcoinjs.payments.p2pkh({ pubkey: Buffer.from('02'+hexkey, 'hex') }).address;
            }
            else if (loginkey.startsWith("L") || loginkey.startsWith("K")) {
                let ecpair = window.bitcoinjs.ECPair.fromWIF(loginkey);
                publicaddress = window.bitcoinjs.payments.p2pkh({ pubkey: ecpair.publicKey }).address;
                privkey = loginkey;
                document.getElementById('loginkey').value = "";
            } else if (loginkey.startsWith("BC1")) {
                var preslice = window.bs58check.decode(loginkey);
                var bcpublicKey = preslice.slice(3);
                checkIfBitcloutUser(new Buffer(bcpublicKey).toString('hex'));
                var ecpair = new window.bitcoinjs.ECPair.fromPublicKey(Buffer.from(bcpublicKey));
                publicaddress = window.bitcoinjs.payments.p2pkh({ pubkey: ecpair.publicKey }).address;
            } else if (loginkey.startsWith("1") || loginkey.startsWith("3")) {
                window.bitcoinjs.address.toOutputScript(loginkey);//this will throw error if address is not valid
                publicaddress = loginkey;
            } else {
                throw Error('No login key recognized');
            }
        } catch (err) {
            if (loginkey.length < 20) {
                var theURL = dropdowns.contentserver + '?action=usersearch&searchterm=' + encodeURIComponent(loginkey);
                getJSON(theURL).then(function (data) {
                    if (data && data.length > 0) {
                        //Nostr won't have a bitcoin address associated with it - use representative one
                        //if(!qaddress || qaddress=='null'){
                        let namepubkey=data[0].publickey;
                        if (namepubkey.length==64)namepubkey='02'+namepubkey;
                        var qaddress=pubkeyhexToLegacy(namepubkey);
                        //}
                        
                        if(qaddress && qaddress.length>21){
                            trylogin(qaddress);
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

        pubkey = publicaddress.toString();
        localStorageSet(localStorageSafe, "pubkey", pubkey);

        if (privkey) {
            let ecpair = new window.bitcoinjs.ECPair.fromWIF(privkey);
            pubkeyhex = ecpair.publicKey.toString('hex');
            privkeyhex = ecpair.privateKey.toString('hex');

            localStorageSet(localStorageSafe, "privkey", privkey);
            localStorageSet(localStorageSafe, "pubkeyhex", pubkeyhex);
            localStorageSet(localStorageSafe, "privkeyhex", privkeyhex);
            
            if(newlygeneratedaccount || userLoggedInWithnsec){
                linkNostrAccount(false); //link the nostr public key to the member key
            }
            //dropdowns.utxoserver
            if(allowBitcloutUser){
                checkIfBitcloutUser(pubkeyhex);
            }
            //bitCloutUser=pubkeyToBCaddress(pubkeyhex);
        }



    }

    if (privkey) {
        privateKeyBuf = Buffer.from(privkeyhex, 'hex');
    }


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
    document.getElementById('settingsanchor').innerHTML = templateReplace(pages.settings, {version:version, dust:nativeCoin.dust, maxprofilelength:maxprofilelength}, true);
    document.getElementById('lowfundswarning').innerHTML = templateReplace(lowfundswarningHTML, { coinname:nativeCoin.name, version:version, bcaddress: pubkey, cashaddress: legacyToNativeCoin(pubkey) }, true);

    updateSettings();
    getAndPopulateSettings();

    //Register public key hex with utxo server so that utxos can be cached    
    //getJSON(dropdowns.utxoserver + 'reg/' + pubkeyhex + '?a=100').then(function (data) { }, function (status) { });

    //Register public key with content server to prepare feeds faster    
    getJSON(dropdowns.txbroadcastserver + 'regk/' + pubkey + '?a=100').then(function (data) { }, function (status) { });

    loadStyle();

    //Transaction queue requires bitcoinjs library to be loaded which may slow things down for a fast login on page reload
    if (!window.bitcoinjs) { await loadScript(bitcoinjslib); }
    tq = new TransactionQueue(pubkey, privkey, dropdowns.mcutxoserver + "address/utxo/", updateStatus, getSafeTranslation, updateChainHeight, null, window.bitcoinjs, dropdowns.txbroadcastserver + "rawtransactions/sendRawTransactionPost",nativeCoin.satsPerByte,nativeCoin.interestExponent,nativeCoin.dust);
    tq.refreshPool();

    if (!privkey) {
        //tq.utxopools[pubkey].showwarning = false;
        //document.getElementById('lowfundswarning').style.display = 'none';
        updateStatus(getSafeTranslation('publickeymode', "You are logging in with a public key. This is a read-only mode. You won't be able to make posts or likes etc."));
    }

    document.getElementById('messagesanchor').innerHTML = templateReplace(messagesanchorHTML, { dust: nativeCoin.dust }, true);
    //document.getElementById('newpost').innerHTML = newpostHTML;
    document.getElementById('newpost').innerHTML = templateReplace(newpostHTML, { fileuploadurl: dropdowns.imageuploadserver + "uploadfile", defaulttag: defaultTag, maxlength: maxlength }, true);



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

var newlygeneratedaccount=false;
async function createNewAccount() {
    if (!bip39) { await loadScript("js/lib/bip39.browser.js"); }
    let mnemonictemp = bip39.generateMnemonic();
    document.getElementById('newseedphrasedescription').style.display = "inline";
    document.getElementById('newseedphrase').textContent = mnemonictemp;
    document.getElementById('loginkey').value = mnemonictemp;
    newlygeneratedaccount=true;
}

function setNostrKeys(nostrKey){
    nostrPrivKeyHex = nostrKey.privateKey.toString('hex');
    nostrPubKeyHex = nostrKey.publicKey.toString('hex').slice(2);
    localStorageSet(localStorageSafe, "nostrprivkeyhex", nostrPrivKeyHex);
    localStorageSet(localStorageSafe, "nostrpubkeyhex", nostrPubKeyHex);
    let keyelement = document.getElementById('linknostraccount');
    if(keyelement){
      keyelement.value=nostrPubKeyHex;
    }
}

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
    pubkey = "";
    mnemonic = "";
    privateKeyBuf = "";
    nostrPrivKeyHex = "";
    nostrPubKeyHex = "";
    pubkeyhex = ""; //Public Key, full hex
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