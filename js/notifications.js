"use strict";

function getAndPopulateNotifications(start, limit, page, qaddress) {
    //Clear existing content
    show(page);

    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;

    //Show navigation next/back buttons


    //Request content from the server and display it when received
    getJSON(server + '?action=' + page + '&address=' + pubkey + '&qaddress=' + qaddress + '&start=' + start + '&limit=' + limit).then(function (data) {
        //data = mergeRepliesToRepliesBySameAuthor(data);
        var navbuttons = getNavButtonsHTML(start, limit, page, 'new', qaddress, "", "getAndPopulateNotifications", data.length);

        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + getHTMLForNotification(data[i], i + 1 + start, page, i);
        }
        //console.log(contents);
        if (contents == "") { contents = "Nothing in this feed yet"; }
        contents = getNotificationsTableHTML(contents, navbuttons);
        document.getElementById(page).innerHTML = contents; //display the result in an HTML element
        addStarRatings(data, page);
        listenForTwitFrameResizes();
        window.scrollTo(0, 0);
    }, function (status) { //error detection....
        console.log('Something is wrong:' + status);
        document.getElementById(page).innerHTML = 'Something is wrong:'+status;
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
                getHTMLForPostHTML(data.rtxid, data.raddress, data.originname, data.rlikes, data.rdislikes, data.rtips, data.rfirstseen, data.rmessage, data.rroottxid, data.rtopic, data.rreplies, data.rgeohash, page, postRatingID,  data.rlikedtxid, data.rlikeordislike, data.repliesroot, data.raterrating, starindex)
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
                getHTMLForPostHTML(data.rtxid, data.raddress, data.originname, data.rlikes, data.rdislikes, data.rtips, data.rfirstseen, data.rmessage, data.rroottxid, data.rtopic, data.rreplies, data.rgeohash, page, postRatingID, data.rlikedtxid, data.rlikeordislike, data.repliesroot, data.raterrating, starindex)
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
            postRatingID = starindex + page + ds(data.address) + type;
            return notificationItemHTML(
                "like",
                `💗&nbsp;`,
                userHTML(data.origin, data.originname, mainRatingID, data.raterrating, 16) + ` liked your ` + postlinkHTML(data.likeretxid, "post") + ` ` + balanceString(Number(data.amount),` sats `),
                timeSince(Number(data.time)),
                getHTMLForPostHTML(data.ltxid, data.laddress, data.username, data.llikes, data.ldislikes, data.ltips, data.lfirstseen, data.lmessage, data.lroottxid, data.ltopic, data.lreplies, data.lgeohash, page, postRatingID,  data.likedtxid, data.likeordislike, data.repliesroot, data.selfrating, starindex)
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
