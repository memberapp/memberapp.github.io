async function chooseNostrPublicKey(useNOS2Xifavailable=true){
    let pubKeyToUse=nostrPubKeyHex;
    if(useNOS2Xifavailable && window.nostr){
        pubKeyToUse=await window.nostr.getPublicKey();
    }
    return pubKeyToUse;
}

async function signAndBroadcastEvent(event,successFunction,useNOS2Xifavailable=true){
    event.id = window.NostrTools.getEventHash(event);
    
    if(useNOS2Xifavailable && window.nostr){
        try{
            event = await window.nostr.signEvent(event);
        }catch(err){
            event.sig = window.NostrTools.signEvent(event, nostrPrivKeyHex);
        }
    }else{
        event.sig = window.NostrTools.signEvent(event, nostrPrivKeyHex);
    }
    broadcastEvent(event,successFunction,useNOS2Xifavailable);
    return event;
}

async function broadcastEvent(event,successFunction,useNOS2Xifavailable=true){
    let relays = [];
    try{
        if(useNOS2Xifavailable && window.nostr){
        let relaysObj=await window.nostr.getRelays();
            for (var key in relaysObj) {
                console.log(key);
                relays.push(key);
            }
        }
    }catch(err){
        console.log(err);
    }

    relays.push("wss://nostr.rocks");
    relays.push("wss://relay.damus.io");
    relays.push("wss://nostr.openchain.fr");
    relays.push("wss://relay.nostr.ch");
    relays.push("wss://nostr-pub.wellorder.net");
    relays.push("wss://relay.damus.io");
    relays.push("wss://nostr-relay.wlvs.space");
    relays.push("wss://nostr.fmt.wiz.biz");
    relays.push("wss://relay.nostr.bg");
    relays.push("wss://nostr.oxtr.dev");
    relays.push("wss://nostr.v0l.io");
    relays.push("wss://nostr-2.zebedee.cloud");
    /*
    relays.push("wss://relay.nostr.info");
    relays.push("wss://nostr-relay.wlvs.space");
    relays.push("wss://nostr-relay.untethr.me");
    relays.push("wss://nostr.onsats.org");
    relays.push("wss://nostr.semisol.dev");
    relays.push("wss://nostr-pub.semisol.dev");
    relays.push("wss://nostr-verified.wellorder.net");
    relays.push("wss://nostr.drss.io");
    relays.push("wss://nostr.delo.software");
    relays.push("wss://relay.minds.com/nostr/v1/ws");
    relays.push("wss://nostr.zaprite.io");
    relays.push("wss://nostr.oxtr.dev");
    relays.push("wss://nostr.ono.re");
    relays.push("wss://relay.grunch.dev");
    relays.push("wss://nostr.sandwich.farm");
    relays.push("wss://nostr.fmt.wiz.biz");	
*/
    sendNostrTransaction(JSON.stringify(event), null);
    for(let i=0;i<relays.length;i++){
        publishEventToRelay(event,relays[i],successFunction);    
    }
}

function publishEventToRelay(event, relayaddress,successFunction){
    const relay = window.NostrTools.relayInit(relayaddress);
    relay.connect();

    relay.on('connect', () => {
        console.log(`connected to ${relay.url}`);
        let pub = relay.publish(event);
        pub.on('ok', () => {
            console.log(`${relay.url} has accepted our event`);
            if(successFunction){
                successFunction(event.id);
            }
            relay.close();
        });
        pub.on('seen', () => {
            console.log(`we saw the event on ${relay.url}`);
            relay.close();
        });
        pub.on('failed', reason => {
            console.log(`failed to publish to ${relay.url}: ${reason}`);
            relay.close();
            //pub = relay.publish(event);
        });
    });

      relay.on('error', () => {
        console.log(`failed to connect to ${relay.url}`)
      })
}

async function sendNostrTransaction(payload, divForStatus) {

    if (divForStatus) {
      var statusElement = document.getElementById(divForStatus);
    }
    
    var url = dropdowns.txbroadcastserver + "nostr?action=relay&payload=" + encodeURIComponent(payload);
    if (statusElement) statusElement.value = "Sending Nostr Tx";
    //Fire and forget
    getJSON(url, null,null).then(async function (data) {
        console.log(data);
      });
    }

async function sendNostrPost(posttext, postbody, topic, divelement, successFunction, useNOS2Xifavailable=true) {

    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");

    if (topic) {
        posttext += '\n' + topic;
    }
    if (postbody) {
        posttext += '\n' + postbody;
    }

    let event = {
        kind: 1,
        pubkey: await chooseNostrPublicKey(useNOS2Xifavailable),
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: posttext
    }

    signAndBroadcastEvent(event, successFunction, useNOS2Xifavailable);

}


async function nostrLikePost(origtxid){
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let event = {
        kind: 7,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [["e", origtxid]],
        content: '+'
    }
    signAndBroadcastEvent(event, null);
}

async function sendNostrReply(txid, replytext, divForStatus, successFunction, roottxid){
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");

    //note incorrect roottxid provide currently, must update db
    let event = {
        kind: 1,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            //["e", roottxid,'','root'],
            ["e", txid,'','reply']
        ],
        //tags: [["e", txid]],
        content: replytext
    }

    signAndBroadcastEvent(event, successFunction);
}

async function sendNostrQuotePost(posttext, topic, txid, divForStatus, successFunction, roottxid){
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    //note incorrect roottxid provide currently, must update db
    let event = {
        kind: 1,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            //["e", roottxid,'','root'],
            ["e", txid, '', 'repost']
        ],
        content: posttext
    }
    signAndBroadcastEvent(event, successFunction);
}


// Need quote post action
// async function sendBitCloutQuotePost(posttext, topic, txid, divForStatus, successFunction, network, imageURL=null) 
// Quote Repost 	0x6d0f 	txhash(32), topic(variable), message(179 - topic length) 	Memo/Member Joint Proposal
/*async function sendNostrQuotePost(posttext, topic, txid, divForStatus, successFunction){
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let event = {
        kind: 6015,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [["e", txid]],
        content: posttext
    }
    signAndBroadcastEvent(event, successFunction);
}*/


async function nostrRePost(txid){
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let event = {
        kind: 6,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [["e", txid]],
        content: ''
    }
    signAndBroadcastEvent(event, null);
}
 
/*
async function sendNostrPrivateMessage(messageRecipientpubkey, text, divForStatus, successFunction, useNOS2Xifavailable=true){
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    
    let encryptedtext;
    if(useNOS2Xifavailable, window.nostr){
        event = await window.nostr.nip04.encrypt(messageRecipientpubkey.slice(2), text);
    }else{
        encryptedtext = await nip04.encrypt(nostrPrivKeyHex, messageRecipientpubkey.slice(2), text);
    }

    let event = {
        kind: 4,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [["p", messageRecipientpubkey.slice(2)]],
        content: encryptedtext
    }

    signAndBroadcastEvent(event, successFunction);
}

async function sendNostrPrivateMessage(publickey, text, status, successFunction){
    // on the sender side
    let ciphertext = '';
    if(window.nostr){
        event = await window.nostr.nip04.encrypt(publickey, text);
    }else{
        ciphertext = await window.NostrTools.nip04.encrypt(nostrPrivKeyHex, publickey, text);
    }

    let event = {
        kind: 4,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [['p', publickey]],
        content: ciphertext
    }
    signAndBroadcastEvent(event, successFunction);
}  */


async function setNostrProfile(){
    var name = document.getElementById('settingsnametext').value;
    var picture = document.getElementById('settingspic').value;
    var about = document.getElementById('settingsprofiletext').value;

    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let event = {
        kind: 0,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: JSON.stringify({
            name: name,
            about: about,
            picture: picture
        })
    }
    signAndBroadcastEvent(event, function(){updateStatus(`Set ${name}`)});
}

/*
async function setNostrProfile(name,value){
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let event = {
        kind: 0,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: {}
    }
    event.content[name]=value;
    signAndBroadcastEvent(event, function(){updateStatus(`Set ${name}`)});
}*/

/*

Mute user 	0x6d16 	address(20) 	
Unmute user 	0x6d17 	address(20)

User Rating 	0x6da5 	address(20),message(196) 
*/
// Need pin post action
//Pin post 	0x6da9 	txhash(32) 	Pin Post To Profile Implemented on Member
// bitCloutPinPost(pinPostHashHex, pubkey)

// Follow user 	0x6d06 	address(20)
async function sendNostrFollow(followpubkey){
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let keytype='p';
    if(followpubkey.length==66){
        keytype='cecdsa';
    }
    let event = {
        kind: 6006,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [[keytype, followpubkey]],
        content: 'addfollow'
    }
    signAndBroadcastEvent(event, null);
}

//Unfollow user 0x6d07 address(20)  
async function sendNostrUnFollow(followpubkey){
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let keytype='p';
    if(followpubkey.length==66){
        keytype='cecdsa';
    }
    let event = {
        kind: 6007,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [[keytype, followpubkey]],
        content: 'unfollow'
    }
    signAndBroadcastEvent(event, null);
}






// Need unsubscribe action
// async function sendBitCloutUnSub(topicHOSTILE)
// Need subscribe action
// async function sendBitCloutSub(topicHOSTILE)
/*
async function sendNostrSub(topicHOSTILE){
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let event = {
        kind: 6013,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: topicHOSTILE
    }
    signAndBroadcastEvent(event, null);
}

async function sendNostrUnSub(topicHOSTILE){
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let event = {
        kind: 6014,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: topicHOSTILE
    }
    signAndBroadcastEvent(event, null);
}*/

// Need mute action
// async function sendBitCloutMute(followpubkey)
  
// Need unmute action
// async function sendBitCloutUnMute(followpubkey)
  
// Need rating action
// async function sendBitCloutRating(posttext, topic, divForStatus, successFunction, postExtraData)
  
// skip for now
//async function sendBitCloutPostLong(posttext, postbody, topic, divForStatus, successFunction, imageURL=null)

