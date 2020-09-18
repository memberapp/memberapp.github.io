"use strict";

//These 4 functions could be refactored into a single functions
function getAndPopulateFollowers(qaddress) {
    show('followers');
    var page = "followers";
    var theURL=dropdowns.contentserver + '?action=followers&qaddress=' + qaddress + '&address=' + pubkey;
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + getMembersWithRatingHTML(i, page, data[i], "Follows", false);
        }

        document.getElementById('follows').innerHTML = contents;
        var disable = false;
        if (qaddress != pubkey) {
            disable = true;
        }
        addDynamicHTMLElements(data, disable);
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}

function getAndPopulateFollowing(qaddress) {
    show('following');
    var page = "following";
    var theURL=dropdowns.contentserver + '?action=following&qaddress=' + qaddress + '&address=' + pubkey;
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + getMembersWithRatingHTML(i, page, data[i], "Follows", true);
        }
        document.getElementById('followingtable').innerHTML = contents;

        var disable = false;
        if (qaddress != pubkey) {
            disable = true;
        }
        addDynamicHTMLElements(data, disable);
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}

function getAndPopulateBlockers(qaddress) {
    show('blockers');
    var page = "blockers";
    var theURL=dropdowns.contentserver + '?action=blockers&qaddress=' + qaddress + '&address=' + pubkey;
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + getMembersWithRatingHTML(i, page, data[i], "Mutes", false);
        }
        document.getElementById('blocks').innerHTML = contents;

        var disable = false;
        if (qaddress != pubkey) {
            disable = true;
        }
        addDynamicHTMLElements(data, disable);

    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}

function getAndPopulateBlocking(qaddress) {
    show('blocking');
    var page = "blocking";
    var theURL=dropdowns.contentserver + '?action=blocking&qaddress=' + qaddress + '&address=' + pubkey;
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + getMembersWithRatingHTML(i, page, data[i], "Mutes", true);
        }
        document.getElementById('blockingtable').innerHTML = contents;

        var disable = false;
        if (qaddress != pubkey) {
            disable = true;
        }
        addDynamicHTMLElements(data, disable);

    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}
