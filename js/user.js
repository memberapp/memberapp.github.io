
function getAndPopulateRatings(qaddress) {
    document.getElementById('ratingtable').innerHTML = "";
    getJSON(server + '?action=ratings&qaddress=' + qaddress + '&address=' + pubkey).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents +
                `<tr>
                <td><div id="rating`+ ds(data[i].address) + `"</div></td>
                <td><a href="#member?qaddress=`+ ds(data[i].address) + `" onclick="showMember('` + ds(data[i].address) + `')">` + ds(data[i].name) + `</a></td>
                <td><a href="#member?qaddress=`+ ds(data[i].address) + `" onclick="showMember('` + ds(data[i].address) + `')">` + ds(data[i].address) + `</a></td>
                </tr>`;
        }
        document.getElementById('ratingtable').innerHTML = contents;

        for (var i = 0; i < data.length; i++) {

            var theRating = 0; if (data[i].rating != null) { theRating = (ds(data[i].rating) / 64) + 1; }
            var theAddress = ds(data[i].address);
            var starRating1 = raterJs({
                starSize: 24,
                rating: theRating,
                element: document.querySelector("#rating" + theAddress),
                rateCallback: function rateCallback(rating, done) {
                    rateCallbackAction(rating, this);
                    done();
                }
            });
            starRating1.theAddress = theAddress;

        }
    }, function (status) { //error detection....
        alert('Something went wrong.');
    });
}


function getDataCommonToSettingsAndMember(qaddress, pre) {
    document.getElementById('memberrating').innerHTML = "<div id='memberrating"+qaddress+"'></div>";
    getJSON(server + '?action=settings&qaddress=' + qaddress + '&address=' + pubkey).then(function (data) {
        //alert('Your Json result is:  ' + data.result); //you can comment this, i used it to debug
        document.getElementById(pre + 'followersnumber').innerText = ds(data[0].followers);
        document.getElementById(pre + 'followersnumber').href = "#followers?qaddress=" + qaddress;
        document.getElementById(pre + 'followersnumber').onclick = function () { showFollowers(qaddress); };
        document.getElementById(pre + 'followingnumber').innerText = ds(data[0].following);
        document.getElementById(pre + 'followingnumber').href = "#following?qaddress=" + qaddress;
        document.getElementById(pre + 'followingnumber').onclick = function () { showFollowing(qaddress); };
        document.getElementById(pre + 'blockersnumber').innerText = ds(data[0].blockers);
        document.getElementById(pre + 'blockersnumber').href = "#blockers?qaddress=" + qaddress;
        document.getElementById(pre + 'blockersnumber').onclick = function () { showBlockers(qaddress); };
        document.getElementById(pre + 'blockingnumber').innerText = ds(data[0].blocking);
        document.getElementById(pre + 'blockingnumber').href = "#blocking?qaddress=" + qaddress;
        document.getElementById(pre + 'blockingnumber').onclick = function () { showBlocking(qaddress); };

        if (pre == "member") {
            document.getElementById(pre + 'nametext').innerText = ds(data[0].name);
            document.getElementById(pre + 'profiletext').innerText = ds(data[0].profile);
        } else if (pre == "settings") {
            document.getElementById(pre + 'nametext').value = ds(data[0].name);
            document.getElementById(pre + 'nametextbutton').disabled = true;
            document.getElementById(pre + 'profiletext').value = ds(data[0].profile);
            document.getElementById(pre + 'profiletextbutton').disabled = true;
        }


        var escaped = '"' + qaddress + '"';
        if (ds(data[0].isfollowing) == "0") {
            document.getElementById(pre + 'follow').innerHTML = "<a href='javascript:;' onclick='follow(" + escaped + ");'>follow</a>";
        } else {
            document.getElementById(pre + 'follow').innerHTML = "<a href='javascript:;' onclick='unfollow(" + escaped + ");'>unfollow</a>";
        }

        if (qaddress != pubkey) {
            if (ds(data[0].isblocked) == "0") {
                document.getElementById(pre + 'block').innerHTML = "<a href='javascript:;' onclick='block(" + escaped + ");'>block</a>";
            } else {
                document.getElementById(pre + 'block').innerHTML = "<a href='javascript:;' onclick='unblock(" + escaped + ");'>unblock</a>";
            }

            var theRating = 0; if (data[0].rating != null) { theRating = (ds(data[0].rating) / 64) + 1; }
            var starRating1 = raterJs({
                starSize: 24,
                rating: theRating,
                element: document.querySelector("#memberrating"+qaddress),
                rateCallback: function rateCallback(rating, done) {
                    rateCallbackAction(rating, this);
                    done();
                }
            });
            //myRating.setRating(theRating);

            starRating1.theAddress = qaddress;

            document.getElementById(pre + 'trustgraph').innerHTML = `<a href='#trustgraph?member=` + pubkey + `&amp;target=` + qaddress + `' onclick='showTrustGraph("` + pubkey + `","` + qaddress + `");'>Show Trust Graph</a>`;
        }

    }, function (status) { //error detection....
        alert('Something went wrong.');
    });
}

function getAndPopulateMember(qaddress) {
    document.getElementById('ratingtable').innerHTML = "";
    document.getElementById('memberlegacyformat').innerHTML = qaddress;
    var publicaddress = new bch.Address(qaddress);
    var memberqpubkey = publicaddress.toString(bch.Address.CashAddrFormat);
    document.getElementById('membercashaddrformat').innerHTML = memberqpubkey;
    document.getElementById('memberqrformat').innerHTML = `<a id="memberqrclicktoshow" onclick="document.getElementById('memberqrchart').style.display='block';document.getElementById('memberqrclicktoshow').style.display='none';">Click To Show</a><img id="memberqrchart" style="display:none;" src="https://chart.googleapis.com/chart?chs=100x100&amp;cht=qr&amp;chl=` + memberqpubkey + `&amp;choe=UTF-8">`;

    getDataCommonToSettingsAndMember(qaddress, "member");
    getAndPopulateRatings(qaddress);
}

function getAndPopulateSettings() {
    document.getElementById('ratingtable').innerHTML = "";
    document.getElementById('legacyformat').innerHTML = pubkey;
    document.getElementById('cashaddrformat').innerHTML = qpubkey;
    document.getElementById('qrformat').innerHTML = `<a id="qrclicktoshow" onclick="document.getElementById('qrchart').style.display='block';document.getElementById('qrclicktoshow').style.display='none';">Click To Show</a><img id="qrchart" style="display:none;" src="https://chart.googleapis.com/chart?chs=100x100&amp;cht=qr&amp;chl=` + qpubkey + `&amp;choe=UTF-8">`;
    document.getElementById('privatekey').innerHTML = `<a id="privatekeyclicktoshow" onclick="document.getElementById('privatekeydisplay').style.display='block';document.getElementById('privatekeyclicktoshow').style.display='none';">Click To Show</a><div style="display:none;"  id="privatekeydisplay"></div>`;
    document.getElementById('privatekeydisplay').innerHTML = privkey;
    if (typeof Storage !== void (0)) {
        var storedmutedwords = localStorage.getItem("mutedwords");
        if (storedmutedwords != undefined && storedmutedwords != null) {
            document.getElementById('mutedwords').value = storedmutedwords;
            mutedwords = storedmutedwords.split(',');
        }

    }


    getDataCommonToSettingsAndMember(pubkey, "settings");
    getAndPopulateRatings(pubkey);
}

function rateCallbackAction(rating, that) {
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
    if (rateUser(qaddress, transposed)) {
        that.setRating(rating);
    }
}

function updatemutedwords() {

    document.getElementById('mutedwordsbutton').disabled = true;
    var commasep = document.getElementById('mutedwords').value;
    mutedwords = commasep.split(',');
    for (var i = 0; i < mutedwords.length; i++) {
        mutedwords[i] = mutedwords[i].trim()
    }
    if (typeof Storage !== void (0)) {
        localStorage.setItem("mutedwords", mutedwords);
    }

}

function getMemberLink(address, name) {
    return `<a href="#member?qaddress=` + ds(address) + `" onclick="showMember('` + ds(address) + `')">` + ds(name) + `</a>`;
}

function getAddressLink(address, name) {
    return `<a href="#member?qaddress=` + ds(address) + `" onclick="showMember('` + ds(address) + `')">` + ds(address) + `</a>`;
}