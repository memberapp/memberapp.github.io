"use strict";

function getAndPopulateCommunityRatings(qaddress) {

    document.getElementById('community').innerHTML=communityHTML;
    document.getElementById('communityratingtable').innerHTML = document.getElementById("loading").innerHTML;

    var page = 'communityratingtable';
    var theURL = dropdowns.contentserver + '?action=rated&qaddress=' + qaddress + '&address=' + pubkey;
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            //contents = contents + ratingAndReasonHTML(data[i]);
            contents = contents + ratingAndReasonNew(data[i].name, data[i].address, data[i].rateename, data[i].rates, data[i].rating, data[i].reason, 'comrating', data[i].trxid);
        }
        document.getElementById(page).innerHTML = contents;

        addDynamicHTMLElements();
        addStarRatings('comrating');
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}

function getAndPopulateRatings(qaddress) {
    document.getElementById('anchorratings').innerHTML=anchorratingsHTML;
    document.getElementById('memberratingtable').innerHTML = document.getElementById("loading").innerHTML;

    var page = 'memberratingtable';
    var theURL = dropdowns.contentserver + '?action=ratings&qaddress=' + qaddress + '&address=' + pubkey;
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            //contents = contents + ratingAndReason2HTML(data[i]);
            contents = contents + ratingAndReasonNew(data[i].ratername, data[i].rateraddress, data[i].name, data[i].address, data[i].rating, data[i].reason, 'memrating', data[i].trxid);
        }
        document.getElementById(page).innerHTML = contents;
        addDynamicHTMLElements();
        addStarRatings('memrating');
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}


function getDataCommonToSettingsAndMember(qaddress, pre) {
    
    document.getElementById(pre+'anchor').innerHTML = document.getElementById("loading").innerHTML;

    var theURL = dropdowns.contentserver + '?action=settings&qaddress=' + qaddress + '&address=' + pubkey;
    getJSON(theURL).then(function (data) {

        //Note, data may not contain any rows, for new or unknown users.
        var jdenticonname = "";
        var picurl;
        
        var obj = {
            address:qaddress,
            cashaddress:new BITBOX.Address().toCashAddress(qaddress),
            followers:0,
            following:0,
            muters:0,
            muting:0,
            handle:"",
            profile:"",
            pagingid:"",
            profilepiclargehtml:"",
        };
        
        if (data[0]) {
            obj.followers = Number(data[0].followers);
            obj.following = Number(data[0].following);
            obj.muters = Number(data[0].blockers);
            obj.muting = Number(data[0].blocking);
            obj.handle = ds(data[0].name);
            obj.handlefunction = unicodeEscape(data[0].name);
            obj.profile = ds(data[0].profile);
            obj.publickey = san(data[0].publickey);
            obj.pagingid=ds(data[0].pagingid);
            picurl=data[0].picurl;
            //document.getElementById(pre + 'nametext').innerHTML = escapeHTML(data[0].name) + sendEncryptedMessageHTML(qaddress, data[0].name, data[0].publickey);
            //document.getElementById(pre + 'profiletext').innerHTML = escapeHTML(data[0].profile);
            //document.getElementById(pre + 'pagingid').innerHTML = escapeHTML("@" + data[0].pagingid);
            document.title = "@" + data[0].pagingid + " (" + data[0].name + ") at " + siteTitle;
            //jdenticonname = data[0].name;
            //img/profilepics/`+san(address)+`128x128.jpg
        }

        if (data.length < 1 || Number(data[0].isfollowing) == 0) {
            obj.followbuttonhtml = clickActionNamedHTML("follow", qaddress, "follow");
        } else {
            obj.followbuttonhtml = clickActionNamedHTML("unfollow", qaddress, "unfollow");
        }
        
        if (data.length < 1 || Number(data[0].isblocked) == 0) {
            obj.mutebuttonhtml = clickActionNamedHTML("mute", qaddress, "mute");
        } else {
            obj.mutebuttonhtml = clickActionNamedHTML("unmute", qaddress, "unmute");
        }

         
        if (picurl) {
            obj.profilepiclargehtml=`<img id="settingspicturelarge" class="settingspicturelarge" src="`+profilepicbase + san(qaddress) + `.640x640.jpg" style="display: block;" width="640" height="640">`;
        }

        //var jdenticon = `<svg width="20" height="20" class="jdenticonlarge" data-jdenticon-value="` + san(qaddress) + `"></svg>`;

        if (pre == "settings") {
            obj.privatekey = privkey;
            obj.seedphrase = (mnemonic == "" ? "" : "Seed Phrase: " + mnemonic + "<br/>") + "Compressed Private Key: " + privkey;
        }

        document.getElementById(pre + 'anchor').innerHTML = templateReplace(pages[pre], obj);
    
        
        if (pre == "settings") {
            
            //try { document.getElementById('privatekey').innerHTML = privatekeyClickToShowHTML(); } catch (err) { }
        
            updateSettings();
            document.getElementById(pre + 'nametextbutton').disabled = true;
            document.getElementById(pre + 'profiletextbutton').disabled = true;
            document.getElementById(pre + 'picbutton').disabled = true;
            //After 3 ratings, members cannot change their handle
            if (data.length>0 && data[0].ratingnumber>2){
                document.getElementById(pre + 'nametext').disabled = true;
            }
        }



        //This condition checks that the user being viewed is not the logged in user
        if (pre == "member" && qaddress == pubkey) {
            document.getElementById(pre + 'ratinggroup').style.display = "none";
        } else if (pre == "member") {

            document.getElementById(pre + 'ratinggroup').style.display = "block";
            document.getElementById(pre + 'ratingcomment').innerHTML = getRatingComment(qaddress, data);
            document.getElementById(pre + 'ratingcommentinputbox' + qaddress).onchange = function () { starRating1.setRating(0); };

            var ratingScore = 0;
            if (data.length > 0) {
                ratingScore = Number(data[0].rating);
            }
            document.getElementById('memberrating').innerHTML = `<div class="starrating"><div data-ratingsize="20" data-ratingaddress="` + san(qaddress) + `" data-ratingraw="` + ratingScore + `" id="memberrating` + qaddress + `"></div></div>`;
            var theElement = document.getElementById(`memberrating` + qaddress);
            var starRating1 = addSingleStarsRating(theElement);
        }
        
        jdenticon();
    }, function (status) { //error detection....
        showErrorMessage(status, null, theURL);
    });
}


function getAndPopulateMember(qaddress) {
    //document.getElementById('memberlegacyformat').innerHTML = qaddress;
    //document.getElementById('memberqrformat').innerHTML = `<a id="memberqrclicktoshow" onclick="document.getElementById('memberqrchart').style.display='block'; new QRCode(document.getElementById('memberqrchart'), '`+memberqpubkey+`'); document.getElementById('memberqrclicktoshow').style.display='none';">Click To Show</a><div id="memberqrchart"></div>`;

    getDataCommonToSettingsAndMember(qaddress, "member");
    getAndPopulateCommunityRatings(qaddress);
    getAndPopulateRatings(qaddress);
    if (pubkey) {
        getAndPopulateTrustGraph(pubkey, qaddress);
    } else {
        document.getElementById('trustgraph').style.display = "none";
    }
}

function getAndPopulateSettings() {

    getDataCommonToSettingsAndMember(pubkey, "settings");
}

function updateSettings(){

    //These may already be switched to qrcodes, so try/catch necessary
    //try { document.getElementById('legacyformat').innerHTML = pubkey; } catch (err) { }
    try { document.getElementById('lowfundsaddress').innerHTML = qpubkey; } catch (err) { }
    
    var storedmutedwords = localStorageGet(localStorageSafe, "mutedwords");
    if (storedmutedwords != undefined && storedmutedwords != null) {
        document.getElementById('mutedwords').value = storedmutedwords;
        mutedwords = storedmutedwords.split(',');
    }

    //numbers
    for (var key in numbers) {
        if (key == 'defaulttip') continue;
        var theSetting = localStorageGet(localStorageSafe, key);
        if (theSetting != undefined && theSetting != null) {
            document.getElementById(key).value = theSetting;
            numbers[key] = Number(theSetting);
        } else {
            document.getElementById(key).value = numbers[key];
        }
    }

    //Checkboxes
    for (var key in settings) {
        var theSetting = localStorageGet(localStorageSafe, key);

        if (theSetting != undefined && theSetting != null) {
            document.getElementById(key).checked = Boolean(theSetting == "true");
            settings[key] = theSetting;
        } else {
            document.getElementById(key).checked = Boolean(settings[key] == "true");
        }
    }

    //Select boxes
    for (var key in dropdowns) {
        var theSetting = localStorageGet(localStorageSafe, key);
        if (theSetting != null) {
            dropdowns[key] = theSetting;
        } else {
            theSetting = dropdowns[key];
        }
        var selector = document.getElementById(key);

        var opts = selector.options;
        for (var i = 0; i < opts.length; i++) {
            if (opts[i].value == theSetting) {
                selector.selectedIndex = i;
            }
        }
    }

    //Make sure users are not on the old server
    if (dropdowns.contentserver == "https://memberjs.org:8123/member.js") {
        dropdowns.contentserver = "https://member.cash/v2/member.js";
    }
    if (dropdowns.txbroadcastserver == "https://memberjs.org:8123/member.js") {
        dropdowns.txbroadcastserver = "https://member.cash/v2/";
    }
}

function updateSettingsCheckbox(settingsName) {
    settings[settingsName] = "" + document.getElementById(settingsName).checked;
    localStorageSet(localStorageSafe, settingsName, settings[settingsName]);
    updateStatus("Updated. "+settings[settingsName]);
}

function updateSettingsDropdown(settingsName) {
    var selector = document.getElementById(settingsName);
    dropdowns[settingsName] = selector.options[selector.selectedIndex].value;
    localStorageSet(localStorageSafe, settingsName, dropdowns[settingsName]);
    if (settingsName == "currencydisplay") {
        tq.updateBalance(pubkey);
    }
    updateStatus("Updated. "+dropdowns[settingsName]);
}

function updateSettingsNumber(settingsName) {
    numbers[settingsName] = Number(document.getElementById(settingsName).value);

    //No numbers are less than 2 except oneclicktip, which will be reset below
    if (numbers[settingsName] < 2) {
        numbers[settingsName] = 2;
    }

    if (settingsName == "results" && numbers[settingsName] > 100) {
        numbers[settingsName] = 100;
    }
    if (settingsName == "maxfee" && numbers[settingsName] < 2) {
        numbers[settingsName] = 2;
    }
    if (settingsName == "oneclicktip" && numbers[settingsName] < 547) {
        numbers[settingsName] = 0;
    }
    localStorageSet(localStorageSafe, settingsName, numbers[settingsName]);
    updateStatus("Updated. "+numbers[settingsName]);
}

function showQRCode(spanid, size) {
    var addressToQR = document.getElementById(spanid).innerHTML;
    document.getElementById(spanid + "div").innerHTML = "";
    new QRCode(document.getElementById(spanid + "div"),
        {
            text: addressToQR,
            width: size,
            height: size,
        });
    //document.getElementById('qrclicktoshow').style.display='none';
}



function rateCallbackAction(rating, that, ratingtext) {
    if (ratingtext === undefined) {
        ratingtext = "";
    }
    var qaddress = that.theAddress;
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
    if (rateUser(qaddress, transposed, ratingtext)) {
        that.setRating(rating);
    }
}

function updatemutedwords() {

    var commasep = document.getElementById('mutedwords').value;
    mutedwords = commasep.split(',');
    for (var i = 0; i < mutedwords.length; i++) {
        mutedwords[i] = mutedwords[i].trim()
    }
    localStorageSet(localStorageSafe, "mutedwords", mutedwords);


}

function getAndPopulateFB(page,qaddress){
    document.getElementById(page).innerHTML = fbHTML[page];
    show(page);
    var theURL=dropdowns.contentserver + '?action='+page+'&qaddress=' + qaddress + '&address=' + pubkey;
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + getMembersWithRatingHTML(i, page, data[i], '', false);
        }

        document.getElementById(page+'table').innerHTML = contents;
        addDynamicHTMLElements(data);
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}



