async function chooseNostrPublicKey(useNOS2Xifavailable = true) {
    //let pubKeyToUse = nostrPubKeyHex;
    let pubKeyToUse = pubkeyhex;
    if (useNOS2Xifavailable && window.nostr) {
        pubKeyToUse = await window.nostr.getPublicKey();
    }
    return pubKeyToUse;
}

async function signAndBroadcastEvent(event, successFunction, useNOS2Xifavailable = true) {
    event.id = window.NostrTools.getEventHash(event);

    if (useNOS2Xifavailable && window.nostr) {
        try {
            event = await window.nostr.signEvent(event);
        } catch (err) {
            event.sig = window.NostrTools.signEvent(event, privkeyhex);
        }
    } else {
        event.sig = window.NostrTools.signEvent(event, privkeyhex);
    }
    broadcastEvent(event, successFunction, useNOS2Xifavailable);
    return event;
}

async function broadcastEvent(event, successFunction, useNOS2Xifavailable = true) {
    let relays = [];
    try {
        if (useNOS2Xifavailable && window.nostr) {
            let relaysObj = await window.nostr.getRelays();
            for (var key in relaysObj) {
                console.log(key);
                relays.push(key);
            }
        }
    } catch (err) {
        console.log(err);
    }

    relays.push("wss://nostr.oxtr.dev");
    relays.push("wss://nostr.fmt.wiz.biz");
    relays.push("wss://nostr-pub.wellorder.net");
    relays.push("wss://relayable.org");
    relays.push("wss://relay.nostr.band");
    relays.push("wss://hk.purplerelay.com");
    relays.push("wss://nostr.mutinywallet.com");


    sendNostrTransaction(JSON.stringify(event), null);
    for (let i = 0; i < relays.length; i++) {
        publishEventToRelay(event, relays[i], successFunction);
    }
}

var relaysGlobal = new Object();

function publishEventToRelay(event, relayaddress, successFunction) {
    let relay = relaysGlobal[relayaddress];
    if (!relay) {
        relay = window.NostrTools.relayInit(relayaddress);
        relaysGlobal[relayaddress] = relay;
        //console.log(relay.status);//3
    }
    console.log("Relay status:"+relay.status); //0 might be status during connection
    if(relay.status==3){ //no attempt at connection made yet
        relay.connect().catch(function () { console.log(`Promise Rejected ${relay.url}`); relaysGlobal[relayaddress] = null;});
        relay.on('connect', () => {
            //console.log(`connected to ${relay.url}`);
            let pub = relay.publish(event);
            pub.on('ok', () => {
                console.log(`3 ${relay.url} has accepted our event ` + event.id);
                if (successFunction) {
                    successFunction(event.id);
                }
            });
            pub.on('seen', () => {
                console.log(`3 we saw the event on ${relay.url}`);
            });
            pub.on('failed', reason => {
                console.log(`3 failed to publish to ${relay.url}: ${reason}`);
                //relay.close();
                //pub = relay.publish(event);
            });
        });

        relay.on('error', () => {
            console.log(`failed to connect to ${relay.url}`);
            relaysGlobal[relayaddress] = null;
        })
    }
    else if(relay.status==1){ //connected
        let pub = relay.publish(event);
        pub.on('ok', () => {
            console.log(`1 ${relay.url} has accepted our event ` + event.id);
            if (successFunction) {
                successFunction(event.id);
            }
        });
        pub.on('seen', () => {
            console.log(`1 we saw the event on ${relay.url}`);
        });
        pub.on('failed', reason => {
            console.log(`1 failed to publish to ${relay.url}: ${reason}`);
            //relay.close();
            //pub = relay.publish(event);
        });
    }else{
        //unknown
        console.log("Unknown relay status "+relay.status);
        //await sleep(1000);
        setTimeout(function(){publishEventToRelay(event, relayaddress, successFunction)},1000);
    }

}

async function sendNostrTransaction(payload, divForStatus) {

    if (divForStatus) {
        var statusElement = document.getElementById(divForStatus);
    }

    var url = dropdowns.txbroadcastserver + "nostr?action=relay&payload=" + encodeURIComponent(payload);
    if (statusElement) statusElement.value = "Sending Nostr Tx";
    //Fire and forget
    getJSON(url, null, null).then(async function (data) {
        console.log(data);
    });
}

async function sendNostrPost(posttext, postbody, topic, divelement, successFunction, useNOS2Xifavailable = true, eventkind = 1, geotag=null) {

    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");

    if (topic) {
        posttext += '\n' + topic;
    }
    if (postbody) {
        posttext += '\n' + postbody;
    }

    let tags=[];

    if(geotag){
        tags = [["g", geohash]];
    }

    let event = {
        kind: eventkind,
        pubkey: await chooseNostrPublicKey(useNOS2Xifavailable),
        created_at: Math.floor(Date.now() / 1000),
        tags: tags,
        content: posttext
    }

    return await signAndBroadcastEvent(event, successFunction, useNOS2Xifavailable);

}


async function nostrLikePost(origtxid) {
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let event = {
        kind: 7,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [["e", origtxid]],
        content: '+'
    }
    return await signAndBroadcastEvent(event, null);
}

async function nostrDislikePost(origtxid) {
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let event = {
        kind: 7,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [["e", origtxid]],
        content: '-'
    }
    return await signAndBroadcastEvent(event, null);
}

async function getNostrMetadata(txid, event, successFunction) {
    var theURL = dropdowns.contentserver + '?action=nostrmetadata&txid=' + txid;

    try {
        const data = await getJSON(theURL);

        if (!data) {
            serverresponses.set(id, "Error no metadata for post");
        } else {
            console.log(data);
        }

        if (data && data[1] && data[1].metadata) {
            // Root event
            if (data[1].metadata.length === 64) {
                if (event.tags[0][1] !== data[1].metadata) { // Nostrgram doesn't like an identical root/reply tag
                    let newtags = [["e", data[1].metadata, '', 'root']];
                    event.tags = newtags.concat(event.tags);
                }
            }
        }

        if (data && data[0] && data[0].metadata) {
            // Pubkey
            if (data[0].metadata.length === 64) {
                event.tags.push(["p", data[0].metadata]);
            } else if (data[0].metadata.length === 66) { // Some pubkeys stored incorrectly in db, can remove this after db rebuild
                event.tags.push(["p", data[0].metadata.slice(2)]);
            }
        }

        // Modify event
        // Insert root e before
        // Insert p after
        return await signAndBroadcastEvent(event, successFunction);
    } catch (err) {
        console.log(err);
        // Handle errors here if needed
    }
}
/*
async function getNostrMetadata(txid, event, successFunction) {
    var theURL = dropdowns.contentserver + '?action=nostrmetadata&txid=' + txid;

    getJSON(theURL).then(function (data) {
        try {
            if (!data) {
                serverresponses.set(id, "Error no metadata for post");
            } else {
                console.log(data);
            }

            if (data && data[1] && data[1].metadata) {
                //root event
                if (data[1].metadata.length == 64) {
                    if(event.tags[0][1]!=data[1].metadata){ //nostrgram doesn't like an identical root/reply tag
                        let newtags = [["e", data[1].metadata, '', 'root']];
                        event.tags = newtags.concat(event.tags);
                    }
                }
            }

            if (data && data[0] && data[0].metadata) {
                //pubkey
                if (data[0].metadata.length == 64) {
                    event.tags.push(["p", data[0].metadata]);
                } else if (data[0].metadata.length = 66) {//some pubkeys stored incorrectly in db, can remove this after db rebuild
                    event.tags.push(["p", data[0].metadata.slice(2)]);
                }
            }
        } catch (err) {
            console.log(err);
        }
        //modify event
        //insert root e before
        //insert p after
        signAndBroadcastEvent(event, successFunction);
    });
}*/

async function sendNostrReply(origtxid, replytext, divForStatus, successFunction, txid) {
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");

    let event = {
        kind: 1,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            //["e", roottxid,'','root'],
            ["e", origtxid, '', 'reply']
        ],
        //tags: [["e", txid]],
        content: replytext
    }

    //note incorrect roottxid provide currently, must update db
    return await getNostrMetadata(txid, event, successFunction);

}

async function sendNostrQuotePost(posttext, topic, origtxid, divForStatus, successFunction, txid) {
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    //note incorrect roottxid provide currently, must update db
    let event = {
        kind: 1,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            //["e", roottxid,'','root'],
            ["e", origtxid, '', 'repost']
        ],
        content: posttext
    }

    return await getNostrMetadata(txid, event, successFunction);
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
    return await signAndBroadcastEvent(event, successFunction);
}*/


async function nostrRePost(txid) {
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let event = {
        kind: 6,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [["e", txid]],
        content: ''
    }
    return await signAndBroadcastEvent(event, null);
}

/*
async function sendNostrPrivateMessage(messageRecipientpubkey, text, divForStatus, successFunction, useNOS2Xifavailable=true){
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    
    let encryptedtext;
    if(useNOS2Xifavailable, window.nostr){
        event = await window.nostr.nip04.encrypt(messageRecipientpubkey.slice(2), text);
    }else{
        encryptedtext = await nip04.encrypt(privkeyhex, messageRecipientpubkey.slice(2), text);
    }

    let event = {
        kind: 4,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [["p", messageRecipientpubkey.slice(2)]],
        content: encryptedtext
    }

    return await signAndBroadcastEvent(event, successFunction);
}

async function sendNostrPrivateMessage(publickey, text, status, successFunction){
    // on the sender side
    let ciphertext = '';
    if(window.nostr){
        event = await window.nostr.nip04.encrypt(publickey, text);
    }else{
        ciphertext = await window.NostrTools.nip04.encrypt(privkeyhex, publickey, text);
    }

    let event = {
        kind: 4,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [['p', publickey]],
        content: ciphertext
    }
    return await signAndBroadcastEvent(event, successFunction);
}  */


async function setNostrProfile() {
    var name = document.getElementById('settingsnametext').value;
    var picture = document.getElementById('settingspicurl').value;
    var about = document.getElementById('settingsprofiletext').value;
    var pagingid = document.getElementById('settingspagingidhtml').textContent;

    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let event2 = {
        kind: 2,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: "wss://relay.nostraco.in"
    };
    signAndBroadcastEvent(event2, null);

    let event = {
        kind: 0,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: JSON.stringify({
            name: name,
            about: about,
            picture: picture,
            nip05: pagingid.replace('@', '') + "@nostraco.in"
        })
    }
    return signAndBroadcastEvent(event, function () { updateStatus(`Set ${name}`) });
    
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
    return await signAndBroadcastEvent(event, function(){updateStatus(`Set ${name}`)});
}*/

/*

Mute user 	0x6d16 	address(20) 	
Unmute user 	0x6d17 	address(20)

User Rating 	0x6da5 	address(20),message(196) 
*/
// Need pin post action
//Pin post 	0x6da9 	txhash(32) 	Pin Post To Profile Implemented on Member

async function nostrPinPost(pinPostHashHex) {
    let event = {
        kind: 6019,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [['e', pinPostHashHex]],
        content: 'pinpost'
    }
    return await signAndBroadcastEvent(event, null);
}

// Follow user 	0x6d06 	address(20)
async function sendNostrFollow(followpubkey) {
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let keytype = 'p';
    if (followpubkey.length == 66) {
        keytype = 'cecdsa';
    }
    let event = {
        kind: 6006,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [[keytype, followpubkey]],
        content: 'addfollow'
    }
    return await signAndBroadcastEvent(event, null);
}

//Unfollow user 0x6d07 address(20)  
async function sendNostrUnFollow(followpubkey) {
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let keytype = 'p';
    if (followpubkey.length == 66) {
        keytype = 'cecdsa';
    }
    let event = {
        kind: 6007,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [[keytype, followpubkey]],
        content: 'unfollow'
    }
    return await signAndBroadcastEvent(event, null);
}

async function sendNostrMute(followpubkey) {
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let keytype = 'p';
    if (followpubkey.length == 66) {
        keytype = 'cecdsa';
    }
    let event = {
        kind: 6016,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [[keytype, followpubkey]],
        content: 'mute'
    }
    return await signAndBroadcastEvent(event, null);
}

async function sendNostrUnMute(followpubkey) {
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let keytype = 'p';
    if (followpubkey.length == 66) {
        keytype = 'cecdsa';
    }
    let event = {
        kind: 6017,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [[keytype, followpubkey]],
        content: 'unmute'
    }
    return await signAndBroadcastEvent(event, null);
}


async function sendNostrSub(topicHOSTILE) {
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let event = {
        kind: 6013,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: topicHOSTILE
    }
    return await signAndBroadcastEvent(event, null);
}

async function sendNostrUnSub(topicHOSTILE) {
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");
    let event = {
        kind: 6014,
        pubkey: await chooseNostrPublicKey(),
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: topicHOSTILE
    }
    return await signAndBroadcastEvent(event, null);
}

// Need rating action
async function sendNostrRating(posttext, successFunction, targetMember, useNOS2Xifavailable, rating, comment) {
    if (!window.NostrTools) await loadScript("js/lib/nostr.bundle.1.0.1.js");

    //let keytype = 'p';
    //if (targetMember.length == 66) {
    //    keytype = 'cecdsa';
    //}

    let event2 = {
        kind: 6015,
        pubkey: await chooseNostrPublicKey(useNOS2Xifavailable),
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            [keytype, targetMember],
            ["rating", ""+rating]
        ],
        content: comment
    };


    let event = {
        kind: 1,
        pubkey: await chooseNostrPublicKey(useNOS2Xifavailable),
        created_at: Math.floor(Date.now() / 1000),
        tags: [[keytype, targetMember]],
        content: posttext
    };

    signAndBroadcastEvent(event, null, useNOS2Xifavailable);
    return await signAndBroadcastEvent(event2, successFunction, useNOS2Xifavailable);

    
}

// skip for now
//async function sendBitCloutPostLong(posttext, postbody, topic, divForStatus, successFunction, imageURL=null)

