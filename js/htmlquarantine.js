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
function userHTML(address, name, ratingID) {
    //TODO sanitize this data
    return `<a href="#member?qaddress=` + san(address) + `" onclick="showMember('` + san(address) + `')" class="hnuser">` + ds(name) + `</a>
    <div id="rating` + ratingID + `"></div>`;
}

function postlinkHTML(txid, linktext) {
    //TODO sanitize this data
    return `<a href="#thread?post=` + san(txid) + `" onclick="showThread('` + san(txid) + `')">` + ds(linktext) + `</a>`;
}

function getNavButtonsHTML(start, limit, page, type, qaddress, topicName, functionName) {

    //Caution topicname may contain hostile characters/code

    var navbuttons = `<div class="navbuttons">`;

    if (start != 0) //Don't show back buttons if we're at the start
    { navbuttons += `<a class="next" href="#` + page + `?start=` + (start - 25) + `&limit=` + limit + `&type=` + type + `&qaddress=` + qaddress + `&topicname=` + encodeURIComponent(topicName) + `" onclick="javascript:` + functionName + `(` + (start - 25) + `,` + limit + `,'` + page + `','` + qaddress + `','` + type + `','` + unicodeEscape(topicName) + `')">Back | </a> `; }
    { navbuttons += `<a class="back" href="#` + page + `?start=` + (start + 25) + `&limit=` + limit + `&type=` + type + `&qaddress=` + qaddress + `&topicname=` + encodeURIComponent(topicName) + `" onclick="javascript:` + functionName + `(` + (start + 25) + `,` + limit + `,'` + page + `','` + qaddress + `','` + type + `','` + unicodeEscape(topicName) + `')">Next</div>`; }
    return navbuttons;

}

function getItemListandNavButtonsHTML(contentsHTML, navbuttonsHTML) {
    return `<table class="itemlist" cellspacing="0" cellpadding="0" border="0"><tbody>`
        + contentsHTML + "</tbody></table>"
        + `<div style="text-align:right">` + navbuttonsHTML + `</div>`;
}

function getTableClassHTML(className, contentsHTML) {
    return `<table class="` + className + `" border="0"><tbody>` + contentsHTML + `</tbody></table>`;
}

function getVoteButtons(txid, address, likedtxid, dislikedtxid) {
    var upvoteHTML;
    if (likedtxid == null) {
        upvoteHTML = `<center><a id="upvoteaction` + san(txid) + `" href="javascript:;" onclick="likePost('` + san(txid) + `','` + san(address) + `')"><div id="upvote` + san(txid) + `" class="votearrow" title="upvote"></div></a></center>`;
    } else {
        upvoteHTML = `<center><a id="upvoteaction` + san(txid) + `" href="javascript:;"><div id="upvote` + san(txid) + `" class="votearrowactivated" title="upvote"></div></a></center>`;
    }

    var downvoteHTML;
    if (dislikedtxid == null) {
        downvoteHTML = `<center><a id="downvoteaction` + san(txid) + `" href="javascript:;" onclick="dislikePost('` + san(txid) + `')"><div id="downvote` + san(txid) + `" class="votearrow rotate180" title="downvote"></div></a></center>`;
    } else {
        downvoteHTML = `<center><a id="downvoteaction` + san(txid) + `" href="javascript:;"><div id="downvote` + san(txid) + `" class="votearrowactivated rotate180" title="downvote"></div></a></center>`;
    }
    return upvoteHTML + downvoteHTML;
}

function getReplyDiv(txid, page) {
    return `
        <div id="reply`+ page + san(txid) + `" style="display:none">
            <br/>
            <textarea id="replytext`+ page + san(txid) + `" rows="3"  style="width:100%;"></textarea>
            <br/>
            <input id="replybutton`+ page + san(txid) + `" value="reply" type="submit" onclick="sendReply('` + san(txid) + `','` + page + `','replystatus` + page + san(txid) + `');"/>
            <input id="replystatus`+ page + san(txid) + `" value="sending..." type="submit"  style="display:none" disabled/>
            <div id="replycompleted`+ page + san(txid) + `" value=""/>
        </div>`;
}

function getReplyAndTipLinksHTML(page,txid,address){
    return `
        <font size="1">  <u><a id="replylink`+ page + san(txid) + `" onclick="showReplyBox('` + page + san(txid) + `');" href="javascript:;">reply</a></u></font>
        <font size="1">| <u><a id="tiplink`+ page + san(txid) + `" onclick="showTipBox('` + page + san(txid) + `');" href="javascript:;">tip</a></u></font>
        <span id="tipbox`+ page + san(txid) + `" style="display:none">
            <input id="tipamount`+ page + san(txid) + `" type="number" value="0" min="0" style="width: 6em;" step="1000"/>
            <input id="tipbutton`+ page + san(txid) + `" value="tip" type="submit" onclick="sendTip('` + san(txid) + `','` + san(address) + `','` + page + `');"/>
            <input id="tipstatus`+ page + san(txid) + `"value="sending" type="submit" style="display:none" disabled/>
        </span>`;
}

function getScoresHTML(txid, likes, dislikes, tips){
    return ` <span class="score"><span id="likescount` + san(txid) + `">` + (Number(likes) - Number(dislikes)) + `</span> likes and <span id="tipscount` + san(txid) + `">` + Number(tips) + `</span> sats </span>`;
}

function getAgeHTML(firstseen){
    return `<span class="age"><a>` + timeSince(Number(firstseen)) + `</a></span>`;
}

function getTopicHTML(topic){
    return ` <span class="topic">` + 
    (topic == '' ? "" : `<a href="#topic?topicname=` + encodeURIComponent(topic) + `&start=0&limit=25" onclick="showTopic(0,25,'` + unicodeEscape(topic) + `')">to topic/` + ds(topic) + `</a> | `) 
    + `</span>`;
}

function getHTMLForPostHTML(txid, address, name, likes, dislikes, tips, firstseen, message, roottxid, topic, replies, rank, page, ratingID, likedtxid, likedtipamount, dislikedtxid) {
    if (name == null) { name = address.substring(0, 10); }

    return `<tr class="athing">
                <td class="title" valign="top" align="right"><span class="rank">`+ (rank == "" ? rank : rank + `.`) + `</span></td>
                <td class="votelinks" valign="top" rowspan="2">` + getVoteButtons(txid, address, likedtxid, dislikedtxid) + `</td>
                <td class="title"><a href="#thread?root=`+ san(roottxid) + `&post=` + san(txid) + `" onclick="showThread('` + san(roottxid) + `','` + san(txid) + `')">` + anchorme(ds(message), { attributes: [{ name: "target", value: "_blank" }] }) + `</a> </td>
            </tr>
            <tr>
                <td></td>
                <td class="subtext">`
                    + getScoresHTML(txid, likes, dislikes, tips)
                    +`by ` + userHTML(address, name, ratingID) 
                    + getTopicHTML(topic)
                    + getAgeHTML(firstseen) + ` | `
                    + `<a href="#thread?root=` + san(roottxid) + `&post=` + san(txid) + `" onclick="showThread('` + san(roottxid) + `','` + san(txid) + `')">` + (Math.max(0, Number(replies))) + `&nbsp;comments</a> | `
                    + getReplyAndTipLinksHTML(page,txid,address)+`
                </td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td>`+ getReplyDiv(txid, page) + `</td>
            </tr>
            <tr class="spacer" style="height:5px"></tr>`;
}



function getHTMLForReplyHTML(txid, address, name, likes, dislikes, tips, firstseen, message, depth, page, ratingID, highlighttxid, likedtxid, likedtipamount, dislikedtxid) {
    if (name == null) { name = address.substring(0, 10); }

    return `<tr ` + (txid == highlighttxid ? `class="athing comtr highlight" id="highlightedcomment"` : `class="athing comtr"`) + `>
                <td>
                    <table border="0"><tbody><tr>
                        <td class="ind"><img src="s.gif" width="`+ depth + `" height="1"/></td>
                        <td class="votelinks" valign="top">` + getVoteButtons(txid, address, likedtxid, dislikedtxid) + `</td>
                        <td class="default">
                            <div style="margin-top:2px; margin-bottom:-10px;">
                                <span class="comhead">`
                                + userHTML(address, name, ratingID)
                                + getScoresHTML(txid, likes, dislikes, tips) 
                                + getAgeHTML(firstseen) + 
                                `</span>
                            </div>
                            <br/>
                            <div class="comment">
                                <span class="c00">`+ anchorme(ds(message).replace(/(?:\r\n|\r|\n)/g, '<br>'), { attributes: [{ name: "target", value: "_blank" }] }) + `
                                    <div class="reply">`+getReplyAndTipLinksHTML(page,txid,address)+`</div>
                                </span>
                            </div>
                            `+ getReplyDiv(txid, page) + `
                        </td>
                    </tr></tbody></table>
                </td>
            </tr>`;
}


function notificationItemHTML(iconHTML, mainbodyHTML, subtextHTML, addendumHTML) {
    //icon, mainbody and subtext should already be escaped and HTML formatted
    return `<tr><td class="title">
    <tr class="spacer" style="height:15px"></tr>
    <tr class="athing">
    <td class="title" valign="top" align="right"><span class="notificationrank">`+ iconHTML + `</span></td>
    <td class="title" colspan="2">`+ mainbodyHTML + `<br/><span class="age">` + subtextHTML + `</span></td>
    </tr>
    <tr class="spacer" style="height:5px"></tr>`
        + addendumHTML +
        `<tr><td></td><td colspan="2" style="border-bottom: 1px solid #4cca47"></td></tr></td></tr>`;
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

function getRefreshButtonHTML(){
    return `<a id="refreshbutton" class="btn" href="" onclick="displayContentBasedOnURLParameters();return false;">🔄</a>`;
}

function getMembersWithRatingHTML(i,page,data){
    return `<tr>
                <td><div id="rating`+i+page+ san(data.address) + `"</div></td>
                <td>`+getMemberLink(data.address, data.name)+`</td>
                <td>`+getAddressLink(data.address, data.name)+`</td>                
                </tr>`;
}


function getMemberLink(address, name) {
    return `<a href="#member?qaddress=` + san(address) + `" onclick="showMember('` + san(address) + `')">` + ds(name) + `</a>`;
}

function getAddressLink(address, name) {
    return `<a href="#member?qaddress=` + san(address) + `" onclick="showMember('` + san(address) + `')">` + san(address) + `</a>`;
}

//Temporary function to bootstrap selection of members to rate
function getBootStrapHTML(pubkey,data,lbstcount){
    return "<tr><td>" + getMemberLink(pubkey,data.ratername) + "</td>" 
    + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td><td></td><td></td><td align='center'> <div id='rating" + lbstcount+san(data.testaddress) + "'></div>  </td><td></td><td></td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data.testaddress,data.name) + "</td><td>"+`<a href='#trustgraph?member=` + san(pubkey) + `&amp;target=` + san(data.testaddress) + `' onclick='showTrustGraph("` + san(pubkey) + `","` + san(data.testaddress) + `");'>Full Trust Graph</a>`+"</td></tr>";
}

//Map

function getMapCloseButtonHTML(){
    return `<font size="+3"><a href="#posts?type=top&amp;start=0&amp;limit=25" onclick="hideMap();showPosts(0,25,'top');">X</a></font>`;
}

function getOSMattributionHTML(){
    return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.';
}

function mapThreadLoadingHTML(previewHTML){
    return "<div id='mapthread'>Loading..." + previewHTML + "</div>" ;
}

//notification
function escapeHTML(thetext){
    return ds(thetext);
}

function getNotificationsTableHTML(contents,navbuttons){
    return `<table class="itemlist" cellspacing="0" cellpadding="0" border="0"><tbody>` + contents + "<tr><td/><td/><td><br/>" + navbuttons + "</td></tr></tbody></table>";
}

//Trust graph
function getDirectRatingHTML(data){
    return "<tr><td>" + getMemberLink(data[0], data[1]) + "</td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td><td></td><td></td><td align='center'> <div id='trust" + san(data[0]) + san(data[6]) + "'></div>  </td><td></td><td></td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data[6], data[7]) + "</td></tr>";
}

function getIndirectRatingHTML(data){
    return "<tr><td>" + getMemberLink(data[0], data[1]) + "</td>" + "<td><img height='16' width='16' src='img/rightarrow.png'/></td><td> <div id='trust" + san(data[0]) + san(data[3]) + "'></div> </td><td><img height='16' width='16' src='img/rightarrow.png'/></td>" + "<td align='center'>" + getMemberLink(data[3], data[4]) + "</td>" + `<td><img height='16' width='16' src='img/rightarrow.png'/></td><td> <div id='trust` + san(data[3]) + san(data[6]) + "'> </div> </td><td><img height='16' width='16' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data[6], data[7]) + "</td></tr>";
}

function getTrustRatingTableHTML(contentsHTML, rating){
    return "<span style='font-size:2em'>Overall Rating:" + Number(rating) + "/5.0</span><div id='overall'></div><br/><br/><table>" + contentsHTML + "</table>";
}

function rts(thetext){
    //Sanitize text in ratings disabled mouseover. This is probably overkill
    return san(thetext);
}

//Settings
//These two functions could be combined
function ratingAndReasonHTML(data){
    return "<tr><td>" + getMemberLink(data.address, data.name) + "</td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td><td></td><td></td><td align='center'> <div id='rating" + san(data.address) + "'></div>  </td><td></td><td></td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data.rates, data.rateename) + "</td><td>|</td><td>" + ds(data.reason) + "</td></tr>";
}

function ratingAndReason2HTML(data){
    return "<tr><td>" + getMemberLink(data.rateraddress, data.ratername) + "</td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td><td></td><td></td><td align='center'> <div id='rating" + san(data.rates) + "'></div>  </td><td></td><td></td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data.rates, data.name) + "</td><td>|</td><td>" + ds(data.reason) + "</td></tr>";
}

function clickActionHTML(action, qaddress){
    return `<a href='javascript:;' onclick='`+action+`("` + san(qaddress) + `");'>`+ds(action)+`</a>`;
}

function getRatingComment(qaddress,data){
    return `<input size="30" maxlength="210" id="memberratingcommentinputbox` + san(qaddress) + `" value="` + (data.length > 0 ? ds(data[0].ratingreason) : "") + `" onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"></input>`;
}

function privatekeyClickToShowHTML(){
    return `<a id="privatekeyclicktoshow" onclick="document.getElementById('privatekeydisplay').style.display='block';document.getElementById('privatekeyclicktoshow').style.display='none';">Click To Show</a><div style="display:none;"  id="privatekeydisplay"></div>`;
}
