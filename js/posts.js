
function getAndPopulate(start, limit, page, qaddress, type) {
    document.getElementById(page).innerHTML = "";
    show(page);
    var navbuttons = `<div class="navbuttons">`;
    if (start != 0) navbuttons += `<a class="next" href="#` + page + `?start=` + (start - 25) + `&limit=` + limit + `&type=` + type + `&qaddress=` + qaddress + `" onclick="javascript:getAndPopulate(` + (start - 25) + `,` + limit + `,'` + page + `','` + qaddress + `','` + type + `')">Back | </a> `;
    navbuttons += `<a class="back" href="#` + page + `?start=` + (start + 25) + `&limit=` + limit + `&type=` + type + `&qaddress=` + qaddress + `" onclick="javascript:getAndPopulate(` + (start + 25) + `,` + limit + `,'` + page + `','` + qaddress + `','` + type + `')">Next</div>`;
    getJSON(server + '?action=' + page + '&address=' + pubkey + '&type=' + type + '&qaddress=' + qaddress + '&start=' + start + '&limit=' + limit).then(function (data) {
        data = mergeRepliesToRepliesBySameAuthor(data);
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + getHTMLForPost(data[i], i + 1 + start, page, i);
        }
        if (contents == "") { contents = "Nothing in this feed yet"; }
        contents = `<table class="itemlist" cellspacing="0" cellpadding="0" border="0"><tbody>` + contents + "<tr><td/><td/><td>" + navbuttons + "</td></tr></tbody></table>";
        document.getElementById(page).innerHTML = contents; //display the result in an HTML element
        addStarRatings(data, page);
        window.scrollTo(0, 0);
    }, function (status) { //error detection....
        alert('Something went wrong.');
    });

}

function addStarRatings(data, page, disable) {
    for (var i = 0; i < data.length; i++) {
        var theAddress = ds(data[i].address);
        var theElement = document.querySelector("#rating" + i + page + theAddress);
        if (theElement == undefined) continue;
        var theRating = 0; if (data[i].rating != null) { theRating = (ds(data[i].rating) / 64) + 1; }
        var starRating1 = raterJs({
            starSize: 8,
            rating: Math.round(theRating * 10) / 10,
            element: document.querySelector("#rating" + i + page + theAddress),
            disableText: 'This user rates ' + ds(data[i].name) + ' as {rating}/{maxRating}',
            rateCallback: function rateCallback(rating, done) {
                rateCallbackAction(rating, this);
                done();
            }
        });
        starRating1.theAddress = theAddress;
        if (disable) {
            starRating1.disable();
        }
    }
}

function getAndPopulateTopic(start, limit, topicname) {
    //Note topicname may contain hostile code - treat with extreme caution
    var page = "topic";
    show(page);
    document.getElementById(page).innerHTML = "";
    var navbuttons = `<div class="navbuttons">`;
    if (start != 0) navbuttons += `<a class="next" href="#` + page + `?topicname=` + encodeURIComponent(topicname) + `&start=` + (start - 25) + `&limit=` + limit + `" onclick="javascript:getAndPopulateTopic(` + (start - 25) + `,` + limit + `,'` + unicodeEscape(topicname) + `')">Back | </a> `;
    navbuttons += `<a class="back" href="#` + page + `?topicname=` + encodeURIComponent(topicname) + `&start=` + (start + 25) + `&limit=` + limit + `" onclick="javascript:getAndPopulateTopic(` + (start + 25) + `,` + limit + `,'` + unicodeEscape(topicname) + `')">Next</div>`;
    getJSON(server + '?action=' + page + '&address=' + pubkey + '&topicname=' + encodeURIComponent(topicname) + '&start=' + start + '&limit=' + limit).then(function (data) {
        var contents = "";
        contents = contents + `<table class="itemlist" cellspacing="0" cellpadding="0" border="0"><tbody>`;
        for (var i = 0; i < data.length; i++) {
            contents = contents + getHTMLForPost(data[i], i + 1 + start, page, i);
        }
        contents = contents + "<tr><td/><td/><td>" + navbuttons + "</td></tr></tbody></table>";
        document.getElementById(page).innerHTML = contents; //display the result in an HTML element
        addStarRatings(data, page);
        window.scrollTo(0, 0);
    }, function (status) { //error detection....
        alert('Something went wrong.');
    });

}





function getHTMLForPost(data, rank, page, starindex) {
    if (checkForMutedWords(data)) return "";
    return `<tr class="athing">
                <td class="title" valign="top" align="right"><span class="rank">`+ rank + `.</span></td>
                <td class="votelinks" valign="top" rowspan="2">
                    <center><a href="javascript:;" onclick="likePost('`+ ds(data.txid) + `')"><div id="upvote` + ds(data.txid) + `" class="votearrow" title="upvote"></div></a></center>
                    <center><a href="javascript:;" onclick="dislikePost('`+ ds(data.txid) + `')"><div id="downvote` + ds(data.txid) + `" class="votearrow rotate180" title="downvote"></div></a></center>
                </td>
                <td class="title">
                    <a href="#thread?root=`+ ds(data.roottxid) + `&post=` + ds(data.txid) + `" onclick="showThread('` + ds(data.roottxid) + `','` + ds(data.txid) + `')">` + anchorme(ds(data.message), { attributes: [{ name: "target", value: "_blank" }] }) + `</a> ` +
        `</td>
            </tr>
            <tr>
                <td></td>
                <td class="subtext">
                    <span class="score">`+ (ds(data.likes) - ds(data.dislikes)) + ` likes and ` + ds(data.tips) + ` sats </span>`
        + (ds(data.name) == "" ? " " : `by <a href="#member?qaddress=` + ds(data.address) + `" onclick="showMember('` + ds(data.address) + `')" class="hnuser">` + ds(data.name) + `</a> <div id="rating` + starindex + page + ds(data.address) + `"></div> `)
        + '<span class="topic">'
        + (data.topic == '' ? "" : `<a href="#topic?topicname=` + encodeURIComponent(data.topic) + `&start=0&limit=25" onclick="showTopic(0,25,'` + unicodeEscape(data.topic) + `')">to topic/` + ds(data.topic) + `</a> | `)
        + "</span>"
        + `<span class="age"><a>` + timeSince(ds(data.firstseen)) + `</a></span> | `
        //+(((ds(data.replies)-1)>-1)?`<a href="#thread?post=`+ds(data.roottxid)+`" onclick="showThread('`+ds(data.roottxid)+`')">`+(ds(data.replies)-1)+`&nbsp;comments</a> | `:``)
        + `<a href="#thread?root=` + ds(data.roottxid) + `&post=` + ds(data.txid) + `" onclick="showThread('` + ds(data.roottxid) + `','` + ds(data.txid) + `')">` + (ds(data.replies)) + `&nbsp;comments</a> | `
        + `<a id="replylink` + page + ds(data.txid) + `" onclick="showReplyBox('` + page + ds(data.txid) + `');" href="javascript:;">reply</a>
                    | <a id="tiplink`+ page + ds(data.txid) + `" onclick="showTipBox('` + page + ds(data.txid) + `');" href="javascript:;">tip</a>
                    <span id="tipbox`+ page + ds(data.txid) + `" style="display:none">
                        <input id="tipamount`+ page + ds(data.txid) + `" type="number" value="0" min="0" style="width: 6em;" step="1000"/>
                        <input id="tipbutton`+ page + ds(data.txid) + `" value="tip" type="submit" onclick="sendTip('` + ds(data.txid) + `','` + ds(data.address) + `','` + ds(page) + `');"/>
                        <input id="tipstatus`+ page + ds(data.txid) + `"value="sending" type="submit" style="display:none" disabled/>
                    </span>
                 </td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td>
                    <div id="reply`+ page + ds(data.txid) + `" style="display:none">
                        <br/>
                        <textarea id="replytext`+ page + ds(data.txid) + `" rows="3"  style="width:100%;"></textarea>
                        <br/>
                        <input id="replybutton`+ page + ds(data.txid) + `" value="reply" type="submit" onclick="sendReply('` + ds(data.txid) + `','` + ds(page) + `','replystatus` + page + ds(data.txid) + `');"/>
                        <input id="replystatus`+ page + ds(data.txid) + `" value="sending..." type="submit"  style="display:none" disabled/>
                        <input id="replyclear`+ page + ds(data.txid) + `" value="clear" type="submit"  style="display:none" onclick="showReplyButton('` + ds(data.txid) + `','` + ds(page) + `','replystatus` + page + ds(data.txid) + `');"/>
                    </div>
                </td>
            </tr>
            <tr class="spacer" style="height:5px"></tr>`;
}

function getHTMLForReply(data, depth, page, starindex, highlighttxid) {
    if (checkForMutedWords(data)) return "";
    if (data.name == null) { data.name = data.address.substring(0, 10); }
    return `<tr class="athing comtr `
        + (data.txid == highlighttxid ? "highlight" : "") +
        `"><td>
            <table border="0"><tbody><tr>
                <td class="ind"><img src="s.gif" width="`+ depth + `" height="1"/></td>
                <td class="votelinks" valign="top">
                    <center><a href="javascript:;" onclick="likePost('`+ ds(data.txid) + `')"><div id="upvote` + ds(data.txid) + `" class="votearrow" title="upvote"></div></a></center>
                    <center><a href="javascript:;" onclick="dislikePost('`+ ds(data.txid) + `')"><div id="downvote` + ds(data.txid) + `" class="votearrow rotate180" title="downvote"></div></a></center>
                </td>
                <td class="default">
                    <div style="margin-top:2px; margin-bottom:-10px;">
                        <span class="comhead">
                            <a href="#member?qaddress=`+ ds(data.address) + `" onclick="showMember('` + ds(data.address) + `')" class="hnuser">` + ds(data.name) + `</a>
                            <div id="rating`+ starindex + page + ds(data.address) + `"></div>
                            <span class="score">`+ (ds(data.likes) - ds(data.dislikes)) + ` likes and ` + ds(data.tips) + ` sats </span>
                            <span class="age"><a>`+ timeSince(ds(data.firstseen)) + `</a></span>
                            <span></span>
                            <span class="par"></span>
                            <a class="togg" n="8" >[-]</a>
                            <span class="storyon"></span>
                        </span>
                    </div>
                    <br/>
                    <div class="comment">
                        <span class="c00">`+ anchorme(ds(data.message).replace(/(?:\r\n|\r|\n)/g, '<br>'), { attributes: [{ name: "target", value: "_blank" }] }) + `
                            <div class="reply">
                                <font size="1">  <u><a id="replylink`+ page + ds(data.txid) + `" onclick="showReplyBox('` + page + ds(data.txid) + `');" href="javascript:;">reply</a></u></font>
                                <font size="1">| <u><a id="tiplink`+ page + ds(data.txid) + `" onclick="showTipBox('` + page + ds(data.txid) + `');" href="javascript:;">tip</a></u></font>
                                <span id="tipbox`+ page + ds(data.txid) + `" style="display:none">
                                    <input id="tipamount`+ page + ds(data.txid) + `" type="number" value="0" min="0" style="width: 6em;" step="1000"/>
                                    <input id="tipbutton`+ page + ds(data.txid) + `" value="tip" type="submit" onclick="sendTip('` + ds(data.txid) + `','` + ds(data.address) + `','` + ds(page) + `');"/>
                                    <input id="tipstatus`+ page + ds(data.txid) + `"value="sending" type="submit" style="display:none" disabled/>
                                </span>
                            </div>
                        </span>
                    </div>
                    <div id="reply`+ page + ds(data.txid) + `" style="display:none">
                        <br/>
                        <textarea id="replytext`+ page + ds(data.txid) + `" rows="3" rows="3" style="width:100%;"></textarea>
                        <br/>
                        <input id="replybutton`+ page + ds(data.txid) + `" value="reply" type="submit" onclick="sendReply('` + ds(data.txid) + `','` + ds(page) + `','replystatus` + page + ds(data.txid) + `');"/>
                        <input id="replystatus`+ page + ds(data.txid) + `" value="sending..." type="submit"  style="display:none" disabled/>
                        <input id="replyclear`+ page + ds(data.txid) + `" value="clear" type="submit"  style="display:none" onclick="showReplyButton('` + ds(data.txid) + `','` + ds(page) + `','replystatus` + page + ds(data.txid) + `');"/>                       
                    </div>
                </td>
            </tr></tbody></table>
            </td></tr>`;
}

function showReplyButton(txid, page, divForStatus) {
    document.getElementById("replyclear" + page + txid).style.display = "none";
    document.getElementById("replybutton" + page + txid).style.display = "block";
    document.getElementById("replytext" + page + txid).value = "";
}

function sendReply(txid, page, divForStatus) {
    if (!checkForPrivKey()) return false;

    var replytext = document.getElementById("replytext" + page + txid).value;
    if (replytext.length == 0) {
        alert("Nothing to send");
        return false;
    }
    //Hide the reply button, show the reply status button
    document.getElementById("replybutton" + page + txid).style.display = "none";
    document.getElementById("replystatus" + page + txid).style.display = "block";

    var replytext = document.getElementById("replytext" + page + txid).value;
    const replyhex = new Buffer(replytext).toString('hex');
    //const decoded = new Buffer(encoded, 'hex').toString(); // decoded === "This is my string to be encoded/decoded"
    //no wait for the first reply
    sendReplyRaw(privkey, txid, replyhex, 0, divForStatus,
        function () {
            document.getElementById(divForStatus).innerHTML = "";
            document.getElementById("replystatus" + page + txid).style.display = "none";
            document.getElementById("replyclear" + page + txid).style.display = "block";
        }
    );
    return true;
}

function showReplyBox(txid) {
    if (privkey == "") {
        alert("You must login with a private key to reply to posts.");
        return false;
    }
    document.getElementById("reply" + txid).style.display = "block";
    //document.getElementById("replylink"+txid).style.display = "none";
    return true;
}

var defaulttip = 1000;

function sendTip(txid, tipAddress, page) {
    if (!checkForPrivKey()) return false;

    //document.getElementById("tipbox" + page + txid).style.display = "none";
    //document.getElementById("tiplink" + page + txid).style.display = "block";

    document.getElementById('tipbutton' + page + txid).style.display = "none";
    document.getElementById('tipstatus' + page + txid).style.display = "block";

    var tipAmount = parseInt(document.getElementById("tipamount" + page + txid).value);
    if (tipAmount < 547) {
        alert("547 (dust+1) is the minimum tip possible");
        return false;
    }
    defaulttip = tipAmount;

    document.getElementById('tipstatus' + page + txid).value = "Sending Tip . . " + tipAmount;

    sendTipRaw(txid, tipAddress, page, tipAmount, privkey,
        function () {
            document.getElementById('tipstatus' + page + txid).value = "sent";
        }
    );

}

function showTipBox(txid) {
    if (privkey == "") {
        alert("You must login with a private key to tip.");
        return false;
    }
    if (document.getElementById("tipamount" + txid).value == 0) {
        document.getElementById("tipamount" + txid).value = defaulttip;
    }

    document.getElementById("tipbox" + txid).style.display = "block";
    //document.getElementById("tiplink"+txid).style.display = "none";
    return true;
}

function post() {
    if (!checkForPrivKey()) return false;
    var txtarea = document.getElementById('newpostta');
    var posttext = txtarea.value;
    if (posttext.length == 0) {
        alert("No Message Body");
        return false;
    }

    document.getElementById('newpostbutton').style.display = "none";
    document.getElementById('newpoststatus').style.display = "block";
    document.getElementById('newpoststatus').value = "Sending Title...";

    postRaw(posttext, privkey, "newpoststatus", memocompleted);

    //if (typeof popupOverlay !== "undefined") {
    //    popupOverlay.hide();
    //}
}

function postmemorandum() {
    if (!checkForPrivKey()) return false;
    var posttext = document.getElementById('memorandumtitle').value;
    if (posttext.length == 0) {
        alert("No Title");
        return false;
    }
    var postbody = document.getElementById('newposttamemorandum').value;
    if (postbody.length == 0) {
        alert("No Message Body");
        return false;
    }

    document.getElementById('newpostmemorandumbutton').style.display = "none";
    document.getElementById('newpostmemorandumstatus').style.display = "block";
    document.getElementById('newpostmemorandumstatus').value = "Sending Title...";

    const tx = {
        data: ["0x6d02", posttext],
        cash: { key: privkey }
    }

    postmemorandumRaw(posttext, postbody, privkey, "newpostmemorandumstatus", memorandumpostcompleted);

    //if (typeof popupOverlay !== "undefined") {
    //    popupOverlay.hide();
    //}
}

function memorandumpostcompleted() {
    document.getElementById('newpostmemorandumstatus').style.display = "none";
    document.getElementById('newpostmemorandumclear').style.display = "block";
}

function memocompleted() {
    document.getElementById('newpoststatus').style.display = "none";
    document.getElementById('newpostclear').style.display = "block";
}

function clearmemorandumpost() {
    document.getElementById('memorandumtitle').value = "";
    document.getElementById('newposttamemorandum').value = "";
    document.getElementById('newpostmemorandumbutton').style.display = "block";
    document.getElementById('newpostmemorandumclear').style.display = "none";
}

function clearpost() {
    document.getElementById('newpostta').value = "";
    document.getElementById('newpostbutton').style.display = "block";
    document.getElementById('newpostclear').style.display = "none";
}


function checkForMutedWords(data) {
    for (var i = 0; i < mutedwords.length; i++) {
        if (mutedwords[i] == "") continue;
        var checkfor = mutedwords[i].toLowerCase();
        if (data.message != undefined && data.message.toLowerCase().contains(checkfor)) return true;
        if (data.name != undefined && data.name.toLowerCase().contains(checkfor)) return true;
        if (data.address != undefined && data.address.toLowerCase().contains(checkfor)) return true;
        if (data.topic != undefined && ("(" + data.topic.toLowerCase() + ")").contains(checkfor)) return true;

    }
    return false;
}

