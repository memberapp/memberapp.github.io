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

function userFromDataBasic(data, mainRatingID) {
    if (!data.raterrating) { data.raterrating = data.rating; }//Fix for collapsed comments not having rating. TODO - look into rating/raterrating
    return new Member(data.address, data.name, mainRatingID, data.raterrating, data.pagingid, data.publickey, data.picurl, data.tokens, data.followers, data.following, data.blockers, data.blocking, data.profile, data.isfollowing, data.nametime, (data.lastactive ? data.lastactive : data.pictime), data.sysrating, data.hivename, data.bitcoinaddress).userHTML(true);
}

function userFromData(data, mainRatingID) {
    return MemberFromData(data, 'origin', mainRatingID).userHTML(true);
}
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
        memberpic = `<img alt="Profile Picture" class="memberpicturesmall" src='` + picurlfull + `'/>`;
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
    let useScore=this.ratingRawScore
    if (!useScore) { //If the user hasn't rated the user, use a system score
        useScore = this.sysrating;
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
        rating: Number(useScore),
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
        origtxid: origtxid,
        maxreplylength: maxreplylength
    }

    return templateReplace(replyDivTemplate, obj);

}

function getReplyAndTipLinksHTML(page, txid, address, article, geohash, differentiator, topicHOSTILE, sourcenetwork, hivelink, origtxid, bitcoinaddress, permalink, articlelink) {

    var page = page + differentiator; //This is so if the same post appears twice on the same page, there is a way to tell it apart
    var santxid = san(txid);
    var articleLink2 = "";
    var mapLink = " ";

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
    /*var remembersOnclick = ` onclick="repostPost('${santxid}','${san(origtxid)}','${san(sourcenetwork)}'); this.class='remebersinactive remembersinactive'; this.onclick='';" href="javascript:;"`;
    if (repostidtxid != null && repostidtxid != '') {
        remembersActive = "remebersinactive remembersinactive";
        remembersOnclick = ` `;
    }*/

    let sourceNetworkHTML = '';
    if (sourcenetwork == 0) {
        sourceNetworkHTML = '<a rel="noopener noreferrer" target="memo" href="https://memo.cash/a/' + san(hivelink) + '">memo</a>';
    } else if (sourcenetwork == 1) {
        sourceNetworkHTML = '<a rel="noopener noreferrer" target="bitclout" href="https://bitclout.com/posts/' + san(hivelink) + '">bitclout</a>';
    } else if (sourcenetwork == 2) {
        sourceNetworkHTML = '<a rel="noopener noreferrer" target="hiveblog" href="https://hive.blog/@' + sanhl(hivelink) + '">hive.blog</a>';
    } else if (sourcenetwork == 3) {
        //sourceNetworkHTML = '<a rel="noopener noreferrer" href="' + permalink + '">member.cash</a>';
    } else if (sourcenetwork == 99) {
        sourceNetworkHTML = '<a rel="noopener noreferrer" target="rsslink" href="' + quoteattr(hivelink) + '">rss</a>';
    }

    var obj = {
        //These must all be HTML safe.
        page: page,
        txid: san(txid),
        diff: differentiator,
        remembersactive: remembersActive,
        articlelink2: articleLink2,
        hideuser: hideuserHTML,
        address: san(address),
        permalink: permalink,
        maplink: mapLink,
        sourceNetworkHTML: sourceNetworkHTML,
        origtxid: san(origtxid),
        bitcoinaddress: bitcoinaddress,
        MEMUSD1C: satsToUSDString(10000000),
        MEMUSD1: satsToUSDString(100000000),
        MEMUSD5: satsToUSDString(500000000),
        MEMUSD10: satsToUSDString(1000000000),
        MEMUSD20: satsToUSDString(2000000000),
        MEMUSD50: satsToUSDString(5000000000),
        MEMUSD100: satsToUSDString(10000000000),
        ticker: nativeCoin.ticker
    }

    return templateReplace(replyAndTipsTemplate, obj);

}

function getTipsHTML(txid, tips, differentiator, display) {
    var obj = {
        //These must all be HTML safe.
        txid: san(txid),
        diff: differentiator,
        tips: Number(tips),
        balancestring: usdString(Number(tips), false),
        display: (display ? `` : ` style="display:none" `)
    }
    return templateReplace(tipsTemplate, obj);
}


function getRemembersHTML(txid, differentiator, repostcount, display, origtxid, network) {

    var obj = {
        //These must all be HTML safe.
        txid: san(txid),
        diff: differentiator,
        repostcount: Number(repostcount),
        display: (display ? `` : ` style="display:none" `),
        origtxid: origtxid,
        network: network
    }
    return templateReplace(remembersTemplate, obj);
}

function getLikesHTML(txid, likesbalance, differentiator, display) {
    var obj = {
        //These must all be HTML safe.
        txid: san(txid),
        diff: differentiator,
        likesbalance: likesbalance,
        display: (display ? `` : ` style="display:none" `)
    }
    return templateReplace(likesTemplate, obj);
}


function replacePageNamesWithLinks(target) {
    //return target.replace(/(^|\s|>)@([^,\/#!$%\^&\*;:{}=`~()'"@<>\ \n?]{1,217})/g, replacePageName);
    //return target.replace(/(^|\s|>)@([A-Za-z0-9\-_\.]{1,217})/g, replacePageName);
    //we won't store . - in pagenames, but where a page includes . -, the page will be recognized.
    return target.replace(/(^|\s|>)@([0-9\-_\.\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]{1,217})/g, replacePageName);


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
        page,
        differentiator,
        repostedHTML,
        truncate,
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
        data[stub + "likedtxid"],
        data[stub + "likeordislike"],
        data[stub + "repliesroot"],
        data[stub + "repostcount"],
        data[stub + "repostidtxid"],
        data[stub + "network"],
        data[stub + "hivelink"],
        data[stub + "deleted"]
    );
}


function getHTMLForPostHTML2(theMember, page, differentiator, repostedHTML, truncate, txid, likes, dislikes, tips, firstseen, message, roottxid, topic, replies, geohash, likedtxid, likeordislike, repliesroot, repostcount, repostidtxid, sourcenetwork, hivelink, deleted) {
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
    //var scores = getScoresHTML(txid, likes, dislikes, tips, differentiator);
    var tipsandlinks = '';
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
        sourceNetworkImage = `<a rel="noopener noreferrer" target="memo" href="https://memo.cash/a/${san(hivelink)}"><img width='15' height='15' alt='Memo' src='img/networks/0.png'></a>`;
    } else if (sourcenetwork == 1) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="bitclout" href="https://bitclout.com/posts/${san(hivelink)}">BitClout</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="bitclout" href="https://bitclout.com/posts/${san(hivelink)}"><img width='15' height='15' alt='BitClout' src='img/networks/1.png'></a>`;
    } else if (sourcenetwork == 2) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="hiveblog" href="https://hive.blog/@${sanhl(hivelink)}">hive.blog</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="hiveblog" href="https://hive.blog/@${sanhl(hivelink)}"><img width='15' height='15' alt='Hive' src='img/networks/2.png'></a>`;
    } else if (sourcenetwork == 3) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="memberp" href="${permalink}">member.cash</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="memberp" href="${permalink}"><img width='15' height='15' alt='member.cash' src='img/networks/3.png'></a>`;
    } else if (sourcenetwork == 4) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="dogehair" href="${permalink}">doge.hair</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="dogehair" href="${permalink}"><img width='15' height='15' alt='doge.hair' src='img/networks/4.png'></a>`;
    } else if (sourcenetwork == 5) {
        sourceNetworkHTML = `nostr`;
        sourceNetworkImage = `<img width='15' height='15' alt='nostr' src='img/networks/5.png'>`;
    } else if (sourcenetwork == 99) {
        sourceNetworkHTML = `<a rel="noopener noreferrer" target="rsslink" href="${quoteattr(hivelink)}">RSS Link</a>`;
        sourceNetworkImage = `<a rel="noopener noreferrer" target="rsslink" href="${quoteattr(hivelink)}"><img width='15' height='15' alt='RSS' src='img/networks/99.png'></a>`;
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
        replies: Number(replies) < 0 ? 0 : truncateNumber(Number(replies)),
        likesbalance: truncateNumber((Number(likes) - Number(dislikes))),
        likes: truncateNumber(Number(likes)),
        dislikes: truncateNumber(Number(dislikes)),
        remembers: truncateNumber(Number(repostcount)),
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
        MEMUSD1C: satsToUSDString(10000000),
        MEMUSD1: satsToUSDString(100000000),
        MEMUSD5: satsToUSDString(500000000),
        MEMUSD10: satsToUSDString(1000000000),
        MEMUSD20: satsToUSDString(2000000000),
        MEMUSD50: satsToUSDString(5000000000),
        MEMUSD100: satsToUSDString(10000000000),
        deleted: (deleted == '1' ? ` deleted` : ''),
        retracted: (deleted == '1' ? ` <span class='retracted'>removed</span>` : ''),
        ticker: nativeCoin.ticker
    };

    return templateReplace(postCompactTemplate, obj);


}

function truncateNumber(theNumber){
    if(theNumber>999){
        return parseInt(theNumber/100)/10+'k';
    }
    return theNumber;
}


function getHTMLForReplyHTML2(theMember, txid, likes, dislikes, tips, firstseen, message, page, ishighlighted, likedtxid, likeordislike, blockstxid, differentiator, topicHOSTILE, moderatedtxid, repostcount, repostidtxid, sourcenetwork, hivelink, deleted, edit) {
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
    //var voteButtons = getVoteButtons(txid, theMember.bitcoinaddress, likedtxid, likeordislike, (Number(likes) - Number(dislikes)), origTXID);
    //var author = theMember.userHTML(true);
    //new Member(address, name, ratingID, rating, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, lastactive, sysrating, hivename, bitcoinaddress).userHTML(true);
    //var age = getAgeHTML(firstseen);
    //var scores = getScoresHTML(txid, likes, dislikes, tips, differentiator, repostcount);
    //var replyAndTips = getReplyAndTipLinksHTML(page, txid, theMember.address, false, "", differentiator, topicHOSTILE, repostidtxid, sourcenetwork, hivelink, origTXID, theMember.bitcoinaddress);
    //var replyDiv = getReplyDiv(txid, page, differentiator, theMember.address, sourcenetwork, origTXID);

    let likesbalance = Number(likes) - Number(dislikes);
    let santxid = san(txid);
    let permalink = `?` + santxid.substring(0, 4) + `#thread?post=` + santxid;
    let articlelink = `?` + santxid.substring(0, 4) + `#article?post=` + santxid;
    if (pathpermalinks) {
        permalink = pathpermalinks + `p/` + origTXID.substr(0, 10);
        articlelink = pathpermalinks + `a/` + origTXID.substr(0, 10);
    }
    var obj = {
        //These must all be HTML safe 
        txid: santxid,
        highlighted: (ishighlighted ? ` highlight` : ``),
        id: (ishighlighted ? `highlightedcomment` : ``),
        blocked: (blockstxid != null ? `blocked` : ``),
        votebuttons: getVoteButtons(txid, theMember.bitcoinaddress, likedtxid, likeordislike, (Number(likes) - Number(dislikes)), origTXID),
        author: theMember.userHTML(true),
        message: message,
        likes: getLikesHTML(txid, likesbalance, differentiator, (likes > 0)),
        tips: getTipsHTML(txid, tips, differentiator, (tips > 0)),
        remembers: getRemembersHTML(txid, differentiator, repostcount, (repostcount > 0), origTXID, sourcenetwork),
        age: getAgeHTML(firstseen, false, permalink),
        replyandtips: getReplyAndTipLinksHTML(page, txid, theMember.address, false, "", differentiator, topicHOSTILE, sourcenetwork, hivelink, origTXID, theMember.bitcoinaddress, permalink, articlelink),
        replydiv: getReplyDiv(txid, page, differentiator, theMember.address, sourcenetwork, origTXID),
        diff: differentiator,
        deleted: (deleted == '1' ? ` deleted` : ''),
        retracted: (deleted == '1' ? ` removed` : ''),
        revision: (Number(edit)>0 ? ' edit'+Number(edit) : '')
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
            var isMuted = (data[i].edit > 0 || data[i].blockstxid != null || data[i].moderated != null || ratingused < maxScoreToCollapseComment);

            var obj = {
                unmuteddisplay: (isMuted ? `none` : `block`),
                muteddisplay: (isMuted ? `block` : `none`),
                txid: san(data[i].txid),
                hightlightedclass: (data[i].highlighted ? `highlightli` : ``),
                replyHTML: getHTMLForReply(data[i], depth, pageName, i),
                nestedPostHTML: getNestedPostHTML(data, data[i].txid, depth + 1, pageName, "dontmatch"),
                user: userFromDataBasic(data[i], data[i].ratingID),
                age: getAgeHTML(data[i].firstseen),
                diff: i,
                deleted: (data[i].deleted == '1' ? ` deleted` : ''),
                retracted: (data[i].deleted == '1' ? ` removed` : ''),
                revision: (Number(data[i].edit)>0 ? ' edit'+Number(data[i].edit) : '')
                //These must all be HTML safe.
            }

            contents += templateReplace(nestedPostTemplate, obj);
        }
    }
    contents = contents + "</ul>";
    return contents;
}

function getAgeHTML(firstseen, compress = false, link = null) {
    let agehtml = `<span class="age">&hairsp;•&hairsp;` + timeSince(Number(firstseen), compress) + `</span>`;
    if (link) {
        agehtml = `<a href='${link}'>${agehtml}</a>`;
    }
    return agehtml;
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


function getItemListandNavButtonsHTML(navheader, contentsHTML, navbuttonsHTML, styletype, start) {
    if (styletype != "") {
        return `<div class="itemlist">${navheader}<ol start="` + (Number(start) + 1) + `" class="` + styletype + `">` + contentsHTML + `</ol></div><div class="navbuttons">` + navbuttonsHTML + `</div>`;
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
    return `<div class="` + theclass + `">` + user + (amount > 0 ? ` ` + getSafeTranslation('tipped', 'tipped') + ` ` + usdString(amount, false) : ``) + (Number(type) == -1 ? ` ` + getSafeTranslation('disliked', 'disliked') : ``) + `</div>`;
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
        message = message.replace(bitcloutRegex, `<a href="https://images.bitclout.com/$1.webp" rel="noopener noreferrer" target="_bitclout" onclick="event.stopPropagation();" aria-label="Full Sized Image"><div class="imgurcontainer"><img loading="lazy" alt="Post's Image (Bitclout)" class="imgurimage" src="https://images.bitclout.com/$1$2"></img></div></a>`);

        var bitcloutRegex = global ?
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?images\.deso\.org\/([a-zA-Z0-9]{64})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/gi :
            /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?images\.deso\.org\/([a-zA-Z0-9]{64})(\.[a-zA-Z0-9]{3,4})*.*?<\/a>/i;
        message = message.replace(bitcloutRegex, `<a href="https://images.deso.org/$1.webp" rel="noopener noreferrer" target="_bitclout" onclick="event.stopPropagation();" aria-label="Full Sized Image"><div class="imgurcontainer"><img loading="lazy" alt="Post's Image (Deso)" class="imgurimage" src="https://images.deso.org/$1$2"></img></div></a>`);

    }

    var membercoinRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?member\.cash\/img\/upload\/([a-z0-9]{10})(\.webp)*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?member\.cash\/img\/upload\/([a-z0-9]{10})(\.webp)*.*?<\/a>/i;
    message = message.replace(membercoinRegex, `<a href="https://member.cash/img/upload/$1.webp" rel="noopener noreferrer" target="_membercoin" onclick="event.stopPropagation();" aria-label="Full Sized Image"><div class="imgurcontainer"><img loading="lazy" alt="Post's Image (member.cash)" class="imgurimage" src="https://member.cash/img/upload/$1.webp"></img></div></a>`);

    var memberlinksRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(member\.cash\/p\/)([a-z0-9]{10})*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(member\.cash\/p\/)([a-z0-9]{10})*.*?<\/a>/i;
    message = message.replace(memberlinksRegex, replaceDiamondApp);

    var giphyRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(giphy\.com\/embed\/|media1\.giphy\.com\/media\/)([a-z0-9A-Z]{5,20})*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(giphy\.com\/embed\/|media1\.giphy\.com\/media\/)([a-z0-9A-Z]{5,20})*.*?<\/a>/i;
    message = message.replace(giphyRegex, `<a href="https://i.giphy.com/media/$2/giphy.webp" rel="noopener noreferrer" target="_giphy" onclick="event.stopPropagation();" aria-label="Full Sized Image"><div class="imgurcontainer"><img loading="lazy"  alt="Post's Image (Giphy)" class="imgurimage" src="https://i.giphy.com/media/$2/giphy.webp"></img></div></a>`);


    var pearlRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?cdn\.pearl\.app\/([a-z0-9\-]{36})(\.webp)*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?cdn\.pearl\.app\/([a-z0-9\-]{36})(\.webp)*.*?<\/a>/i;
    message = message.replace(pearlRegex, `<a href="https://cdn.pearl.app/$1.webp" rel="noopener noreferrer" target="_pearl" onclick="event.stopPropagation();" aria-label="Full Sized Image"><div class="imgurcontainer"><img loading="lazy" alt="Post's Image (Pearl)" class="imgurimage" src="https://cdn.pearl.app/$1.webp"></img></div></a>`);

    var diamondappRegex = global ?
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(bitclout\.com\/posts\/|diamondapp\.com\/posts\/|diamondapp\.com\/nft\/|desocialworld\.com\/nft\/|desocialworld\.com\/posts\/|node\.deso\.org\/posts\/)([a-z0-9]{64})*.*?<\/a>/gi :
        /<a (?:rel="noopener noreferrer" )?href="(?:https?:\/\/)?(bitclout\.com\/posts\/|diamondapp\.com\/posts\/|diamondapp\.com\/nft\/|desocialworld\.com\/nft\/|desocialworld\.com\/posts\/|node\.deso\.org\/posts\/)([a-z0-9]{64})*.*?<\/a>/i;
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
function replaceDiamondApp(match, p1, p2) {
    return `<a onclick="event.stopPropagation();nlc();location.href='#thread?post=${p2}'; " href="javascript:">https://member.cash/p/${p2.substring(0, 10)}</a>`;
}

function replaceImgur(match, p1, p2, p3, p4, offset, string) {
    //return p1 + `<a href="#member?pagingid=` + encodeURIComponent(p2) + `" onclick="nlc();">@` + ds(p2) + `</a>`;
    if (!p4) { p4 = '.jpg'; }
    if (p4.toLowerCase() == '.mp4') {
        return `<a href='javascript:;'><video controls class="imgurimage" draggable="false" playsinline="true" loop="true"><source loading="lazy" type="video/mp4" src="https://i.imgur.com` + p2 + p3 + p4 + `" alt="imgur post ` + p2 + `"></video></a>`;
    }

    return `<a href="https://i.imgur.com` + p2 + p3 + `" rel="noopener noreferrer" target="_imgur" onclick="event.stopPropagation();" aria-label="Full Sized Image"><div class="imgurcontainer"><img loading="lazy" alt="Post's Image (Imgur)" class="imgurimage" src="https://i.imgur.com` + p2 + p3 + p4 + `" alt="imgur post ` + p2 + `"></img></div></a>`;
}

//Notifications

function allowNotificationButtonHTML() {
    return `<span class="allownotifications"><a data-vavilon="VV0080" class="memberlinkbutton" href="javascript:;" onclick="requestNotificationPermission(); this.style.display='none';">Allow Notifications</a></span>`;
}

function getNotificationsTableHTML(contents, navbuttons) {
    return `<ul class="notificationslist">` + contents + `</ul>` + navbuttons;
}

function notificationItemHTML(notificationtype, iconHTML, mainbodyHTML, subtextHTML, addendumHTML, txid, highlighted, alttext) {
    //icon, mainbody and subtext should already be escaped and HTML formatted

    var obj = {
        //These must all be HTML safe.
        highlighted: (highlighted ? 'highlighted ' : ''),
        type: notificationtype,
        txid: san(txid),
        title: mainbodyHTML,
        age: subtextHTML,
        post: addendumHTML,
        iconHTML: iconHTML,
        alttext: alttext
    }

    return templateReplace(notificationCompactTemplate, obj);
}



//Maps

function getMapPostHTML(lat, lng, requireLogin) {

    var obj = {
        //These must all be HTML safe.
        lat: Number(lat),
        lng: Number(lng),
        profilepicsmall: profilepic,
        address: pubkey,
        maxgeolength: maxgeolength
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
function getMembersWithRatingHTML(i, page, data) {
    var directlink = "";
    var field1 = `<td>` + directlink + userFromDataBasic(data, i + page + data.address) + getAgeHTML((data.lastactive ? data.lastactive : data.pictime), true) + `</td>`;
    //return field1;
    /*var field2 = `<td>` + getMemberLink(data.address2, data.name2) + `</td>`;
    if (reverse) {
        return `<tr>` + field2 + `<td>` + action + `</td>` + field1 + `</tr>`;
    }*/
    //return `<tr>` + field1 + `<td>` + action + `</td>` + field2 + `</tr>`;
    return `<tr>` + field1 + `</tr>`;
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
    return `<input placeholder="` + getSafeTranslation('VVratinginstruction', 'Add a comment and click on a star rating to rate this member...') + `" size="30" maxlength="${maxratinglength}" id="memberratingcommentinputbox${san(data.bitcoinaddress)}" value="${ds(data.ratingreason)}" onchange="checkLength('memberratingcommentinputbox${san(data.bitcoinaddress)}',${maxratinglength});" onkeypress="this.onchange();" onpaste="this.onchange();" oninput="this.onchange();"></input>`;
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
                ret += `<div class="filterprovider">` + clickActionTopicHTML("dismiss", data[i].existingmod, data[i].topicname, getSafeTranslation('removefilter', 'remove filter'), "dismiss" + data[i].existingmod + Number(data[i].mostrecent)) + "<span class='mib'>( " + (new Member(data[i].existingmod, data[i].existingmodname, "", "")).userHTML(false) + ")</span></div>";
            } else {
                var userName = "";
                try {
                    userName = document.getElementById('settingsnametext').value;
                } catch (err) { }//means user is not logged in
                var userIsGroupFilter = userName.toLowerCase().endsWith("filter") || userName.toLowerCase().endsWith("group");
                if (!data[i].existingmodname) data[i].existingmodname = "";
                var modIsGroupFilter = data[i].existingmodname.toLowerCase().endsWith("filter") || data[i].existingmodname.toLowerCase().endsWith("group");
                if (userIsGroupFilter != modIsGroupFilter) {
                    ret += `<div class="filterprovider">` + clickActionTopicHTML("designate", data[i].existingmod, data[i].topicname, getSafeTranslation('addfilter', 'add filter'), "designate" + data[i].existingmod + Number(data[i].mostrecent)) + "<span class='mib'>( " + (new Member(data[i].existingmod, data[i].existingmodname, "", "")).userHTML(false) + ")</span></div>";
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
        return "<li><span class='messagemeta'>" + userFromDataBasic(data, count + "privatemessages" + data.address) + " " + getAgeHTML(data.firstseen, false) + " " + sendEncryptedMessageHTML(data.bitcoinaddress, data.name, data.publickey) + "</span><br/><div class='privatemessagetext' id='" + san(data.roottxid) + "'>" + getSafeTranslation('processing', 'processing') + "</div><br/></li>";
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
    if(status==499){
        //Google error status, probably caused by google bot being unable to 
        //load content due to robot.txt restrictions. show the preview content text instead
        theElement.innerHTML = document.getElementById('previewcontent').innerHTML;
        return;
    }
    if (theElement) {
        var obj = {
            //These must all be HTML safe.
            status: ds(status),
            url: ds(theURL)
        }
        theElement.innerHTML = templateReplace(errorTemplate, obj);
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
