//All functions that generate HTML should be quarantined here. 

//All HTML to be escaped should go through functions in this file
//variables ending in HTML should already be HTML escaped
//functions ending in HTML should return safely escaped HTML strings


//Functions
//san is used to strip all but alphanumeric and . _ -
//ds is used to escape as HTML
//Number is used to ensure an input is a number
//encodeURIComponent for part of uri
//unicodeEscape to escape text going into function
//quoteattr to escape text for an XML attribute

"use strict";


//Members
function MemberFromData(data, stub, ratingID) {
    return new Member(
        data[stub + "address"],
        data[stub + "name"],
        ratingID,
        data[stub + "rating"],
        data[stub + "pagingid"],
        data[stub + "publickey"],
        data[stub + "picurl"],
        data[stub + "tokens"],
        data[stub + "followers"],
        data[stub + "following"],
        data[stub + "blockers"],
        data[stub + "blocking"],
        data[stub + "profile"],
        data[stub + "isfollowing"],
        data[stub + "nametime"],
        data[stub + "lastactive"],
        data[stub + "sysrating"],
        data[stub + "hivename"],
        data[stub + "bitcoinaddress"]

    );
}

function Member(address, name, ratingID, ratingRawScore, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, lastactive, sysrating, hivename, bitcoinaddress) {

    if (!address) {
        updateStatus('Missing address for post error - this should not happen.'); return "";
    }

    if (!bitcoinaddress) {
        updateStatus('Missing legacy address for post error - this can happen if server does not have public key for user.');
    }

    address = "" + address;//always treat address like a string.
    if (this.name == "" || this.name == null) {
        this.name = address.substring(0, 10);
    }

    /*if (!name) {
        if (sourcenetwork == 2) {//get the hive name
            name = hivelink.split('/')[0];
        } else {
            name = address.substring(0, 10);
        }
    }*/
    this.address = address;
    this.name = name;
    this.ratingID = ratingID;
    this.ratingRawScore = ratingRawScore;
    this.pagingid = pagingid;
    this.publickey = publickey;
    this.picurl = picurl;
    this.tokens = tokens;
    this.followers = followers;
    this.following = following;
    this.blockers = blockers;
    this.blocking = blocking;
    this.profile = profile;
    this.isfollowing = isfollowing;
    this.nametime = nametime;
    this.lastactive = lastactive;
    this.sysrating = sysrating;
    this.hivename = hivename;
    this.bitcoinaddress = bitcoinaddress;
}

Member.prototype.userHTML = function (includeProfile) {
    if (!this.address) {
        return "error:no address for user";
    }

    let userclass = "hnuser";
    let profilemeta = "profile-meta";
    let curTime = new Date().getTime() / 1000;

    if (!this.nametime || curTime - this.nametime < 60 * 60 * 24 * 7 * 2) {
        //if the user has changed name in the past two weeks
        userclass = "hnuser newuser";
        profilemeta = "profile-meta newuser";
    }

    let memberpic = `<svg class="jdenticon" width="20" height="20" data-jdenticon-value="` + san(this.address) + `"></svg>`;
    if (this.picurl) {
        var picurlfull = getPicURL(this.picurl, profilepicbase, this.address, this.hivename);
        memberpic = `<img class="memberpicturesmall" src='` + picurlfull + `'/>`;
    }

    //let linkStart = `<a href="#member?qaddress=` + san(this.address) + `" onclick="nlc();" class="` + userclass + `">`;
    //let linkEnd = `</a> `;
    let flair = " ";
    if (this.tokens > 0) {
        flair = ` <span data-vavilon_title="TopIndex" class="flair" title="TopIndex">` + ordinal_suffix_of(Number(this.tokens)) + ` </span> `;
    }
    let followButton = `<a data-vavilon="follow" class="follow" href="javascript:;" onclick="follow('` + sane(this.bitcoinaddress) + `','` + sane(this.publickey) + `'); this.style.display='none';">follow</a>`;
    if (this.isfollowing) {
        followButton = `<a data-vavilon="unfollow" class="unfollow" href="javascript:;" onclick="unfollow('` + sane(this.bitcoinaddress) + `','` + sane(this.publickey) + `'); this.style.display='none';">unfollow</a>`;
    }

    if (this.ratingID == undefined) {
        this.ratingID = 'test';
    }

    let onlineStatus = "";
    //var lastonlineseconds=curTime - lastactive;
    onlineStatus = timeSince(this.lastactive, true);
    /*if (lastactive &&  lastonlineseconds < 60 * 10) {
        //if the user took an action in the past 3 minutes
        onlineStatus="🟠";
    }
    if (lastactive && lastonlineseconds < 60 * 3) {
        //if the user took an action in the past 3 minutes
        onlineStatus="🟢";
    }*/

    let directlink = "";

    let systemScoreClass = '';
    if (!this.ratingRawScore) {
        this.ratingRawScore = this.sysrating;
        systemScoreClass = 'systemscore';
    }

    let obj = {
        //These must all be HTML safe.
        address: san(this.address),
        profilepicsmall: memberpic,
        handle: ds(this.name),
        pagingidattrib: ds(this.pagingid),
        pagingid: ds(this.pagingid),
        flair: flair,
        rating: Number(this.ratingRawScore),
        followbutton: followButton,
        following: Number(this.following),
        followers: Number(this.followers),
        profile: getSafeMessage(this.profile, 'profilecard', false),
        diff: this.ratingID,
        onlinestatus: onlineStatus,
        systemscoreclass: systemScoreClass,
        directlink: directlink,
        bitcoinaddress: sane(this.bitcoinaddress)
    }

    obj.profilecard = "";
    if (includeProfile) {
        obj.authorsidebar = "";
        obj.profilecard = templateReplace(userProfileCompactTemplate, obj);
    }
    return templateReplace(userCompactTemplate, obj);
};

//Get html for a user, given their address and name
/*function userHTML(address, name, ratingID, ratingRawScore, ratingStarSize, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, includeProfile, lastactive, sysrating, hivename, bitcoinaddress) {
    if (!address) {
        return "error:no address for user";
    }
    if (name == "" || name == null) {
        name = address.substring(0, 10);
    }

    var userclass = "hnuser";
    var profilemeta = "profile-meta";
    var curTime = new Date().getTime() / 1000;

    if (!nametime || curTime - nametime < 60 * 60 * 24 * 7 * 2) {
        //if the user has changed name in the past two weeks
        userclass = "hnuser newuser";
        profilemeta = "profile-meta newuser";
    }

    var memberpic = `<svg class="jdenticon" width="20" height="20" data-jdenticon-value="` + san(address) + `"></svg>`;
    if (picurl) {
        var picurlfull = getPicURL(picurl, profilepicbase, address, hivename);
        memberpic = `<img class="memberpicturesmall" src='` + picurlfull + `'/>`;
    }

    var linkStart = `<a href="#member?qaddress=` + san(address) + `" onclick="nlc();" class="` + userclass + `">`;
    var linkEnd = `</a> `;
    var flair = " ";
    if (tokens > 0) {
        flair = ` <span data-vavilon_title="TopIndex" class="flair" title="TopIndex">` + ordinal_suffix_of(Number(tokens)) + ` </span> `;
    }
    var followButton = `<a data-vavilon="follow" class="follow" href="javascript:;" onclick="follow('` + sane(bitcoinaddress) + `','` + sane(publickey) + `'); this.style.display='none';">follow</a>`;
    if (isfollowing) {
        followButton = `<a data-vavilon="unfollow" class="unfollow" href="javascript:;" onclick="unfollow('` + sane(bitcoinaddress) + `','` + sane(publickey) + `'); this.style.display='none';">unfollow</a>`;
    }

    if (ratingID == undefined) {
        ratingID = 'test';
    }

    var onlineStatus = "";
    //var lastonlineseconds=curTime - lastactive;
    onlineStatus = timeSince(lastactive, true);

    var directlink = "";

    var systemScoreClass = '';
    if (!ratingRawScore) {
        ratingRawScore = sysrating;
        systemScoreClass = 'systemscore';
    }

    var obj = {
        //These must all be HTML safe.
        address: san(address),
        profilepicsmall: memberpic,
        handle: ds(name),
        pagingidattrib: ds(pagingid),
        pagingid: ds(pagingid),
        flair: flair,
        rating: Number(ratingRawScore),
        followbutton: followButton,
        following: Number(following),
        followers: Number(followers),
        profile: getSafeMessage(profile, 'profilecard', false),
        diff: ratingID,
        onlinestatus: onlineStatus,
        systemscoreclass: systemScoreClass,
        directlink: directlink,
        bitcoinaddress: sane(bitcoinaddress)
    }

    obj.profilecard = "";
    if (includeProfile) {
        obj.authorsidebar = "";
        obj.profilecard = templateReplace(userProfileCompactTemplate, obj);
    }
    return templateReplace(userCompactTemplate, obj);


}*/

function userFromDataBasic(data, mainRatingID) {
    if (!data.raterrating) { data.raterrating = data.rating; }//Fix for collapsed comments not having rating. TODO - look into rating/raterrating
    return new Member(data.address, data.name, mainRatingID, data.raterrating, data.pagingid, data.publickey, data.picurl, data.tokens, data.followers, data.following, data.blockers, data.blocking, data.profile, data.isfollowing, data.nametime, (data.lastactive ? data.lastactive : data.pictime), data.sysrating, data.hivename, data.bitcoinaddress).userHTML(true);
}

//Posts and Replies
function getReplyDiv(txid, page, differentiator, address, sourcenetwork, origtxid) {
    page = page + differentiator;
    var obj = {
        //These must all be HTML safe.
        page: page,
        txid: san(txid),
        address: address,
        profilepicsmall: profilepic,
        address: pubkey,
        sourcenetwork: sourcenetwork,
        origtxid: origtxid
    }

    return templateReplace(replyDivTemplate, obj);

}

function getReplyAndTipLinksHTML(page, txid, address, article, geohash, differentiator, topicHOSTILE, repostcount, repostidtxid, sourcenetwork, hivelink, origtxid, bitcoinaddress) {

    var page = page + differentiator; //This is so if the same post appears twice on the same page, there is a way to tell it apart
    var santxid = san(txid);
    var articleLink2 = "";
    var mapLink = " ";

    var permalink = `?` + santxid.substring(0, 4) + `#thread?post=` + santxid;
    var articlelink = `?` + santxid.substring(0, 4) + `#article?post=` + santxid;

    if (pathpermalinks) {
        permalink = pathpermalinks + `p/` + origtxid.substr(0, 10);
        articlelink = pathpermalinks + `a/` + origtxid.substr(0, 10);
    }

    if (article) {
        articleLink2 = `<a id="articlelink` + page + santxid + `" href="` + articlelink + `">article</a> `;
    }
    if (geohash != null && geohash != "") {
        mapLink = ` <a id="maplink` + page + santxid + `" href="#map?geohash=` + san(geohash) + `&post=` + santxid + `">🌍map</a> `;
    }
    var hideuserHTML = hideuserHTML = `<a data-vavilon="flaguser" id="hideuserlink` + page + santxid + `" onclick="hideuser('` + san(address) + `','','hideuserlink` + page + santxid + `');" href="javascript:;">flag(user)</a>`;
    if (topicHOSTILE != "") {
        hideuserHTML += `<a data-vavilon="flagusertopic" id="hideuserlink` + page + santxid + `" onclick="hideuser('` + san(address) + `','` + unicodeEscape(topicHOSTILE) + `','hideuserlink` + page + santxid + `');" href="javascript:;">flag(user for topic)</a>`;
    }

    //Can remove mispelling 'remebers' when css files are updated
    var remembersActive = "remebersactive remembersactive";
    var remembersOnclick = ` onclick="repostPost('${santxid}','${san(origtxid)}','${san(sourcenetwork)}'); this.class='remebersinactive remembersinactive'; this.onclick='';" href="javascript:;"`;
    if (repostidtxid != null && repostidtxid != '') {
        remembersActive = "remebersinactive remembersinactive";
        remembersOnclick = ` `;
    }

    let sourceNetworkHTML = '';
    if (sourcenetwork == 0) {
        sourceNetworkHTML = '<a rel="noopener noreferrer" target="memo" href="https://memo.cash/a/' + san(hivelink) + '">Memo</a>';
    } else if (sourcenetwork == 1) {
        sourceNetworkHTML = '<a rel="noopener noreferrer" target="bitclout" href="https://bitclout.com/posts/' + san(hivelink) + '">BitClout</a>';
    } else if (sourcenetwork == 2) {
        sourceNetworkHTML = '<a rel="noopener noreferrer" target="hiveblog" href="https://hive.blog/@' + sanhl(hivelink) + '">hive.blog</a>';
    } else if (sourcenetwork == 3) {
        sourceNetworkHTML = '<a rel="noopener noreferrer" href="' + permalink + '">member.cash</a>';
    } else if (sourcenetwork == 99) {
        sourceNetworkHTML = '<a rel="noopener noreferrer" target="rsslink" href="' + quoteattr(hivelink) + '">RSS Link</a>';
    }

    var obj = {
        //These must all be HTML safe.
        page: page,
        txid: san(txid),
        remembersonclick: remembersOnclick,
        diff: differentiator,
        repostcount: repostcount,
        remembersactive: remembersActive,
        articlelink2: articleLink2,
        hideuser: hideuserHTML,
        address: san(address),
        permalink: permalink,
        maplink: mapLink,
        sourceNetworkHTML: sourceNetworkHTML,
        origtxid: san(origtxid),
        bitcoinaddress: bitcoinaddress,
        MEMUSD1: satsToUSDString(100000000),
        MEMUSD5: satsToUSDString(500000000),
        MEMUSD10: satsToUSDString(1000000000),
        MEMUSD20: satsToUSDString(2000000000),
        MEMUSD50: satsToUSDString(5000000000),
        MEMUSD100: satsToUSDString(10000000000)
    }

    return templateReplace(replyAndTipsTemplate, obj);

}

function getScoresHTML(txid, likes, dislikes, tips, differentiator) {

    var obj = {
        //These must all be HTML safe.
        txid: san(txid),
        diff: differentiator,
        likesbalance: (Number(likes) - Number(dislikes)),
        tips: Number(tips),
        balancestring: usdString(Number(tips), false)
    }
    return templateReplace(scoresTemplate, obj);
    //return ` <span onclick="showScoresExpanded('` + san(txid) + `','scoresexpanded` + san(txid) + differentiator + `')" id="scores` + san(txid) + differentiator + `" class="score"><span class="likescounttext"><span id="likescount` + san(txid) + `">` + (Number(likes) - Number(dislikes)) + `</span> likes and</span> <span class="tipscounttext"><span id="tipscount` + san(txid) + `"  data-amount="` + Number(tips) + `">` + balanceString(Number(tips), false) + `</span></span></span>`;
}

function replacePageNamesWithLinks(target) {
    //return target.replace(/(^|\s|>)@([^,\/#!$%\^&\*;:{}=`~()'"@<>\ \n?]{1,217})/g, replacePageName);
    return target.replace(/(^|\s|>)@([A-Za-z0-9\-_\.]{1,217})/g, replacePageName);
}

function replacePageName(match, p1, p2, offset, string) {
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    return p1 + `<a href="#member?pagingid=` + encodeURIComponent(p2) + `" onclick="nlc();">@` + ds(p2) + `</a>`;
}

function replaceTagNamesWithLinks(target) {
    //return target.replace(/(^|\s|>)#([^.,\/#!$%\^&\*;:{}=\-`~()'"@<>\ \n?]{1,217})/g, replaceTagName);
    return target.replace(/(^|\s|>)#([A-Za-z0-9\-_]{1,217})/g, replaceTagName);
}

function replaceTagName(match, p1, p2, offset, string) {
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    return p1 + `<a href="#topic?topicname=` + encodeURIComponent(p2) + `" onclick="nlc();">#` + ds(p2) + `</a>`;
}

function replaceTickerNamesWithLinks(target) {
    //return target.replace(/(^|\s|>)$([^.,\/#!$%\^&\*;:{}=\-`~()'"@<>\ \n?]{1,217})/g, replaceTickerName);
    return target.replace(/(^|\s|>)$([A-Za-z0-9\-_\.]{1,217})/g, replaceTickerName);
}

function replaceTickerName(match, p1, p2, offset, string) {
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    return p1 + `<a href="#member?pagingid=` + encodeURIComponent(p2) + `" onclick="nlc();">$` + ds(p2) + `</a>`;
}

/*
function getSafeInteractiveHTML(message, differentiator, includeMajorMedia) {
    //Escape as HTML
    let messageHTML = ds(message);
    //Add Line breaks
    messageHTML = messageHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');

    //Add tag links
    messageHTML = replaceTagNamesWithLinks(messageHTML);

    //Add ticker links
    messageHTML = replaceTickerNamesWithLinks(messageHTML);

    //Add paging id links
    messageHTML = replacePageNamesWithLinks(messageHTML);

    //Add links for web addresses
    messageHTML = anchorme(messageHTML, { attributes: [{ name: "target", value: "_blank" }] });

    //Scan for XSS vulnerabilities
    messageHTML = DOMPurify.sanitize(messageHTML);

    //Add youtube etc
    if (includeMajorMedia) {
        messageHTML = addImageAndYoutubeMarkdown(messageHTML, differentiator, false);
    }

    return messageHTML;
}*/

function getSafeMessage(messageHTML, differentiator, includeMajorMedia) {

    if (!messageHTML) {
        return '';
    }
    //Add Line breaks
    messageHTML = messageHTML.replace(/(?:\r\n|\r|\n)/g, '<br>');

    //First replace any allowable html tags if html tags are permitted (hive)
    messageHTML = turndownService.turndown(messageHTML);

    //Now escape any remaining html
    //messageHTML = ds(messageHTML);

    //Now allow for any markdown
    messageHTML = ShowdownConverter.makeHtml(messageHTML);

    //Add tag links
    messageHTML = replaceTagNamesWithLinks(messageHTML);

    //Add ticker links
    messageHTML = replaceTickerNamesWithLinks(messageHTML);

    //Add paging id links
    messageHTML = replacePageNamesWithLinks(messageHTML);

    //Add links for web addresses
    //messageHTML = anchorme(messageHTML, { attributes: [{ name: "target", value: "_blank" }] });

    //Scan for XSS vulnerabilities
    messageHTML = DOMPurify.sanitize(messageHTML);

    //Add youtube etc
    if (includeMajorMedia) {
        messageHTML = addImageAndYoutubeMarkdown(messageHTML, differentiator, true);
    }

    return messageHTML;

}

/*function getHTMLForPostHTML(txid, address, name, likes, dislikes, tips, firstseen, message, roottxid, topic, replies, geohash, page, ratingID, likedtxid, likeordislike, repliesroot, rating, differentiator, repostcount, repostidtxid, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, repostedHTML, lastactive, truncate, sysrating, sourcenetwork, hivename, hivelink, bitcoinaddress) {
    let theMember= new Member(address, name, ratingID, rating, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, lastactive, sysrating, hivename, bitcoinaddress);
    return getHTMLForPostHTML2(theMember, txid, likes, dislikes, tips, firstseen, message, roottxid, topic, replies, geohash, page, likedtxid, likeordislike, repliesroot, differentiator, repostcount, repostidtxid, repostedHTML, truncate, sourcenetwork, hivelink);
}*/
function getHTMLForPostHTML3(theMember, data, stub, page, differentiator, repostedHTML, truncate) {
    return getHTMLForPostHTML2(
        theMember,
        data[stub + "txid"],
        data[stub + "likes"],
        data[stub + "dislikes"],
        data[stub + "tips"],
        data[stub + "firstseen"],
        data[stub + "message"],
        data[stub + "roottxid"],
        data[stub + "topic"],
        data[stub + "replies"],
        data[stub + "geohash"],
        page,
        data[stub + "likedtxid"],
        data[stub + "likeordislike"],
        data[stub + "repliesroot"],
        differentiator,
        data[stub + "repostcount"],
        data[stub + "repostidtxid"],
        repostedHTML,
        truncate,
        data[stub + "network"],
        data[stub + "hivelink"]);
}


function getHTMLForPostHTML2(theMember, txid, likes, dislikes, tips, firstseen, message, roottxid, topic, replies, geohash, page, likedtxid, likeordislike, repliesroot, differentiator, repostcount, repostidtxid, repostedHTML, truncate, sourcenetwork, hivelink) {
    var theAuthorHTML = theMember.userHTML(true);
    var theAuthor2HTML = theMember.userHTML(false);

    let origTXID = hivelink; //This is used when replying, reposting, or other onchain actions
    if (sourcenetwork == 2 || sourcenetwork == 99) {
        origTXID = sha256.create().update(hivelink).hex();
    }

    if (!origTXID) {
        updateStatus('Missing original TXID for post error - this is required for replies, tips etc'); return "";
    }

    if (truncate && message.length > 800) { //to do, try to break on a whitespace
        message = message.substring(0, 400) + '...';
    }

    let messageLinksHTML = getSafeMessage(message, differentiator, true);

    //let messageLinksHTML = ShowdownConverter.makeHtml(message);
    repliesroot = Number(repliesroot);
    replies = Number(replies);
    var isReply = (roottxid != txid);
    if (!isReply) {
        //only if main post
        if (repliesroot > replies) {
            replies = repliesroot;
        }
    }


    var votelinks = getVoteButtons(txid, theMember.bitcoinaddress, likedtxid, likeordislike, (Number(likes) - Number(dislikes)), origTXID);
    var age = getAgeHTML(firstseen);
    var scores = getScoresHTML(txid, likes, dislikes, tips, differentiator);
    var tipsandlinks = '';//getReplyAndTipLinksHTML(page, txid, address, true, geohash, differentiator, topic, repostcount, repostidtxid, sourcenetwork, hivelink, origTXID, bitcoinaddress);
    var replydiv = getReplyDiv(txid, page, differentiator, theMember.address, sourcenetwork, origTXID);

    var santxid = san(txid);
    var permalink = `p/` + santxid;
    var articlelink = `a/` + santxid;
    if (pathpermalinks) {
        permalink = pathpermalinks + `p/` + origTXID.substr(0, 10);
        articlelink = pathpermalinks + `a/` + origTXID.substr(0, 10);
    }

    var directlink = "";

    let sourceNetworkHTML;
    let sourceNetworkImage;
    if (sourcenetwork == 0) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="memo" href="https://memo.cash/a/${san(hivelink)}">Memo</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="memo" href="https://memo.cash/a/${san(hivelink)}"><img src='img/networks/0.png'></a>`;
    } else if (sourcenetwork == 1) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="bitclout" href="https://bitclout.com/posts/${san(hivelink)}">BitClout</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="bitclout" href="https://bitclout.com/posts/${san(hivelink)}"><img src='img/networks/1.png'></a>`;
    } else if (sourcenetwork == 2) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="hiveblog" href="https://hive.blog/@${sanhl(hivelink)}">hive.blog</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="hiveblog" href="https://hive.blog/@${sanhl(hivelink)}"><img src='img/networks/2.png'></a>`;
    } else if (sourcenetwork == 3) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="hiveblog" href="${permalink}">member.cash</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="hiveblog" href="${permalink}"><img src='img/networks/3.png'></a>`;
    } else if (sourcenetwork == 99) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="rsslink" href="${quoteattr(hivelink)}">RSS Link</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="rsslink" href="${quoteattr(hivelink)}"><img src='img/networks/99.png'></a>`;
    }

    let pinnedpostHTML = '';
    if (theMember.bitcoinaddress == pubkey) {
        pinnedpostHTML = `<a data-vavilon="VVpinpost" href="javascript:;" onclick="pinpost('${san(origTXID)}')">Pin Post</a>`;
    }

    var obj = {
        //These must all be HTML safe 
        author: theAuthorHTML,
        authorsidebar: theAuthor2HTML,
        message: messageLinksHTML,
        replies: Number(replies) < 0 ? 0 : Number(replies),
        likesbalance: (Number(likes) - Number(dislikes)),
        likes: Number(likes),
        dislikes: Number(dislikes),
        remembers: Number(repostcount),
        tips: usdString(Number(tips), true),
        tipsinsatoshis: Number(tips),
        txid: san(txid),
        txidshort: san(txid).substring(0, 10),
        elapsed: getAgeHTML(firstseen, false),
        elapsedcompressed: getAgeHTML(firstseen, true),
        topic: topic ? getTopicHTML(topic, getSafeTranslation('totopic', ' #')) : "",
        topicescaped: unicodeEscape(topic),
        quote: repostedHTML,
        address: theMember.address,
        votelinks: votelinks,
        age: age,
        roottxid: roottxid,
        scores: scores,
        tipsandlinks: tipsandlinks,
        replydiv: replydiv,
        diff: differentiator,
        likeactivated: likeordislike == "1" ? "-activated" : "",
        dislikeactivated: likeordislike == "-1" ? "-activated" : "",
        rememberactivated: repostidtxid ? "-activated" : "",
        permalink: permalink,
        articlelink: articlelink,
        directlink: directlink,
        sourceNetworkHTML: sourceNetworkHTML,
        sourceNetworkImage: sourceNetworkImage,
        pinnedpostHTML: pinnedpostHTML,
        origtxid: san(origTXID),
        sourcenetwork: san(sourcenetwork),
        page: page,
        bitcoinaddress: theMember.bitcoinaddress,
        MEMUSD1: satsToUSDString(100000000),
        MEMUSD5: satsToUSDString(500000000),
        MEMUSD10: satsToUSDString(1000000000),
        MEMUSD20: satsToUSDString(2000000000),
        MEMUSD50: satsToUSDString(5000000000),
        MEMUSD100: satsToUSDString(10000000000)

    };

    return templateReplace(postCompactTemplate, obj);


}


function getHTMLForReplyHTML2(theMember, txid, likes, dislikes, tips, firstseen, message, page, ishighlighted, likedtxid, likeordislike, blockstxid, differentiator, topicHOSTILE, moderatedtxid, repostcount, repostidtxid, sourcenetwork, hivelink) {
    txid = txid + ""; //ensure txid is a string. Sometimes it is returned as a number.

    let origTXID = hivelink; //This is used when replying, reposting, or other onchain actions
    if (sourcenetwork == 2) {
        try {
            origTXID = sha256.create().update(hivelink).hex();
        } catch (err) {
            origTXID = 'na';
            //this is the case when this is a hive edit or delete post
        }
    }

    /*
    if (!name) {
        if (sourcenetwork == 2 && hivelink) {//hive
            name = hivelink.split('/')[0];
        } else {
            name = address.substring(0, 10);
        }
    }*/

    message = getSafeMessage(message, differentiator, true);

    /*
    //Remove html - use dslite here to allow for markdown including some characters
    message = dslite(message);

    message = ShowdownConverter.makeHtml(message);
    
    //check for XSS vulnerabilities
    message = DOMPurify.sanitize(message);

    //Add youtube links

    message = addImageAndYoutubeMarkdown(message, differentiator, true);
*/
    var voteButtons = getVoteButtons(txid, theMember.bitcoinaddress, likedtxid, likeordislike, (Number(likes) - Number(dislikes)), origTXID);
    var author = theMember.userHTML(true);
    //new Member(address, name, ratingID, rating, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, lastactive, sysrating, hivename, bitcoinaddress).userHTML(true);
    var scores = getScoresHTML(txid, likes, dislikes, tips, differentiator);
    var age = getAgeHTML(firstseen);
    var replyAndTips = getReplyAndTipLinksHTML(page, txid, theMember.address, false, "", differentiator, topicHOSTILE, repostcount, repostidtxid, sourcenetwork, hivelink, origTXID, theMember.bitcoinaddress);
    var replyDiv = getReplyDiv(txid, page, differentiator, theMember.address, sourcenetwork, origTXID);


    var obj = {
        //These must all be HTML safe 
        txid: san(txid),
        highlighted: (ishighlighted ? ` highlight` : ``),
        id: (ishighlighted ? `highlightedcomment` : ``),
        blocked: (blockstxid != null || moderatedtxid != null ? `blocked` : ``),
        votebuttons: voteButtons,
        author: author,
        message: message,
        scores: scores,
        age: age,
        replyandtips: replyAndTips,
        replydiv: replyDiv,
        diff: differentiator
    };

    return templateReplace(replyTemplate, obj);

}

function getNestedPostHTML(data, targettxid, depth, pageName, firstreplytxid) {
    var contents = "<ul>";
    for (var i = 0; i < data.length; i++) {
        if ((data[i].retxid == targettxid || data[i].retxid == firstreplytxid) && data[i].txid != firstreplytxid) {
            let ratingused = data[i].sysrating;
            if (data[i].rating) {
                ratingused = data[i].rating;
            }
            var isMuted = (data[i].blockstxid != null || data[i].moderated != null || ratingused < 64);

            var obj = {
                unmuteddisplay: (isMuted ? `none` : `block`),
                muteddisplay: (isMuted ? `block` : `none`),
                txid: san(data[i].txid),
                hightlightedclass: (data[i].highlighted ? `highlightli` : ``),
                replyHTML: getHTMLForReply(data[i], depth, pageName, i),
                nestedPostHTML: getNestedPostHTML(data, data[i].txid, depth + 1, pageName, "dontmatch"),
                user: userFromDataBasic(data[i], data[i].ratingID, 0),
                scores: getScoresHTML(data[i].txid, data[i].likes, data[i].dislikes, data[i].tips, i),
                age: getAgeHTML(data[i].firstseen),
                diff: i
                //These must all be HTML safe.
            }

            contents += templateReplace(nestedPostTemplate, obj);
        }
    }
    contents = contents + "</ul>";
    return contents;
}

function getAgeHTML(firstseen, compress) {
    return `<span class="age">` + timeSince(Number(firstseen), compress) + `</span>`;
}

function getPostListItemHTML(postHTML) {
    if (postHTML == "") {
        return "";
    }
    return `<li class="post-list-li">` + postHTML + `</li>`;
}

function postlinkHTML(txid, linktext) {
    return `<a href="#thread?post=` + san(txid) + `" onclick="nlc();">` + getSafeTranslation(linktext, linktext) + `</a>`;
}

function getNavHeaderHTML(order, content, topicnameHOSTILE, filter, start, limit, action, qaddress, functionName, numberOfResults) {
    //Caution topicname may contain hostile characters/code

    var navheader = `<nav class="filters">`;
    navheader += `<a data-vavilon="VV0106" data-vavilon_title="VV0107" value="new" title="Latest posts" class="` + (order == 'new' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=new&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >New</a> `;
    navheader += `<span class="separator"></span>`;
    navheader += `<a data-vavilon="VV0104" data-vavilon_title="VV0105" value="hot" title="Hottest posts" class="` + (order == 'hot' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=hot&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >Hot</a> `;
    navheader += `<span class="separator"></span>`;
    navheader += `<a data-vavilon="VVTop" data-vavilon_title="VV0109" value="topd" title="Top posts from the past Day" class="` + (order == 'topd' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=topd&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >Top</a> `;
    navheader += `<span class="separator"></span>`;
    //navheader += `<a data-vavilon="VV0112" data-vavilon_title="VV0113" value="topw" title="Top posts from the past Week" class="` + (order == 'topw' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=topw&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >Week</a> `;
    //navheader += `<span class="separator"></span>`;
    //navheader += `<a data-vavilon="VV0114" data-vavilon_title="VV0115" value="topm" title="Top posts from the past Month" class="` + (order == 'topm' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=topm&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >Month</a> `;
    //navheader += `<span class="separator"></span>`;
    //navheader += `<a data-vavilon="VV0116" data-vavilon_title="VV0117" value="topy" title="Top posts from the past Year" class="`+(order=='topy'?'filteron':'filteroff')+`" href="#` + action + `?start=0&limit=` + limit + `&order=topy&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >` + getSafeTranslation('new', 'new') + `</a> `;
    //navheader += `<span class="separator"></span>`;
    navheader += `<a data-vavilon="VV0118" data-vavilon_title="VV0119" value="topa" title="Top posts from all time" class="` + (order == 'topa' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=topa&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >All</a> `;
    navheader += `<span class="separator"></span>`;
    navheader += `<a data-vavilon="VVold" data-vavilon_title="VVoldtitle" value="topa" title="Oldest to newest" class="` + (order == 'old' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=old&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >Old</a> `;

    navheader += `<nav class="filterssecondset">`;
    navheader += `<a data-vavilon="VV0120" data-vavilon_title="VV0121" title="See only posts" class="` + (content == 'posts' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=` + order + `&content=posts&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >Posts</a> `;
    navheader += `<span class="separator"></span>`;
    navheader += `<a data-vavilon="VV0122" data-vavilon_title="VV0123" title="See only replies" class="` + (content == 'replies' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=` + order + `&content=replies&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >Replies</a> `;
    navheader += `<span class="separator"></span>`;
    navheader += `<a data-vavilon="VVall" data-vavilon_title="VV0125" title="See both posts and replies" class="` + (content == 'both' ? 'filteron' : 'filteroff') + `" href="#` + action + `?start=0&limit=` + limit + `&order=` + order + `&content=both&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >All</a> `;
    navheader += "</nav>";
    navheader += "</nav>";
    return navheader;

}

function getNotificationNavButtonsNewHTML(start, limit, action, qaddress, minrating, notificationtype, numberOfResults) {
    //Caution topicname may contain hostile characters/code

    var navbuttons = `<div class="navbuttons">`;

    if (start != 0) //Don't show back buttons if we're at the start
    { navbuttons += `<a class="next" href="#` + action + `?start=` + (Number(start) - Number(numbers.results)) + `&limit=` + limit + `&minrating=` + minrating + `&nfilter=` + notificationtype + `&qaddress=` + qaddress + `" >` + getSafeTranslation('prev', 'back') + `</a> `; }

    //if (numberOfResults > numbers.results) //Sometimes an sql limit request returns fewer than the available set - nearly always include a next button
    //Always show
    { navbuttons += `<a class="back" href="#` + action + `?start=` + (Number(start) + Number(numbers.results)) + `&limit=` + limit + `&minrating=` + minrating + `&nfilter=` + notificationtype + `&qaddress=` + qaddress + `" >` + getSafeTranslation('next', 'next') + `</a>`; }

    navbuttons += "</div>";
    return navbuttons;

}


function getNavButtonsNewHTML(order, content, topicnameHOSTILE, filter, start, limit, action, qaddress, functionName, numberOfResults) {
    //Caution topicname may contain hostile characters/code

    var navbuttons = `<div class="navbuttons">`;

    //Don't really need back button - user can click back in browser
    //if (start != 0) //Don't show back buttons if we're at the start
    //{ navbuttons += `<a class="next" href="#` + action + `?start=` + (Number(start) - Number(numbers.results)) + `&limit=` + limit + `&order=` + order + `&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >` + getSafeTranslation('prev', 'back') + `</a> `; }

    //if (numberOfResults > numbers.results / 2) //Sometimes an sql limit request returns fewer than the available set - nearly always include a next button
    //Always show
    { navbuttons += `<a class="back" href="#` + action + `?start=` + (Number(start)) + `&limit=` + limit + `&order=` + order + `&content=` + content + `&filter=` + filter + `&qaddress=` + qaddress + `&topicname=` + ds(encodeURIComponent(topicnameHOSTILE)) + `" >` + getSafeTranslation('next', 'next') + `</a>`; }

    navbuttons += "</div>";
    return navbuttons;

}


function getItemListandNavButtonsHTML(contentsHTML, navbuttonsHTML, styletype, start) {
    if (styletype != "") {
        return `<div class="itemlist"><ol start="` + (Number(start) + 1) + `" class="` + styletype + `">` + contentsHTML + `</ol></div><div class="navbuttons">` + navbuttonsHTML + `</div>`;
    } else {
        return `<div class="itemlist">` + contentsHTML + `</div><div class="navbuttons">` + navbuttonsHTML + `</div>`;
    }
}

function getVoteButtons(txid, bitcoinaddress, likedtxid, likeordislike, score, origTXID) {

    var upvoteHTML;
    let scoreHTML = `<span class="betweenvotesscore" id="score` + san(txid) + `">` + Number(score) + `</span>`;
    var downvoteHTML;

    if (likeordislike == "1") {
        upvoteHTML = `<a id="upvoteaction` + san(txid) + `" href="javascript:;"><span id="upvote` + san(txid) + `" class="votearrowactivated" title="` + getSafeTranslation('up') + `"></span><span class="votetext">` + getSafeTranslation('up') + `</span></a>`;
        scoreHTML = `<span class="betweenvotesscoreup" id="score` + san(txid) + `">` + Number(score) + `</span>`;
    } else {
        upvoteHTML = `<a id="upvoteaction${san(txid)}" href="javascript:;" onclick="likePost('${san(txid)}','${origTXID}','${san(bitcoinaddress)}',0)"><span id="upvote${san(txid)}" class="votearrow" title="${getSafeTranslation('up')}"></span><span class="votetext">${getSafeTranslation('up', 'up')}</span></a>`;
    }

    if (likeordislike == "-1") {
        downvoteHTML = `<a id="downvoteaction` + san(txid) + `" href="javascript:;"><span id="downvote` + san(txid) + `" class="votearrowactivateddown rotate180" title="` + getSafeTranslation('down') + `"><span class="votetext">` + getSafeTranslation('down', 'down') + `</span></span></a>`;
        scoreHTML = `<span class="betweenvotesscoredown" id="score` + san(txid) + `">` + Number(score) + `</span>`;
    } else {
        downvoteHTML = `<a id="downvoteaction` + san(txid) + `" href="javascript:;" onclick="dislikePost('` + san(txid) + `','` + san(origTXID) + `')"><span id="downvote` + san(txid) + `" class="votearrow rotate180" title="` + getSafeTranslation('down') + `"><span class="votetext">` + getSafeTranslation('down', 'down') + `</span></span></a>`;
    }

    return upvoteHTML + " " + scoreHTML + " " + downvoteHTML;
}

function getRefreshButtonHTML() {
    return `<a id="refreshbutton" class="btn" href="" onclick="displayContentBasedOnURLParameters();return false;">🔄</a>`;
}


function completedPostHTML(txid, titleHOSTILE) {

    var encodedURL = `https://twitter.com/intent/tweet?text=` + encodeURIComponent(titleHOSTILE + '\r\n' + ` member.cash/p/` + san(txid));

    var obj = {
        //These must all be HTML safe 
        txid: san(txid),
        encodedurl: encodedURL
    };

    return templateReplace(completedPostTemplate, obj);
}

function getCloseButtonHTML(profileelement) {
    return `<div class='closebutton'><a onclick="document.getElementById('` + profileelement + `').style.display='none';">` + getSafeTranslation('close', 'close') + `</a></div>`;
}

function getTipDetailsHTML(user, amount, type) {
    var theclass = "tipdetailscompact";
    return `<div class="` + theclass + `">` + user + (amount > 0 ? ` ` + getSafeTranslation('tipped', 'tipped') + ` ` + usdString(amount) : ``) + (Number(type) == -1 ? ` ` + getSafeTranslation('disliked', 'disliked') : ``) + `</div>`;
}

function getRememberDetailsHTML(user, message, topic, txid) {
    var theclass = "rememberdetailscompact";
    return `<div class="` + theclass + `">` + user + `<span class="plaintext"><a href="#thread?post=` + san(txid) + `" onclick="nlc();">` + (message ? getSafeTranslation('quoteremembered', 'quote remembered') : getSafeTranslation('remembered', 'remembered')) + "</a></span> " + getTopicHTML(topic, getSafeTranslation('totopic', ' #')) + `</div>`;
}

function getRepostHeaderHTML(user) {
    return `<span class='repost'>` + user + ` ` + getSafeTranslation('remembered', 'remembered') + `</span>`;
}

function getProfilePicLargeHTML(theURL) {
    return `<img id="settingspicturelarge" class="settingspicturelarge" src="` + theURL + `" style="display: block;" width="640" height="640">`;
}

function getNoCommentsYetHTML() {
    return `<p data-vavilon="replytostart" class='nocommentsyet'>No comments yet . . . reply to start a conversation</p>`;
}

//Media replacement
function makeYoutubeIframe(youtubeid, starttime) {
    var src = event.srcElement.parentElement;
    //setTimeout(function(){src.innerHTML='<div><br/><iframe class="youtubeiframe" src="https://www.youtube.com/embed/'+san(youtubeid)+'?rel=0&autoplay=1&showinfo=0" frameborder="0"></iframe></div>';},100);
    src.innerHTML += '<iframe width="480" height="270" class="youtubeiframe" src="https://www.youtube.com/embed/' + sane(youtubeid) + '?rel=0&autoplay=1&showinfo=0&start=' + starttime + '" frameborder="0"></iframe>';
}

function addImageAndYoutubeMarkdown(message, differentiator, global) {

    //These links should all have been generated by software, so should have a pattern of <a href=" pattern.

    if (settings["showyoutube"] == "true") {
        //Youtube
        var youtubeRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/.*?(?:watch|embed)?(?:.*?v=|v\/|\/)([\w\-_]{7,12})(?:[\&\?\#].*?)*?(?:([\&\?\#]t=)?(([\dhms]+))?).*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/.*?(?:watch|embed)?(?:.*?v=|v\/|\/)([\w\-_]{7,12})(?:[\&\?\#].*?)*?(?:([\&\?\#]t=)?(([\dhms]+))?).*?<\/a>/i;
        message = message.replace(youtubeRegex,
            `<div class="youtubecontainer"><div class="youtubepreviewimage"><a onclick="event.stopPropagation();makeYoutubeIframe('$1','$4');"><div class="youtubepreview"><img loading="lazy" height="270" class="youtubepreviewimage" src="https://img.youtube.com/vi/$1/0.jpg"><img class="play-icon" alt="video post" width="100" src="img/youtubeplaybutton.svg"></div></a></div></div>`
        );
    }

    if (settings["showimgur"] == "true") {
        //Imgur
        var imgurRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(\w+\.)?imgur\.com(\/|\/a\/|\/gallery\/)(?!gallery)([\w\-_]{5,12})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(\w+\.)?imgur\.com(\/|\/a\/|\/gallery\/)(?!gallery)([\w\-_]{5,12})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/i;
        message = message.replace(imgurRegex, replaceImgur);
    }
    

    /*if (settings["showprism"] == "true") {
        //Prism
        //If not, cdn.prism.red/*.jpeg & .png
        //Otherwise include mp4 & mp3 in that extension list
        var imgurRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(\w+\.)?imgur\.com(\/|\/a\/|\/gallery\/)(?!gallery)([\w\-_]{5,12})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(\w+\.)?imgur\.com(\/|\/a\/|\/gallery\/)(?!gallery)([\w\-_]{5,12})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/i;
        message = message.replace(imgurRegex, replaceImgur);
    }*/

    if (settings["showtwitter"] == "true") {
        //Twitter
        var tweetRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/([0-9]{19})*.*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="https?:\/\/(?:mobile\.)?twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/([0-9]{19})*.*?<\/a>/i;
        //This works but is ugly
        //Add differentiator so that if a tweet is shown multiple times, it has a different id each time
        message = message.replace(tweetRegex,
            '<div class="twittercontainer"><iframe loading="lazy" height="400" width="550" class="twitteriframe" id="tweet_$3' + differentiator + '" border=0 frameborder=0  src="https://twitframe.com/show?url=https%3A%2F%2Ftwitter.com%2F$1%2Fstatus%2F$3"></iframe></div>'
            //'<div class="nittercontainer"><iframe loading="lazy" height="400" width="550" class="twitteriframe" id="tweet_$3' + differentiator + '" border=0 frameborder=0  src="https://nitter.net/i/status/$3/embed?theme=twitter"></iframe></div>'        
        );
    }

    //Nitter
    /*
    var nitterRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="https?:\/\/(?:mobile\.)?nitter\.net\/(?:#!\/)?(\w+)\/status(es)?\/([0-9]{19})*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="https?:\/\/(?:mobile\.)?nitter\.net\/(?:#!\/)?(\w+)\/status(es)?\/([0-9]{19})*.*?<\/a>/i;

    //Add differentiator so that if a tweet is shown multiple times, it has a different id each time
    message = message.replace(nitterRegex,
        '<div class="nittercontainer"><iframe height="400" width="550" class="twitteriframe" id="tweet_$3' + differentiator + '" border=0 frameborder=0  src="https://nitter.net/embed/Tweet.html?id=$3"></iframe></div>'
    );*/

    if (settings["showlbry"] == "true") {
        var lbryRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?lbry\.tv\/@.+\/(.+?(?=:)).*<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?lbry\.tv\/@.+\/(.+?(?=:)).*<\/a>/i;
        message = message.replace(lbryRegex, `<div class="youtubecontainer"><iframe loading="lazy" width="480" height="270" class="odyseeiframe" src="https://odysee.com/$/embed/$1" allowFullScreen="false"></iframe></div>`);
    }

    if (settings["showbitclout"] == "true") {
        //Bitclout
        var bitcloutRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?images\.bitclout\.com\/([a-zA-Z0-9]{64})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?images\.bitclout\.com\/([a-zA-Z0-9]{64})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/i;
        message = message.replace(bitcloutRegex, `<a href="https://images.bitclout.com/$1.webp" rel="noopener noreferrer" target="_bitclout" onclick="event.stopPropagation();"><div class="imgurcontainer"><img loading="lazy" class="imgurimage" src="https://images.bitclout.com/$1$2"></img></div></a>`);

        var bitcloutRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?images\.deso\.org\/([a-zA-Z0-9]{64})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?images\.deso\.org\/([a-zA-Z0-9]{64})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/i;
        message = message.replace(bitcloutRegex, `<a href="https://images.deso.org/$1.webp" rel="noopener noreferrer" target="_bitclout" onclick="event.stopPropagation();"><div class="imgurcontainer"><img loading="lazy" class="imgurimage" src="https://images.deso.org/$1$2"></img></div></a>`);

    }

    var membercoinRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?member\.cash\/img\/upload\/([a-z0-9]{10})(\.webp)*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?member\.cash\/img\/upload\/([a-z0-9]{10})(\.webp)*.*?<\/a>/i;
    message = message.replace(membercoinRegex, `<a href="https://member.cash/img/upload/$1.webp" rel="noopener noreferrer" target="_membercoin" onclick="event.stopPropagation();"><div class="imgurcontainer"><img loading="lazy" class="imgurimage" src="https://member.cash/img/upload/$1.webp"></img></div></a>`);

    var memberlinksRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(member\.cash\/p\/)([a-z0-9]{10})*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(member\.cash\/p\/)([a-z0-9]{10})*.*?<\/a>/i;
    message = message.replace(memberlinksRegex, replaceDiamondApp);


    var giphyRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?giphy\.com\/embed\/([a-z0-9A-Z]{5,20})*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?giphy\.com\/embed\/([a-z0-9A-Z]{5,20})*.*?<\/a>/i;
    message = message.replace(giphyRegex, `<a href="https://i.giphy.com/media/$1/giphy.webp" rel="noopener noreferrer" target="_giphy" onclick="event.stopPropagation();"><div class="imgurcontainer"><img loading="lazy" class="imgurimage" src="https://i.giphy.com/media/$1/giphy.webp"></img></div></a>`);


    var pearlRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?cdn\.pearl\.app\/([a-z0-9\-]{36})(\.webp)*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?cdn\.pearl\.app\/([a-z0-9\-]{36})(\.webp)*.*?<\/a>/i;
    message = message.replace(pearlRegex, `<a href="https://cdn.pearl.app/$1.webp" rel="noopener noreferrer" target="_pearl" onclick="event.stopPropagation();"><div class="imgurcontainer"><img loading="lazy" class="imgurimage" src="https://cdn.pearl.app/$1.webp"></img></div></a>`);

    var diamondappRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(bitclout\.com\/posts\/|diamondapp\.com\/posts\/|desocialworld\.com\/nft\/|desocialworld\.com\/posts\/)([a-z0-9]{64})*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(bitclout\.com\/posts\/|diamondapp\.com\/posts\/|desocialworld\.com\/nft\/|desocialworld\.com\/posts\/)([a-z0-9]{64})*.*?<\/a>/i;
    message = message.replace(diamondappRegex, replaceDiamondApp);


    return message;
}

/*
function replaceLBRY(match, p1, p2, p3, p4, offset, string) {
    var differentiator = Math.floor(Math.random() * 1000000);
    populatelbry(p1,'lbry'+differentiator);
    return `<div id="lbry`+differentiator+`" class="youtubecontainer"></div>`;
}

async function populatelbry(lbrylink,elementid){
    //load lbry page
    let response = await fetch("https://lbry.tv/"+lbrylink);
    if (response.ok) { // if HTTP-status is 200-299
        let json = await response.text();
        document.getElementById(elementid).innerHTML=`<iframe width="480" height="270" class="youtubeiframe" src="https://lbry.tv/"></iframe>`;
    } else {
        //alert("HTTP-Error: " + response.status);
    }
    //parse for link
    
    //set contents
    //
}*/
function replaceDiamondApp(match, p1, p2){
    return `<a onclick="event.stopPropagation();nlc();location.href='#thread?post=${p2}'; " href="javascript:">https://member.cash/p/${p2.substring(0,10)}</a>`;
}

function replaceImgur(match, p1, p2, p3, p4, offset, string) {
    //return p1 + `<a href="#member?pagingid=` + encodeURIComponent(p2) + `" onclick="nlc();">@` + ds(p2) + `</a>`;
    if (!p4) { p4 = '.jpg'; }
    if (p4.toLowerCase() == '.mp4') {
        return `<a href='javascript:;'><video controls class="imgurimage" draggable="false" playsinline="true" loop="true"><source loading="lazy" type="video/mp4" src="https://i.imgur.com` + p2 + p3 + p4 + `" alt="imgur post ` + p2 + `"></video></a>`;
    }

    return `<a href="https://i.imgur.com` + p2 + p3 + `" rel="noopener noreferrer" target="_imgur" onclick="event.stopPropagation();"><div class="imgurcontainer"><img loading="lazy" class="imgurimage" src="https://i.imgur.com` + p2 + p3 + p4 + `" alt="imgur post ` + p2 + `"></img></div></a>`;
}

//Notifications

function allowNotificationButtonHTML() {
    return `<span class="allownotifications"><a data-vavilon="VV0080" class="memberlinkbutton" href="javascript:;" onclick="requestNotificationPermission(); this.style.display='none';">Allow Notifications</a></span>`;
}

function getNotificationsTableHTML(contents, navbuttons) {
    return `<ul class="notificationslist">` + contents + `</ul>` + navbuttons;
}

function notificationItemHTML(notificationtype, iconHTML, mainbodyHTML, subtextHTML, addendumHTML, txid, highlighted) {
    //icon, mainbody and subtext should already be escaped and HTML formatted

    var obj = {
        //These must all be HTML safe.
        highlighted: (highlighted ? 'highlighted ' : ''),
        type: notificationtype,
        txid: san(txid),
        title: mainbodyHTML,
        age: subtextHTML,
        post: addendumHTML,
        iconHTML: iconHTML
    }

    return templateReplace(notificationCompactTemplate, obj);


    /*return `
    <li class="`+ (highlighted ? 'highlighted ' : '') + `notificationitem notification` + san(notificationtype) + `" id='notification` + san(txid) + `'>
        <div class="notificationdetails">
        <div class="notificationminheight">
            <div class="notificationtitle">`+
        mainbodyHTML + `
                <span class="age">` + subtextHTML + `</span>
            </div>`+
        addendumHTML +
        `</div><hr class="notificationhr"/>
        </div>       
    </li>`;*/
}



//Maps

function getMapPostHTML(lat, lng, requireLogin) {

    var obj = {
        //These must all be HTML safe.
        lat: Number(lat),
        lng: Number(lng),
        profilepicsmall: profilepic,
        address: pubkey
    }

    return templateReplace(mapPostTemplate, obj);

}

function getMapCloseButtonHTML() {
    return `<font size="+3"><a href="#posts?type=all&amp;start=0&amp;limit=` + numbers.results + `">X</a></font>`;
    //onclick="hideMap();showPosts(0,numbers.results,'all');"
}

function getOSMattributionHTML() {
    return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.';
}

function mapThreadLoadingHTML(previewHTML) {
    return `<div id='mapthread'>` + getSafeTranslation('loading', 'loading ') + previewHTML + "</div>";
}

//Trust graph and Rating
function getMembersWithRatingHTML(i, page, data, action, reverse) {
    var directlink = "";
    var field1 = `<td>` + directlink + userFromDataBasic(data, i + page + data.address, 8) + `</td>`;
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

function getDirectRatingHTML(data) {
    var obj = {
        //These must all be HTML safe.
        member: getMemberLink(data.member, data.membername),
        memberid: san(data.member),
        target: san(data.target),
        targetid: getMemberLink(data.target, data.targetname)
    }

    return templateReplace(directRatingHTML, obj);

    //return "<tr><td data-label='Member'>" + getMemberLink(data.member, data.membername) + "</td>" + "<td></td><td></td><td data-label='Rates as' align='center'> <div id='trust" + san(data.member) + san(data.target) + "'></div>  </td><td></td><td></td>" + "<td align='center'>" + "<td data-label='Member'>" + getMemberLink(data.target, data.targetname) + "</td></tr>";
}

function getIndirectRatingHTML(data) {
    var obj = {
        //These must all be HTML safe.
        member: getMemberLink(data.member, data.membername),
        memberid: san(data.member),
        membertxid: san(data.membertxid),
        inter: getMemberLink(data.inter, data.intername),
        interid: san(data.inter),
        intertxid: san(data.intertxid),
        target: getMemberLink(data.target, data.targetname),
        targetid: san(data.target)
    }

    return templateReplace(indirectRatingHTML, obj);

    //return "<tr><td data-label='You'><span class='ratermember'>" + getMemberLink(data.member, data.membername) + "</span></td>" + "<td data-label='Rate as'><span class='trustratingintermediate'><div id='trust" + san(data.member) + san(data.inter) + "'></div></span></td>" + "<td align='center' data-label='Member'><span class='intermediatemember'>" + getMemberLink(data.inter, data.intername) + "</span></td>" + `<td data-label='Who Rates as'><span class='trustratingbyintermediate'><div id='trust` + san(data.inter) + san(data.target) + "'></div></span></td>" + "<td data-label='Member'><span class='ratedmember'>" + getMemberLink(data.target, data.targetname) + "</span></td></tr>";
}

function getTrustRatingTableHTML(contentsHTML, rating) {

    var obj = {
        //These must all be HTML safe.
        tablecontents: contentsHTML,
        rating: (rating == 0) ? "No information" : Number(rating)
    }

    return templateReplace(trustRatingTableHTML, obj);

    /*if (rating == 0) {
        return "<span style='font-size:2em'>Overall Rating: No information</span><div id='overall'></div><br/><br/><table>" + contentsHTML + "</table>";
    } else {
        return "<span style='font-size:2em'>Overall Rating:" + Number(rating) + "/5</span><div id='overall'></div><br/><br/><table>" + contentsHTML + "</table>";
    }*/
}

function ratingAndReasonNew(ratername, rateraddress, rateename, rateeaddress, rating, reason, stem, txid) {
    //Careful to ensure disabletext is sanitized
    var disableText = rts(ratername) + ' rates ' + rts(rateename) + ' as {rating}/{maxRating}';

    var obj = {
        //These must all be HTML safe.
        rater: getMemberLink(rateraddress, ratername),
        disabletext: disableText,
        rateraddress: san(rateraddress),
        rating: Number(rating),
        stem: stem,
        ratee: getMemberLink(rateeaddress, rateename),
        txid: san(txid),
        reason: ds(reason)
    }

    return templateReplace(ratingAndReasonHTML, obj);


}

function getRatingComment(data) {
    return `<input placeholder="` + getSafeTranslation('VVratinginstruction', 'Add a comment and click on a star rating to rate this member...') + `" size="30" maxlength="190" id="memberratingcommentinputbox${san(data.bitcoinaddress)}" value="${ds(data.ratingreason)}" onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"></input>`;
}

function getMemberRatingHTML(bitcoinaddress, ratingScore, pagingid) {
    return `<div class="starrating"><div data-ratingsize="20" data-ratingname="` + ds(pagingid) + `" data-ratingaddress="` + san(bitcoinaddress) + `" data-ratingraw="` + Number(ratingScore) + `" id="memberrating` + san(bitcoinaddress) + `"></div></div>`;
}


//Settings
function clickActionNamedHTML(action, qaddress, name, targetpubkey) {
    return `<a class='${action}button' data-vavilon='` + action + `' class='` + action + `' href='javascript:;' onclick='` + action + `("` + sane(qaddress) + `","` + sane(targetpubkey) + `"); this.style.display="none";'>` + ds(name) + `</a>`;
}

/*
function privatekeyClickToShowHTML() {
    return `<a id="privatekeyclicktoshow" onclick="document.getElementById('privatekeydisplay').style.display='block';document.getElementById('privatekeyclicktoshow').style.display='none';">` + getSafeTranslation('showpriv', 'Show private key') + `</a>`;
}*/

//Topics
function clickActionTopicHTML(action, qaddress, topicHOSTILE, buttonText, elementid) {
    return `<a id='` + san(elementid) + `' href='javascript:;' onclick='` + action + `("` + sane(qaddress) + `","` + unicodeEscape(topicHOSTILE) + `","` + san(elementid) + `");'>` + ds(buttonText) + `</a>`;
}

function getTopicHTML(topicHOSTILE, append) {
    //If the topic is All Topics, keep that as the display name, but use the empty string for server
    var displayNameHOSTILE = topicHOSTILE;
    if (topicHOSTILE == '') {
        if (append != '') return '';
        displayNameHOSTILE = 'All Tags';
    }
    return ` <span class="topic">` +
        `<a href="#topic?topicname=` + encodeURIComponent(topicHOSTILE) + `&start=0&limit=` + numbers.results + `&order=new" onclick="nlc();"> #` + capitalizeFirstLetter(ds(displayNameHOSTILE).substr(0, 40)) + `</a>`
        + `</span>`;
}

function getHTMLForTopicArray(data, elementStem) {

    var ret = getHTMLForTopic(data[0], elementStem);

    //This line so the alternate coloring on table rows still works
    ret += "<tr style='display:none'></tr>";

    ret += `<tr style='display:none' id='` + elementStem + data[0].mostrecent + `'><td colspan='4'>`;
    if (data[0].topic != "") {
        ret += `<div class="filterprovider">` + clickActionNamedHTML("unsub", data[0].topic, getSafeTranslation('unsubscribe', 'unsubscribe')) + "</div>";
    }
    var alreadymod = false;
    for (var i = 0; i < data.length; i++) {
        if (data[i].existingmod == pubkey) {
            ret += `<div class="filterprovider">` + clickActionTopicHTML("dismiss", pubkey, data[i].topicname, getSafeTranslation('resign', 'resign as moderator'), "dismiss" + Number(data[i].mostrecent)) + "</div>";
            alreadymod = true;
        }
    }
    if (!alreadymod) {
        ret += `<div class="filterprovider">` + clickActionTopicHTML("designate", pubkey, data[0].topicname, getSafeTranslation('volunteer', 'volunteer as moderator'), "designate" + Number(data[0].mostrecent)) + "</div>";
    }

    for (var i = 0; i < data.length; i++) {
        if (data[i].existingmod == pubkey) continue;
        if (data[i].existingmod != null) {
            if (data[i].existingmodaddress != null) {
                ret += `<div class="filterprovider">` + clickActionTopicHTML("dismiss", data[i].existingmod, data[i].topicname, getSafeTranslation('removefilter', 'remove filter'), "dismiss" + data[i].existingmod + Number(data[i].mostrecent)) + "<span class='mib'>( " + Member(data[i].existingmod, data[i].existingmodname, "", "").userHTML(false) + ")</span></div>";
            } else {
                var userName = "";
                try {
                    userName = document.getElementById('settingsnametext').value;
                } catch (err) { }//means user is not logged in
                var userIsGroupFilter = userName.toLowerCase().endsWith("filter") || userName.toLowerCase().endsWith("group");
                if (!data[i].existingmodname) data[i].existingmodname = "";
                var modIsGroupFilter = data[i].existingmodname.toLowerCase().endsWith("filter") || data[i].existingmodname.toLowerCase().endsWith("group");
                if (userIsGroupFilter != modIsGroupFilter) {
                    ret += `<div class="filterprovider">` + clickActionTopicHTML("designate", data[i].existingmod, data[i].topicname, getSafeTranslation('addfilter', 'add filter'), "designate" + data[i].existingmod + Number(data[i].mostrecent)) + "<span class='mib'>( " + Member(data[i].existingmod, data[i].existingmodname, "", "").userHTML(false) + ")</span></div>";
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
        subscribe = `<a id="` + elementStem + `link` + data.mostrecent + `" onclick="showMore('` + elementStem + data.mostrecent + `','` + elementStem + `link` + data.mostrecent + `'); jdenticon();" href="javascript:;">` + getSafeTranslation('more', 'more') + `</a>`;
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

    var obj = {
        //These must all be HTML safe.
        topic: capitalizeFirstLetter(ds(topicNameHOSTILE)),
        tablecontents: contents
    }

    return templateReplace(topicHeaderHTML, obj);

}

//Private Messages
function sendEncryptedMessageHTML(address, name, publickey) {
    return ` <a class="populate-send-message" onclick="populateSendMessage('` + san(address) + `','` + unicodeEscape(name) + `','` + san(publickey) + `');" href='javascript:;'>` + getSafeTranslation('sendmessage', 'send message') + `</a>`;
}

function populateSendMessage(address, name, publickey) {
    //show('messagesanchor');
    location.href = "#messages";

    if (publickey == null || publickey == "") {
        alert(getSafeTranslation('publickeynotavailable', "Public key is not available - maybe the user hasn't set their name/handle."));
        return;
    }
    document.getElementById('sendmessagebox').style.display = 'block';
    document.getElementById('messagerecipient').textContent = name;
    document.getElementById('messageaddress').textContent = address;
    document.getElementById('messagepublickey').textContent = publickey;
    scrollToElement("sendmessagecontainer");
}

function getMessageHTML(data, count) {
    //You sent a message
    if (data.bitcoinaddress == pubkey && data.address != data.toaddress) {
        return "<li><div class='replymessagemeta'><span class='plaintext'>" + getSafeTranslation('yousent', 'you sent') + " (" + data.message.length + " bytes) -> </span>" + (new Member(data.toaddress, data.recipientname, count + "privatemessages" + data.recipientbitcoinaddress, data.recipientrating, data.recipientpagingid, data.recipientpublickey, data.recipientpicurl, data.recipienttokens, data.recipientfollowers, data.recipientfollowing, data.recipientblockers, data.recipientblocking, data.recipientprofile, data.recipientisfollowing, data.recipientnametime, data.recipientlastactive, data.recipientsysrating, data.hivename, data.bitcoinaddress)).userHTML(true) + " " + getAgeHTML(data.firstseen, false) + " " + sendEncryptedMessageHTML(data.recipientbitcoinaddress, data.recipientname, data.recipientpublickey) + "</div><br/><div class='privatemessagetext' id='" + san(data.roottxid) + "'>" + getSafeTranslation('processing', 'processing') + "</div><br/></li>";
    } else {
        return "<li><span class='messagemeta'>" + userFromDataBasic(data, count + "privatemessages" + data.address, 16) + " " + getAgeHTML(data.firstseen, false) + " " + sendEncryptedMessageHTML(data.bitcoinaddress, data.name, data.publickey) + "</span><br/><div class='privatemessagetext' id='" + san(data.roottxid) + "'>" + getSafeTranslation('processing', 'processing') + "</div><br/></li>";
    }
}

async function populateMessages(data, count) {
    // Decrypt the message
    if (data.bitcoinaddress == pubkey && data.address != data.toaddress) {
        //this message was sent by the logged in user.
        await decryptMessageAndPlaceInDiv(privateKeyBuf, data.message, data.roottxid, data.recipientpublickey);
    } else {
        await decryptMessageAndPlaceInDiv(privateKeyBuf, data.message, data.roottxid, data.publickey);
    }
    return;
}


var bcdecrypt = null;

async function decryptMessageAndPlaceInDiv(privateKeyBuf, message, roottxid, publicKeySender) {

    //nb decrypted message can contain anything - don't do anything fancy with it - js/css risk!

    //Possibilities here
    //1 bitclout identity user logged in
    //2 seedphrase user logged in
    //3 no user logged in

    //a bitclout new style
    //b bitclout legacy style
    //c member legacy style

    //if bitclout identity user, only a or b is possible
    //if privkey, try member legacy style, then bitclout styles a or b

    //"Try again later: Unable to decrypt message: "
    //var decryptedMessage = getSafeTranslation('unabledecrypt', "Try again later: Unable to decrypt message: ");

    if (isBitCloutIdentityUser()) {
        putBitCloutDecryptedMessageInElement(message, roottxid, publicKeySender);
    } else if (privateKeyBuf) {
        //Bitclout message style - 
        if (bcdecrypt == null) {
            await loadScript("js/lib/identityencryption.js");
        }
        //var msgArray = new BCBuffer(message.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        var msgArray = Buffer.from(message, 'hex');
        try {
            //Try new style message
            //function (privateKeyRecipient, publicKeySender, encrypted, opts)
            let pubKeyBuf = Buffer.from(publicKeySender, 'hex');
            //var bcpublicKey = preslice.slice(3);
            //var publicKeyUncompressed = ec.keyFromPublic(pubKeyBuf, 'hex').getPublic(false, 'hex');
            let uncompressedPublicKeySender = Buffer.from(window.ec.keyFromPublic(pubKeyBuf, 'hex').getPublic(false, 'hex'), 'hex');

            let decryptedMessage = await bcdecryptShared(privateKeyBuf, uncompressedPublicKeySender, msgArray, { legacy: false }).toString();
            document.getElementById(roottxid).textContent = decryptedMessage;
            //console.log("new style:"+decryptedMessage);
            return;
        } catch (err) {
            document.getElementById(roottxid).textContent += " Try decrypt new style message error: " + err;
        }

        try {
            //Try old style message
            let decryptedMessage = await bcdecrypt(privateKeyBuf, msgArray, { legacy: false }).toString();
            document.getElementById(roottxid).textContent = decryptedMessage;
            return;
        } catch (err) {
            document.getElementById(roottxid).textContent += " Try decrypt legacy style message error: " + err;
        }
    } else {
        let decryptedMessage = getSafeTranslation('logintodecrypt', "Login to decrypt message: ");
        document.getElementById(roottxid).textContent = decryptedMessage;
        return;
    }

    try {
        if (privkey) {
            //If privkey login, try first, member message style
            const encrypted = eccryptoJs.deserialize(Buffer.from(message, 'hex'));
            const structuredEj = await eccryptoJs.decrypt(privateKeyBuf, encrypted);
            let decryptedMessage = structuredEj.toString();
            document.getElementById(roottxid).textContent = decryptedMessage;
            return;
        }
    } catch (err) {
        document.getElementById(roottxid).textContent += " Try decrypt member legacy style message error: " + err;
        //not a member legacy style message
    }

    document.getElementById(roottxid).textContent = " Unable to decrypt this message. May be a legacy style message that only the recipient can view.";

    return;
}


/*function getNothingFoundMessageHTML(tk, def) {
    return "<div class='message'>" + getSafeTranslation(tk, def) + "</div>";
}*/

function ___i18n(translationKey) {
    if (dictionary.live[translationKey]) {
        return dictionary.live[translationKey];
    }
    //console.log("No translation for "+translationKey);
    if (dictionary.fallback[translationKey]) {
        return dictionary.fallback[translationKey];
    }
    //console.log("No fallback translation for "+translationKey);
    return translationKey;

}

function getSafeTranslation(translationKey, fallback) {
    //return 'x';
    var translated = ___i18n(translationKey);
    if (translated == translationKey && fallback) {
        translated = fallback;
    }
    return ds(translated);
}

function getUnSafeTranslation(translationKey, fallback) {
    //return 'x';
    var translated = ___i18n(translationKey);
    if (translated == translationKey && fallback) {
        translated = fallback;
    }
    return (translated);
}

function translatePage() {
    //var matches = document.getElementsByTagName("*");
    var matches = document.querySelectorAll('[data-vavilon],[data-vavilon_title],[data-vavilon_value],[data-vavilon_data_label],[data-vavilon_data_placeholder]');
    //document.body.style.display='none';
    for (var j = 0; j < matches.length; j++) {
        var fds = matches[j].dataset;
        //if (fds.vavilon || fds.vavilon_title || fds.vavilon_value || fds.vavilon_data_label) {
        if (fds.vavilon)
            //matches[j].innerHTML=getSafeTranslation(fds.vavilon,fds.vavilon); //nb setting innerText is *a lot* faster
            //matches[j].innerText=getUnSafeTranslation(fds.vavilon,matches[j].innerText); //nb textContent is *even* faster - doesn't cause reflow problems
            matches[j].textContent = getUnSafeTranslation(fds.vavilon, matches[j].textContent);
        if (fds.vavilon_title)
            matches[j].title = getSafeTranslation(fds.vavilon_title, matches[j].title);
        if (fds.vavilon_value)
            matches[j].value = getSafeTranslation(fds.vavilon_value, matches[j].value);
        if (fds.vavilon_data_label)
            fds.label = getSafeTranslation(fds.vavilon_data_label, fds.label);
        if (fds.vavilon_data_placeholder)
            fds.placeholder = getSafeTranslation(fds.vavilon_data_placeholder, fds.placeholder);

        //}
    }
    //document.body.style.display='block';
}

//nb iframe not allowed by twitter
/*function createiframe(url, elementname) {
    document.getElementById(elementname).innerHTML = `<iframe height="400" width="550" id="alsotweet" border=0 frameborder=0 src="` + url + `"></iframe>`;
}*/

//Error

function showErrorMessage(status, page, theURL) {
    status = san(status);
    console.log(`Error:${status}`);
    var theElement = document.getElementById(page);
    if (theElement) {
        var obj = {
            //These must all be HTML safe.
            status: ds(status),
            url: ds(theURL)
        }
        theElement.innerHTML = templateReplace(errorTemplate, obj);
        //theElement.innerHTML = `<p><span class='connectionerror'>Oops. This request failed.<br/>There may be a problem with your internet connection, or the server may be having problems.<br/>The error code is ${status}<br/>The resource was ` + ds(theURL) + `</span></p>`;
    }
    updateStatus(`Error:${status}` + ds(theURL));
    updateStatus(`Error:${status}`);
}

//General
function getDivClassHTML(className, contentsHTML) {
    return `<div class="` + className + `">` + contentsHTML + `</div>`;
}

function getSpanHTML(className, localstrid, fallbacktext) {
    return ` <span class="` + className + `">` + getSafeTranslation(localstrid, fallbacktext) + `</span> `;
}

function getSpanClassHTML(className, contentsHTML) {
    return ` <span class="` + className + `">` + contentsHTML + `</span> `;
}

function escapeHTML(thetext) {
    return ds(thetext);
}

function rts(thetext) {
    //Sanitize text in ratings disabled mouseover. This is probably overkill
    return san(thetext);
}
