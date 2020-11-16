
var mutedwords = new Array();
var defaulttip = 1000;
var oneclicktip = 0;
var maxfee = 2;
var pathpermalinks = 'https://member.cash/';
var profilepicbase = 'img/profilepics/';
mapTileProvider = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
var siteTitle = 'Ember';
var theStyle = 'feels compact';

//These should probably all go in a single config object
var settings = {
    "showyoutube": "true",
    "showimgur": "true",
    "showtwitter": "true"
};
var dropdowns = {
    "contentserver": "http://localhost:3123/v2/member.js",
    "txbroadcastserver": "http://localhost:3123/v2/",
    "utxoserver": "http://localhost:3123/v2/",
    "currencydisplay": "USD",
    "languageselector": "en"
};
var numbers = {
    "defaulttip": 1000,
    "oneclicktip": 0,
    "maxfee": 2,
    "results": 25,
    "usdrate": 0
}
