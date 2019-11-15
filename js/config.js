"use strict";

var server="https://memberjs.org:8123/member.js";
//var server="http://127.0.0.1:3123/member.js";

//These are redefinitions - so no 'var' or 'let'
utxoServer = "https://rest.bitcoin.com/v2/";
txbroadcastServer = "https://memberjs.org:8123/v2/";

//Defaults
defaulttip = 1000;
oneclicktip = 0;
maxfee = 5;

mapTileProvider='https://tile.openstreetmap.org/{z}/{x}/{y}.png';

