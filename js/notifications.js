"use strict";

var lastViewOfNotifications = 0;
var lastViewOfNotificationspm = 0;

function displayNotificationCount() {
    getJSON(dropdowns.contentserver + '?action=alertcount&address=' + pubkey + '&since=' + lastViewOfNotifications + '&sincepm=' + lastViewOfNotificationspm).then(function (data) {

        if (data[0].count == null) {
            return;
        }

        var alertcount = Number(data[0].count);
        var element = document.getElementById("alertcount");
        if (alertcount > 0) {
            element.innerHTML = alertcount;
        } else {
            element.innerHTML = "";
        }

        var alertcountpm = Number(data[0].countpm);
        var element = document.getElementById("alertcountpm");
        if (alertcountpm > 0) {
            element.innerHTML = alertcountpm;
        } else {
            element.innerHTML = "";
        }

        var pageTitleCount = alertcount + alertcountpm;
        var pageTitle = "";
        if (pageTitleCount > 0) {
            pageTitle = "(" + pageTitleCount + ") ";
        }
        document.title = pageTitle + "member.cash";
        setTimeout(displayNotificationCount, 60000);
    }, function (status) { //error detection....
        console.log('Something is wrong:' + status);
        updateStatus(status);
    });

}

function getAndPopulateNotifications(start, limit, page, qaddress) {
    //Clear existing content
    show(page);

    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;

    //Show navigation next/back buttons


    //Request content from the server and display it when received
    getJSON(dropdowns.contentserver + '?action=' + page + '&address=' + pubkey + '&qaddress=' + qaddress + '&start=' + start + '&limit=' + limit).then(function (data) {
        //data = mergeRepliesToRepliesBySameAuthor(data);
        var navbuttons = getNavButtonsHTML(start, limit, page, 'new', qaddress, "", "getAndPopulateNotifications", data.length > 0 ? data[0].unduplicatedlength : 0);

        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + getHTMLForNotification(data[i], i + 1 + start, page, i);
        }
        //console.log(contents);
        if (contents == "") {
            contents = getNothingFoundMessageHTML("No notifications yet");
        }
        contents = getNotificationsTableHTML(contents, navbuttons);

        //Update last view of notifications iff the user is looking at the first page of notifications.
        if (start == 0) {
            lastViewOfNotifications = parseInt(new Date().getTime() / 1000);
            localStorageSet(localStorageSafe, "lastViewOfNotifications", lastViewOfNotifications);
        }

        document.getElementById("alertcount").innerHTML = "";
        document.title = "member.cash";

        document.getElementById(page).innerHTML = contents; //display the result in an HTML element
        addDynamicHTMLElements(data);
        listenForTwitFrameResizes();
        //window.scrollTo(0, scrollhistory[window.location.hash]);
    }, function (status) { //error detection....
        console.log('Something is wrong:' + status);
        document.getElementById(page).innerHTML = 'Something is wrong:' + status;
        updateStatus(status);
    });

}



function getHTMLForNotification(data, rank, page, starindex) {
    if (checkForMutedWords(data)) return "";
    let type = ds(data.type);
    let mainRatingID = starindex + page + ds(data.origin);
    let postRatingID = "";

    switch (type) {
        case "page":
            postRatingID = starindex + page + ds(data.raddress) + type;
            return notificationItemHTML(
                "page",
                `📣&nbsp;`,
                userHTML(data.origin, data.originname, mainRatingID, data.raterrating, 16) + ` ` + postlinkHTML(data.txid, "mentioned you "),
                timeSince(Number(data.time)),
                getHTMLForPostHTML(data.rtxid, data.raddress, data.originname, data.rlikes, data.rdislikes, data.rtips, data.rfirstseen, data.rmessage, data.rroottxid, data.rtopic, data.rreplies, data.rgeohash, page, postRatingID, data.rlikedtxid, data.rlikeordislike, data.repliesroot, data.raterrating, starindex, data.rrepostcount, data.rrepostidtxid)
            );
            //<a href="#thread?root=`+ ds(data.roottxid) + `&post=` + ds(data.txid) + `" onclick="showThread('` + ds(data.roottxid) + `','` + ds(data.txid) + `')">` + anchorme(ds(data.message), { attributes: [{ name: "target", value: "_blank" }] }) + `</a> `;
            break;
        case "reply":
            postRatingID = starindex + page + ds(data.raddress) + type;
            return notificationItemHTML(
                "reply",
                `💬&nbsp;`,
                userHTML(data.origin, data.originname, mainRatingID, data.raterrating, 16) + ` ` + postlinkHTML(data.txid, "replied") + ` to your ` + postlinkHTML(data.rretxid, "post"),
                timeSince(Number(data.time)),
                getHTMLForPostHTML(data.rtxid, data.raddress, data.originname, data.rlikes, data.rdislikes, data.rtips, data.rfirstseen, data.rmessage, data.rroottxid, data.rtopic, data.rreplies, data.rgeohash, page, postRatingID, data.rlikedtxid, data.rlikeordislike, data.repliesroot, data.raterrating, starindex, data.rrepostcount, data.rrepostidtxid)
            );
            //<a href="#thread?root=`+ ds(data.roottxid) + `&post=` + ds(data.txid) + `" onclick="showThread('` + ds(data.roottxid) + `','` + ds(data.txid) + `')">` + anchorme(ds(data.message), { attributes: [{ name: "target", value: "_blank" }] }) + `</a> `;
            break;
        case "rating":
            var theRating = 0;
            if (data.rating != null && data.rating != "") { theRating = (Number(data.rating) / 64) + 1; }
            theRating = Math.round(theRating * 10) / 10;
            return notificationItemHTML(
                "rating",
                `⭐&nbsp;`,
                userHTML(data.origin, data.originname, mainRatingID, data.raterrating, 16) + ` rated you as ` + theRating + ` stars, commenting ... ` + escapeHTML(data.reason),
                timeSince(Number(data.time)),
                ""
            );
            break;
        case "follow":
            return notificationItemHTML(
                "follow",
                `👩&nbsp;`,
                userHTML(data.origin, data.originname, mainRatingID, data.raterrating, 16) + ` followed you `,
                timeSince(Number(data.time)),
                ""
            );
            break;
        case "like":
            if (data.llikedtxid == null) {
                //Server returns empty likes sometimes, probably if a like is superceeded by another like
                return "";
            }
            postRatingID = starindex + page + ds(data.address) + type;
            return notificationItemHTML(
                "like",
                `💗&nbsp;`,
                userHTML(data.origin, data.originname, mainRatingID, data.raterrating, 16) + ` liked your ` + postlinkHTML(data.likeretxid, "post") + ` ` + (Number(data.amount) > 0 ? balanceString(Number(data.amount), false) : ""),
                timeSince(Number(data.time)),
                getHTMLForPostHTML(data.ltxid, data.laddress, data.username, data.llikes, data.ldislikes, data.ltips, data.lfirstseen, data.lmessage, data.lroottxid, data.ltopic, data.lreplies, data.lgeohash, page, postRatingID, data.likedtxid, data.likeordislike, data.repliesroot, data.selfrating, starindex, data.lrepostcount, data.lrepostidtxid)
            );
            break;
        case "repost":
            postRatingID = starindex + page + ds(data.address) + type;
            return notificationItemHTML(
                "repost",
                `🔗&nbsp;`,
                userHTML(data.origin, data.originname, mainRatingID, data.raterrating, 16) + ` re-membered your ` + postlinkHTML(data.likeretxid, "post") + ` ` + (Number(data.amount) > 0 ? balanceString(Number(data.amount), false) : ""),
                timeSince(Number(data.time)),
                getHTMLForPostHTML(data.ltxid, data.laddress, data.username, data.llikes, data.ldislikes, data.ltips, data.lfirstseen, data.lmessage, data.lroottxid, data.ltopic, data.lreplies, data.lgeohash, page, postRatingID, data.likedtxid, data.likeordislike, data.repliesroot, data.selfrating, starindex, data.lrepostcount, data.lrepostidtxid)
            );
            break;

        // Maybe shelve these 'negative' ones
        case "unfollow":
            //return `Unfollow: User x unfollowed you time`;
            break;
        case "mute":
            //return `Mute: User x muted you time`;
            break;
        case "unmute":
            //return `Unmute: User x unmuted you time`;
            break;
        case "dislike":
            //return `Dislike: User x disliked your post | post`;
            break;
        //reply, rating, follow, unfollow, mute, unmute, like, dislike
        default:
            return '';
            break;
    }
    return '';
}
