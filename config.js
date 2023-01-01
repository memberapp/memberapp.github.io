

var mutedwords = new Array();
var defaulttip = 1000;
var oneclicktip = 0;
var maxfee = 2;
var pathpermalinks = 'https://member.cash/';
var profilepicbase = 'img/profilepics/';
mapTileProvider = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
var siteTitle = 'member.cash';
var theStyle = 'feels compact';
var maxScoreToCollapseComment = 32;
var bitcoinjslib = "js/lib/bitcoincashjs-lib-5.2.0-bitcoinmessage.min.js";
//var bitcoinjslib = "js/lib/bitcoinjs-lib-5.2.0.js";
var allowBitcloutUser = true;
var defaultTag="#newmember";
var logowide="img/logos/logowide.svg";
var logoicon="img/logos/membericon.svg";
var customCSS="";
var adfrequency = 0.10; //value between 0 and 1


var nativeCoin = {
    "dust": 547, //Avoid using BCH tokens - this is actually dust+1
    "interestExponent": 22,
    "satsPerByte": 1,
    "name": 'Membercoin',
    "ticker": 'M3M',
    "opreturnsize": 4000,
    "symbol":'m̈'
}


var bytesForPost=4;
var maxlength=nativeCoin.opreturnsize-bytesForPost;
var maxhexlength=maxlength*2;

var bytesForProfile=4;
var maxprofilelength=nativeCoin.opreturnsize-bytesForPost;
var maxprofilehexlength=maxlength*2;

var bytesForReply=5+32;
var maxreplylength=nativeCoin.opreturnsize-bytesForReply;
var maxreplyhexlength=maxreplylength*2;

var bytesForRating=5+20;
var maxratinglength=nativeCoin.opreturnsize-bytesForRating;
var maxratinghexlength=maxratinglength*2;


//var maxhexlength=368; //memo - 184*2, doge 76*2

var whitespacebreak=20; //how many chars to go back to look for whitespace to break


//These should probably all go in a single config object
var settings = {
    "showyoutube": "true",
    "showimgur": "true",
    "showtwitter": "true",
    "showlbry": "true",
    "showbitclout": "true",
    "shownonameposts": "false",
    "shownopicposts": "true",
    "mutenostr" : "false",
    "mutebitclout" : "false",
};
var dropdowns = {
    "contentserver": "https://member.cash/v2/member.js",
    "txbroadcastserver": "https://member.cash/v2/",
    "mcutxoserver": "https://member.cash/v2/",
    "imageuploadserver": "https://member.cash/v2/",
    "languageselector": "en",
    "contentnetwork": -1
};
var numbers = {
    "defaulttip": 1000,
    "oneclicktip": 0,
    "maxfee": 2,
    "results": 25,
    "usdrate": .50
}

//Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'UA-243798555-1');