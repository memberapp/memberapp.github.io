"use strict";

var lastViewOfNotifications = 0;
var lastViewOfNotificationspm = 0;

function displayNotificationCount() {
    lastViewOfNotifications = Number(localStorageGet(localStorageSafe, "lastViewOfNotifications"));
    lastViewOfNotificationspm = Number(localStorageGet(localStorageSafe, "lastViewOfNotificationspm"));
    var theURL = dropdowns.contentserver + '?action=alertcount&address=' + pubkey + '&since=' + lastViewOfNotifications + '&sincepm=' + lastViewOfNotificationspm;
    getJSON(theURL).then(function (data) {

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
        document.title = pageTitle + siteTitle;
        setTimeout(displayNotificationCount, 60000);
    }, function (status) { //error detection....
        showErrorMessage(status, null, theURL);
    });
}


function getAndPopulateNotifications(start, limit, page, qaddress, txid) {
    //Clear existing content
    show(page);

    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;

    //Show navigation next/back buttons


    //Request content from the server and display it when received
    var theURL = dropdowns.contentserver + '?action=' + page + '&address=' + pubkey + '&qaddress=' + qaddress + '&start=' + start + '&limit=' + limit;
    getJSON(theURL).then(function (data) {
        //data = mergeRepliesToRepliesBySameAuthor(data);
        var navbuttons = getNavButtonsNewHTML('new', page, '', '', start, limit, page, qaddress, "getAndPopulateNotifications", data.length > 0 ? data[0].unduplicatedlength : 0);
        //var navbuttons = getNavButtonsHTML(start, limit, page, 'new', qaddress, "", "getAndPopulateNotifications", data.length > 0 ? data[0].unduplicatedlength : 0);

        var contents = ``;

        for (var i = 0; i < data.length; i++) {
            try {
                contents = contents + getHTMLForNotification(data[i], i + 1 + start, page, i, (data[i].txid == txid));
            } catch (err) {
                console.log(err);
            }
        }
        //console.log(contents);
        if (contents == "") {
            contents =  getDivClassHTML("message",getSafeTranslation("nonotifications","No notifications yet"));
        }

        if (window.Notification.permission != 'granted') {
            contents = allowNotificationButtonHTML()+ contents;
        }else{
            //notification subscriptions seem to get cancelled a lot - keep requesting subscription if granted to ensure continuity
            requestNotificationPermission();
        }

        contents = getNotificationsTableHTML(contents, navbuttons);

        //Update last view of notifications iff the user is looking at the first page of notifications.
        if (start == 0) {
            lastViewOfNotifications = parseInt(new Date().getTime() / 1000);
            localStorageSet(localStorageSafe, "lastViewOfNotifications", lastViewOfNotifications);
            document.getElementById("alertcount").innerHTML = "";
            document.title = siteTitle;
        }


        document.getElementById(page).innerHTML = contents; //display the result in an HTML element
        addDynamicHTMLElements(data);
        if(txid){
            scrollToPosition('notification' + san(txid));
        }else{
            scrollToPosition();
        }
        
        listenForTwitFrameResizes();
        //window.scrollTo(0, scrollhistory[window.location.hash]);
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}


function userFromData(data, mainRatingID) {
    return userHTML(data.origin, data.originname, mainRatingID, data.raterrating, 16, data.originpagingid, data.originpublickey, data.originpicurl, data.origintokens, data.originfollowers, data.originfollowing, data.originblockers, data.originblocking, data.originprofile, data.originisfollowing, data.originnametime, true);
}


function getHTMLForNotification(data, rank, page, starindex, highlighted) {
    if (checkForMutedWords(data)) return "";
    let type = ds(data.type);
    let mainRatingID = starindex + page + ds(data.origin);
    let postRatingID = "";

    //For root posts, we show number of replies as total
    //For comments, just the number of direct replies
    if (data.ltxid == data.lroottxid) {
        data.lreplies = data.lrepliesroot;
    }
    if (data.rtxid == data.rroottxid) {
        data.rreplies = data.rrepliesroot;
    }

    switch (type) {
        case "thread":
            postRatingID = starindex + page + ds(data.raddress) + type;
            return notificationItemHTML(
                "thread",
                `💬&nbsp;`,
                userFromData(data, mainRatingID) + ` ` + postlinkHTML(data.txid, "replied") + getSpanHTML('plaintext','discussion',`in a discussion you're in'`),
                timeSince(Number(data.time)),
                getHTMLForPostHTML(data.rtxid, data.raddress, data.originname, data.rlikes, data.rdislikes, data.rtips, data.rfirstseen, data.rmessage, data.rroottxid, data.rtopic, data.rreplies, data.rgeohash, page, postRatingID, data.rlikedtxid, data.rlikeordislike, data.repliesroot, data.raterrating, starindex, data.rrepostcount, data.rrepostidtxid, data.originpagingid, data.originpublickey, data.originpicurl, data.origintokens, data.originfollowers, data.originfollowing, data.originblockers, data.originblocking, data.originprofile, data.originisfollowing, data.originnametime, ''),
                data.txid, highlighted
            );
            break;
        case "topic":
            postRatingID = starindex + page + ds(data.raddress) + type;
            return notificationItemHTML(
                "topic",
                `📰&nbsp;`,
                userFromData(data, mainRatingID) + ` ` + postlinkHTML(data.txid, "posted") + getSpanHTML('plaintext','inatopic',`in a topic you're subscribed to`),
                timeSince(Number(data.time)),
                getHTMLForPostHTML(data.rtxid, data.raddress, data.originname, data.rlikes, data.rdislikes, data.rtips, data.rfirstseen, data.rmessage, data.rroottxid, data.rtopic, data.rreplies, data.rgeohash, page, postRatingID, data.rlikedtxid, data.rlikeordislike, data.repliesroot, data.raterrating, starindex, data.rrepostcount, data.rrepostidtxid, data.originpagingid, data.originpublickey, data.originpicurl, data.origintokens, data.originfollowers, data.originfollowing, data.originblockers, data.originblocking, data.originprofile, data.originisfollowing, data.originnametime, ''),
                data.txid, highlighted
            );
            break;
        case "page":
            postRatingID = starindex + page + ds(data.raddress) + type;
            return notificationItemHTML(
                "page",
                `📣&nbsp;`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext','mentionedyou','mentioned you in a') + postlinkHTML(data.txid, `post`),
                timeSince(Number(data.time)),
                getHTMLForPostHTML(data.rtxid, data.raddress, data.originname, data.rlikes, data.rdislikes, data.rtips, data.rfirstseen, data.rmessage, data.rroottxid, data.rtopic, data.rreplies, data.rgeohash, page, postRatingID, data.rlikedtxid, data.rlikeordislike, data.repliesroot, data.raterrating, starindex, data.rrepostcount, data.rrepostidtxid, data.originpagingid, data.originpublickey, data.originpicurl, data.origintokens, data.originfollowers, data.originfollowing, data.originblockers, data.originblocking, data.originprofile, data.originisfollowing, data.originnametime, ''),
                data.txid, highlighted
            );
            break;
        case "reply":
            postRatingID = starindex + page + ds(data.raddress) + type;
            return notificationItemHTML(
                "reply",
                `💬&nbsp;`,
                userFromData(data, mainRatingID) + ` ` + postlinkHTML(data.txid, "replied") + getSpanHTML('plaintext','toyour','to your') + postlinkHTML(data.rretxid, "post"),
                timeSince(Number(data.time)),
                getHTMLForPostHTML(data.rtxid, data.raddress, data.originname, data.rlikes, data.rdislikes, data.rtips, data.rfirstseen, data.rmessage, data.rroottxid, data.rtopic, data.rreplies, data.rgeohash, page, postRatingID, data.rlikedtxid, data.rlikeordislike, data.repliesroot, data.raterrating, starindex, data.rrepostcount, data.rrepostidtxid, data.originpagingid, data.originpublickey, data.originpicurl, data.origintokens, data.originfollowers, data.originfollowing, data.originblockers, data.originblocking, data.originprofile, data.originisfollowing, data.originnametime, ''),
                data.txid, highlighted
            );
            break;
        case "rating":
            var theRating = 0;
            if (data.rating != null && data.rating != "") { theRating = (Number(data.rating) / 64) + 1; }
            theRating = Math.round(theRating * 10) / 10;
            return notificationItemHTML(
                "rating",
                `⭐&nbsp;`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext','ratedyou','rated you as') + theRating + getSpanHTML('plaintext','starscommenting','stars, commenting ...') + getSpanClassHTML("plaintext",escapeHTML(data.reason)),
                timeSince(Number(data.time)),
                "",
                data.txid, highlighted
            );
            break;
        case "follow":
            return notificationItemHTML(
                "follow",
                `👩&nbsp;`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext','followedyou','followed you'),
                timeSince(Number(data.time)),
                "",
                data.txid, highlighted
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
                userFromData(data, mainRatingID) + getSpanHTML('plaintext','likedyour','liked your') + postlinkHTML(data.likeretxid, "post") + getSpanClassHTML("plaintext",(Number(data.amount) > 0 ? balanceString(Number(data.amount), false) : "")),
                timeSince(Number(data.time)),
                getHTMLForPostHTML(data.ltxid, data.laddress, data.username, data.llikes, data.ldislikes, data.ltips, data.lfirstseen, data.lmessage, data.lroottxid, data.ltopic, data.lreplies, data.lgeohash, page, postRatingID, data.likedtxid, data.likeordislike, data.repliesroot, data.selfrating, starindex, data.lrepostcount, data.lrepostidtxid, data.userpagingid, data.userpublickey, data.userpicurl, data.usertokens, data.userfollowers, data.userfollowing, data.userblockers, data.userblocking, data.userprofile, data.userisfollowing, data.usernametime, ''),
                data.txid, highlighted
            );
            break;
        case "repost":
            postRatingID = starindex + page + ds(data.address) + type;
            return notificationItemHTML(
                "repost",
                `🔗&nbsp;`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext','rememberedyour','remembered your') + postlinkHTML(data.likeretxid, "post") + ` ` + (Number(data.amount) > 0 ? balanceString(Number(data.amount), false) : ""),
                timeSince(Number(data.time)),
                getHTMLForPostHTML(data.ltxid, data.laddress, data.username, data.llikes, data.ldislikes, data.ltips, data.lfirstseen, data.lmessage, data.lroottxid, data.ltopic, data.lreplies, data.lgeohash, page, postRatingID, data.likedtxid, data.likeordislike, data.repliesroot, data.selfrating, starindex, data.lrepostcount, data.lrepostidtxid, data.userpagingid, data.userpublickey, data.userpicurl, data.usertokens, data.userfollowers, data.userfollowing, data.userblockers, data.userblocking, data.userprofile, data.userisfollowing, data.usernametime, ''),
                data.txid, highlighted
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
