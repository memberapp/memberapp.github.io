"use strict";

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function timeSince(timestamp, compress) {
  let date = new Date(timestamp * 1000);
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return (compress ? interval + getSafeTranslation("y", "y") : " " + getSafeTranslation("hace", "") + interval + " " + getSafeTranslation("yearsago", "years ago"));
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return (compress ? interval + getSafeTranslation("mo", "mo") : " " + getSafeTranslation("hace", "") + interval + " " + getSafeTranslation("monthsago", "months ago"));
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return (compress ? interval + getSafeTranslation("d", "d") : " " + getSafeTranslation("hace", "") + interval + " " + getSafeTranslation("daysago", "days ago"));
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return (compress ? interval + getSafeTranslation("h", "h") : " " + getSafeTranslation("hace", "") + interval + " " + getSafeTranslation("hoursago", "hours ago"));
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return (compress ? interval + getSafeTranslation("m", "m") : " " + getSafeTranslation("hace", "") + interval + " " + getSafeTranslation("minutesago", "minutes ago"));
  }
  return (compress ? Math.floor(seconds) + getSafeTranslation("s", "s") : " " + getSafeTranslation("hace", "") + Math.floor(seconds) + " " + getSafeTranslation("secondsago", "seconds ago"));
}

var ordinal_suffix_of = function (i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

var getJSON = function (url, postparams, oFormElement) {
  //force a reload by appending time so no cached versions
  if (url.contains('?')) {
    url += "&r=" + (new Date().getTime() % 100000);
  }
  try {
    updateStatus(getSafeTranslation('loading', "loading") + " " + url);
  } catch (noworries) { }
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    addListeners(xhr);
    xhr.onerror = function (e) {
      reject(xhr.status);
    };

    xhr.onload = function () {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.status);
      }
    };

    xhr.responseType = 'json';
    if (postparams || oFormElement) {
      xhr.open('post', url, true);

      if (oFormElement) {
        xhr.open(oFormElement.method, oFormElement.getAttribute("action"));
        xhr.send(new FormData(oFormElement));
      } else {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(postparams);
      }
    } else {
      xhr.open('get', url, true);
      xhr.send();
    }

  });
};

function addListeners(xhr) {
  //xhr.addEventListener('loadstart', handleEvent);
  //xhr.addEventListener('load', handleEvent);
  //xhr.addEventListener('loadend', handleEvent);
  xhr.addEventListener('progress', handleEvent);
  //xhr.addEventListener('error', handleEvent);
  xhr.addEventListener('abort', handleEvent);
}

function handleEvent(e) {
  updateStatus(`${e.type}: ${e.loaded} ` + getSafeTranslation('bytestransferred', `bytes transferred`));
}



function ds(input) {
  //if (input === undefined) { return ""; };
  try {
    //If this error out 'input.replace not a number' probably input is not a string type
    input = input.replace(/&/g, '&amp;');
    input = input.replace(/</g, '&lt;');
    input = input.replace(/>/g, '&gt;');
    input = input.replace(/"/g, '&quot;');
    input = input.replace(/'/g, '&#x27;');
  } catch (e) {
    //Anything funky goes on, we'll return safe empty string
    return "";
  }
  return input;
}

function dslite(input) {
  //if (input === undefined) { return ""; };
  try {
    //If this error out 'input.replace not a number' probably input is not a string type
    input = input.replace(/&/g, '&amp;');
    //input = input.replace(/</g, '&lt;');
    //input = input.replace(/>/g, '&gt;');
    input = input.replace(/"/g, '&quot;');
    input = input.replace(/'/g, '&#x27;');
  } catch (e) {
    //Anything funky goes on, we'll return safe empty string
    return "";
  }
  return input;
}

function quoteattr(s, preserveCR) {
  preserveCR = preserveCR ? '&#13;' : '\n';
  return ('' + s) /* Forces the conversion to string. */
    .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
    .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    /*
    You may add other replacements here for HTML only 
    (but it's not necessary).
    Or for XML, only if the named entities are defined in its DTD.
    */
    .replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
    .replace(/[\r\n]/g, preserveCR);
  ;
}


var debuginfo = "";

function updateStatus(message) {
  document.getElementById("status").innerHTML = message;
  debuginfo = message + '\n' + debuginfo;
}

function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

function san(input) {
  return sane(input);
}

function sanhl(input) { //hive link
  if (input === undefined || input == null) { return ""; }
  input = input + "";
  return input.replace(/[^A-Za-z0-9\-_\./]/g, '');
}
/*
function sanitizeAlphanumeric(input) {
  if (input === undefined || input == null) { return ""; }
  input = input + "";
  return input.replace(/[^A-Za-z0-9]/g, '');
}

function sanitizeAlphanumericUnderscore(input) {
  if (input === undefined || input == null) { return ""; }
  input = input + "";
  return input.replace(/[^A-Za-z0-9_]/g, '');
}*/

function sane(input) {
  if (input === undefined || input == null) { return ""; }
  input = input + "";
  return input.replace(/[^A-Za-z0-9\-_\.]/g, '');
}

function unicodeEscape(str) {
  if (str == undefined) return "";
  var result = '', index = 0, charCode, escape;
  while (!isNaN(charCode = str.charCodeAt(index++))) {
    escape = charCode.toString(16);
    result += charCode < 256
      ? '\\x' + (charCode > 15 ? '' : '0') + escape
      : '\\u' + ('0000' + escape).slice(-4);
  }
  return result;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getHeight() {
  var myWidth = 0, myHeight = 0;
  if (typeof (window.innerWidth) == 'number') {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  return myHeight;
}

function getWidth() {
  var myWidth = 0, myHeight = 0;
  if (typeof (window.innerWidth) == 'number') {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  return myWidth;
}

String.prototype.contains = function (segment) { return this.indexOf(segment) !== -1; };

function safeGPBN(name) {
  return sane(getParameterByName(name));
}

function numberGPBN(name) {
  return Number(getParameterByName(name));
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function scrollToElement(name) {
  var element = document.getElementById(name);
  if (element != undefined) {
    ScrollToResolver(element);
  }
}

function ScrollToResolver(elem) {
  var jump = parseInt((elem.getBoundingClientRect().top - 50) * .2);
  document.body.scrollTop += jump;
  document.documentElement.scrollTop += jump;
  if (!elem.lastjump || elem.lastjump > Math.abs(jump)) {
    elem.lastjump = Math.abs(jump);
    setTimeout(function () { ScrollToResolver(elem); }, "100");
  } else {
    elem.lastjump = null;
  }
}

function localStorageGet(theSO, itemName) {
  try {
    let theString = theSO.getItem(itemName);
    return theString;
  } catch (err) {
    return null;
  }
}

function localStorageSet(theSO, itemName, theString) {
  try {
    theSO.setItem(itemName, theString);
    return true;
  } catch (err) {
    return false;
  }
}


function satsToUSD(sats) {
  return sats * numbers.usdrate / 10000;
}

function satsToUSDString(sats) {
  return usdString(satsToUSD(sats), false);
}

function usdString(total, truncate=false) {
  var usd = Number(total / 10000).toFixed(2);
  if (usd < 1) {
    return (usd * 100).toFixed(0) + "¢";
  } else {
    if(truncate){
      return "$" + parseInt(usd);
    }
    return "$" + usd;
  }
}

function updateUSDRate(data) {
  let element=document.getElementById('usdrate');
  if (data && data[0] && data[0].usdrate && element) { 
    element.value = data[0].usdrate;
    updateSettingsNumber('usdrate');
  }
}

function balanceString(total) {
  if (numbers.usdrate === undefined || numbers.usdrate === 0) {
    //var balString = (Number(total) / 1000).toFixed(3);
    //balString = Number(balString.substr(0, balString.length - 4)).toLocaleString() + "<span class='sats'>" + balString.substr(balString.length - 3, 3) + "</span>";
    var balString = "" + Number(total);
    if (balString.length > 3) {
      balString = Number(balString.substr(0, balString.length - 3)).toLocaleString() + "k";
    } else {
      balString = Number(total);
    }
  }
  var usd = ((Number(total) * numbers.usdrate) / 100000000).toFixed(2);
  if (usd < 1) {
    return (usd * 100).toFixed(0) + "¢";
  } else {
    return "$" + usd;
  }
}

function detectMultipleIDS() {
  //console.log("Run Multiple ID check");
  var elms = document.getElementsByTagName("*"), i, len, ids = {}, id;
  for (i = 0, len = elms.length; i < len; i += 1) {
    id = elms[i].id || null;
    if (id) {
      ids[id] = ids.hasOwnProperty(id) ? ids[id] += 1 : 0;
    }
  }
  for (id in ids) {
    if (ids.hasOwnProperty(id)) {
      if (ids[id]) {
        console.warn("Multiple IDs #" + id);
      }
    }
  }
}


// Add a hook to make all links open a new window
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  // set all elements owning target to target=_blank
  if ('target' in node) {
    //don't set target for internal links, like member profile links
    if (!node.outerHTML.startsWith('<a href="#member')) {
      node.setAttribute('target', '_blank');
      // prevent https://www.owasp.org/index.php/Reverse_Tabnabbing
      node.setAttribute('rel', 'noopener noreferrer');
      node.setAttribute('onclick', 'event.stopPropagation();');
    }
  }
  // set non-HTML/MathML links to xlink:show=new
  if (!node.hasAttribute('target')
    && (node.hasAttribute('xlink:href')
      || node.hasAttribute('href'))) {
    node.setAttribute('xlink:show', 'new');
  }
});


//Twitter stuff, doesn't seem to be working
/*
window.$ = document.querySelectorAll.bind(document);

window.onmessage = (event) => {
  console.log(`Received message: ${event.data}`);
  var oe = e.originalEvent;
  if (oe.origin != "https://twitframe.com")
      return;

  if (oe.data.height && oe.data.element.match(/^tweet_/))
      $("#" + oe.data.element).css("height", parseInt(oe.data.height) + "px");

};*/

/* listen for the return message once the tweet has been loaded */

function listenForTwitFrameResizes() {
  /* find all iframes with ids starting with "tweet_" */
  var tweetIframes = document.querySelectorAll("*[id^='tweet_']");
  tweetIframes.forEach(element => {
    //onload doesn't seem to always have the tweet loaded, so return 133 as height
    //maybe could use readyState instead.
    element.onload = function () {
      this.contentWindow.postMessage({ element: this.id, query: "height" }, "https://twitframe.com");
    };
  });

}

/* listen for the return message once the tweet has been loaded */
window.onmessage = (oe) => {
  console.log("twit message: ");
  console.log(oe);
  if (oe.origin != "https://twitframe.com")
    return;
  if (oe.data.height && oe.data.element.match(/^tweet_/)) {
    try {
      //console.log("element "+oe.data.element);
      //console.log("prev height "+document.getElementById(oe.data.element).style.height);
      //console.log("new height "+parseInt(oe.data.height) + "px");
      if (parseInt(oe.data.height) < 140) {
        console.log("Error, twitter resize height must be 140 or greater.");

        /*
        //This attempt to repost the message doesn't work. I don't know why
        var that=document.getElementById(oe.data.element);
        setTimeout(function(){
          that.contentWindow.postMessage({ element: that.id, query: "height" }, "https://twitframe.com");
        },1000);*/
        return;
      }
      document.getElementById(oe.data.element).style.height = parseInt(oe.data.height) + "px";
    } catch (err) {
      console.log("Tweet frame resize error: Probably due to running from filesystem: " + err);
    }
  }
}

//short delay showing profile card
var delay = function (elem, callback, target) {
  var timeout = null;
  elem.onmouseover = function () {
    // Set timeout to be a timer which will invoke callback after 1s
    timeout = setTimeout(function () { callback(target) }, 1000);
  };

  elem.onmouseout = function () {
    // Clear any timers set to timeout
    clearTimeout(timeout);
  }
};

//replace items in a template
function templateReplace(templateString, obj, skipdebug) {
  //var templateString=document.getElementById(template).innerHTML;
  return templateString.replace(/\{(\w+)\}/g, function (_, k) {
    if (obj[k] == undefined && !skipdebug) {
      console.log("missing template value:" + k);
      //console.log(templateString);
    }
    return obj[k];
  });
}

function loadScript(src) {
  //console.log("background loading " + src);
  return new Promise(function (resolve, reject) {
    var s;
    s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}


function getBrowserLanguageCode() {
  const zhTraditional = ["zh-hk", "zh-tw", "zh-hant"];
  const zhSimplified = ["zh-cn", "zh-sg", "zh-hans"];
  const allowedInput = ["af", "an", "ar", "as", "azb", "az", "bal", "bel",
    "bg", "bn", "bo", "bs", "ca", "ckb", "cs", "cy", "da", "de", "el",
    "en", "eo", "es", "et", "eu", "fa", "fi", "fo", "fr", "fy", "ga", "gd",
    "gl", "gu", "haz", "he", "hi", "hr", "hsb", "hu", "id", "is", "it",
    "ja", "jv", "kab", "ka", "kir", "kk", "km", "kmr", "kn", "ko", "lt",
    "lv", "me", "mg", "mk", "ml", "mn", "mr", "ms", "mya", "nb", "ne",
    "nl", "nn", "os", "pa", "pl", "ps", "pt", "ro", "ru", "si", "sk",
    "skr", "sl", "snd", "so", "sq", "sr", "sv", "sw", "szl", "ta", "te",
    "th", "tl", "tr", "ug", "uk", "ur", "uz", "vi", "zh", "zht"];
  var language = (window.navigator.language || window.browserLanguage).toLowerCase();

  if (zhSimplified.includes(language)) {
    language = 'zh';
  } else if (zhTraditional.includes(language)) {
    language = 'zh'; //we only support zh atm
  } else {
    language = language.substring(0, 3).split('-')[0]
  }
  // As the language is controlled by the users browser,
  // the input is restricted to a known set of possibilities
  const src = allowedInput.includes(language) ? language : 'en';
  return src;
}

function changeClass(element, newClass) {
  element.className = newClass;
}

//Fade in, move Fareed

function elementInViewport2(ele, newclass) {
  if (ele) {
    var elements = Array.from(ele);
    for (let i = 0; i < elements.length; i++) {
      let el = elements[i];
      var top = el.offsetTop;
      var left = el.offsetLeft;
      var width = el.offsetWidth;
      var height = el.offsetHeight;

      while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
      }

      if (
        top < window.pageYOffset + window.innerHeight &&
        left < window.pageXOffset + window.innerWidth &&
        top + height > window.pageYOffset &&
        left + width > window.pageXOffset
      ) {
        elements[i].setAttribute('class', newclass);
      }
    }
  }
}

function setVisibleContentFinal() {
  if (document.getElementsByClassName('post-list-li')) {
    elementInViewport2(document.getElementsByClassName('post-list-li'), 'post-list-final');
  }
}


//When item is scrolled into view, it is set to fade in
window.addEventListener('scroll', function (e) {
  elementInViewport2(document.getElementsByClassName('post-list-li'), 'post-list-item');
});


function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData("Text", text);

  }
  else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      updateStatus("Copied to clipboard.");
      return document.execCommand("copy");  // Security exception may be thrown by some browsers.
    }
    catch (ex) {
      updateStatus("Copy to clipboard failed.");
      console.warn("Copy to clipboard failed.", ex);
      return false;
    }
    finally {
      document.body.removeChild(textarea);
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function outOfFive(theRating) {
  theRating = (Number(theRating) / 64) + 1;
  theRating = Math.round(theRating * 10) / 10;
  return theRating;
}

function transposeStarRating(rating) {
  var transposed = 0;
  switch (rating) {
    case 1:
      transposed = 1;
      break;
    case 2:
      transposed = 64;
      break;
    case 3:
      transposed = 128;
      break;
    case 4:
      transposed = 192;
      break;
    case 5:
      transposed = 255;
      break;
  }
  return transposed;
}

function dropDownMenuAction(that) {
  //var ddmenu = that.parentElement.querySelector('#dropdown-content');
  var ddmenu = that.parentElement.querySelector("[id^='dropdown-content']");

  ddmenu.style.display = 'block';
  var ddcover = document.getElementById('ddcover');
  ddcover.style.display = 'block';
  ddcover.onclick = ddmenu.onclick = function () { ddmenu.style.display = ddcover.style.display = 'none'; };
}

function getSatsWithInterest(principle, utxoheight, chainheight) {
  if (utxoheight == 0 || !utxoheight) {//not in blockchain yet. unconfirmed, no interest earned yet
    return principle;
  }
  if (!chainheight) {//we don't know chainheight - we must or we may lose interest
    throw Error('Chainheight not found - we must know this or may lose interest');
  }
  //Interest rate on each block 1+(1/2^22)
  let blocksheld = chainheight - utxoheight;
  let withInterest = principle * Math.pow(1 + (1 / Math.pow(2, 22)), blocksheld);
  return Math.floor(withInterest);
}

window.document.addEventListener('miningtxreceived', handleMiningTXReceivedEvent, false);
function handleMiningTXReceivedEvent(e) {
  //note - making a guess here the vout is 0, 50/50 chance. could get the full transaction data from server and parse but this should do for now
  tq.addUTXO(e.detail.data.txid, 0, e.detail.data.satoshis, 0);
  //addUTXO(txid: string, vout: number, satoshis: number, height: number)
  //do proper update after 5 seconds, utxo should be availabe from electrum by then
  setTimeout(refreshPool, 5000);
}

const reloadImageEverywhere = url =>
  fetch(url, { cache: 'reload', mode: 'no-cors' })
    .then(() => document.body.querySelectorAll(`img[src='${url}']`)
      .forEach(img => img.src = url))
      
//Install app

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  // e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
});

function installApp() {
  // Show the prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }
    deferredPrompt = null;
  });
}

function linkNostrAccount(useNOS2Xifavailable=true) {
  let nostrpublickey='02'+nostrPubKeyHex;
  let element=document.getElementById('linknostraccount');
  if(element){
    nostrpublickey='02'+element.value.trim();
  }

  let legacyaddress=pubkeyhexToLegacy(nostrpublickey);
  //note legacyaddress from Nostr account is internal identifier and should not be used for anything external.
  //as mixing signature schemes may weaken security.
  let fullmessage = getLinkMessage(legacyaddress);

  sendNostrPost(fullmessage, '', '', "newpostmemorandumstatus", nostrLinkSuccessMessage, useNOS2Xifavailable);
}

function nostrLinkSuccessMessage(){
  updateStatus('Nostr Link Request submitted');
}

function showBitcloutLinkText() {
  let legacyaddress=document.getElementById('linkbitcloutaccount').value.trim();

  if (legacyaddress.startsWith("member:") || legacyaddress.startsWith("bitcoincash:")) {
    legacyaddress = membercoinToLegacy(legacyaddress);
  }else if (legacyaddress.startsWith("BC1")) {
    legacyaddress = bitcloutToLegacy(legacyaddress);
  }
  
  let fullmessage = getLinkMessage(legacyaddress);

  //let bcaddress=document.getElementById('linkbitcloutaccount').value.trim();
  document.getElementById('bitcloutlinktextarea').value=fullmessage;
  document.getElementById('bitcloutlinktext').style.display='block';
}

function getLinkMessage(legacyaddress){
  window.bitcoinjs.address.toOutputScript(legacyaddress);//this will throw error if address is not valid
  var time = parseInt(new Date().getTime() / 1000);
  let message=`membercashlink:${legacyaddress}:${pubkeyhex}:${time}`;
  let keyPair = new window.bitcoinjs.ECPair.fromWIF(privkey);
  var privateKey = keyPair.privateKey;
  var signature = window.bitcoinmessage.sign(message, privateKey, keyPair.compressed, "member.cash link request", { extraEntropy: eccryptoJs.randomBytes(32) });
  return message+':'+signature.toString('base64');
}

function switchNostrKey(){
  try{
    let hexprivkey=document.getElementById('usenostrkeyaccount').value.trim();
    //let ecpair = new window.bitcoinjs.ECPair.fromWIF(hexprivkey);
    let ecpair = new window.bitcoinjs.ECPair.fromPrivateKey(Buffer.from(hexprivkey,'hex'));
    setNostrKeys(ecpair);
    updateStatus("New Nostr Public Key:"+nostrPubKeyHex);
  }catch(err){
    updateStatus("Nostr Private Key Not Recognized"+err);
  }
  
}