"use strict";

function getAndPopulateCommunityRatings(qaddress) {

    document.getElementById('community').innerHTML = communityHTML;
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

        addStarRatings('comrating');
        addDynamicHTMLElements();
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}

function getAndPopulateRatings(qaddress) {
    document.getElementById('anchorratings').innerHTML = anchorratingsHTML;
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
        addStarRatings('memrating');
        addDynamicHTMLElements();
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}


function getDataMember(qaddress) {
    document.getElementById('mcidmemberanchor').innerHTML = document.getElementById("loading").innerHTML;
    var theURL = dropdowns.contentserver + '?action=settings&address=' + pubkey + '&qaddress=' + qaddress;
    getJSON(theURL).then(function (data) {
        if (data[0] && !data[0].address) data[0].address = data[0].nameaddress; //sometimes address is empty because the user hasn't made a post yet.
        if (data) {
            getDataMemberFinally(data);
        }
    }, function (status) { //error detection....
        showErrorMessage(status, null, theURL);
    });
}

function getDataSettings(qaddress, cashaddress) {

    //document.getElementById('settingsanchor').innerHTML = document.getElementById("loading").innerHTML;

    var theURL = dropdowns.contentserver + '?action=settings&address=' + pubkey + '&qaddress=' + qaddress;
    getJSON(theURL).then(function (data) {
        if (data[0] && !data[0].address) data[0].address = data[0].nameaddress; //sometimes address is empty because the user hasn't made a post yet.
        try {
            getDataSettingsFinally(qaddress, cashaddress, data);
        } catch (error) {
            console.log("Setting settings failed");
            console.log(error);
        }

    }, function (status) { //error detection....
        //If this fails, we still want to show settings page, so user can change server etc
        getDataSettingsFinally(qaddress, cashaddress, null);
        showErrorMessage(status, null, theURL);
    });
}

function getPicURL(picurl, profilepicbase, qaddress, hivename) {
    var pictype = '.jpg';
    picurl = picurl + "";
    /*if (picurl && picurl.toLowerCase().endsWith('.png') && !hivename) {
        //some bch pics are stored as .png
        pictype = '.png';
    }
    //not true anymore. also will transition all profile pics to webp
    */
    if (hivename) {
        return profilepicbase + sane(hivename) + `.128x128` + pictype;
    }
    return profilepicbase + san(qaddress) + `.128x128` + pictype;
}

async function getDataMemberFinally(data) {

    let qaddress = null;
    if (data[0] && data[0].bitcoinaddress) {
        qaddress = data[0].bitcoinaddress;
    }

    let cashaddress = null;
    if (qaddress) {
        cashaddress = legacyToNativeCoin(qaddress);
    }

    //Note, data may not contain any rows, for new or unknown users.

    var obj = {
        address: qaddress,
        cashaddress: cashaddress,
        followers: 0,
        following: 0,
        muters: 0,
        muting: 0,
        handle: "",
        profile: "",
        pagingid: "",
        profilepiclargehtml: "",
        publickey: "",
    };

    if (data && data[0]) {
        obj.followers = Number(data[0].followers);
        obj.following = Number(data[0].following);
        obj.muters = Number(data[0].blockers);
        obj.muting = Number(data[0].blocking);
        obj.handle = ds(data[0].name);
        obj.handlefunction = unicodeEscape(data[0].name);
        obj.profile = data[0].profile;
        obj.publickey = san(data[0].publickey);
        obj.pagingid = ds(data[0].pagingid);
        obj.picurl = ds(data[0].picurl + "");
        obj.tokens = Number(data[0].tokens);
        obj.nametime = Number(data[0].nametime);
        obj.rating = Number(data[0].rating);

        let theRatingRound = outOfFive(Number(data[0].sysrating));
        obj.membrain = theRatingRound + "/5";

        //document.title = "@" + data[0].pagingid + " (" + data[0].name + ") at " + siteTitle;
    }

    if (data && (data.length < 1 || Number(data[0].isfollowing) == 0)) {
        obj.followbuttonhtml = clickActionNamedHTML("follow", qaddress, "follow", obj.publickey);
    } else {
        obj.followbuttonhtml = clickActionNamedHTML("unfollow", qaddress, "unfollow", obj.publickey);
    }

    if (data && (data.length < 1 || Number(data[0].isblocked) == 0)) {
        obj.mutebuttonhtml = clickActionNamedHTML("mute", qaddress, "mute", obj.publickey);
    } else {
        obj.mutebuttonhtml = clickActionNamedHTML("unmute", qaddress, "unmute", obj.publickey);
    }


    if (obj.picurl) {
        let picstem = sane(data[0].address);
        if (data[0].hivename) { picstem = sane(data[0].hivename); }
        obj.profilepiclargehtml = getProfilePicLargeHTML(profilepicbase + picstem + `.640x640.jpg`);
    }

    if (data && data[0] && !data[0].hivename && data[0].publickey) { //don't show bcaddress for hivename - publickey is not correct yet
        var bcaddress = await pubkeyToBCaddress(data[0].publickey);
        obj.bcaddress = bcaddress;
    }


    obj.profile = getSafeMessage(obj.profile, 'profile', false);
    if (data && data[0]) {
        //data[0].rname=data[0].name;
        let member = MemberFromData(data[0],'','???mainratingid');
        //obj.pinnedpostHTML = getHTMLForPostHTML(data[0].rtxid, data[0].raddress, data[0].name, data[0].rlikes, data[0].rdislikes, data[0].rtips, data[0].rfirstseen, data[0].rmessage, data[0].rroottxid, data[0].rtopic, data[0].rreplies, data[0].rgeohash, 'memberpage', '???mainratingid', data[0].likedtxid, data[0].likeordislike, data[0].rrepliesroot, data[0].rating, 0, data[0].rrepostcount, data[0].repostidtxid, data[0].pagingid, data[0].publickey, data[0].picurl, data[0].tokens, data[0].followers, data[0].following, data[0].blockers, data[0].blocking, data[0].profile, data[0].isfollowing, data[0].nametime, '', data[0].lastactive, false, data[0].sysrating, data[0].rsourcenetwork, data[0].hivename, data[0].hivelink, data[0].bitcoinaddress);
        obj.pinnedpostHTML = getHTMLForPostHTML3(member, data[0], 'r', 'memberpage', 0, '', false);
    }

    document.getElementById('mcidmemberanchor').innerHTML = templateReplace(pages.member, obj);

    if (data && data[0] && data[0].hivename) {
        document.getElementById('memberprofileactions').style.display = "none"; //no hive actions for now
        document.getElementById('walletaddress').style.display = "none"; //no hive actions for now
        document.getElementById('walletbcaddress').style.display = "none"; //no hive actions for now

    }

    //This condition checks that the user being viewed is not the logged in user
    if (qaddress == pubkey) {
        document.getElementById('memberratinggroup').style.display = "none";
    } else {

        document.getElementById('memberratinggroup').style.display = "block";
        document.getElementById('memberratingcomment').innerHTML = getRatingComment(data[0]);
        document.getElementById('memberratingcommentinputbox' + data[0].bitcoinaddress).onchange = function () { starRating1.setRating(0); };

        var ratingScore = 0;
        if (data.length > 0) {
            ratingScore = Number(data[0].rating);
        }
        document.getElementById('memberrating').innerHTML = getMemberRatingHTML(data[0].bitcoinaddress, ratingScore, data[0].pagingid);

        var theElement = document.getElementById(`memberrating` + data[0].bitcoinaddress);
        var starRating1 = addSingleStarsRating(theElement);
        setPageTitleRaw("@" + data[0].pagingid);

    }

    addDynamicHTMLElements();
}

async function getDataSettingsFinally(qaddress, cashaddress, data) {

    //Set the headerbar pic
    if (data && data[0]) {
        profilepic = `<svg class="jdenticon" width="20" height="20" data-jdenticon-value="` + san(data[0].address) + `"></svg>`;
        var picurl = getPicURL(data[0].picurl, profilepicbase, data[0].address, data[0].hivename);
        document.getElementById('profilepicheader').innerHTML = `<img alt="Profile pic" class="profilepicheaderimg" width="128" height="128" src="` + picurl + `">`;
        profilepic = `<img alt="Profile Picture" class="memberpicturesmallpost" width='30' height='30' src='` + picurl + `'/>`;
        try {
            document.getElementById('newpostprofilepic').innerHTML = profilepic;
        } catch (err) {
            console.log("error newpostprofilepic");
        }
        reloadImageEverywhere(picurl);
    }



    if (qaddress && !cashaddress) {
        {
            legacyToNativeCoin(qaddress);
        }
    }

    //Note, data may not contain any rows, for new or unknown users.

    var obj = {
        address: qaddress,
        cashaddress: cashaddress,
        followers: 0,
        following: 0,
        muters: 0,
        muting: 0,
        handle: "",
        profile: "",
        pagingid: "",
        profilepiclargehtml: "",
        publickey: "",
        fileuploadurl: dropdowns.imageuploadserver + "uploadfile"
    };

    if (data && data[0]) {
        obj.addressnumber = san(data[0].address);
        obj.followers = Number(data[0].followers);
        obj.following = Number(data[0].following);
        obj.muters = Number(data[0].blockers);
        obj.muting = Number(data[0].blocking);
        obj.handle = ds(data[0].name);
        obj.handlefunction = unicodeEscape(data[0].name);
        obj.profile = data[0].profile;
        obj.publickey = san(data[0].publickey);
        obj.pagingid = ds(data[0].pagingid);
        obj.picurl = ds(data[0].picurl + "");
        obj.tokens = Number(data[0].tokens);
        obj.nametime = Number(data[0].nametime);
        obj.rating = Number(data[0].rating);


        let theRatingRound = outOfFive(Number(data[0].sysrating));
        obj.membrain = theRatingRound + "/5";

        //document.title = "@" + data[0].pagingid + " (" + data[0].name + ") at " + siteTitle;
    }


    if (obj.picurl) {
        let picstem = sane(data[0].address);
        if (data[0].hivename) { picstem = sane(data[0].hivename); }
        obj.profilepiclargehtml = getProfilePicLargeHTML(profilepicbase + picstem + `.640x640.jpg`);
    }


    obj.privatekey = privkey;
    obj.seedphrase = (mnemonic == "" ? "" : getSafeTranslation('seedphrase', "Seed Phrase:") + " " + mnemonic + "<br/>") + getSafeTranslation('cpk', "Compressed Private Key:") + " " + privkey;



    if (data && data[0] && data[0].publickey) {
        var bcaddress = await pubkeyToBCaddress(data[0].publickey);
        obj.bcaddress = bcaddress;
    } else if (qaddress == pubkey && pubkeyhex) {
        var bcaddress = await pubkeyToBCaddress(pubkeyhex);
        obj.bcaddress = bcaddress;
    }
    obj.version = version;
    obj.dust=nativeCoin.dust;
    obj.maxprofilelength=maxprofilelength;
    document.getElementById('settingsanchor').innerHTML = templateReplace(pages.settings, obj);
    //reloadImageEverywhere(obj.profilepiclargehtml);


    updateSettings();
    document.getElementById('settingsnametextbutton').disabled = true;
    document.getElementById('settingsprofiletextbutton').disabled = true;
    document.getElementById('settingspicbutton').disabled = true;
    //After 9 ratings, members cannot change their handle
    //if (data && data[0] && data[0].ratingnumber > 9) { note - ratingnumber is not being returned in data
    //    document.getElementById('settingsnametext').disabled = true;
    //}

    if (qaddress) {
        document.getElementById('settingsloggedin').style.display = "block";
    } else {
        document.getElementById('settingsloggedin').style.display = "none";
    }

    addDynamicHTMLElements();

}

async function populateTools() {

    var bcaddress = await pubkeyToBCaddress(pubkeyhex);
    var obj = {
        address: pubkey,
        cashaddress: legacyToNativeCoin(pubkey),
        bcaddress: bcaddress,
        ticker: nativeCoin.ticker
    };

    obj.privatekey = privkey;
    obj.seedphrase = (mnemonic == "" ? "" : getSafeTranslation('seedphrase', "Seed Phrase:") + " " + mnemonic + "<br/>") + getSafeTranslation('cpk', "Compressed Private Key:") + " " + privkey;

    document.getElementById('toolsanchor').innerHTML = templateReplace(walletanchorHTML, obj);



}


async function getAndPopulateSettings() {
    let cashaddr;
    try {
        cashaddr = legacyToNativeCoin(pubkey);
    } catch (err) {
        console.log(err);
    }
    getDataSettings(pubkey, cashaddr);
}

function updateSettings() {



    //These may already be switched to qrcodes, so try/catch necessary
    //try { document.getElementById('lowfundsaddress').innerHTML = qpubkey; } catch (err) { }

    var storedmutedwords = localStorageGet(localStorageSafe, "mutedwords");
    if (storedmutedwords != undefined && storedmutedwords != null) {
        document.getElementById('mutedwords').value = storedmutedwords;
        mutedwords = storedmutedwords.split(',');
    }

    //numbers
    for (var key in numbers) {
        if (key == 'defaulttip') continue;
        var theSetting = localStorageGet(localStorageSafe, key);
        try {
            if (theSetting != undefined && theSetting != null) {
                document.getElementById(key).value = theSetting;
                numbers[key] = Number(theSetting);
            } else {
                document.getElementById(key).value = numbers[key];
            }
        } catch (err) {
            console.log("setting error " + key);
        }
    }

    //Checkboxes
    for (var key in settings) {
        var theSetting = localStorageGet(localStorageSafe, key);

        try {
            if (theSetting != undefined && theSetting != null) {
                document.getElementById(key).checked = Boolean(theSetting == "true");
                settings[key] = theSetting;
            } else {
                document.getElementById(key).checked = Boolean(settings[key] == "true");
            }
        } catch (err) {
            console.log("setting error " + key);
        }
    }

    //Select boxes
    for (var key in dropdowns) {
        var theSetting = localStorageGet(localStorageSafe, key);
        try {
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

            if (key == "languageselector") {
                if (dictionary[theSetting]) {
                    dictionary.live = dictionary[theSetting];
                }
            }
        } catch (err) {
            console.log("setting error " + key);
        }
    }

    //Make sure users are not on the old server
    if (dropdowns.contentserver == "https://memberjs.org:8123/member.js") {
        dropdowns.contentserver = "https://member.cash/v2/member.js";
    }
    if (dropdowns.txbroadcastserver == "https://memberjs.org:8123/member.js") {
        dropdowns.txbroadcastserver = "https://member.cash/v2/";
    }

    document.getElementById("debuginfo").value = debuginfo;

}

function updateSettingsCheckbox(settingsName) {
    settings[settingsName] = "" + document.getElementById(settingsName).checked;
    localStorageSet(localStorageSafe, settingsName, settings[settingsName]);
    updateStatus(getSafeTranslation('updated', "Updated.") + " " + settings[settingsName]);
}

function updateSettingsDropdown(settingsName) {
    var selector = document.getElementById(settingsName);
    dropdowns[settingsName] = selector.options[selector.selectedIndex].value;
    settings[settingsName] = "" + dropdowns[settingsName];
    localStorageSet(localStorageSafe, settingsName, dropdowns[settingsName]);

    //if (settingsName == "currencydisplay") {
    //    tq.updateBalance(pubkey);
    //}
    if (settingsName == "mcutxoserver") {
        tq.setUTXOServer(dropdowns.mcutxoserver + "address/utxo/");
        refreshPool();
    }
    if (settingsName == "languageselector") {
        if (dictionary[dropdowns[settingsName]]) {
            dictionary.live = dictionary[dropdowns[settingsName]];
            //location.reload();
            translatePage();
        }
    }
    if (settingsName == "txbroadcastserver"){
        tq.setbroadcastServer(dropdowns.txbroadcastserver + "rawtransactions/sendRawTransactionPost");
    }

    updateStatus(getSafeTranslation('updated', "Updated.") + " " + dropdowns[settingsName]);
}

function updateSettingsNumber(settingsName) {
    numbers[settingsName] = Number(document.getElementById(settingsName).value);

    //No numbers are less than 2 except oneclicktip, which will be reset below
    /*if (numbers[settingsName] < 2) {
        numbers[settingsName] = 2;
    }*/

    if (settingsName == "results" && numbers[settingsName] > 100) {
        numbers[settingsName] = 100;
    }
    if (settingsName == "maxfee" && numbers[settingsName] < 2) {
        numbers[settingsName] = 2;
    }
    if (settingsName == "oneclicktip" && numbers[settingsName] < nativeCoin.dust) {
        numbers[settingsName] = 0;
    }
    localStorageSet(localStorageSafe, settingsName, numbers[settingsName]);
    if(settingsName!='usdrate'){
        updateStatus(getSafeTranslation('updated', "Updated.") + " " + numbers[settingsName]);
    }
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



function rateCallbackAction(rating, ratingtext, qaddress) {
    if (ratingtext === undefined) {
        ratingtext = "";
    }
    //var qaddress = that.theAddress;
    var transposed = transposeStarRating(rating);
    rateUser(qaddress, transposed, ratingtext);
}

function updatemutedwords() {

    var commasep = document.getElementById('mutedwords').value;
    mutedwords = commasep.split(',');
    for (var i = 0; i < mutedwords.length; i++) {
        mutedwords[i] = mutedwords[i].trim()
    }
    localStorageSet(localStorageSafe, "mutedwords", mutedwords);


}

function getAndPopulateFB(page, qaddress) {
    document.getElementById(page).innerHTML = fbHTML[page];
    show(page);
    if (!qaddress) {
        qaddress = pubkey;
    }
    var theURL = dropdowns.contentserver + '?action=' + page + '&qaddress=' + qaddress + '&address=' + pubkey;
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + getMembersWithRatingHTML(i, page, data[i], '', false);
        }

        document.getElementById(page + 'table').innerHTML = contents;
        addDynamicHTMLElements(data);
        scrollToPosition();
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}

function setPic() {
    setTrxPic(getAndPopulateSettings);
}



