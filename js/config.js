"use strict";
var server="https://memberjs.org/dev/member.php";
var graphserver="https://memberjs.org/dev/trustgraph.php";

utxoServer = "https://rest.bitcoin.com/v2/";
txbroadcastServer = "https://memberjs.org:8123/v2/";
//const txbroadcastServer ="http://127.0.0.1:3000/v2/";

//Defaults
defaulttip = 1000;
oneclicktip = 0;
maxfee = 5;

mapTileProvider='https://tile.openstreetmap.org/{z}/{x}/{y}.png';
