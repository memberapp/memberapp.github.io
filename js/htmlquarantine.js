//All functions that generate HTML should be quarantined here. 

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
    if (name == "" || name == null) {
        name = address.substring(0, 10);
    }
    var ret = `<a href="#member?qaddress=` + san(address) + `" onclick="showMember('` + san(address) + `')" class="hnuser">` + ds(name) + `</a> `;
    if (ratingStarSize > 0) {
        ret += `<div data-ratingsize="` + Number(ratingStarSize) + `" data-ratingaddress="` + san(address) + `" data-ratingraw="` + Number(ratingRawScore) + `" id="rating` + ratingID + `"></div>`;
    }
    return ret;
}

function postlinkHTML(txid, linktext) {
    return `<a href="#thread?post=` + san(txid) + `" onclick="showThread('` + san(txid) + `')">` + ds(linktext) + `</a>`;
}

function getNavButtonsNewHTML(order, content, topicnameHOSTILE, filter, start, limit, page, qaddress, functionName, numberOfResults) {
    //Caution topicname may contain hostile characters/code

    var navbuttons = `<div class="navbuttons">`;

    if (start != 0) //Don't show back buttons if we're at the start
    { navbuttons += `<a class="next" href="#show?start=` + (Number(start) - Number(numbers.results)) + `&limit=` + limit + `&order=` + order + `&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" onclick="javascript:` + functionName + `('` + order + `','` + content + `','` + unicodeEscape(topicnameHOSTILE) + `','` + filter + `',` + (start - numbers.results) + `,` + limit + `,'` + page + `','` + qaddress + `')">` + ___i18n('prev') + `</a> `; }
    if (numberOfResults > numbers.results) //Don't show next button unless the server has returned 1 additional set of results than requested
    { navbuttons += `<a class="back" href="#show?start=` + (Number(start) + Number(numbers.results)) + `&limit=` + limit + `&order=` + order + `&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" onclick="javascript:` + functionName + `('` + order + `','` + content + `','` + unicodeEscape(topicnameHOSTILE) + `','` + filter + `',` + (start + numbers.results) + `,` + limit + `,'` + page + `','` + qaddress + `')">` + ___i18n('next') + `</a>`; }
    return navbuttons;

}

function getNavButtonsHTML(start, limit, page, type, qaddress, topicName, functionName, numberOfResults) {

    //Caution topicname may contain hostile characters/code

    var navbuttons = `<div class="navbuttons">`;

    if (start != 0) //Don't show back buttons if we're at the start
    { navbuttons += `<a class="next" href="#` + page + `?start=` + (Number(start) - Number(numbers.results)) + `&limit=` + limit + `&type=` + type + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicName)) + `" onclick="javascript:` + functionName + `(` + (start - numbers.results) + `,` + limit + `,'` + page + `','` + qaddress + `','` + type + `','` + unicodeEscape(topicName) + `')">` + ___i18n('prev') + `</a> `; }
    if (numberOfResults > numbers.results) //Don't show next button unless the server has returned 1 additional set of results than requested
    { navbuttons += `<a class="back" href="#` + page + `?start=` + (Number(start) + Number(numbers.results)) + `&limit=` + limit + `&type=` + type + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicName)) + `" onclick="javascript:` + functionName + `(` + (start + numbers.results) + `,` + limit + `,'` + page + `','` + qaddress + `','` + type + `','` + unicodeEscape(topicName) + `')">` + ___i18n('next') + `</a>`; }
    return navbuttons;

}

function getItemListandNavButtonsHTML(contentsHTML, navbuttonsHTML, styletype, start) {
    if (styletype != "") {
        return `<div class="itemlist"><ol start="` + (Number(start) + 1) + `" class="` + styletype + `">` + contentsHTML + `</ol></div><div class="navbuttons">` + navbuttonsHTML + `</div>`;
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

    if (likeordislike == "1") {
        upvoteHTML = `<a id="upvoteaction` + san(txid) + `" href="javascript:;"><span id="upvote` + san(txid) + `" class="votearrowactivated" title="upvote"></span><span class="votetext">up</span></a>`;
        scoreHTML = `<span class="betweenvotesscoreup" id="score` + san(txid) + `">` + Number(score) + `</span>`;
    } else {
        upvoteHTML = `<a id="upvoteaction` + san(txid) + `" href="javascript:;" onclick="likePost('` + san(txid) + `','` + san(address) + `')"><span id="upvote` + san(txid) + `" class="votearrow" title="upvote"></span><span class="votetext">up</span></a>`;
    }

    if (likeordislike == "-1") {
        downvoteHTML = `<a id="downvoteaction` + san(txid) + `" href="javascript:;"><span id="downvote` + san(txid) + `" class="votearrowactivateddown rotate180" title="downvote"><span class="votetext">down</span></span></a>`;
        scoreHTML = `<span class="betweenvotesscoredown" id="score` + san(txid) + `">` + Number(score) + `</span>`;
    } else {
        downvoteHTML = `<a id="downvoteaction` + san(txid) + `" href="javascript:;" onclick="dislikePost('` + san(txid) + `')"><span id="downvote` + san(txid) + `" class="votearrow rotate180" title="downvote"><span class="votetext">down</span></span></a>`;
    }

    return upvoteHTML + " " + scoreHTML + " " + downvoteHTML;
}

function getReplyDiv(txid, page, differentiator) {
    page = page + differentiator;
    return `
        <div id="reply`+ page + san(txid) + `" style="display:none">
            <br/>
            <textarea id="replytext`+ page + san(txid) + `" rows="3"></textarea>
            <br/>
            <input id="replybutton`+ page + san(txid) + `" value="` + ___i18n('reply').toLowerCase() + `" type="submit" onclick="sendReply('` + san(txid) + `','` + page + `','replystatus` + page + san(txid) + `');"/>
            <input id="replystatus`+ page + san(txid) + `" value="sending..." type="submit"  style="display:none" disabled/>
            <div id="replycompleted`+ page + san(txid) + `" value=""></div>
        </div>`;
}

function getReplyAndTipLinksHTML(page, txid, address, article, geohash, differentiator, topicHOSTILE) {

    var page = page + differentiator; //This is so if the same post appears twice on the same page, there is a way to tell it apart
    var santxid = san(txid);
    var articleLink = "";
    var mapLink = "";

    if (article) {
        articleLink = `<a id="articlelink` + page + santxid + `" href="?` + santxid.substring(0, 4) + `#article?post=` + santxid.substring(0, 10) + `">article</a> `;
    }
    if (geohash != "") {
        mapLink = ` <a id="maplink` + page + santxid + `" onclick="showMap('` + san(geohash) + `','` + santxid + `');" href="javascript:;">🌍map</a> `;
    }
    var hideuserHTML = hideuserHTML = `<a id="hideuserlink` + page + santxid + `" onclick="hideuser('` + san(address) + `','','hideuserlink` + page + santxid + `');" href="javascript:;">flag(user)</a>`;
    if (topicHOSTILE != "") {
        hideuserHTML += `<a id="hideuserlink` + page + santxid + `" onclick="hideuser('` + san(address) + `','` + unicodeEscape(topicHOSTILE) + `','hideuserlink` + page + santxid + `');" href="javascript:;">flag(user for topic)</a>`;
    }
        
    
    return `
        <a id="permalink`+ page + santxid + `" href="?` + santxid.substring(0, 4) + `#thread?post=` + santxid.substring(0, 10) + `">permalink</a> `
        + articleLink
        + mapLink
        + `<a id="replylink` + page + santxid + `" onclick="showReplyBox('` + page + santxid + `');" href="javascript:;"> ` + ___i18n('reply').toLowerCase() + `</a>
        <a id="tiplink`+ page + santxid + `" onclick="showTipBox('` + page + santxid + `');" href="javascript:;">tip</a>
        <a  id="morelink`+ page + santxid + `" onclick="showMore('more` + page + santxid + `','morelink` + page + santxid + `');" href="javascript:;">+more</a>
        <span id="more`+ page + santxid + `" style="display:none">
        <a rel="noopener noreferrer" target="memo" href="https://memo.cash/a/` + santxid + `">memo</a>
            <a rel="noopener noreferrer" target="bitcoincom" href="https://explorer.bitcoin.com/bch/tx/` + santxid + `">bitcoin.com</a>
            <a rel="noopener noreferrer" target="blockchair" href="https://blockchair.com/bitcoin-cash/transaction/` + santxid + `">blockchair</a>
        </span>

        <a  id="moderatelink`+ page + santxid + `" onclick="showMore('moderate` + page + santxid + `','moderatelink` + page + santxid + `');" href="javascript:;">+moderate</a>
        <span id="moderate`+ page + santxid + `" style="display:none">
            <a id="hidepostlink`+ page + santxid + `" onclick="sendHidePost('` + santxid + `');" href="javascript:;">flag(post)</a>`
        + hideuserHTML +
        `</span>

        <span id="tipbox`+ page + santxid + `" style="display:none">
            <input id="tipamount`+ page + santxid + `" type="number" value="0" min="0" style="width: 6em;" step="1000"/>
            <input id="tipbutton`+ page + santxid + `" value="tip" type="submit" onclick="sendTip('` + santxid + `','` + san(address) + `','` + page + `');"/>
            <input id="tipstatus`+ page + santxid + `"value="sending" type="submit" style="display:none" disabled/>
        </span>`;
}

function getScoresHTML(txid, likes, dislikes, tips) {
    return ` <span class="score"><span class="likescounttext"><span id="likescount` + san(txid) + `">` + (Number(likes) - Number(dislikes)) + `</span> likes and</span> <span class="tipscounttext"><span id="tipscount` + san(txid) + `"  data-amount="` + Number(tips) + `">` + balanceString(Number(tips), false) + `</span></span></span>`;
}

function getAgeHTML(firstseen, compress) {
    return `<span class="age">` + timeSince(Number(firstseen), compress) + `</span>`;
}

function getTopicHTML(topicHOSTILE, append) {
    //If the topic is All Topics, keep that as the display name, but use the empty string for server
    var displayNameHOSTILE = topicHOSTILE;
    if (topicHOSTILE == '') {
        if (append != '') return '';
        displayNameHOSTILE = 'All Topics';
    }
    return ` <span class="topic">` +
        `<a href="#topic?topicname=` + encodeURIComponent(topicHOSTILE) + `&start=0&limit=` + numbers.results + `&order=new" onclick="showTopic(0,numbers.results,'` + unicodeEscape(topicHOSTILE) + `','new')">` + append + capitalizeFirstLetter(ds(displayNameHOSTILE).substr(0, 40)) + `</a>`
        + `</span>`;
}

function getPostListItemHTML(postHTML) {
    if (postHTML == "") {
        return "";
    }
    return `<li>` + postHTML + `</li>`;
}

function getHTMLForPostHTML(txid, address, name, likes, dislikes, tips, firstseen, message, roottxid, topic, replies, geohash, page, ratingID, likedtxid, likeordislike, repliesroot, rating, differentiator) {
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
    //var messageLinksHTML=`<a href="#thread?root=`+ san(roottxid) + `&post=` + san(txid) + `" onclick="showThread('` + san(roottxid) + `','` + san(txid) + `')">` + anchorme(messageHTML, { attributes: [{ name: "target", value: "_blank" }] }) + `</a>`;
    var messageLinksHTML = anchorme(messageHTML, { attributes: [{ name: "target", value: "_blank" }] });
    messageLinksHTML = DOMPurify.sanitize(messageLinksHTML);

    //Add youtube etc
    messageLinksHTML = addImageAndYoutubeMarkdown(messageLinksHTML, differentiator);

    if (messageLinksHTML.indexOf("<a ") == -1 && messageLinksHTML.indexOf("<iframe ") == -1) {//if no links
        messageLinksHTML = `<a href="#thread?root=` + san(roottxid) + `&post=` + san(txid) + `" onclick="showThread('` + san(roottxid) + `','` + san(txid) + `')">` + messageLinksHTML + `</a>`;
    }

    //Scan for XSS vulnerabilities


    return `<div class="post">
                <div class="votelinks">` + getVoteButtons(txid, address, likedtxid, likeordislike, (Number(likes) - Number(dislikes))) + `</div>
                <div class="postdetails">
                    <div class="title">`+ messageLinksHTML + ` </div>
                    <div class="subtext">
                        <span class="submitter"> 
                        submitted `
        + ` ` + getAgeHTML(firstseen)
        + ` ` + ___i18n('by') + ` `
        + userHTML(address, name, ratingID, rating, 8)
        + getTopicHTML(topic, 'to topic/')
        + `</span>`
        + `<span class="subtextbuttons">`
        + `<a href="#thread?root=` + san(roottxid) + `&post=` + san(txid) + `" onclick="showThread('` + san(roottxid) + `','` + san(txid) + `')">` + (Math.max(0, Number(replies))) + `&nbsp;`
        + ___i18n('comments').toLowerCase()
        + `</a> `
        + getScoresHTML(txid, likes, dislikes, tips)
        + ` `
        + getReplyAndTipLinksHTML(page, txid, address, true, geohash, differentiator, topic) +
        `</span>
                    </div>`
        + getReplyDiv(txid, page, differentiator) + `
                </div>
            </div>`;
}


function dslite(input) {
    //if (input === undefined) { return ""; };
    try {
        //If this error out 'input.replace not a number' probably input is not a string type
        input = input.replace(/&/g, '&amp;');
        //input = input.replace(/</g, '&lt;');
        //input = input.replace(/>/g, '&gt;');
        input = input.replace(/"/g, '&quot;');
        input = input.replace(/'/g, '&#x27;');
    } catch (e) {
        //Anything funky goes on, we'll return safe empty string
        return "";
    }
    return input;
}

function getHTMLForReplyHTML(txid, address, name, likes, dislikes, tips, firstseen, message, depth, page, ratingID, highlighttxid, likedtxid, likeordislike, blockstxid, rating, differentiator, topicHOSTILE) {
    if (name == null) { name = address.substring(0, 10); }
    //Remove html - use dslite here to allow for markdown including some characters
    message = dslite(message);

    //add images and youtube markdown
    //message=addImageAndYoutubeMarkdown(message);
    //add markdown
    message = ShowdownConverter.makeHtml(message);
    //message=SnuOwnd.getParser().render(message);

    //add links
    //message=anchorme(message, { attributes: [{ name: "target", value: "_blank" }] });
    //old newline
    //anchorme(ds(message).replace(/(?:\r\n|\r|\n)/g, '<br>')

    //check for XSS vulnerabilities
    message = DOMPurify.sanitize(message);

    //Add youtube links
    message = addImageAndYoutubeMarkdown(message, differentiator);


    return `<div ` + (txid.startsWith(highlighttxid) ? `class="reply highlight" id="highlightedcomment"` : `class="reply"`) + `>
                <div`+ (blockstxid != null ? ` class="blocked"` : ``) + `>
                    <div class="votelinks">` + getVoteButtons(txid, address, likedtxid, likeordislike) + `</div>
                    <div class="commentdetails">
                        <div class="comhead"> <a onclick="collapseComment('`+ san(txid) + `');" href="javascript:;">[-]</a> `
        + userHTML(address, name, ratingID, rating, 8)
        + getScoresHTML(txid, likes, dislikes, tips)
        + ` ` + getAgeHTML(firstseen) +
        `</div>
                        <div class="comment"><div class="commentbody">
                            `+ message + `
                            </div><div class="subtextbuttons">`+ getReplyAndTipLinksHTML(page, txid, address, false, "", differentiator, topicHOSTILE) + `</div>
                            `+ getReplyDiv(txid, page, differentiator) + `
                        </div>
                    </div>
                </div>
            </div>
            `;
}

function makeYoutubeIframe(youtubeid, starttime) {
    var src = event.srcElement.parentElement.parentElement.parentElement.parentElement;
    //setTimeout(function(){src.innerHTML='<div><br/><iframe class="youtubeiframe" src="https://www.youtube.com/embed/'+san(youtubeid)+'?rel=0&autoplay=1&showinfo=0" frameborder="0"></iframe></div>';},100);
    src.innerHTML = '<iframe width="480" height="270" class="youtubeiframe" src="https://www.youtube.com/embed/' + sanyoutubeid(youtubeid) + '?rel=0&autoplay=1&showinfo=0&start=' + starttime + '" frameborder="0"></iframe>';
}

function addImageAndYoutubeMarkdown(message, differentiator) {

    if (settings["showyoutube"] == "true") {
        //Youtube
        message = message.replace(/<a.*(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]{7,12})(?:[\&\?\#].*?)*?(?:([\&\?\#]t=)?(([\dhms]+))?).*<\/a>/,
            `<div class="youtubecontainer"><div class="youtubepreviewimage"><a onclick="makeYoutubeIframe('$1','$4');"><div class="youtubepreview"><img height="270" class="youtubepreviewimage" src="https://img.youtube.com/vi/$1/0.jpg"><img class="play-icon" alt="video post" width="100" src="img/youtubeplaybutton.svg"></div></a></div></div>`
        );
    }

    /*message=message.replace(/<a.*(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]{7,12}).*<\/a>/g,
    '<iframe class="youtubeiframe" src="https://www.youtube.com/embed/$1?rel=0&autoplay=0&showinfo=0" frameborder="0" allowfullscreen></iframe>'
    );*/

    /*message=message.replace(/<a.*(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]{7,12}).*<\/a>/g,
    '<iframe class="youtubeiframe" src="https://img.youtube.com/vi/$1/0.jpg" frameborder="0" allowfullscreen></iframe>'
    );*/

    //'<iframe class="youtubeiframe" src="https://www.youtube.com/embed/$1?rel=0&autoplay=0&showinfo=0" frameborder="0" allowfullscreen></iframe>'


    if (settings["showimgur"] == "true") {
        //Imgur
        message = message.replace(/<a.*(?:https?:\/\/)?(\w+\.)?imgur\.com(\/|\/a\/|\/gallery\/)(?!gallery)([\w\-_]{5,12})(\.[a-zA-Z]{3})*.*<\/a>/,
            '<a href="https://i.imgur.com$2$3" rel="noopener noreferrer" target="_imgur"><div class="imgurcontainer"><img class="imgurimage"  src="https://i.imgur.com$2$3.jpg" alt="imgur post $2"></div></a>'
        );
    }

    if (settings["showtwitter"] == "true") {
        //Twitter
        var tweetRegex = /<a.*https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/([0-9]{19})*.*<\/a>/;
        //This works but is ugly
        //Add differentiator so that if a tweet is shown multiple times, it has a different id each time
        message = message.replace(tweetRegex,
            '<div class="twittercontainer"><iframe  height="400" width="550" class="twitteriframe" id="tweet_$3' + differentiator + '" border=0 frameborder=0  src="https://twitframe.com/show?url=https%3A%2F%2Ftwitter.com%2F$1%2Fstatus%2F$3"></iframe></div>'
        );
    }


    //Twitter's preferred way to do this doesn't work well with Member's html construction
    /*
    let arr=message.match(tweetRegex);
    let id='';
    if(arr!=null){
        id = arr[3];
    }
    
    if(id!=''){
        message=message.replace(tweetRegex,`<div id='`+id+`'>test</div>`);
        twitterEmbeds.push(id);
    }*/

    return message;
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

function getMapPostHTML(lat, lng, requireLogin) {

    var loginRequired = "";
    if (requireLogin) {
        loginRequired = ` <a href="#login" onclick="showLogin();">(Login Required)</a>`;
    }
    return `
    <div id="newgeopost" class="bgcolor">
        <input id="lat" size="10" type="hidden" value="`+ Number(lat) + `">
        <input id="lon" size="10" type="hidden" value="`+ Number(lng) + `">
        <input id="geohash" size="15" type="hidden">
        <textarea class="geoposttextarea" id="newgeopostta" maxlength="217" name="text" rows="4"></textarea><br/>
        <input id="newpostgeobutton" value="Post" type="submit" onclick="geopost();">`
        + loginRequired
        + `<input id="newpostgeostatus" style="display: none;" value="Sending . . ." type="submit" disabled>
        <div id="newpostgeocompleted"></div>    
    </div>`;
}

function getRefreshButtonHTML() {
    return `<a id="refreshbutton" class="btn" href="" onclick="displayContentBasedOnURLParameters();return false;">🔄</a>`;
}

function getMembersWithRatingHTML(i, page, data, action, reverse) {
    var field1 = `<td>` + userHTML(data.address, data.name, i + page + data.address, data.rating, 8) + `</td>`;
    var field2 = `<td>` + getMemberLink(data.address2, data.name2) + `</td>`;
    if (reverse) {
        return `<tr>` + field2 + `<td>` + action + `</td>` + field1 + `</tr>`;
    }
    return `<tr>` + field1 + `<td>` + action + `</td>` + field2 + `</tr>`;
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
    return `<font size="+3"><a href="#posts?type=all&amp;start=0&amp;limit=` + numbers.results + `" onclick="hideMap();showPosts(0,numbers.results,'all');">X</a></font>`;
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
    return "<tr><td>" + getMemberLink(data.member, data.membername) + "</td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td><td></td><td></td><td align='center'> <div id='trust" + san(data.member) + san(data.target) + "'></div>  </td><td></td><td></td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data.target, data.targetname) + "</td></tr>";
}

function getIndirectRatingHTML(data) {
    return "<tr><td>" + getMemberLink(data.member, data.membername) + "</td>" + "<td><img height='16' width='16' src='img/rightarrow.png'/></td><td> <div id='trust" + san(data.member) + san(data.inter) + "'></div> </td><td><img height='16' width='16' src='img/rightarrow.png'/></td>" + "<td align='center'>" + getMemberLink(data.inter, data.intername) + "</td>" + `<td><img height='16' width='16' src='img/rightarrow.png'/></td><td> <div id='trust` + san(data.inter) + san(data.target) + "'> </div> </td><td><img height='16' width='16' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data.target, data.targetname) + "</td></tr>";
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
    return "<tr><td>" + getMemberLink(data.address, data.name) + "</td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td><td></td><td></td><td align='center'> <div id='crating" + san(data.address) + "'></div>  </td><td></td><td></td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data.rates, data.rateename) + "</td><td><span class='separatornarrow'></span></td><td>" + ds(data.reason) + "</td></tr>";
}

function ratingAndReason2HTML(data) {
    return "<tr><td>" + getMemberLink(data.rateraddress, data.ratername) + "</td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td><td></td><td></td><td align='center'> <div id='rating" + san(data.rates) + "'></div>  </td><td></td><td></td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data.rates, data.name) + "</td><td><span class='separatornarrow'></span></td><td>" + ds(data.reason) + "</td></tr>";
}

function clickActionNamedHTML(action, qaddress, name) {
    return `<a href='javascript:;' onclick='` + action + `("` + unicodeEscape(qaddress) + `");'>` + ds(name) + `</a>`;
}

function clickActionTopicHTML(action, qaddress, topicHOSTILE, buttonText, elementid) {
    return `<a id='` + san(elementid) + `' href='javascript:;' onclick='` + action + `("` + unicodeEscape(qaddress) + `","` + unicodeEscape(topicHOSTILE) + `","` + san(elementid) + `");'>` + ds(buttonText) + `</a>`;
}

function getRatingComment(qaddress, data) {
    return `<input size="30" maxlength="210" id="memberratingcommentinputbox` + san(qaddress) + `" value="` + (data.length > 0 ? ds(data[0].ratingreason) : "") + `" onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"></input>`;
}

function privatekeyClickToShowHTML() {
    return `<a id="privatekeyclicktoshow" onclick="document.getElementById('privatekeydisplay').style.display='block';document.getElementById('privatekeyclicktoshow').style.display='none';">` + ___i18n('text') + `</a>`;
}

function getNestedPostHTML(data, targettxid, depth, pageName, highlighttxid, firstreplytxid) {
    var contents = "<ul>";
    for (var i = 0; i < data.length; i++) {
        if ((data[i].retxid == targettxid || data[i].retxid == firstreplytxid) && data[i].txid != firstreplytxid) {
            contents += `<li id="LI` + san(data[i].txid) + `"` + (data[i].txid.startsWith(highlighttxid) ? `class="highlightli" ` : ``) + `>` + getHTMLForReply(data[i], depth, pageName, i, highlighttxid) + getNestedPostHTML(data, data[i].txid, depth + 1, pageName, highlighttxid, "dontmatch") + "</li>";
            contents += `<li class="collapsed" style="display: none;" id="CollapsedLI` + san(data[i].txid) + `"><div class="comhead"><a onclick="uncollapseComment('` + san(data[i].txid) + `');" href="javascript:;">[+] </a>`
                + userHTML(data[i].address, data[i].name, data[i].ratingID, data[i].rating, 0)
                + getScoresHTML(data[i].txid, data[i].likes, data[i].dislikes, data[i].tips)
                + ` ` + getAgeHTML(data[i].firstseen)
                + `</div></li>`;
        }
    }
    contents = contents + "</ul>";
    return contents;
}

function getHTMLForTopicArray(data) {

    var ret = getHTMLForTopic(data[0]);

    //This line so the alternate coloring on table rows still works
    ret += "<tr style='display:none'></tr>";

    ret += `<tr style='display:none' id='modmore` + data[0].mostrecent + `'><td colspan='4'>`;
    if (data[0].topic != "") {
        ret += clickActionNamedHTML("unsub", data.topicname, "Unsubscribe") + "<br/>";
    }
    var alreadymod = false;
    for (var i = 0; i < data.length; i++) {
        if (data[i].existingmod == pubkey) {
            ret += clickActionTopicHTML("dismiss", pubkey, data[i].topicname, "Resign as moderator", "dismiss" + Number(data[i].mostrecent)) + '<br/>';
            alreadymod = true;
        }
    }
    if (!alreadymod) {
        ret += clickActionTopicHTML("designate", pubkey, data[0].topicname, "Volunteer to moderate", "designate" + Number(data[0].mostrecent)) + '<br/>';
    }

    for (var i = 0; i < data.length; i++) {
        if (data[i].existingmod == pubkey) continue;
        if (data[i].existingmod != null) {
            if (data[i].existingmodaddress != null) {
                ret += clickActionTopicHTML("dismiss", data[i].existingmod, data[i].topicname, "Remove Filter ", "dismiss" + data[i].existingmod + Number(data[i].mostrecent)) + "( " + userHTML(data[i].existingmod, data[i].existingmodname, "", "", 0) + ")<br/>";
            } else {
                ret += clickActionTopicHTML("designate", data[i].existingmod, data[i].topicname, "Add Filter ", "designate" + data[i].existingmod + Number(data[i].mostrecent)) + "( " + userHTML(data[i].existingmod, data[i].existingmodname, "", "", 0) + ")<br/>";
            }
        }
    }
    ret += "</td></tr>";
    return ret;
}

function getHTMLForTopic(data) {
    var ret = "";
    var subscribe = clickActionNamedHTML("sub", data.topicname, "sub");

    //Show more button if the user is subscribed or topic is emtpy string
    if (data.address != null || data.topicname == "") {
        subscribe = `<a id="modmorelink` + data.mostrecent + `" onclick="showMore('modmore` + data.mostrecent + `','modmorelink` + data.mostrecent + `');" href="javascript:;">more</a>`;
    }
    //Special values for empty topic
    if (data.topicname == "") {
        data.messagescount = "";
        data.subscount = "";
    }
    ret += "<tr><td class='tltopicname'>" + getTopicHTML(data.topicname, '') + "</td><td class='tlmessagecount'>" + Number(data.messagescount) + "</td><td class='tlsubscount'>" + Number(data.subscount) + "</td><td class='tlaction'>" + subscribe + "</td></tr>";
    return ret;

}

function sendEncryptedMessageHTML(address, name, publickey) {
    return ` <a onclick="populateSendMessage('` + san(address) + `','` + unicodeEscape(name) + `','` + san(publickey) + `');" href='javascript:;'>Send Message</a>`;
}

function populateSendMessage(address, name, publickey) {
    show('messagesanchor');
    if(publickey==null || publickey==""){
        alert("Public key is not available - maybe the user hasn't set their name/handle.");
        return;
    }
    document.getElementById('sendmessagebox').style.display = 'block';
    document.getElementById('messagerecipient').innerText = name;
    document.getElementById('messageaddress').innerText = address;
    document.getElementById('messagepublickey').innerText = publickey;
}

function collapseComment(commentid) {
    document.getElementById('LI' + commentid).style.display = 'none';
    document.getElementById('CollapsedLI' + commentid).style.display = 'block';
}

function uncollapseComment(commentid) {
    document.getElementById('LI' + commentid).style.display = 'block';
    document.getElementById('CollapsedLI' + commentid).style.display = 'none';
}

function getMessageHTML(data,count) {
    var contents = "";
    // Decrypt the message
    let ecpair = new BITBOX.ECPair().fromWIF(privkey);
    var privateKeyBuf = Buffer.from(ecpair.d.toHex(), 'hex');
    decryptMessageAndPlaceInDiv(privateKeyBuf,data.message,data.roottxid);
    contents += "<li>" + userHTML(data.address, data.name, count+"privatemessages"+data.address, data.rating, 16) + " " + getAgeHTML(data.firstseen, false) +" "+sendEncryptedMessageHTML(data.address, data.name, data.publickey)+"<br/><div id='"+san(data.roottxid)+"'>processing</div><br/></li>";
    return contents;
}

async function decryptMessageAndPlaceInDiv(privateKeyBuf,message,roottxid){
    //const privateKeyBuf5 = wif.decode(privkey).privateKey;
    var decryptedMessage = "Try again later: Unable to decrypt message: ";
    try {
        const encrypted = eccryptoJs.deserialize(Buffer.from(message, 'hex'));
        const structuredEj = await eccryptoJs.decrypt(privateKeyBuf, encrypted);
        decryptedMessage = structuredEj.toString();

    } catch (err) {
        decryptedMessage+=err;
        console.log(err);
        await sleep(500);
    }
    //decrypted message can contain anything - don't do anything fancy with it - js/css risk!
    document.getElementById(roottxid).innerText=decryptedMessage;
}

function getNothingFoundMessageHTML(message){
    return "<div class='message'>" + message + "</div>";
}

//nb iframe not allowed by twitter
function createiframe(url,elementname){
    document.getElementById(elementname).innerHTML=`<iframe height="400" width="550" id="alsotweet" border=0 frameborder=0 src="`+url+`"></iframe>`;
}