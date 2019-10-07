//All functions that generate HTML should be quarantined here. 
//This is a work in progress, HTML is fairly spread out at the moment

"use strict";
//Get html for a user, given their address and name
function userHTML(address, name, ratingID) {
    //TODO sanitize this data
    return `<a href="#member?qaddress=` + ds(address) + `" onclick="showMember('` + ds(address) + `')" class="hnuser">` + ds(name) + `</a>
    <div id="rating` + ratingID + `"></div>`;
}

function postlinkHTML(txid, linktext) {
    //TODO sanitize this data
    return `<a href="#thread?post=` + ds(txid) + `" onclick="showThread('` + ds(txid) + `')">` + ds(linktext) + `</a>`;
}

function getNavButtonsHTML(start, limit, page, type, qaddress, topicName, functionName) {

    //Caution topicname may contain hostile characters/code

    var navbuttons = `<div class="navbuttons">`;

    if (start != 0) //Don't show back buttons if we're at the start
    { navbuttons += `<a class="next" href="#` + page + `?start=` + (start - 25) + `&limit=` + limit + `&type=` + type + `&qaddress=` + qaddress + `&topicname=` + encodeURIComponent(topicName) + `" onclick="javascript:` + functionName + `(` + (start - 25) + `,` + limit + `,'` + page + `','` + qaddress + `','` + type + `','` + unicodeEscape(topicName) + `')">Back | </a> `; }
    { navbuttons += `<a class="back" href="#` + page + `?start=` + (start + 25) + `&limit=` + limit + `&type=` + type + `&qaddress=` + qaddress + `&topicname=` + encodeURIComponent(topicName) + `" onclick="javascript:` + functionName + `(` + (start + 25) + `,` + limit + `,'` + page + `','` + qaddress + `','` + type + `','` + unicodeEscape(topicName) + `')">Next</div>`; }
    return navbuttons;

}

function getItemListandNavButtonsHTML(contents, navbuttons) {
    return `<table class="itemlist" cellspacing="0" cellpadding="0" border="0"><tbody>`
        + contents + "</tbody></table>"
        + `<div style="text-align:right">` + navbuttons + `</div>`;
}

function getTableClassHTML(className, contents) {
    return `<table class="` + className + `" border="0"><tbody>` + contents + `</tbody></table>`;
}

function getHTMLForPostHTML(txid, address, name, likes, dislikes, tips, firstseen, message, roottxid, topic, replies, rank, page, ratingID) {
    if (name == null) { name = address.substring(0, 10); }

    return `<tr class="athing">
                <td class="title" valign="top" align="right"><span class="rank">`+ (rank == "" ? rank : rank + `.`) + `</span></td>
                <td class="votelinks" valign="top" rowspan="2">
                    <center><a href="javascript:;" onclick="likePost('`+ ds(txid) + `','` + ds(address) + `')"><div id="upvote` + ds(txid) + `" class="votearrow" title="upvote"></div></a></center>
                    <center><a href="javascript:;" onclick="dislikePost('`+ ds(txid) + `')"><div id="downvote` + ds(txid) + `" class="votearrow rotate180" title="downvote"></div></a></center>
                </td>
                <td class="title">
                    <a href="#thread?root=`+ ds(roottxid) + `&post=` + ds(txid) + `" onclick="showThread('` + ds(roottxid) + `','` + ds(txid) + `')">` + anchorme(ds(message), { attributes: [{ name: "target", value: "_blank" }] }) + `</a> ` +
        `</td>
            </tr>
            <tr>
                <td></td>
                <td class="subtext">
                    <span class="score">`+ (ds(likes) - ds(dislikes)) + ` likes and ` + ds(tips) + ` sats </span>`
        + (ds(name) == "" ? " " : `by ` + userHTML(address, name, ratingID) + `</div> `)
        + '<span class="topic">'
        + (topic == '' ? "" : `<a href="#topic?topicname=` + encodeURIComponent(topic) + `&start=0&limit=25" onclick="showTopic(0,25,'` + unicodeEscape(topic) + `')">to topic/` + ds(topic) + `</a> | `)
        + "</span>"
        + `<span class="age"><a>` + timeSince(ds(firstseen)) + `</a></span> | `
        //+(((ds(replies)-1)>-1)?`<a href="#thread?post=`+ds(roottxid)+`" onclick="showThread('`+ds(roottxid)+`')">`+(ds(replies)-1)+`&nbsp;comments</a> | `:``)
        + `<a href="#thread?root=` + ds(roottxid) + `&post=` + ds(txid) + `" onclick="showThread('` + ds(roottxid) + `','` + ds(txid) + `')">` + (Math.max(0, Number(ds(replies)))) + `&nbsp;comments</a> | `
        + `<a id="replylink` + page + ds(txid) + `" onclick="showReplyBox('` + page + ds(txid) + `');" href="javascript:;">reply</a>
                    | <a id="tiplink`+ page + ds(txid) + `" onclick="showTipBox('` + page + ds(txid) + `');" href="javascript:;">tip</a>
                    <span id="tipbox`+ page + ds(txid) + `" style="display:none">
                        <input id="tipamount`+ page + ds(txid) + `" type="number" value="0" min="0" style="width: 6em;" step="1000"/>
                        <input id="tipbutton`+ page + ds(txid) + `" value="tip" type="submit" onclick="sendTip('` + ds(txid) + `','` + ds(address) + `','` + ds(page) + `');"/>
                        <input id="tipstatus`+ page + ds(txid) + `"value="sending" type="submit" style="display:none" disabled/>
                    </span>
                 </td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td>
                    <div id="reply`+ page + ds(txid) + `" style="display:none">
                        <br/>
                        <textarea id="replytext`+ page + ds(txid) + `" rows="3"  style="width:100%;"></textarea>
                        <br/>
                        <input id="replybutton`+ page + ds(txid) + `" value="reply" type="submit" onclick="sendReply('` + ds(txid) + `','` + ds(page) + `','replystatus` + page + ds(txid) + `');"/>
                        <input id="replystatus`+ page + ds(txid) + `" value="sending..." type="submit"  style="display:none" disabled/>
                        <div id="replycompleted`+ page + ds(txid) + `" value=""/>
                    </div>
                </td>
            </tr>
            <tr class="spacer" style="height:5px"></tr>`;
}

function getHTMLForReplyHTML(txid, address, name, likes, dislikes, tips, firstseen, message, depth, page, ratingID, highlighttxid) {
    if (name == null) { name = address.substring(0, 10); }

    return `<tr class="athing comtr `
        + (txid == highlighttxid ? "highlight" : "") +
        `"><td>
            <table border="0"><tbody><tr>
                <td class="ind"><img src="s.gif" width="`+ depth + `" height="1"/></td>
                <td class="votelinks" valign="top">
                    <center><a href="javascript:;" onclick="likePost('`+ ds(txid) + `','` + ds(address) + `')"><div id="upvote` + ds(txid) + `" class="votearrow" title="upvote"></div></a></center>
                    <center><a href="javascript:;" onclick="dislikePost('`+ ds(txid) + `')"><div id="downvote` + ds(txid) + `" class="votearrow rotate180" title="downvote"></div></a></center>
                </td>
                <td class="default">
                    <div style="margin-top:2px; margin-bottom:-10px;">
                        <span class="comhead">`
        + userHTML(address, name, ratingID) + `
                            <span class="score">`+ (ds(likes) - ds(dislikes)) + ` likes and ` + ds(tips) + ` sats </span>
                            <span class="age"><a>`+ timeSince(ds(firstseen)) + `</a></span>
                            <span></span>
                            <span class="par"></span>
                            <a class="togg" n="8" >[-]</a>
                            <span class="storyon"></span>
                        </span>
                    </div>
                    <br/>
                    <div class="comment">
                        <span class="c00">`+ anchorme(ds(message).replace(/(?:\r\n|\r|\n)/g, '<br>'), { attributes: [{ name: "target", value: "_blank" }] }) + `
                            <div class="reply">
                                <font size="1">  <u><a id="replylink`+ page + ds(txid) + `" onclick="showReplyBox('` + page + ds(txid) + `');" href="javascript:;">reply</a></u></font>
                                <font size="1">| <u><a id="tiplink`+ page + ds(txid) + `" onclick="showTipBox('` + page + ds(txid) + `');" href="javascript:;">tip</a></u></font>
                                <span id="tipbox`+ page + ds(txid) + `" style="display:none">
                                    <input id="tipamount`+ page + ds(txid) + `" type="number" value="0" min="0" style="width: 6em;" step="1000"/>
                                    <input id="tipbutton`+ page + ds(txid) + `" value="tip" type="submit" onclick="sendTip('` + ds(txid) + `','` + ds(address) + `','` + ds(page) + `');"/>
                                    <input id="tipstatus`+ page + ds(txid) + `"value="sending" type="submit" style="display:none" disabled/>
                                </span>
                            </div>
                        </span>
                    </div>
                    <div id="reply`+ page + ds(txid) + `" style="display:none">
                        <br/>
                        <textarea id="replytext`+ page + ds(txid) + `" rows="3" rows="3" style="width:100%;"></textarea>
                        <br/>
                        <input id="replybutton`+ page + ds(txid) + `" value="reply" type="submit" onclick="sendReply('` + ds(txid) + `','` + ds(page) + `','replystatus` + page + ds(txid) + `');"/>
                        <input id="replystatus`+ page + ds(txid) + `" value="sending..." type="submit"  style="display:none" disabled/>
                        <div id="replycompleted`+ page + ds(txid) + `" value=""/>                       
                    </div>
                </td>
            </tr></tbody></table>
            </td></tr>`;
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

function getMapPostHTML(lat, lng) {

    return `
    <div id="newgeopost" class="bgcolor">
    <table class="table left">
        <tbody>
            <tr>
                <td><input id="lat" size="10" type="hidden" value="`+ lat + `"></td>
                <td><input id="lon" size="10" type="hidden" value="`+ lng + `"></td>
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