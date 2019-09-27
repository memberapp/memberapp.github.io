function getAndPopulateNotifications(start, limit, page, qaddress) {
    //Clear existing content
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;
    show(page);

    //Show navigation next/back buttons
    var navbuttons = `<div class="navbuttons">`;
    if (start != 0)
    navbuttons += `<a class="next" href="#` + page + `?start=` + (start - 25) + `&limit=` + limit + `&qaddress=` + qaddress + `" onclick="javascript:getAndPopulateNotifications(` + (start - 25) + `,` + limit + `,'` + page + `','` + qaddress + `')">Back | </a> `;
    navbuttons += `<a class="back" href="#` + page + `?start=` + (start + 25) + `&limit=` + limit + `&qaddress=` + qaddress + `" onclick="javascript:getAndPopulateNotifications(` + (start + 25) + `,` + limit + `,'` + page + `','` + qaddress + `')">Next</div>`;

    //Request content from the server and display it when received
    getJSON(server + '?action=' + page + '&address=' + pubkey + '&qaddress=' + qaddress + '&start=' + start + '&limit=' + limit).then(function (data) {
        //data = mergeRepliesToRepliesBySameAuthor(data);
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + '<tr><td class="title">' + getHTMLForNotification(data[i], i + 1 + start, page, i) + '</td></tr>';
        }
        console.log(contents);
        if (contents == "") { contents = "Nothing in this feed yet"; }
        contents = `<table class="itemlist" cellspacing="0" cellpadding="0" border="0"><tbody>` + contents + "<tr><td/><td/><td>" + navbuttons + "</td></tr></tbody></table>";
        document.getElementById(page).innerHTML = contents; //display the result in an HTML element
        addStarRatings(data, page);
        window.scrollTo(0, 0);
    }, function (status) { //error detection....
        alert('Something went wrong.');
    });

}

function notificationItemHTML(iconHTML, mainbodyHTML, subtextHTML, addendumHTML) {
    //icon, mainbody and subtext should already be escaped and HTML formatted
    return `
    <tr class="spacer" style="height:15px"></tr>
    <tr class="athing">
    <td class="title" valign="top" align="right"><span class="rank">`+ iconHTML + `</span></td>
    <td class="title" colspan="2">`+ mainbodyHTML + `</span></td>
    </tr>
    <tr>
    <td></td>
    <td colspan="2" class="subtext"><span class="age">`+ subtextHTML + `</td>
    </tr>
    <tr class="spacer" style="height:5px"></tr>`
        + addendumHTML +
        `<tr><td></td><td colspan="2" style="border-bottom: 1px solid #4cca47"></td></tr>`;
}

function getHTMLForNotification(data, rank, page, starindex) {
    if (checkForMutedWords(data)) return "";
    let type = ds(data.type);
    let mainRatingID=starindex + page + ds(data.origin);
    let postRatingID="";

    switch (type) {
        case "reply":
            postRatingID=starindex + page + ds(data.raddress) + type;
            return notificationItemHTML(
                `💬&nbsp;`,
                userHTML(data.origin, data.originname, mainRatingID) + ` ` + postlinkHTML(data.txid, "replied") + ` to your ` + postlinkHTML(data.rretxid, "post"),
                timeSince(ds(data.time)),
                getHTMLForPostHTML(data.rtxid, data.raddress, data.originname, data.rlikes, data.rdislikes, data.rtips, data.rfirstseen, data.rmessage, data.rroottxid, data.rtopic, data.rreplies, "", page, postRatingID)
            );
            //<a href="#thread?root=`+ ds(data.roottxid) + `&post=` + ds(data.txid) + `" onclick="showThread('` + ds(data.roottxid) + `','` + ds(data.txid) + `')">` + anchorme(ds(data.message), { attributes: [{ name: "target", value: "_blank" }] }) + `</a> `;
            break;
        case "rating":
            var theRating = 0;
            if (data.rating != null && data.rating != "") { theRating = (ds(data.rating) / 64) + 1; }
            theRating=Math.round(theRating * 10) / 10;
            return notificationItemHTML(
                `⭐&nbsp;`,
                userHTML(data.origin, data.originname, mainRatingID) + ` rated you as ` + theRating + ` stars, commenting ... ` + ds(data.reason),
                timeSince(ds(data.time)),
                ""
                );
            break;
        case "follow":
            return notificationItemHTML(
                `👩&nbsp;`,
                userHTML(data.origin, data.originname, mainRatingID) + ` followed you `,
                timeSince(ds(data.time)),
                ""                
                );
            break;
        case "like":
            postRatingID=starindex + page + ds(data.address) + type;    
            return notificationItemHTML(
                `💗&nbsp;`,
                userHTML(data.origin, data.originname, mainRatingID) + ` liked your ` + postlinkHTML(data.likeretxid, "post") + ` ` + ds(data.amount) + ` sats `,
                timeSince(ds(data.time)),
                getHTMLForPostHTML(data.ltxid, data.laddress, data.username, data.llikes, data.ldislikes, data.ltips, data.lfirstseen, data.lmessage, data.lroottxid, data.ltopic, data.lreplies, "", page, postRatingID)
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
}
