//All functions that generate HTML should be quarantined here. 
//This is a work in progress, HTML is fairly spread out at the moment

//All HTML to be escaped should go through functions in this file
//variables ending in HTML should already be HTML escaped
//functions ending in HTML should return safely escaped HTML strings


//Functions
//san is used to strip all but alphanumeric (sanitizealphanumeric)
//ds is used to escape as HTML
//Number is used to ensure an input is a number
//encodeURIComponent for part of uri
//unicodeEscape to escape text going into function

"use strict";
//Get html for a user, given their address and name
function userHTML(address, name, ratingID, ratingRawScore, ratingStarSize) {
    if (name == "") {
        name = address.substring(0, 10);
    }
    return `<a href="#member?qaddress=` + san(address) + `" onclick="showMember('` + san(address) + `')" class="hnuser">` + ds(name) + `</a>
    <div data-ratingsize="`+Number(ratingStarSize)+`" data-ratingaddress="`+ san(address) + `" data-ratingraw="` + Number(ratingRawScore) + `" id="rating` + ratingID + `"></div>`;
}

function postlinkHTML(txid, linktext) {
    return `<a href="#thread?post=` + san(txid) + `" onclick="showThread('` + san(txid) + `')">` + ds(linktext) + `</a>`;
}

function getNavButtonsHTML(start, limit, page, type, qaddress, topicName, functionName, numberOfResults) {

    //Caution topicname may contain hostile characters/code

    var navbuttons = `<div class="navbuttons">`;

    if (start != 0) //Don't show back buttons if we're at the start
    { navbuttons += `<a class="next" href="#` + page + `?start=` + (start - 25) + `&limit=` + limit + `&type=` + type + `&qaddress=` + qaddress + `&topicname=` + encodeURIComponent(topicName) + `" onclick="javascript:` + functionName + `(` + (start - 25) + `,` + limit + `,'` + page + `','` + qaddress + `','` + type + `','` + unicodeEscape(topicName) + `')">Back </a> `; }
    if (numberOfResults > 25) //Don't show next button unless the server has returned 1 additional set of results than requested
    { navbuttons += `<a class="back" href="#` + page + `?start=` + (start + 25) + `&limit=` + limit + `&type=` + type + `&qaddress=` + qaddress + `&topicname=` + encodeURIComponent(topicName) + `" onclick="javascript:` + functionName + `(` + (start + 25) + `,` + limit + `,'` + page + `','` + qaddress + `','` + type + `','` + unicodeEscape(topicName) + `')">Next</div>`; }
    return navbuttons;

}

function getItemListandNavButtonsHTML(contentsHTML, navbuttonsHTML, styletype, start) {
    if (styletype != "") {
        return `<div class="itemlist"><ol start="`+(Number(start)+1)+`" class="` + styletype + `">` + contentsHTML + `</ol></div><div class="navbuttons">` + navbuttonsHTML + `</div>`;
    } else {
        return `<div class="itemlist">` + contentsHTML + `</div><div class="navbuttons">` + navbuttonsHTML + `</div>`;
    }
}

function getDivClassHTML(className, contentsHTML) {
    return `<div class="` + className + `">` + contentsHTML + `</div>`;
}

function getVoteButtons(txid, address, likedtxid, likeordislike, score) {

    var upvoteHTML;
    let scoreHTML = `<span class="betweenvotesscore" id="score` + san(txid) + `">` + Number(score) + `</span>`;
    var downvoteHTML;
    
    if (likeordislike=="1"){
        upvoteHTML = `<a id="upvoteaction` + san(txid) + `" href="javascript:;"><span id="upvote` + san(txid) + `" class="votearrowactivated" title="upvote"></span><span class="votetext">up</span></a>`;
        scoreHTML = `<span class="betweenvotesscoreup" id="score` + san(txid) + `">` + Number(score) + `</span>`;
    }else{
        upvoteHTML = `<a id="upvoteaction` + san(txid) + `" href="javascript:;" onclick="likePost('` + san(txid) + `','` + san(address) + `')"><span id="upvote` + san(txid) + `" class="votearrow" title="upvote"></span><span class="votetext">up</span></a>`;
    }
    
    if (likeordislike=="-1") {
        downvoteHTML = `<a id="downvoteaction` + san(txid) + `" href="javascript:;"><span id="downvote` + san(txid) + `" class="votearrowactivateddown rotate180" title="downvote"><span class="votetext">down</span></span></a>`;
        scoreHTML = `<span class="betweenvotesscoredown" id="score` + san(txid) + `">` + Number(score) + `</span>`;
    }else{
        downvoteHTML = `<a id="downvoteaction` + san(txid) + `" href="javascript:;" onclick="dislikePost('` + san(txid) + `')"><span id="downvote` + san(txid) + `" class="votearrow rotate180" title="downvote"><span class="votetext">down</span></span></a>`;
    }

    return upvoteHTML + " " + scoreHTML + " " + downvoteHTML;
}

function getReplyDiv(txid, page) {
    return `
        <div id="reply`+ page + san(txid) + `" style="display:none">
            <br/>
            <textarea id="replytext`+ page + san(txid) + `" rows="3"></textarea>
            <br/>
            <input id="replybutton`+ page + san(txid) + `" value="reply" type="submit" onclick="sendReply('` + san(txid) + `','` + page + `','replystatus` + page + san(txid) + `');"/>
            <input id="replystatus`+ page + san(txid) + `" value="sending..." type="submit"  style="display:none" disabled/>
            <div id="replycompleted`+ page + san(txid) + `" value=""></div>
        </div>`;
}

function getReplyAndTipLinksHTML(page, txid, address) {
    return `
        <a id="replylink`+ page + san(txid) + `" onclick="showReplyBox('` + page + san(txid) + `');" href="javascript:;">reply</a>
        <a id="tiplink`+ page + san(txid) + `" onclick="showTipBox('` + page + san(txid) + `');" href="javascript:;">tip</a>
        <span id="tipbox`+ page + san(txid) + `" style="display:none">
            <input id="tipamount`+ page + san(txid) + `" type="number" value="0" min="0" style="width: 6em;" step="1000"/>
            <input id="tipbutton`+ page + san(txid) + `" value="tip" type="submit" onclick="sendTip('` + san(txid) + `','` + san(address) + `','` + page + `');"/>
            <input id="tipstatus`+ page + san(txid) + `"value="sending" type="submit" style="display:none" disabled/>
        </span>`;
}

function getScoresHTML(txid, likes, dislikes, tips) {
    return ` <span class="score"><span class="likescounttext"><span id="likescount` + san(txid) + `">` + (Number(likes) - Number(dislikes)) + `</span> likes and</span> <span class="tipscounttext"><span id="tipscount` + san(txid) + `">` + Number(tips) + `</span> sats </span></span>`;
}

function getAgeHTML(firstseen) {
    return `<span class="age"><a>` + timeSince(Number(firstseen)) + `</a></span>`;
}

function getTopicHTML(topic) {
    return ` <span class="topic">` +
        (topic == '' ? "" : `<a href="#topic?topicname=` + encodeURIComponent(topic) + `&start=0&limit=25" onclick="showTopic(0,25,'` + unicodeEscape(topic) + `')">to topic/` + ds(topic) + `</a> `)
        + `</span>`;
}

function getPostListItemHTML(postHTML) {
    return `<li>` + postHTML + `</li>`;
}

function getHTMLForPostHTML(txid, address, name, likes, dislikes, tips, firstseen, message, roottxid, topic, replies, rank, page, ratingID, likedtxid, likeordislike, repliesroot, rating) {
    if (name == null) { name = address.substring(0, 10); }

    repliesroot = Number(repliesroot);
    replies = Number(replies);
    //Replies respect newlines, but root posts do not
    var isReply = (roottxid != txid);
    var messageHTML = ds(message);
    if (isReply) {
        messageHTML = messageHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');
    } else {
        //only if main post
        if (repliesroot > replies) {
            replies = repliesroot;
        }
    }

    return `<div class="post">
                <div class="votelinks">` + getVoteButtons(txid, address, likedtxid, likeordislike, (Number(likes) - Number(dislikes))) + `</div>
                <div class="postdetails">
                    <div class="title"><a href="#thread?root=`+ san(roottxid) + `&post=` + san(txid) + `" onclick="showThread('` + san(roottxid) + `','` + san(txid) + `')">` + anchorme(messageHTML, { attributes: [{ name: "target", value: "_blank" }] }) + `</a> </div>
                    <div class="subtext">
                        <span class="submitter"> 
                        submitted `
        + getAgeHTML(firstseen)
        + ` by ` + userHTML(address, name, ratingID, rating, 8)
        + getTopicHTML(topic)
        + `</span>`
        + `<span class="subtextbuttons">`
        + `<a href="#thread?root=` + san(roottxid) + `&post=` + san(txid) + `" onclick="showThread('` + san(roottxid) + `','` + san(txid) + `')">` + (Math.max(0, Number(replies))) + `&nbsp;comments</a> `
        + getScoresHTML(txid, likes, dislikes, tips)
        + ` `
        + getReplyAndTipLinksHTML(page, txid, address) +
        `</span>
                        </div>`
        + getReplyDiv(txid, page) + `
                </div>
            </div>`;
}

function getHTMLForReplyHTML(txid, address, name, likes, dislikes, tips, firstseen, message, depth, page, ratingID, highlighttxid, likedtxid, likeordislike, blockstxid, rating) {
    if (name == null) { name = address.substring(0, 10); }
    return `<div ` + (txid == highlighttxid ? `class="reply highlight" id="highlightedcomment"` : `class="reply"`) + `>
                <div`+ (blockstxid != null ? ` class="blocked"` : ``) + `>
                    <div class="votelinks">` + getVoteButtons(txid, address, likedtxid, likeordislike) + `</div>
                    <div class="commentdetails">
                        <div class="comhead">`
        + userHTML(address, name, ratingID, rating, 8)
        + getScoresHTML(txid, likes, dislikes, tips)
        + getAgeHTML(firstseen) +
        `</div>
                        <div class="comment">
                            `+ anchorme(ds(message).replace(/(?:\r\n|\r|\n)/g, '<br>'), { attributes: [{ name: "target", value: "_blank" }] }) + `
                                <div class="reply">`+ getReplyAndTipLinksHTML(page, txid, address) + `</div>
                        </div>
                        `+ getReplyDiv(txid, page) + `
                    </div>
                </div>
            </div>
            `;
}


function notificationItemHTML(notificationtype, iconHTML, mainbodyHTML, subtextHTML, addendumHTML) {
    //icon, mainbody and subtext should already be escaped and HTML formatted
    return `
    <li class="notificationitem notification`+ notificationtype + `">
        <div class="notificationdetails">
        <div class="notificationminheight">
            <div class="notificationtitle">`+
        mainbodyHTML + `
                <span class="age">` + subtextHTML + `</span>
            </div>`+
        addendumHTML +
        `</div><hr class="notificationhr"/>
        </div>       
    </li>`;
}

function getMapPostHTML(lat, lng) {

    return `
    <div id="newgeopost" class="bgcolor">
    <table class="table left">
        <tbody>
            <tr>
                <td><input id="lat" size="10" type="hidden" value="`+ Number(lat) + `"></td>
                <td><input id="lon" size="10" type="hidden" value="`+ Number(lng) + `"></td>
                <td><input id="geohash" size="15" type="hidden"></td>
            </tr>
            <tr>
                <td colspan="3">
                    <textarea id="newgeopostta" maxlength="217" name="text" rows="4" cols="30"></textarea>
                </td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>
                    <input id="newpostgeobutton" value="Post" type="submit" onclick="geopost();">
                    <input id="newpostgeostatus" style="display: none;" value="Sending . . ." type="submit" disabled>
                    <div id="newpostgeocompleted"></div>
                </td>
                <td></td>
                <td></td>
            </tr>
            <tr style="height:20px"></tr>
        </tbody>
    </table>
    </div>`;
}

function getRefreshButtonHTML() {
    return `<a id="refreshbutton" class="btn" href="" onclick="displayContentBasedOnURLParameters();return false;">🔄</a>`;
}

function getMembersWithRatingHTML(i, page, data) {
    return `<tr>
                <td><div id="rating`+ i + page + san(data.address) + `"</div></td>
                <td>`+ getMemberLink(data.address, data.name) + `</td>
                <td>`+ getAddressLink(data.address, data.name) + `</td>                
                </tr>`;
}


function getMemberLink(address, name) {
    return `<a href="#member?qaddress=` + san(address) + `" onclick="showMember('` + san(address) + `')">` + ds(name) + `</a>`;
}

function getAddressLink(address, name) {
    return `<a href="#member?qaddress=` + san(address) + `" onclick="showMember('` + san(address) + `')">` + san(address) + `</a>`;
}

//Temporary function to bootstrap selection of members to rate
function getBootStrapHTML(pubkey, data, lbstcount) {
    return "<tr><td>" + getMemberLink(pubkey, data.ratername) + "</td>"
        + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td><td></td><td></td><td align='center'> <div id='rating" + lbstcount + san(data.testaddress) + "'></div>  </td><td></td><td></td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data.testaddress, data.name) + "</td><td>" + `<a href='#trustgraph?member=` + san(pubkey) + `&amp;target=` + san(data.testaddress) + `' onclick='showTrustGraph("` + san(pubkey) + `","` + san(data.testaddress) + `");'>Full Trust Graph</a>` + "</td></tr>";
}

//Map

function getMapCloseButtonHTML() {
    return `<font size="+3"><a href="#posts?type=top&amp;start=0&amp;limit=25" onclick="hideMap();showPosts(0,25,'all');">X</a></font>`;
}

function getOSMattributionHTML() {
    return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.';
}

function mapThreadLoadingHTML(previewHTML) {
    return "<div id='mapthread'>Loading..." + previewHTML + "</div>";
}

//notification
function escapeHTML(thetext) {
    return ds(thetext);
}

function getNotificationsTableHTML(contents, navbuttons) {
    return `<ul class="notificationslist">` + contents + `</ul>` + navbuttons;
}

//Trust graph
function getDirectRatingHTML(data) {
    return "<tr><td>" + getMemberLink(data[0], data[1]) + "</td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td><td></td><td></td><td align='center'> <div id='trust" + san(data[0]) + san(data[6]) + "'></div>  </td><td></td><td></td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data[6], data[7]) + "</td></tr>";
}

function getIndirectRatingHTML(data) {
    return "<tr><td>" + getMemberLink(data[0], data[1]) + "</td>" + "<td><img height='16' width='16' src='img/rightarrow.png'/></td><td> <div id='trust" + san(data[0]) + san(data[3]) + "'></div> </td><td><img height='16' width='16' src='img/rightarrow.png'/></td>" + "<td align='center'>" + getMemberLink(data[3], data[4]) + "</td>" + `<td><img height='16' width='16' src='img/rightarrow.png'/></td><td> <div id='trust` + san(data[3]) + san(data[6]) + "'> </div> </td><td><img height='16' width='16' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data[6], data[7]) + "</td></tr>";
}

function getTrustRatingTableHTML(contentsHTML, rating) {
    return "<span style='font-size:2em'>Overall Rating:" + Number(rating) + "/5.0</span><div id='overall'></div><br/><br/><table>" + contentsHTML + "</table>";
}

function rts(thetext) {
    //Sanitize text in ratings disabled mouseover. This is probably overkill
    return san(thetext);
}

//Settings
//These two functions could be combined
function ratingAndReasonHTML(data) {
    return "<tr><td>" + getMemberLink(data.address, data.name) + "</td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td><td></td><td></td><td align='center'> <div id='rating" + san(data.address) + "'></div>  </td><td></td><td></td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data.rates, data.rateename) + "</td><td><span class='separatornarrow'></span></td><td>" + ds(data.reason) + "</td></tr>";
}

function ratingAndReason2HTML(data) {
    return "<tr><td>" + getMemberLink(data.rateraddress, data.ratername) + "</td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td><td></td><td></td><td align='center'> <div id='rating" + san(data.rates) + "'></div>  </td><td></td><td></td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data.rates, data.name) + "</td><td><span class='separatornarrow'></span></td><td>" + ds(data.reason) + "</td></tr>";
}

function clickActionHTML(action, qaddress) {
    return `<a href='javascript:;' onclick='` + action + `("` + san(qaddress) + `");'>` + ds(action) + `</a>`;
}

function getRatingComment(qaddress, data) {
    return `<input size="30" maxlength="210" id="memberratingcommentinputbox` + san(qaddress) + `" value="` + (data.length > 0 ? ds(data[0].ratingreason) : "") + `" onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"></input>`;
}

function privatekeyClickToShowHTML() {
    return `<a id="privatekeyclicktoshow" onclick="document.getElementById('privatekeydisplay').style.display='block';document.getElementById('privatekeyclicktoshow').style.display='none';">Click To Show</a>`;
}

function getNestedPostHTML(data, targettxid, depth, pageName, highlighttxid) {
    var contents = "<ul>";
    for (var i = 0; i < data.length; i++) {
        if (data[i].retxid == targettxid) {
            contents = contents + `<li ` + (data[i].txid == highlighttxid ? `class="highlightli" id="highlightli"` : ``) + `>` + getHTMLForReply(data[i], depth, pageName, i, highlighttxid) + getNestedPostHTML(data, data[i].txid, depth + 1, pageName, highlighttxid) + "</li>";
        }
    }
    contents = contents + "</ul>";
    return contents;
}
