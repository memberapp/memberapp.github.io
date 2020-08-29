"use strict";

function getAndPopulateCommunityRatings(qaddress) {
    document.getElementById('communityratingtable').innerHTML = document.getElementById("loading").innerHTML;

    getJSON(dropdowns.contentserver + '?action=rated&qaddress=' + qaddress + '&address=' + pubkey).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + ratingAndReasonHTML(data[i]);
        }
        document.getElementById('communityratingtable').innerHTML = contents;

        for (var i = 0; i < data.length; i++) {

            var theRating = 0; if (data[i].rating != null) { theRating = (parseInt(data[i].rating) / 64) + 1; }
            var theAddress = san(data[i].address);
            var starRating1 = raterJs({
                starSize: 24,
                rating: Math.round(theRating * 10) / 10,
                element: document.querySelector("#crating" + theAddress),
                disableText: rts(data[i].name) + ' rates ' + rts(data[i].rateename) + ' as {rating}/{maxRating}',
            });
            starRating1.theAddress = theAddress;
            starRating1.disable();

        }
    }, function (status) { //error detection....
        console.log('Something is wrong:' + status);
        document.getElementById('communityratingtable').innerHTML = 'Something is wrong:' + status;
        updateStatus(status);
    });
}

function getAndPopulateRatings(qaddress) {
    document.getElementById('ratingtable').innerHTML = document.getElementById("loading").innerHTML;

    getJSON(dropdowns.contentserver + '?action=ratings&qaddress=' + qaddress + '&address=' + pubkey).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + ratingAndReason2HTML(data[i]);
        }
        document.getElementById('ratingtable').innerHTML = contents;

        for (var i = 0; i < data.length; i++) {

            var theRating = 0; if (data[i].rating != null) { theRating = (parseInt(data[i].rating) / 64) + 1; }
            var theAddress = san(data[i].rates);
            var starRating1 = raterJs({
                starSize: 24,
                rating: Math.round(theRating * 10) / 10,
                element: document.querySelector("#rating" + theAddress),
                disableText: rts(data[i].ratername) + ' rates ' + rts(data[i].name) + ' as {rating}/{maxRating}',
            });
            starRating1.theAddress = theAddress;

            starRating1.disable();

        }
    }, function (status) { //error detection....
        console.log('Something is wrong:' + status);
        document.getElementById('ratingtable').innerHTML = 'Something is wrong:' + status;
        updateStatus(status);
    });
}


function getDataCommonToSettingsAndMember(qaddress, pre) {

    getJSON(dropdowns.contentserver + '?action=settings&qaddress=' + qaddress + '&address=' + pubkey).then(function (data) {


        //alert('Your Json result is:  ' + data.result); //you can comment this, i used it to debug
        //Note, data may not contain any rows, for new or unknown users.

        var jdenticonname = "";

        if (data.length < 1) {
            document.getElementById(pre + 'followersnumber').innerHTML = "0";
            document.getElementById(pre + 'followingnumber').innerHTML = "0";
            document.getElementById(pre + 'blockersnumber').innerHTML = "0";
            document.getElementById(pre + 'blockingnumber').innerHTML = "0";
            document.getElementById(pre + 'nametext').value = "";
            document.getElementById(pre + 'profiletext').value = "";
            document.getElementById(pre + 'nametext').innerHTML = "";
            document.getElementById(pre + 'profiletext').innerHTML = "";
        } else {
            document.getElementById(pre + 'followersnumber').innerHTML = Number(data[0].followers);
            document.getElementById(pre + 'followingnumber').innerHTML = Number(data[0].following);
            document.getElementById(pre + 'blockersnumber').innerHTML = Number(data[0].blockers);
            document.getElementById(pre + 'blockingnumber').innerHTML = Number(data[0].blocking);
            document.getElementById(pre + 'nametext').value = data[0].name;
            document.getElementById(pre + 'profiletext').value = data[0].profile;

            document.getElementById(pre + 'nametext').innerHTML = escapeHTML(data[0].name) + sendEncryptedMessageHTML(qaddress, data[0].name, data[0].publickey);
            document.getElementById(pre + 'profiletext').innerHTML = escapeHTML(data[0].profile);
            document.getElementById(pre + 'pagingid').innerHTML = escapeHTML("@" + data[0].pagingid);
            jdenticonname=data[0].name;
        }

        document.getElementById(pre + 'profilelink').href = "#member?qaddress=" + san(qaddress);
        document.getElementById(pre + 'profilelink').onclick = function () { showMember(qaddress); };
        document.getElementById(pre + 'memoprofilelink').href = "https://memo.cash/profile/" + san(qaddress);

         
        if (jdenticonname == "" || jdenticonname == null) {
            jdenticonname = qaddress.substring(0, 10);
        }
        document.getElementById(pre + 'identicon').innerHTML = `<svg width="20" height="20" class="jdenticonlarge" data-jdenticon-value="`+unicodeEscape(jdenticonname)+`"></svg>`;


        if (pre == "settings") {
            document.getElementById(pre + 'nametextbutton').disabled = true;
            document.getElementById(pre + 'profiletextbutton').disabled = true;
            if (document.getElementById(pre + 'nametext').value == "") {
                document.getElementById(pre + 'nametext').disabled = false;
            } else {
                document.getElementById(pre + 'nametext').disabled = true;
            }
        }


        document.getElementById(pre + 'followersnumber').href = "#followers?qaddress=" + qaddress;
        document.getElementById(pre + 'followersnumber').onclick = function () { showFollowers(qaddress); };
        document.getElementById(pre + 'followingnumber').href = "#following?qaddress=" + qaddress;
        document.getElementById(pre + 'followingnumber').onclick = function () { showFollowing(qaddress); };
        document.getElementById(pre + 'blockersnumber').href = "#blockers?qaddress=" + qaddress;
        document.getElementById(pre + 'blockersnumber').onclick = function () { showBlockers(qaddress); };
        document.getElementById(pre + 'blockingnumber').href = "#blocking?qaddress=" + qaddress;
        document.getElementById(pre + 'blockingnumber').onclick = function () { showBlocking(qaddress); };




        if (data.length < 1 || Number(data[0].isfollowing) == 0) {
            document.getElementById(pre + 'follow').innerHTML = clickActionNamedHTML("follow", qaddress, "follow");
        } else {
            document.getElementById(pre + 'follow').innerHTML = clickActionNamedHTML("unfollow", qaddress, "unfollow");
        }

        //document.getElementById(pre + 'ratings').innerHTML = `<a href='#ratings?qaddress=` + qaddress + `' onclick='showRatings(` + escaped + `);'>Show Ratings</a>`;

        if (data.length < 1 || Number(data[0].isblocked) == 0) {
            document.getElementById(pre + 'block').innerHTML = clickActionNamedHTML("mute", qaddress, "mute");
        } else {
            document.getElementById(pre + 'block').innerHTML = clickActionNamedHTML("unmute", qaddress, "unmute");
        }

        //This condition checks that the user being viewed is not the logged in user
        if (pre == "member" && qaddress == pubkey) {
            document.getElementById(pre + 'ratinggroup').style.display = "none";
        } else if (pre == "member") {

            document.getElementById(pre + 'ratinggroup').style.display = "block";
            document.getElementById(pre + 'ratingcomment').innerHTML = getRatingComment(qaddress, data);
            document.getElementById(pre + 'ratingcommentinputbox' + qaddress).onchange = function () { starRating1.setRating(0); };

            var ratingScore=0;
            if (data.length >0) {
                ratingScore=Number(data[0].rating);
            }
            document.getElementById('memberrating').innerHTML = `<div data-ratingsize="20" data-ratingaddress="` + san(qaddress) + `" data-ratingraw="` + ratingScore + `" id="memberrating` + qaddress + `"></div>`;
            var theElement = document.getElementById(`memberrating` + qaddress);
            var starRating1 = addSingleStarsRating(false, theElement);
        }

        jdenticon();
    }, function (status) { //error detection....
        console.log('Something is wrong:' + status);
        updateStatus(status);
    });
}

function getAndPopulateMember(qaddress) {
    document.getElementById('memberlegacyformat').innerHTML = qaddress;
    var memberqpubkey = new BITBOX.Address().toCashAddress(qaddress);
    document.getElementById('membercashaddrformat').innerHTML = memberqpubkey;
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
    //These may already be switched to qrcodes, so try/catch necessary
    try { document.getElementById('legacyformat').innerHTML = pubkey; } catch (err) { }
    try { document.getElementById('cashaddrformat').innerHTML = qpubkey; } catch (err) { }
    try { document.getElementById('lowfundsaddress').innerHTML = qpubkey; } catch (err) { }
    try { document.getElementById('privatekeyformat').innerHTML = privkey; } catch (err) { }

    
    try { document.getElementById('privatekeydisplay').innerHTML = (mnemonic == "" ? "" : "Seed Phrase: " + mnemonic + "<br/>") + "Compressed Private Key: " + privkey; } catch (err) { }
    try { document.getElementById('privatekey').innerHTML = privatekeyClickToShowHTML(); } catch (err) { }

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
        }
        var selector = document.getElementById(key);

        var opts = selector.options;
        for (var i = 0; i < opts.length; i++) {
            if (opts[i].value == theSetting) {
                selector.selectedIndex = i;
            }
        }
    }

    //Should have the usdrate populated now
    getLatestUSDrate();
    
    getDataCommonToSettingsAndMember(pubkey, "settings");


}

function updateSettingsCheckbox(settingsName) {
    settings[settingsName] = "" + document.getElementById(settingsName).checked;
    localStorageSet(localStorageSafe, settingsName, settings[settingsName]);
}

function updateSettingsDropdown(settingsName) {
    var selector = document.getElementById(settingsName);
    dropdowns[settingsName] = selector.options[selector.selectedIndex].value;
    localStorageSet(localStorageSafe, settingsName, dropdowns[settingsName]);
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




