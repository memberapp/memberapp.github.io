"use strict";

function getAndPopulateCommunityRatings(qaddress) {
    document.getElementById('communityratingtable').innerHTML = document.getElementById("loading").innerHTML;

    getJSON(server + '?action=rated&qaddress=' + qaddress + '&address=' + pubkey).then(function (data) {
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
                element: document.querySelector("#rating" + theAddress),
                disableText: rts(data[i].name) + ' rates ' + rts(data[i].rateename) + ' as {rating}/{maxRating}',
            });
            starRating1.theAddress = theAddress;
            starRating1.disable();

        }
    }, function (status) { //error detection....
        alert('Something went wrong.');
    });
}

function getAndPopulateRatings(qaddress) {
    document.getElementById('ratingtable').innerHTML = document.getElementById("loading").innerHTML;

    getJSON(server + '?action=ratings&qaddress=' + qaddress + '&address=' + pubkey).then(function (data) {
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
        alert('Something went wrong.');
    });
}


function getDataCommonToSettingsAndMember(qaddress, pre) {
    document.getElementById('memberrating').innerHTML = "<div id='memberrating" + qaddress + "'></div>";
    getJSON(server + '?action=settings&qaddress=' + qaddress + '&address=' + pubkey).then(function (data) {


        //alert('Your Json result is:  ' + data.result); //you can comment this, i used it to debug
        //Note, data may not contain any rows, for new or unknown users.

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
            document.getElementById(pre + 'nametext').innerHTML = escapeHTML(data[0].name);
            document.getElementById(pre + 'profiletext').innerHTML = escapeHTML(data[0].profile);

            document.getElementById(pre + 'profilelink').href = "#member?qaddress=" + san(qaddress);
            document.getElementById(pre + 'profilelink').onclick = function () { showMember(qaddress); };
            document.getElementById(pre + 'memoprofilelink').href = "https://memo.cash/profile/" + san(qaddress);

            if (pre == "settings") {
                document.getElementById(pre + 'nametextbutton').disabled = true;
                document.getElementById(pre + 'profiletextbutton').disabled = true;
                if (document.getElementById(pre + 'nametext').value != "") {
                    document.getElementById(pre + 'nametext').disabled = true;
                }
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




        if (data.length < 1 || ds(data[0].isfollowing) == "0") {
            document.getElementById(pre + 'follow').innerHTML = clickActionHTML("follow",qaddress); 
        } else {
            document.getElementById(pre + 'follow').innerHTML = clickActionHTML("unfollow",qaddress);
        }

        //document.getElementById(pre + 'ratings').innerHTML = `<a href='#ratings?qaddress=` + qaddress + `' onclick='showRatings(` + escaped + `);'>Show Ratings</a>`;

        //This condition checks that the user being viewed is not the logged in user
        if (qaddress != pubkey) {
            if (data.length < 1 || ds(data[0].isblocked) == "0") {
                document.getElementById(pre + 'block').innerHTML = clickActionHTML("block",qaddress);
            } else {
                document.getElementById(pre + 'block').innerHTML = clickActionHTML("unblock",qaddress);
            }

            document.getElementById(pre + 'ratingcomment').innerHTML = getRatingComment(qaddress,data);
            document.getElementById(pre + 'ratingcommentinputbox' + qaddress).onchange = function () { starRating1.setRating(0); };

            var theRating = 0; if (data.length > 0 && data[0].rating != null) { theRating = (ds(data[0].rating) / 64) + 1; }
            var starRating1 = raterJs({
                starSize: 24,
                //rating: theRating,
                element: document.querySelector("#memberrating" + qaddress),
                rateCallback: function rateCallback(rating, done) {
                    var ratingText = document.getElementById("memberratingcommentinputbox" + qaddress);
                    rateCallbackAction(rating, this, ratingText.value);
                    done();
                }
            });
            if (theRating != 0) {
                starRating1.setRating(theRating);
            }

            starRating1.theAddress = qaddress;
            
            //var tgmember = pubkey;
            //if (tgmember == null || tgmember == '') {
            //    tgmember = "19RyV6XQEww5td2LPWDpK8o5V8at7Vpwgv";
            //}
            //document.getElementById(pre + 'trustgraph').innerHTML = `<a href='#trustgraph?member=` + tgmember + `&amp;target=` + qaddress + `' onclick='showTrustGraph("` + pubkey + `","` + qaddress + `");'>Show Trust Graph</a>`;
        }

    }, function (status) { //error detection....
        alert('Something went wrong.');
    });
}

function getAndPopulateMember(qaddress) {
    document.getElementById('memberlegacyformat').innerHTML = qaddress;
    var publicaddress = new bch.Address(qaddress);
    var memberqpubkey = publicaddress.toString(bch.Address.CashAddrFormat);
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
    try{document.getElementById('legacyformat').innerHTML = pubkey;}catch(err){}
    try{document.getElementById('cashaddrformat').innerHTML = qpubkey;}catch(err){}
    try{document.getElementById('privatekeydisplay').innerHTML = privkey;}catch(err){}
    try{document.getElementById('privatekey').innerHTML = privatekeyClickToShowHTML();}catch(err){}
    
    if (typeof Storage !== void (0)) {
        var storedmutedwords = localStorage.getItem("mutedwords");
        if (storedmutedwords != undefined && storedmutedwords != null) {
            document.getElementById('mutedwords').value = storedmutedwords;
            mutedwords = storedmutedwords.split(',');
        }
        
        var storedoneclicktip = localStorage.getItem("oneclicktip");
        if (storedoneclicktip != undefined && storedoneclicktip != null) {
            storedoneclicktip=Number(storedoneclicktip);
            if(storedoneclicktip<547){
                storedoneclicktip=0;
            } 
            document.getElementById('oneclicktip').value = storedoneclicktip;
            oneclicktip= storedoneclicktip;
        }

        var storedmaxfee = localStorage.getItem("maxfee");
        if (storedmaxfee != undefined && storedmaxfee != null) {
            storedmaxfee=Number(storedmaxfee);
            if(storedmaxfee<1){
                storedmaxfee=2;
            } 
            document.getElementById('maxfee').value = storedmaxfee;
            maxfee= storedmaxfee;
        }
    }


    getDataCommonToSettingsAndMember(pubkey, "settings");


}

function showQRCode(spanid) {
    var addressToQR = document.getElementById(spanid).innerHTML;
    document.getElementById(spanid + "div").innerHTML="";
    new QRCode(document.getElementById(spanid + "div"), addressToQR);
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
    if (typeof Storage !== void (0)) {
        localStorage.setItem("mutedwords", mutedwords);
    }

}

function updateOneClickTip(){
    oneclicktip = Number(document.getElementById('oneclicktip').value);
    if (typeof Storage !== void (0)) {
        localStorage.setItem("oneclicktip", oneclicktip);
    }
}

function updateMaxFee(){
    maxfee = Number(document.getElementById('maxfee').value);
    if(maxfee<2){
        maxfee = 2;
    }
    if (typeof Storage !== void (0)) {
        localStorage.setItem("maxfee", maxfee);
    }
}


