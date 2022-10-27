"use strict";

var lastViewOfNotifications = 0;
var lastViewOfNotificationspm = 0;

function displayNotificationCount() {
    if (!pubkey) {
        return;
    }
    lastViewOfNotifications = Number(localStorageGet(localStorageSafe, "lastViewOfNotifications"));
    lastViewOfNotificationspm = Number(localStorageGet(localStorageSafe, "lastViewOfNotificationspm"));
    var theURL = dropdowns.contentserver + '?action=alertcount&address=' + pubkey + '&since=' + lastViewOfNotifications + '&sincepm=' + lastViewOfNotificationspm;
    getJSON(theURL).then(function (data) {
        try {
            if (data[0].count == null) {
                return;
            }

            setAlertCount("alertcount", Number(data[0].count));
            setAlertCount("alertcountpm", Number(data[0].countpm));

            var pageTitleCount = Number(data[0].count) + Number(data[0].countpm);
            var pageTitle = "";
            //if (pageTitleCount > 0) {
            //    pageTitle = "(" + pageTitleCount + ") ";
            //}
            //document.title = pageTitle + siteTitle;
        } catch (err) {
            console.log(err);
        }
        setTimeout(displayNotificationCount, 60000);
    }, function (status) { //error detection....
        showErrorMessage(status, null, theURL);
        setTimeout(displayNotificationCount, 60000);
    });
}

function setAlertCount(elementid, alertNumber) {
    var alertcount = Number(alertNumber);
    var element = document.getElementById(elementid);
    if (alertcount > 0) {
        element.innerHTML = alertcount;
        element.style.visibility = "visible";
    } else {
        element.innerHTML = "";
        element.style.visibility = "hidden";
    }

}

function populateNotificationTab(limit, nfilter, minrating) {
    let options = '&limit=' + limit + '&minrating=' + minrating;
    document.getElementById("notificationtypes").innerHTML =
        `<a data-vavilon="notificationall" data-vavilon_title="notificationall" title="See all notifications" class="` + (nfilter == '' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=` + options + `">All</a>
    <span class="separator"></span>
    <a data-vavilon="notificationlikes" data-vavilon_title="notificationlikes" title="See only likes" class="`+ (nfilter == 'like' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=like` + options + `">Likes</a>
    <span class="separator"></span>
    <a data-vavilon="notificationfollows" data-vavilon_title="notificationfollows" title="See only follows" class="`+ (nfilter == 'follow' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=follow` + options + `">Follows</a>
    <span class="separator"></span>
    <a data-vavilon="notificationunfollows" data-vavilon_title="notificationunfollows" title="See only unfollows" class="`+ (nfilter == 'unfollow' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=unfollow` + options + `">Unfollows</a>
    <span class="separator"></span>
    <a data-vavilon="notificationreplies" data-vavilon_title="notificationreplies" title="See only replies" class="`+ (nfilter == 'reply' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=reply` + options + `">Replies</a>
    <span class="separator"></span>
    <a data-vavilon="notificationratings" data-vavilon_title="notificationratings" title="See only ratings" class="`+ (nfilter == 'rating' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=rating` + options + `">Ratings</a>
    <span class="separator"></span>
    <a data-vavilon="notificationmentions" data-vavilon_title="notificationmentions" title="See only mentions" class="`+ (nfilter == 'page' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=page` + options + `">Mentions</a>
    <span class="separator"></span>
    <a data-vavilon="notificationremembers" data-vavilon_title="notificationremembers" title="See only remembers" class="`+ (nfilter == 'repost' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=repost` + options + `">Remembers</a>
    <span class="separator"></span>
    <a data-vavilon="notificationpurchase" data-vavilon_title="notificationpurchase" title="See only creator coin purchases" class="`+ (nfilter == 'purchase' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=purchase` + options + `">Buys</a>
    <span class="separator"></span>
    <a data-vavilon="notificationsale" data-vavilon_title="notificationsale" title="See only creator coin sales" class="`+ (nfilter == 'sale' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=sale` + options + `">Sells</a>
    <span class="separator"></span>
    <nav class="filterssecondset">
        <span class="starratingnotifications">
            <span data-ratingsize="16" id="notificationsfilter" class="star-rating-notifications"></span>
        </span>
    </nav>
    `;

    //<a data-vavilon="notificationtips" data-vavilon_title="notificationremembers" title="See only tips" class="`+ (nfilter == 'tip' ? 'filteron' : 'filteroff') + `" href="#notifications?nfilter=tip` + options + `">Tips</a>
    //<span class="separator"></span>


    //Activate navigation filter star ratings
    notificationFilter.element = document.getElementById('notificationsfilter');


    notificationFilter.element = raterJs({
        starSize: Number(notificationFilter.element.dataset.ratingsize),
        rating: notificationFilter.minrating,
        element: notificationFilter.element,
        showToolTip: false,
        rateCallback: function rateCallback(rating, done) {
            notificationFilter.element.setRating(rating);
            done();
            notificationFilter.minrating = rating;
            getAndPopulateNotifications(0, notificationFilter.limit, "notifications", pubkey, null, notificationFilter.type, notificationFilter.minrating);
        }
    });

    if (notificationFilter.element) {
        notificationFilter.element.setRating(minrating);
    }

}

function getAndPopulateNotifications(start, limit, page, qaddress, txid, nfilter, minrating) {
    //Clear existing content
    show(page);


    document.getElementById("notificationsbody").innerHTML = document.getElementById("loading").innerHTML;

    populateNotificationTab(limit, nfilter, minrating);


    //Show navigation next/back buttons


    //Request content from the server and display it when received
    var minRatingTransposed = transposeStarRating(minrating);
    notificationFilter.type = nfilter;
    notificationFilter.minrating = minrating;


    var theURL = dropdowns.contentserver + '?action=' + page + '&address=' + pubkey + '&qaddress=' + qaddress + '&start=' + start + '&limit=' + limit + '&nfilter=' + nfilter + '&minrating=' + minRatingTransposed;
    getJSON(theURL).then(function (data) {
        //data = mergeRepliesToRepliesBySameAuthor(data);
        var navbuttons = getNotificationNavButtonsNewHTML(start, limit, page, qaddress, minrating, nfilter, data.length);
        //var navbuttons = getNotificationNavButtonsNewHTML(start, limit, page, qaddress, minrating, nfilter, data.length > 0 ? data[0].unduplicatedlength : 0);
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
            contents = getDivClassHTML("message", getSafeTranslation("nonotifications", "No notifications yet"));
        }


        try {
            if (window.Notification.permission != 'granted') {
                contents = allowNotificationButtonHTML() + contents;
            } else {
                requestNotificationPermission();
            }
        } catch (err) {
            //possibly catching an exception generated by ios here
            contents = allowNotificationButtonHTML() + contents;
            updateStatus(err);
        }



        contents = getNotificationsTableHTML(contents, navbuttons);

        //Update last view of notifications iff the user is looking at the first page of notifications.
        if (start == 0) {
            lastViewOfNotifications = parseInt(new Date().getTime() / 1000);
            localStorageSet(localStorageSafe, "lastViewOfNotifications", lastViewOfNotifications);
            setAlertCount("alertcount", 0);
            //document.title = siteTitle;
        }


        document.getElementById("notificationsbody").innerHTML = contents; //display the result in an HTML element
        addDynamicHTMLElements(data);
        if (txid) {
            scrollToPosition('notification' + san(txid));
        } else {
            scrollToPosition();
        }





        listenForTwitFrameResizes();
        //window.scrollTo(0, scrollhistory[window.location.hash]);


        //Put this at the end - it may be failing silently on iOS, so does least damage here
        /*if (window.Notification.permission == 'granted') {
            try {
                //notification subscriptions seem to get cancelled a lot - keep requesting subscription if granted to ensure continuity
                requestNotificationPermission();
            } catch (err) {
                //possibly catching an exception generated by ios here
                console.log(err);
            }
        }*/

    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}

var notificationFilterRating;
var notificationFilter = [];
notificationFilter.type = "";
notificationFilter.minrating = 0;
notificationFilter.start = 0;
notificationFilter.limit = 25;





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

    let referencedPostHTML = "";

    postRatingID = starindex + page + ds(data.raddress) + type;
    if (type != "rating") { //this is inelegant, quick fix

        if (type == "like" || type == "repost") {
            postRatingID = starindex + page + ds(data.address) + type;
            //data.useraddress=data.laddress;
            let member = MemberFromData(data, 'user', postRatingID);
            referencedPostHTML = getHTMLForPostHTML3(member, data, 'l', page, starindex, '', true);
            //referencedPostHTML = getHTMLForPostHTML(data.ltxid, data.laddress, data.username, data.llikes, data.ldislikes, data.ltips, data.lfirstseen, data.lmessage, data.lroottxid, data.ltopic, data.lreplies, data.lgeohash, page, postRatingID, data.likedtxid, data.likeordislike, data.repliesroot, data.selfrating, starindex, data.lrepostcount, data.lrepostidtxid, data.userpagingid, data.userpublickey, data.userpicurl, data.usertokens, data.userfollowers, data.userfollowing, data.userblockers, data.userblocking, data.userprofile, data.userisfollowing, data.usernametime, '', data.originlastactive, true, data.originsysrating, data.lsourcenetwork, data.lhivename, data.lhivelink, data.userbitcoinaddress);
        } else if (type == "page") {
            //data.originaddress=data.raddress;
            let member = MemberFromData(data, 'origin', postRatingID);
            //referencedPostHTML = getHTMLForPostHTML(data.rtxid, data.raddress, data.originname, data.rlikes, data.rdislikes, data.rtips, data.rfirstseen, data.rmessage, data.rroottxid, data.rtopic, data.rreplies, data.rgeohash, page, postRatingID, data.rlikedtxid, data.rlikeordislike, data.repliesroot, data.raterrating, starindex, data.rrepostcount, data.rrepostidtxid, data.originpagingid, data.originpublickey, data.originpicurl, data.origintokens, data.originfollowers, data.originfollowing, data.originblockers, data.originblocking, data.originprofile, data.originisfollowing, data.originnametime, '', data.originlastactive, true, data.originsysrating, data.rsourcenetwork, data.rhivename, data.rhivelink, data.originbitcoinaddress);
            referencedPostHTML = getHTMLForPostHTML3(member, data, 'r', page, starindex, '', true);
        } else  if (type == "thread")  {

            let opmember = MemberFromData(data, 'op', postRatingID);
            referencedPostHTML = getHTMLForPostHTML3(opmember, data, 'op', page, starindex, '', true);

            let member = MemberFromData(data, 'origin', postRatingID);
            referencedPostHTML += `<div class="replyinmainfeed">` + getHTMLForPostHTML3(member, data, 'r', page, starindex, '', true) + `</div>`;            

        } else {

            //data.useraddress=data.opaddress;
            let opmember = MemberFromData(data, 'user', postRatingID);
            referencedPostHTML = getHTMLForPostHTML3(opmember, data, 'op', page, starindex, '', true);

            //data.originaddress=data.raddress;
            let member = MemberFromData(data, 'origin', postRatingID);
            //referencedPostHTML = getHTMLForPostHTML(data.rtxid, data.raddress, data.originname, data.rlikes, data.rdislikes, data.rtips, data.rfirstseen, data.rmessage, data.rroottxid, data.rtopic, data.rreplies, data.rgeohash, page, postRatingID, data.rlikedtxid, data.rlikeordislike, data.repliesroot, data.raterrating, starindex, data.rrepostcount, data.rrepostidtxid, data.originpagingid, data.originpublickey, data.originpicurl, data.origintokens, data.originfollowers, data.originfollowing, data.originblockers, data.originblocking, data.originprofile, data.originisfollowing, data.originnametime, '', data.originlastactive, true, data.originsysrating, data.rsourcenetwork, data.rhivename, data.rhivelink, data.originbitcoinaddress);
            referencedPostHTML += `<div class="replyinmainfeed">` + getHTMLForPostHTML3(member, data, 'r', page, starindex, '', true) + `</div>`;            

        }
    }

    switch (type) {
        case "message":
            /*return notificationItemHTML(
                "message",
                `img/icons/notification/message.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext','messagedyou','messaged you'),
                timeSince(Number(data.time),true),
                "",
                data.txid, highlighted
            );*/
            break;
        case "thread":

            return notificationItemHTML(
                "thread",
                `img/icons/notification/discussion.png`,
                userFromData(data, mainRatingID) + ` ` + postlinkHTML(data.txid, "replied") + getSpanHTML('plaintext', 'discussion', `in a discussion you're in'`),
                timeSince(Number(data.time), true),
                referencedPostHTML,
                data.txid, highlighted, 'Discussion'
            );
            break;
        case "topic":
            return notificationItemHTML(
                "topic",
                `img/icons/notification/post.png`,
                userFromData(data, mainRatingID) + ` ` + postlinkHTML(data.txid, "posted") + getSpanHTML('plaintext', 'inatopic', `in a tag you're subscribed to`),
                timeSince(Number(data.time), true),
                referencedPostHTML,
                data.txid, highlighted, 'Post'
            );
            break;
        case "page":
            return notificationItemHTML(
                "page",
                `img/icons/notification/mentioned.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'mentionedyou', 'mentioned you in a') + postlinkHTML(data.txid, `post`),
                timeSince(Number(data.time), true),
                referencedPostHTML,
                data.txid, highlighted, 'Mention'
            );
            break;
        case "reply":
            return notificationItemHTML(
                "reply",
                `img/icons/notification/reply.png`,
                userFromData(data, mainRatingID) + ` ` + postlinkHTML(data.txid, "replied") + getSpanHTML('plaintext', 'toyour', 'to your') + postlinkHTML(data.rretxid, "post"),
                timeSince(Number(data.time), true),
                referencedPostHTML,
                data.txid, highlighted, 'Reply'
            );
            break;
        case "rating":
            var theRating = 0;
            if (data.rating) {
                theRating = outOfFive(data.rating);
            }
            return notificationItemHTML(
                "rating",
                `img/icons/notification/star.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'ratedyou', 'rated you as') + theRating + getSpanHTML('plaintext', 'starscommenting', 'stars, commenting ...') + getSpanClassHTML("plaintext", escapeHTML(data.reason)),
                timeSince(Number(data.time), true),
                "",
                data.txid, highlighted, 'Rating'
            );
            break;
        case "follow":
            return notificationItemHTML(
                "follow",
                `img/icons/notification/follow.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'followedyou', 'followed you'),
                timeSince(Number(data.time), true),
                "",
                data.txid, highlighted, 'Follow'
            );
            break;
        case "unfollow":
            return notificationItemHTML(
                "unfollow",
                `img/icons/notification/follow.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'unfollowedyou', 'unfollowed you'),
                timeSince(Number(data.time), true),
                "",
                data.txid, highlighted, 'Unfollow'
            );
            break;
        case "purchase":
            return notificationItemHTML(
                "purchase",
                `img/icons/notification/follow.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'purchasecoin', `purchased your creator coin. ~${usdString(data.ccamount)} `),
                timeSince(Number(data.time), true),
                ``,
                data.txid, highlighted, 'Purchase'
            );
            break;

        case "sale":
            Number(data.ccamount);
            return notificationItemHTML(
                "sale",
                `img/icons/notification/follow.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'soldcoin', `sold your creator coin. ~${usdString(data.ccamount * 1.33)} `),
                timeSince(Number(data.time), true),
                ``,
                data.txid, highlighted, 'Sale'
            );
            break;

        case "like":
            //if (data.llikedtxid == null) {
                //Server returns empty likes sometimes, probably if a like is superceeded by another like
            //    return "";
            //}
            var postHTML = "";
            var messageType = postlinkHTML(data.likeretxid, "remember");
            if (data.lmessage) {
                messageType = postlinkHTML(data.likeretxid, "post");
                //This is a like of a post
                postHTML = referencedPostHTML;
            }
            return notificationItemHTML(
                "like",
                `img/icons/notification/liked.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'likedyour', 'liked your') + messageType + getSpanClassHTML("plaintext", (Number(data.amount) > 0 ? usdString(Number(data.amount), false) : "")),
                timeSince(Number(data.time), true),
                postHTML,
                data.txid, highlighted, 'Like'
            );
            break;
        case "repost":
            return notificationItemHTML(
                "repost",
                `img/icons/notification/repost.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'rememberedyour', 'remembered your') + postlinkHTML(data.rhivelink, "post"),
                timeSince(Number(data.time), true),
                referencedPostHTML,
                data.txid, highlighted, 'Remember'
            );
            break;
        case "quoterepost":
            return notificationItemHTML(
                "repost",
                `img/icons/notification/repost.png`,
                userFromData(data, mainRatingID) + getSpanHTML('plaintext', 'quoterememberedyour', 'quote remembered your') + postlinkHTML(data.likeretxid, "post"),
                timeSince(Number(data.time), true),
                referencedPostHTML,
                data.txid, highlighted, 'Quote Remember'
            );
            break;


        // Maybe shelve these 'negative' ones
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
