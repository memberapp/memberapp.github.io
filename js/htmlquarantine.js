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
function userHTML(address, name, ratingID, ratingRawScore, ratingStarSize, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, theObj) {
    if(!address){
        return "error:no address for user";
    }
    if (name == "" || name == null) {
        name = address.substring(0, 10);
    }

    var userclass="hnuser";
    var profilemeta="profile-meta";
    var curTime = new Date().getTime()/1000;

    if(!nametime || curTime-nametime<60*60*24*7*2){
        //if the user has changed name in the past two weeks
        userclass="hnuser newuser";
        profilemeta="profile-meta newuser";
    }

    var memberpic = `<svg class="jdenticon" width="20" height="20" data-jdenticon-value="` + san(address) + `"></svg>`;
    if (picurl) {
        var pictype = '.jpg';
        if (picurl.toLowerCase().endsWith('.png')) {
            pictype = '.png';
        }
        memberpic = `<span class="memberpicsmall" style="display:inline;"><img class="memberpicturesmall" width='15' height='15' src='` + profilepicbase + san(address) + `.128x128` + pictype + `'/></span>`;
    }

    var linkStart = `<a href="#member?qaddress=` + san(address) + `" onclick="nlc();" class="`+userclass+`">`;
    var linkEnd = `</a> `;
    var ret = `<span class="memberfilter"><span id="memberinfo` + ratingID + `">` + linkStart + memberpic
        + `<span class="member-handle">` + ds(name) + `</span>` + linkEnd + `</span>`;
    var ratingHTML = `<div class="starrating"><div data-ratingsize="` + Number(ratingStarSize) + `" data-ratingaddress="` + san(address) + `" data-ratingraw="` + Number(ratingRawScore) + `" id="rating` + ratingID + `"></div></div>`;
    if (ratingStarSize > 0) {
        ret += ratingHTML;
    }
    var followButton=`<a class="follow" href="javascript:;" onclick="follow('` + unicodeEscape(address) + `'); this.style.display='none';">follow</a>`;
    if(isfollowing){
        followButton=`<a class="unfollow" href="javascript:;" onclick="unfollow('` + unicodeEscape(address) + `'); this.style.display='none';">unfollow</a>`;
    }
    ret += `<span style="display:none;" id="profileinfo` + ratingID + `" data-profileaddress="` + san(address) + `" class="profilepreview">`
        + `<div class='`+profilemeta+`'>`
        + linkStart + memberpic + linkEnd
        + linkStart + "<span class='member-handle'>" + ds(name) + "</span>" + linkEnd
        + ratingHTML
        + linkStart + "<span class='member-pagingid'>@" + ds(pagingid) + "</span>" + linkEnd
        + `</div>`
        + `<div class='profile-text'><span class='profilepreviewtext'>` + ds(profile) + `</span></div> `
        + `<div class='profile-actions'><span class='profilepreviewfollowers'><a href="#followers?qaddress=` + san(address) + `" onclick="nlc();">` + Number(followers) + ` followers</a></span> `
        + `<span class='profilepreviewfollowers'><a href="#following?qaddress=` + san(address) + `" onclick="nlc();">` + Number(following) + ` following</a></span> `
        + `<span class='profilepreviewfollowbutton'>`+followButton+`</span></div> `
        + `</span></span>`;

    if (theObj) {
        //These must all be HTML safe.
        theObj.address = san(address);
        theObj.profilepic = memberpic;
        theObj.handle = ds(name);
        theObj.pagingid = ds(pagingid);
    }
    return ret;
}

function userFromDataBasic(data, mainRatingID, size) {
    return userHTML(data.address, data.name, mainRatingID, data.raterrating, size, data.pagingid, data.publickey, data.picurl, data.tokens, data.followers, data.following, data.blockers, data.blocking, data.profile, data.isfollowing, data.nametime);
}

function postlinkHTML(txid, linktext) {
    return `<a href="#thread?post=` + san(txid) + `" onclick="nlc();">` + ds(linktext) + `</a>`;
}

function getNavButtonsNewHTML(order, content, topicnameHOSTILE, filter, start, limit, page, qaddress, functionName, numberOfResults) {
    //Caution topicname may contain hostile characters/code

    var navbuttons = `<div class="navbuttons">`;

    if (start != 0) //Don't show back buttons if we're at the start
    { navbuttons += `<a class="next" href="#show?start=` + (Number(start) - Number(numbers.results)) + `&limit=` + limit + `&order=` + order + `&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >` + getSafeTranslation('prev') + `</a> `; }

    //Removing this if, because sometimes flagged posts are removed server side, so this condition may be true even where there are more results to return.
    //Proper fix is to have the server return a flag to say if there are more results available.
    if (numberOfResults > numbers.results) //Don't show next button unless the server has returned 1 additional set of results than requested
    { navbuttons += `<a class="back" href="#show?start=` + (Number(start) + Number(numbers.results)) + `&limit=` + limit + `&order=` + order + `&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >` + getSafeTranslation('next') + `</a>`; }
    return navbuttons;

}

function getNavButtonsHTML(start, limit, page, type, qaddress, topicName, functionName, numberOfResults) {

    //Caution topicname may contain hostile characters/code

    var navbuttons = `<div class="navbuttons">`;

    if (start != 0) //Don't show back buttons if we're at the start
    { navbuttons += `<a class="next" href="#` + page + `?start=` + (Number(start) - Number(numbers.results)) + `&limit=` + limit + `&type=` + type + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicName)) + `">` + getSafeTranslation('prev') + `</a> `; }
    //Removing this if, because sometimes flagged posts are removed server side, so this condition may be true even where there are more results to return.
    //Proper fix is to have the server return a flag to say if there are more results available.
    if (numberOfResults > numbers.results) //Don't show next button unless the server has returned 1 additional set of results than requested
    { navbuttons += `<a class="back" href="#` + page + `?start=` + (Number(start) + Number(numbers.results)) + `&limit=` + limit + `&type=` + type + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicName)) + `">` + getSafeTranslation('next') + `</a>`; }
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
        <div id="reply` + san(txid) + page + `" style="display:none">
            <br/>
            <textarea id="replytext`+ page + san(txid) + `" rows="3"></textarea>
            <br/>
            <input id="replybutton`+ page + san(txid) + `" value="` + getSafeTranslation('reply').toLowerCase() + `" type="submit" onclick="sendReply('` + san(txid) + `','` + page + `','replystatus` + page + san(txid) + `');"/>
            <input id="replystatus`+ page + san(txid) + `" value="sending..." type="submit"  style="display:none" disabled/>
            <div id="replycompleted`+ page + san(txid) + `" value=""></div>
        </div>`;
}

function getReplyAndTipLinksHTML(page, txid, address, article, geohash, differentiator, topicHOSTILE, repostcount, repostidtxid) {

    var page = page + differentiator; //This is so if the same post appears twice on the same page, there is a way to tell it apart
    var santxid = san(txid);
    var articleLink = "";
    var mapLink = "";

    if (article) {
        articleLink = `<a id="articlelink` + page + santxid + `" href="?` + santxid.substring(0, 4) + `#article?post=` + santxid.substring(0, 10) + `">article</a> `;
    }
    if (geohash != null && geohash != "") {
        mapLink = ` <a id="maplink` + page + santxid + `" href="#map?geohash=` + san(geohash) + `&post=` + santxid + `">🌍map</a> `;
    }
    var hideuserHTML = hideuserHTML = `<a id="hideuserlink` + page + santxid + `" onclick="hideuser('` + san(address) + `','','hideuserlink` + page + santxid + `');" href="javascript:;">flag(user)</a>`;
    if (topicHOSTILE != "") {
        hideuserHTML += `<a id="hideuserlink` + page + santxid + `" onclick="hideuser('` + san(address) + `','` + unicodeEscape(topicHOSTILE) + `','hideuserlink` + page + santxid + `');" href="javascript:;">flag(user for topic)</a>`;
    }

    var remembersActive = "remebersactive";
    var remembersOnclick = ` onclick="repostPost('` + santxid + `','` + page + `'); this.class='remebersinactive'; this.onclick='';" href="javascript:;"`;
    if (repostidtxid != null && repostidtxid != '') {
        remembersActive = "remebersinactive";
        remembersOnclick = ` `;
    }

    var permalink = `?` + santxid.substring(0, 4) + `#thread?post=` + santxid.substring(0, 10);
    if (pathpermalinks) {
        permalink = `p/` + santxid.substring(0, 10);
    }
    return mapLink +
        `<a id="replylink` + santxid + page + `" onclick="showReplyBox('` + santxid + page + `');" href="javascript:;"> ` + getSafeTranslation('reply') + `</a>
        <span class="rememberscounttext"><a class="`+ remembersActive + `" id="repostlink` + page + santxid + `" ` + remembersOnclick + `> <span class="repostscount" id="repostscount` + santxid + `"> ` + Number(repostcount) + " </span>" + getSafeTranslation('remembers') + `</a></span>
        <a id="tiplink`+ page + santxid + `" onclick="showTipBox('` + page + santxid + `');" href="javascript:;">tip</a>
        <a id="quotelink`+ page + santxid + `" href="#new?txid=` + santxid + `">quote</a>
        <a id="morelink`+ page + santxid + `" onclick="showMore('more` + page + santxid + `','morelink` + page + santxid + `');" href="javascript:;">+more</a>
        <span id="more`+ page + santxid + `" style="display:none">
            <a class="permalink" id="permalink`+ page + santxid + `" href="` + permalink + `">permalink</a> `
        + articleLink + `
            <a rel="noopener noreferrer" target="memo" href="https://memo.cash/a/` + santxid + `">memo</a>
            <a rel="noopener noreferrer" target="bitcoincom" href="https://explorer.bitcoin.com/bch/tx/` + santxid + `">bitcoin.com</a>
            <a rel="noopener noreferrer" target="blockchair" href="https://blockchair.com/bitcoin-cash/transaction/` + santxid + `">blockchair</a>
            <a rel="noopener noreferrer" target="btccom" href="https://bch.btc.com/` + santxid + `">btc.com</a>
            <a rel="noopener noreferrer" target="bitcoinunlimited" href="https://explorer.bitcoinunlimited.info/tx/` + santxid + `">bitcoin unlimited</a>
            <a id="hidepostlink`+ page + santxid + `" onclick="sendHidePost('` + santxid + `');" href="javascript:;">flag(post)</a>`
        + hideuserHTML +
        `</span>

        <span id="tipbox`+ page + santxid + `" style="display:none">
            <input id="tipamount`+ page + santxid + `" type="number" value="0" min="0" style="width: 6em;" step="1000"/>
            <input id="tipbutton`+ page + santxid + `" value="tip" type="submit" onclick="sendTip('` + santxid + `','` + san(address) + `','` + page + `');"/>
            <input id="tipstatus`+ page + santxid + `"value="sending" type="submit" style="display:none" disabled/>
        </span>`;
}

function getScoresHTML(txid, likes, dislikes, tips, differentiator) {
    return ` <span id="scores` + san(txid) + differentiator + `" class="score"><span class="likescounttext"><span id="likescount` + san(txid) + `">` + (Number(likes) - Number(dislikes)) + `</span> likes and</span> <span class="tipscounttext"><span id="tipscount` + san(txid) + `"  data-amount="` + Number(tips) + `">` + balanceString(Number(tips), false) + `</span></span></span>`;
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
        `<a href="#topic?topicname=` + encodeURIComponent(topicHOSTILE) + `&start=0&limit=` + numbers.results + `&order=new" onclick="nlc();">` + append + capitalizeFirstLetter(ds(displayNameHOSTILE).substr(0, 40)) + `</a>`
        + `</span>`;
}

function getPostListItemHTML(postHTML) {
    if (postHTML == "") {
        return "";
    }
    return `<li>` + postHTML + `</li>`;
}

function replacePageName(match, p1, p2, offset, string) {
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    return p1 + `<a href="#member?pagingid=` + encodeURIComponent(p2) + `" onclick="nlc();">@` + ds(p2) + `</a>`;
}

function getHTMLForPostHTML(txid, address, name, likes, dislikes, tips, firstseen, message, roottxid, topic, replies, geohash, page, ratingID, likedtxid, likeordislike, repliesroot, rating, differentiator, repostcount, repostidtxid, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, repostedHTML) {

    if (!address) { return ""; }
    if (!name) { name = address.substring(0, 10); }
    repliesroot = Number(repliesroot);
    replies = Number(replies);
    //Replies respect newlines, but root posts do not
    var isReply = (roottxid != txid);
    var messageHTML = ds(message);
    messageHTML = messageHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');

    //ShowdownConverter.setOption('ghMentionsLink', "#member?pagingid={u}");
    //Add paging ids
    messageHTML = messageHTML.replace(/(^|\s)@([^.,\/#!$%\^&\*;:{}=\-`~()'"@<>\ \n?]{1,217})/g, replacePageName);
    //messageHTML = messageHTML.replace(/(@[^.,\/#!$%\^&\*;:{}=\-`~()'"@<>\ \n?]{1,217})/g,'<a href="#member?pagingid=$1">$1</a>');

    if (!isReply) {
        //only if main post
        if (repliesroot > replies) {
            replies = repliesroot;
        }
    }
    var messageLinksHTML = anchorme(messageHTML, { attributes: [{ name: "target", value: "_blank" }] });

    //Scan for XSS vulnerabilities
    messageLinksHTML = DOMPurify.sanitize(messageLinksHTML);

    //Add youtube etc
    messageLinksHTML = addImageAndYoutubeMarkdown(messageLinksHTML, differentiator, false);

    if (messageLinksHTML.indexOf("<a ") == -1 && messageLinksHTML.indexOf("<iframe ") == -1) {//if no links
        messageLinksHTML = `<a href="#thread?root=` + san(roottxid) + `&post=` + san(txid) + `" onclick="nlc();">` + messageLinksHTML + `</a>`;
    }

    var obj = {
        //These must all be HTML safe 
        message: messageLinksHTML,
        replies: Number(replies),
        likes: (Number(likes) - Number(dislikes)),
        remembers: Number(repostcount),
        tips: Number(tips),
        txid: san(txid),
        elapsed: getAgeHTML(firstseen, false),
        elapsedcompressed: getAgeHTML(firstseen, true)
    };

    var retVal = `<div class="post">
                <div class="votelinks">` + getVoteButtons(txid, address, likedtxid, likeordislike, (Number(likes) - Number(dislikes))) + `</div>
                <div class="postdetails">
                    <div class="title"><p>`+ messageLinksHTML + `</p></div>`
                    + repostedHTML
                    +`<div class="subtext">
                        <span class="submitter"> 
                        <span class="plaintext">submitted</span> `
        + ` ` + getAgeHTML(firstseen)
        + ` <span class="plaintext">` + getSafeTranslation('by') + `</span> `
        + userHTML(address, name, ratingID, rating, 8, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, obj)
        + getTopicHTML(topic, 'to topic/')
        + `</span>`
        + `<span class="subtextbuttons">`
        + `<a href="#thread?root=` + san(roottxid) + `&post=` + san(txid) + `" onclick="nlc();">` + (Math.max(0, Number(replies))) + `&nbsp;`
        + getSafeTranslation('comments').toLowerCase()
        + `</a> `
        + getScoresHTML(txid, likes, dislikes, tips, differentiator)
        + ` `
        + getReplyAndTipLinksHTML(page, txid, address, true, geohash, differentiator, topic, repostcount, repostidtxid) +
        `</span></div>
        <div id="scoresexpanded`+ san(txid) + differentiator + `" class="scoreexpanded"></div>`
        + getReplyDiv(txid, page, differentiator) + `
                </div>
            </div>`;

    if (theStyle == 'nifty' || theStyle == 'none') {
        return templateReplace(templatePost, obj);
    }
    return retVal;
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

function getHTMLForReplyHTML(txid, address, name, likes, dislikes, tips, firstseen, message, depth, page, ratingID, highlighttxid, likedtxid, likeordislike, blockstxid, rating, differentiator, topicHOSTILE, moderatedtxid, repostcount, repostidtxid, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime) {
    if (name == null) { name = address.substring(0, 10); }
    //Remove html - use dslite here to allow for markdown including some characters
    message = dslite(message);

    //add images and youtube markdown
    //message=addImageAndYoutubeMarkdown(message);
    //add markdown
    message = ShowdownConverter.makeHtml(message);
    //message=SnuOwnd.getParser().render(message);

    //message = anchorme(message, { attributes: [{ name: "target", value: "_blank" }] });

    //check for XSS vulnerabilities
    message = DOMPurify.sanitize(message);

    //Add youtube links

    message = addImageAndYoutubeMarkdown(message, differentiator, true);


    return `<div ` + (txid.startsWith(highlighttxid) ? `class="reply highlight" id="highlightedcomment"` : `class="reply"`) + `>
                <div`+ (blockstxid != null || moderatedtxid != null ? ` class="blocked"` : ``) + `>
                    <div class="votelinks">` + getVoteButtons(txid, address, likedtxid, likeordislike, (Number(likes) - Number(dislikes))) + `</div>
                    <div class="commentdetails">
                        <div class="comhead"> <a onclick="collapseComment('`+ san(txid) + `');" href="javascript:;">[-]</a> `
        + userHTML(address, name, ratingID, rating, 8, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime)
        + `</div>
                        <div class="comment"><div class="commentbody">
                            `+ message + `
                            </div><div class="subtextbuttons">`+ getScoresHTML(txid, likes, dislikes, tips, differentiator)
        + ` ` + getAgeHTML(firstseen) + ` ` + getReplyAndTipLinksHTML(page, txid, address, false, "", differentiator, topicHOSTILE, repostcount, repostidtxid) + `</div>
                            `+ getReplyDiv(txid, page, differentiator) + `
                        </div>
                        <div id="scoresexpanded`+ san(txid) + differentiator + `" class="scoreexpanded"></div>
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

function addImageAndYoutubeMarkdown(message, differentiator, global) {

    //These links should all have been generated by software, so should have a pattern of <a href=" pattern.

    if (settings["showyoutube"] == "true") {
        //Youtube
        var youtubeRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/.*?(?:watch|embed)?(?:.*?v=|v\/|\/)([\w\-_]{7,12})(?:[\&\?\#].*?)*?(?:([\&\?\#]t=)?(([\dhms]+))?).*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/.*?(?:watch|embed)?(?:.*?v=|v\/|\/)([\w\-_]{7,12})(?:[\&\?\#].*?)*?(?:([\&\?\#]t=)?(([\dhms]+))?).*?<\/a>/i;
        message = message.replace(youtubeRegex,
            `<div class="youtubecontainer"><div class="youtubepreviewimage"><a onclick="makeYoutubeIframe('$1','$4');"><div class="youtubepreview"><img height="270" class="youtubepreviewimage" src="https://img.youtube.com/vi/$1/0.jpg"><img class="play-icon" alt="video post" width="100" src="img/youtubeplaybutton.svg"></div></a></div></div>`
        );
    }

    if (settings["showimgur"] == "true") {
        //Imgur
        var imgurRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(\w+\.)?imgur\.com(\/|\/a\/|\/gallery\/)(?!gallery)([\w\-_]{5,12})(\.[a-zA-Z]{3})*.*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(\w+\.)?imgur\.com(\/|\/a\/|\/gallery\/)(?!gallery)([\w\-_]{5,12})(\.[a-zA-Z]{3})*.*?<\/a>/i;
        message = message.replace(imgurRegex,
            '<a href="https://i.imgur.com$2$3" rel="noopener noreferrer" target="_imgur"><div class="imgurcontainer"><img class="imgurimage"  src="https://i.imgur.com$2$3.jpg" alt="imgur post $2"></div></a>'
        );
    }

    if (settings["showtwitter"] == "true") {
        //Twitter
        var tweetRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/([0-9]{19})*.*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/([0-9]{19})*.*?<\/a>/i;
        //This works but is ugly
        //Add differentiator so that if a tweet is shown multiple times, it has a different id each time
        message = message.replace(tweetRegex,
            '<div class="twittercontainer"><iframe  height="400" width="550" class="twitteriframe" id="tweet_$3' + differentiator + '" border=0 frameborder=0  src="https://twitframe.com/show?url=https%3A%2F%2Ftwitter.com%2F$1%2Fstatus%2F$3"></iframe></div>'
        );
    }

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
    var field1 = `<td>` + userFromDataBasic(data, i + page + data.address, 8) + `</td>`;
    var field2 = `<td>` + getMemberLink(data.address2, data.name2) + `</td>`;
    if (reverse) {
        return `<tr>` + field2 + `<td>` + action + `</td>` + field1 + `</tr>`;
    }
    return `<tr>` + field1 + `<td>` + action + `</td>` + field2 + `</tr>`;
}


function getMemberLink(address, name) {
    return `<a href="#member?qaddress=` + san(address) + `" onclick="nlc();">` + ds(name) + `</a>`;
}

function getAddressLink(address, name) {
    return `<a href="#member?qaddress=` + san(address) + `" onclick="nlc();">` + san(address) + `</a>`;
}

//Map

function getMapCloseButtonHTML() {
    return `<font size="+3"><a href="#posts?type=all&amp;start=0&amp;limit=` + numbers.results + `">X</a></font>`;
    //onclick="hideMap();showPosts(0,numbers.results,'all');"
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
    return "<tr><td data-label='Member'>" + getMemberLink(data.member, data.membername) + "</td>" + "<td></td><td></td><td data-label='Rates as' align='center'> <div id='trust" + san(data.member) + san(data.target) + "'></div>  </td><td></td><td></td>" + "<td align='center'>" + "<td data-label='Member'>" + getMemberLink(data.target, data.targetname) + "</td></tr>";
}

function getIndirectRatingHTML(data) {
    return "<tr><td data-label='You'><span class='ratermember'>" + getMemberLink(data.member, data.membername) + "</span></td>" + "<td data-label='Rate as'><span class='trustratingintermediate'><div id='trust" + san(data.member) + san(data.inter) + "'></div></span></td>" + "<td align='center' data-label='Member'><span class='intermediatemember'>" + getMemberLink(data.inter, data.intername) + "</span></td>" + `<td data-label='Who Rates as'><span class='trustratingbyintermediate'><div id='trust` + san(data.inter) + san(data.target) + "'></div></span></td>" + "<td data-label='Member'><span class='ratedmember'>" + getMemberLink(data.target, data.targetname) + "</span></td></tr>";
}

function getTrustRatingTableHTML(contentsHTML, rating) {
    if (rating == 0) {
        return "<span style='font-size:2em'>Overall Rating: No information</span><div id='overall'></div><br/><br/><table>" + contentsHTML + "</table>";
    } else {
        return "<span style='font-size:2em'>Overall Rating:" + Number(rating) + "/5</span><div id='overall'></div><br/><br/><table>" + contentsHTML + "</table>";
    }
}

function rts(thetext) {
    //Sanitize text in ratings disabled mouseover. This is probably overkill
    return san(thetext);
}

//Settings
function ratingAndReasonNew(ratername, rateraddress, rateename, rateeaddress, rating, reason, stem, txid) {
    //Careful to ensure disabletext is sanitized
    var disableText = rts(ratername) + ' rates ' + rts(rateename) + ' as {rating}/{maxRating}';
    return "<tr><td data-label='Member'>" + getMemberLink(rateraddress, ratername) + `</td><td data-label='Rates As' align='center'> <div data-disabledtext="` + disableText + `" data-ratingsize="24" data-ratingaddress="` + san(rateraddress) + `" data-ratingraw="` + Number(rating) + `" id='` + stem + `` + san(rateraddress) + "'></div>  </td><td data-label='Member'>" + getMemberLink(rateeaddress, rateename) + "</td></tr> <tr><td></td><td data-label='Commenting...' colspan='2'><a href='#thread?root=" + san(txid) + "'>" + ds(reason) + "</a></td></tr>";
}

/*
function ratingAndReasonHTML(data) {
    //Careful to ensure disabletext is sanitized
    var disableText = rts(data.name) + ' rates ' + rts(data.rateename) + ' as {rating}/{maxRating}';
    return "<tr><td>" + getMemberLink(data.address, data.name) + `</td><td align='center'> <div data-disabledtext="`+disableText+`" data-ratingsize="24" data-ratingaddress="` + san(data.address) + `" data-ratingraw="` + Number(data.rating) + `" id='rating"` + san(data.address) + "'></div>  </td><td>" + getMemberLink(data.rates, data.rateename) + "</td></tr> <tr><td></td><td colspan='2'>" + ds(data.reason) + "</td></tr>";
}

function ratingAndReason2HTML(data) {
    //Careful to ensure disabletext is sanitized
    var disableText = rts(data.ratername) + ' rates ' + rts(data.name) + ' as {rating}/{maxRating}';
    return "<tr><td>" + getMemberLink(data.rateraddress, data.ratername) + `</td><td align='center'> <div data-disabledtext="`+disableText+`" data-ratingsize="24" data-ratingaddress="` + san(data.rates) + `" data-ratingraw="` + Number(data.rating) + `" id='rating"` + san(data.rates) + "'></div>  </td><td>" + getMemberLink(data.rates, data.name) + "</td></tr> <tr><td></td><td colspan='2'>" + ds(data.reason) + "</td></tr>";
}
*/


function clickActionNamedHTML(action, qaddress, name) {
    return `<a class='` + action + `' href='javascript:;' onclick='` + action + `("` + unicodeEscape(qaddress) + `"); self.style.display="none";'>` + ds(name) + `</a>`;
}

function clickActionTopicHTML(action, qaddress, topicHOSTILE, buttonText, elementid) {
    return `<a id='` + san(elementid) + `' href='javascript:;' onclick='` + action + `("` + unicodeEscape(qaddress) + `","` + unicodeEscape(topicHOSTILE) + `","` + san(elementid) + `");'>` + ds(buttonText) + `</a>`;
}

function getRatingComment(qaddress, data) {
    return `<input size="30" maxlength="190" id="memberratingcommentinputbox` + san(qaddress) + `" value="` + (data.length > 0 ? ds(data[0].ratingreason) : "") + `" onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"></input>`;
}

function privatekeyClickToShowHTML() {
    return `<a id="privatekeyclicktoshow" onclick="document.getElementById('privatekeydisplay').style.display='block';document.getElementById('privatekeyclicktoshow').style.display='none';">` + getSafeTranslation('text') + `</a>`;
}

function getNestedPostHTML(data, targettxid, depth, pageName, highlighttxid, firstreplytxid) {
    var contents = "<ul>";
    for (var i = 0; i < data.length; i++) {
        if ((data[i].retxid == targettxid || data[i].retxid == firstreplytxid) && data[i].txid != firstreplytxid) {
            var isMuted = (data[i].blockstxid != null || data[i].moderated != null);
            contents += `<li style="display:` + (isMuted ? `none` : `block`) + `" id="LI` + san(data[i].txid) + `"` + (data[i].txid.startsWith(highlighttxid) ? `" class="highlightli" ` : ``) + `>` + getHTMLForReply(data[i], depth, pageName, i, highlighttxid) + getNestedPostHTML(data, data[i].txid, depth + 1, pageName, highlighttxid, "dontmatch") + "</li>";
            contents += `<li style="display:` + (isMuted ? `block` : `none`) + `" id="CollapsedLI` + san(data[i].txid) + `" class="collapsed"><div class="comhead"><a onclick="uncollapseComment('` + san(data[i].txid) + `');" href="javascript:;">[+] </a>`
                + userFromDataBasic(data[i], data[i].ratingID, 0)
                + getScoresHTML(data[i].txid, data[i].likes, data[i].dislikes, data[i].tips, i)
                + ` ` + getAgeHTML(data[i].firstseen)
                + `</div><div id="scoresexpanded` + san(data[i].txid) + i + `" class="scoreexpanded"></div></li>`;
        }
    }
    contents = contents + "</ul>";
    return contents;
}

function getHTMLForTopicArray(data, elementStem) {

    var ret = getHTMLForTopic(data[0], elementStem);

    //This line so the alternate coloring on table rows still works
    ret += "<tr style='display:none'></tr>";

    ret += `<tr style='display:none' id='` + elementStem + data[0].mostrecent + `'><td colspan='4'>`;
    if (data[0].topic != "") {
        ret += `<div class="filterprovider">` + clickActionNamedHTML("unsub", data.topicname, "Unsubscribe") + "</div>";
    }
    var alreadymod = false;
    for (var i = 0; i < data.length; i++) {
        if (data[i].existingmod == pubkey) {
            ret += `<div class="filterprovider">` + clickActionTopicHTML("dismiss", pubkey, data[i].topicname, "Resign as moderator", "dismiss" + Number(data[i].mostrecent)) + "</div>";
            alreadymod = true;
        }
    }
    if (!alreadymod) {
        ret += `<div class="filterprovider">` + clickActionTopicHTML("designate", pubkey, data[0].topicname, "Volunteer to moderate", "designate" + Number(data[0].mostrecent)) + "</div>";
    }

    for (var i = 0; i < data.length; i++) {
        if (data[i].existingmod == pubkey) continue;
        if (data[i].existingmod != null) {
            if (data[i].existingmodaddress != null) {
                ret += `<div class="filterprovider">` + clickActionTopicHTML("dismiss", data[i].existingmod, data[i].topicname, "Remove Filter ", "dismiss" + data[i].existingmod + Number(data[i].mostrecent)) + "<span class='mib'>( " + userHTML(data[i].existingmod, data[i].existingmodname, "", "", 0) + ")</span></div>";
            } else {
                var userName = document.getElementById('settingsnametext').value;
                var userIsGroupFilter = userName.toLowerCase().endsWith("filter") || userName.toLowerCase().endsWith("group");
                var modIsGroupFilter = data[i].existingmodname.toLowerCase().endsWith("filter") || data[i].existingmodname.toLowerCase().endsWith("group");
                if (userIsGroupFilter != modIsGroupFilter) {
                    ret += `<div class="filterprovider">` + clickActionTopicHTML("designate", data[i].existingmod, data[i].topicname, "Add Filter ", "designate" + data[i].existingmod + Number(data[i].mostrecent)) + "<span class='mib'>( " + userHTML(data[i].existingmod, data[i].existingmodname, "", "", 0) + ")</span></div>";
                }
            }
        }
    }
    ret += "</td></tr>";
    return ret;
}

function getHTMLForTopic(data, elementStem) {
    var ret = "";
    var subscribe = clickActionNamedHTML("sub", data.topicname, "sub");

    //Show more button if the user is subscribed or topic is emtpy string
    if (data.address != null || data.topicname == "") {
        subscribe = `<a id="` + elementStem + `link` + data.mostrecent + `" onclick="showMore('` + elementStem + data.mostrecent + `','` + elementStem + `link` + data.mostrecent + `'); jdenticon();" href="javascript:;">more</a>`;
    }
    //Special values for empty topic
    if (data.topicname == "") {
        data.messagescount = "";
        data.subscount = "";
    }
    ret += "<tr><td class='tltopicname'>" + getTopicHTML(data.topicname, '') + "</td><td class='tlmessagecount'>" + Number(data.messagescount) + "</td><td class='tlsubscount'>" + Number(data.subscount) + "</td><td class='tlaction'>" + subscribe + "</td></tr>";
    return ret;

}

function getHTMLForTopicHeader(topicNameHOSTILE, contents) {
    //todo, move this to htmlquarantine.
    return "<div class='content'><h1 class='topicheader'>" + capitalizeFirstLetter(ds(topicNameHOSTILE)) + "</h1><table><thead><tr><td class='tltopicname'>Topic</td><td class='tlmessagescount'>Posts</td><td class='tlsubscount'>Subs</td><td class='tlaction'>Action</td></tr></thead><tbody>"
        + contents
        + "</tbody></table></div>";
}

function sendEncryptedMessageHTML(address, name, publickey) {
    return ` <a class="populate-send-message" onclick="populateSendMessage('` + san(address) + `','` + unicodeEscape(name) + `','` + san(publickey) + `');" href='javascript:;'>Send Message</a>`;
}

function populateSendMessage(address, name, publickey) {
    show('messagesanchor');
    if (publickey == null || publickey == "") {
        alert("Public key is not available - maybe the user hasn't set their name/handle.");
        return;
    }
    document.getElementById('sendmessagebox').style.display = 'block';
    document.getElementById('messagerecipient').innerText = name;
    document.getElementById('messageaddress').innerText = address;
    document.getElementById('messagepublickey').innerText = publickey;
    scrollToElement("sendmessagecontainer");
}

function collapseComment(commentid) {
    document.getElementById('LI' + commentid).style.display = 'none';
    document.getElementById('CollapsedLI' + commentid).style.display = 'block';
}

function uncollapseComment(commentid) {
    document.getElementById('LI' + commentid).style.display = 'block';
    document.getElementById('CollapsedLI' + commentid).style.display = 'none';
}

function getMessageHTML(data, count) {
    var contents = "";
    // Decrypt the message
    if (data.address == pubkey && data.address != data.toaddress) {
        //this message was sent by the logged in user.
        //we can't decrypt it, just make a note of the reply
        if (!data.recipientname) {
            data.recipientname = data.recipient;
            //should be possible to remove this after a month or so
        }
        contents += "<li><div class='replymessagemeta'><span class='plaintext'>You sent a message (" + data.message.length + " bytes) to </span>" + userHTML(data.toaddress, data.recipientname, count + "privatemessages" + data.toaddress, null, 0, data.recipientpagingid, data.recipientpublickey, data.recipientpicurl, data.recipienttokens, data.recipientfollowers, data.recipientfollowing, data.recipientblockers, data.recipientblocking, data.recipientprofile, data.recipientisfollowing, data.recipientnametime) + " " + getAgeHTML(data.firstseen, false) + " " + sendEncryptedMessageHTML(data.toaddress, data.recipientname, data.recipientpublickey) + "</div></li>";
    } else {
        let ecpair = new BITBOX.ECPair().fromWIF(privkey);
        var privateKeyBuf = Buffer.from(ecpair.d.toHex(), 'hex');
        decryptMessageAndPlaceInDiv(privateKeyBuf, data.message, data.roottxid);
        contents += "<li><span class='messagemeta'>" + userFromDataBasic(data, count + "privatemessages" + data.address, 16) + " " + getAgeHTML(data.firstseen, false) + " " + sendEncryptedMessageHTML(data.address, data.name, data.publickey) + "</span><br/><div id='" + san(data.roottxid) + "'>processing</div><br/></li>";
    }
    return contents;
}

async function decryptMessageAndPlaceInDiv(privateKeyBuf, message, roottxid) {
    //const privateKeyBuf5 = wif.decode(privkey).privateKey;
    var decryptedMessage = "Try again later: Unable to decrypt message: ";
    try {
        const encrypted = eccryptoJs.deserialize(Buffer.from(message, 'hex'));
        const structuredEj = await eccryptoJs.decrypt(privateKeyBuf, encrypted);
        decryptedMessage = structuredEj.toString();

    } catch (err) {
        decryptedMessage += err;
        console.log(err);
        await sleep(500);
    }
    //decrypted message can contain anything - don't do anything fancy with it - js/css risk!
    document.getElementById(roottxid).innerText = decryptedMessage;
}

function getNothingFoundMessageHTML(tk) {
    return "<div class='message'>" + getSafeTranslation(tk) + "</div>";
}

function getSafeTranslation(translationKey, xvar) {
    return ds(___i18n(translationKey, xvar));
}

//nb iframe not allowed by twitter
function createiframe(url, elementname) {
    document.getElementById(elementname).innerHTML = `<iframe height="400" width="550" id="alsotweet" border=0 frameborder=0 src="` + url + `"></iframe>`;
}

function showErrorMessage(status, page, theURL) {
    console.log(`Error:${status}`);
    var theElement = document.getElementById(page);
    if (theElement) {
        theElement.innerHTML = `<p><span class='connectionerror'>Oops. This request failed.<br/>There may be a problem with your internet connection, or the server may be having problems.<br/>The error code is ${status}<br/>The resource was ` + ds(theURL) + `</span></p>`;
    }
    updateStatus(`Error:${status}` + ds(theURL));
    updateStatus(`Error:${status}`);
}