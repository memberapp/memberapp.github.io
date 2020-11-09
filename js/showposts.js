//Some refactoring is possible in these functions

"use strict";

var eccryptoJs = null;

function getAndPopulateQuoteBox(txid) {
    var page = 'quotepost';
    showOnly(page);
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;

    var theURL = dropdowns.contentserver + '?action=singlepost&address=' + pubkey + '&txid=' + txid;
    getJSON(theURL).then(function (data) {
        var contents = "";
        if (data[0]) {
            contents = getHTMLForPost(data[0], 1, page, 0, null, true);
            document.getElementById(page).innerHTML = contents;
        } else {
            throw error(getSafeTranslation('noresult', 'no result returned'));
        }
        addDynamicHTMLElements();
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}

function getAndPopulateNew(order, content, topicnameHOSTILE, filter, start, limit, page, qaddress) {
    if (order == "") order = "hot";
    if (content == "") content = "posts";
    if (filter == "") filter = "everyone";
    if (start == "") start = 0;
    if (limit == "") limit = numbers.results;
    if (page == "") page = "posts";

    //Show the relevant html element
    show(page);

    //Show loading animation
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;

    if (topicnameHOSTILE == null || topicnameHOSTILE == "") {
        setTopic('');
    }

    //Request content from the server and display it when received
    var theURL = dropdowns.contentserver + '?action=show&order=' + order + '&content=' + content + '&topicname=' + encodeURIComponent(topicnameHOSTILE) + '&filter=' + filter + '&address=' + pubkey + '&qaddress=' + qaddress + '&start=' + start + '&limit=' + limit;
    getJSON(theURL).then(function (data) {

        //if(data.length>0){updateStatus("QueryTime:"+data[0].msc)};
        //Show navigation next/back buttons
        var navbuttons = getNavButtonsNewHTML(order, content, topicnameHOSTILE, filter, start, limit, 'show', qaddress, "getAndPopulateNew", data.length > 0 ? data[0].unduplicatedlength : 0);

        //Server bug will sometimes return duplicates if a post is liked twice for example,
        // this is a workaround, better if fixed server side.
        data = removeDuplicates(data);

        data = mergeRepliesToRepliesBySameAuthor(data, false);

        var contents = "";
        for (var i = 0; i < data.length; i++) {
            try {
                contents = contents + getPostListItemHTML(getHTMLForPost(data[i], i + 1 + start, page, i, null, false));
            } catch (err) {
                console.log(err);
            }
        }

        if (contents == "") {
            contents = getDivClassHTML('message', getSafeTranslation("nothinghere", "Nothing here yet"));

            if (filter == "mypeeps" || filter == "myfeed" || topicnameHOSTILE == "MyFeed" || topicnameHOSTILE == "MyTopics") {
                contents = getDivClassHTML('message', getSafeTranslation("nothinginfeed", "Nothing in your feed"));
            }

        }
        if (topicnameHOSTILE != null && topicnameHOSTILE != "" && topicnameHOSTILE.toLowerCase() != "mytopics" && topicnameHOSTILE.toLowerCase() != "myfeed" && topicnameHOSTILE.toLowerCase() != "mypeeps") {
            showOnly("topicmeta");
        }



        displayItemListandNavButtonsHTML(contents, navbuttons, page, data, "posts", start, true);
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}


function getAndPopulateMessages(start, limit) {

    document.getElementById('messageslist').innerHTML = document.getElementById("loading").innerHTML;

    var theURL = dropdowns.contentserver + '?action=messages&address=' + pubkey;
    getJSON(theURL).then(async function (data) {

        if (!eccryptoJs) {
            await loadScript("js/lib/eccrypto-js.js");
        }

        lastViewOfNotificationspm = parseInt(new Date().getTime() / 1000);
        localStorageSet(localStorageSafe, "lastViewOfNotificationspm", lastViewOfNotificationspm);
        document.getElementById("alertcountpm").innerHTML = "";
        document.title = "member.cash";


        data = mergeRepliesToRepliesBySameAuthor(data, true);
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            data[i].address = data[i].senderaddress;
            contents += getMessageHTML(data[i], i);
        }
        if (contents == "") { contents = getSafeTranslation('nomessagesfound', "No messages found."); }


        document.getElementById('messageslist').innerHTML = contents;
        addDynamicHTMLElements(data);
        scrollToPosition();
    }, function (status) { //error detection....
        showErrorMessage(status, 'messageslist', theURL);
    });
}

function getAndPopulateThread(roottxid, txid, pageName) {
    if (pageName != "mapthread") {
        show(pageName);
        document.getElementById(pageName).innerHTML = document.getElementById("loading").innerHTML;
    }

    //Roottxid is used to get all the posts, txid is used to highligh the required post

    //If no post is specified, we'll use it as a top level
    if (txid === undefined || txid == "") { txid = roottxid; }

    var theURL = dropdowns.contentserver + '?action=thread&address=' + pubkey + '&txid=' + txid;
    getJSON(theURL).then(function (data) {
        //Server bug will sometimes return duplicates if a post is liked twice for example,
        // this is a workaround, better if fixed server side.
        data = removeDuplicates(data);

        data = mergeRepliesToRepliesBySameAuthor(data, false);

        //Make sure we have id of the top level post
        if (data.length > 0) { roottxid = data[0].roottxid; }

        //setTopic(data[0].topic);

        //Find who started the thread
        var threadstarter = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].txid == roottxid) {
                threadstarter = data[i].address;
            }
        }

        //Find the first reply by the thread starter
        var earliestReply = "none";
        var earliestReplyTXID = "none";
        var earliestReplyTime = 9999999999;
        for (var i = 0; i < data.length; i++) {
            if (data[i].retxid == roottxid && data[i].address == threadstarter) {
                if (data[i].firstseen < earliestReplyTime) {
                    earliestReply = i;
                    earliestReplyTime = data[i].firstseen;
                    earliestReplyTXID = data[i].txid
                }
            }
        }

        //Treat entries in polls topic as special
        if (data.length > 0 && data[0].topic.toLowerCase() == 'polls') {
            earliestReply = "none";
            earliestReplyTXID = "none";
            earliestReplyTime = 9999999999;
        }

        var contents = "";
        for (var i = 0; i < data.length; i++) {
            if (data[i].txid == roottxid) {
                contents += getDivClassHTML("fatitem", getHTMLForPost(data[i], 1, pageName, i, data[earliestReply], true));
                var commentTree = getNestedPostHTML(data, data[i].txid, 0, pageName, txid, earliestReplyTXID)

                if (commentTree == '<ul></ul>') {
                    commentTree = getNoCommentsYetHTML();
                } else {
                    commentTree = getDivClassHTML("comment-tree", commentTree);
                }

                contents += commentTree;
            }
        }


        //Threads have no navbuttons
        displayItemListandNavButtonsHTML(contents, "", pageName, data, "", 0, false);

        if (popup != undefined) {
            popup.setContent(getDivClassHTML('mapthread', contents));

        }
        addDynamicHTMLElements(data);
        scrollToPosition();

        showReplyBox(san(txid) + pageName);


        scrollToElement("highlightedcomment");

    }, function (status) { //error detection....
        showErrorMessage(status, pageName, theURL);
    });
}

function getAndPopulateTopic(topicNameHOSTILE) {
    var page = "topicmeta";
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;
    var theURL = dropdowns.contentserver + '?action=topiclist&topicname=' + encodeURIComponent(topicNameHOSTILE) + '&qaddress=' + pubkey;
    getJSON(theURL).then(function (data) {

        //todo, move this to htmlquarantine.
        var contents = "";
        //group data rows by moderator before displaying
        var modsArray = [];
        for (var i = 0; i < data.length; i++) {
            if (i == 0 || (i < data.length && data[i].topicname == data[i - 1].topicname)) {
                modsArray.push(data[i]);
            }
        }
        if (modsArray.length == 0) {
            var newData = [];
            //These may be out of date, but better than showing NaN
            newData.mostrecent = 0;
            newData.subscount = 0;
            newData.messagescount = 0;
            newData.topicname = topicNameHOSTILE;
            modsArray.push(newData);
        }
        contents += getHTMLForTopicArray(modsArray, 'modmoresingle');


        document.getElementById(page).innerHTML = getHTMLForTopicHeader(topicNameHOSTILE, contents);

    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}

function getAndPopulateTopicList(showpage) {
    var page = "topiclistanchor";
    if (showpage) {
        show(page);
    }
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;
    var theURL = dropdowns.contentserver + '?action=topiclist&qaddress=' + pubkey;
    getJSON(theURL).then(function (data) {

        var selectboxIndex = 5;
        var selectbox = document.getElementById('topicselector');
        while (selectbox.options[selectboxIndex]) {
            selectbox.remove(selectboxIndex)
        }


        var lastValue = "";
        for (var i = 0; i < Math.min(40, data.length); i++) {
            var option = document.createElement("option");
            //Caution, topicname can contain anything
            if (data[i].topicname == null) continue;

            option.text = capitalizeFirstLetter(data[i].topicname.substr(0, 13));
            option.value = data[i].topicname.trim();
            if (option.value == lastValue) continue;
            lastValue = option.value;
            selectbox.add(option, [selectboxIndex]);
            selectboxIndex++;
        }

        if (showpage) {
            //group data rows by moderator before displaying
            var modsArray = [];
            var contents = "";
            for (var i = 0; i < data.length; i++) {
                if (i == 0 || (i < data.length && data[i].topicname == data[i - 1].topicname)) {
                    modsArray.push(data[i]);
                } else {
                    contents += getHTMLForTopicArray(modsArray, 'modmore');
                    modsArray = [];
                    modsArray.push(data[i]);
                }
            }
            document.getElementById(page).innerHTML = getHTMLForTopicHeader("", contents);
            addDynamicHTMLElements();
        }
        //Threads have no navbuttons
        //displayItemListandNavButtonsHTML(contents, "", "thread", data, "",0);
        //document.getElementById(page).innerHTML = contents;
        //detectMultipleIDS();
        
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}



function displayItemListandNavButtonsHTML(contents, navbuttons, page, data, styletype, start, adddynamic) {
    contents = getItemListandNavButtonsHTML(contents, navbuttons, styletype, start);
    var pageElement = document.getElementById(page);
    pageElement.innerHTML = contents; //display the result in the HTML element
    listenForTwitFrameResizes();
    if (adddynamic) {
        addDynamicHTMLElements(data);
        scrollToPosition();
    }
    //window.scrollTo(0, scrollhistory[window.location.hash]);
    //detectMultipleIDS();
    return;
}



function addDynamicHTMLElements(data) {

    if (data != null && data != undefined && data[0]) {
        //if (data.length > 0) {
        updateStatus("QT:" + (Math.round(data[0].msc * 100) / 100).toFixed(2));
        //}
    }
    //Add ratings, disable controls if the star rating can be updated
    addStarRatings('rating');

    //Add mouseoverprofiles
    addMouseoverProfiles();

    //Add scoremouseovers
    //addClickScores();
    translatePage();

    //Add identicons
    jdenticon();

    loadBigLibs();
}

/*
function addClickScores() {
    var matches = document.querySelectorAll("[id^='scores']");
    for (var i = 0; i < matches.length; i++) {
        var profileElement = matches[i].id.replace('scores', 'scoresexpanded');
        //document.getElementById(profileElement).onmouseleave=setDisplayNone;
        matches[i].onclick = showScoresExpanded;
    }
}*/

function addMouseoverProfiles() {
    var matches = document.querySelectorAll("[id^='memberinfo']");
    for (var i = 0; i < matches.length; i++) {
        var profileElement = document.getElementById(matches[i].id.replace('member', 'profile'));
        if(profileElement){
            profileElement.onmouseleave = setDisplayNone;
            delay(matches[i], showPreviewProfile, profileElement);
        }
    }
}

function setDisplayNone() {
    this.style.display = "none";
}

function showScoresExpanded(retxid, profileelement) {
    if (this) {
        var profileelement = this.id.replace('scores', 'scoresexpanded');
        var retxid = profileelement.substr(14, 64);
    }
    var closeHTML = getCloseButtonHTML(profileelement);
    document.getElementById(profileelement).innerHTML = closeHTML + document.getElementById("loading").innerHTML;
    document.getElementById(profileelement).style.display = "block";
    //load scores
    var theURL = dropdowns.contentserver + '?action=likesandtips&txid=' + san(retxid) + '&address=' + san(pubkey);
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            var amount = Number(data[i].amount);
            contents += getTipDetailsHTML(userFromDataBasic(data[i], san(retxid) + i, 16), amount, data[i].type);
        }
        document.getElementById(profileelement).innerHTML = closeHTML + contents;
        addDynamicHTMLElements();
    }, function (status) { //error detection....
        showErrorMessage(status, profileelement, theURL);
    });
}

function showRemembersExpanded(retxid, profileelement) {

    var closeHTML = getCloseButtonHTML(profileelement);
    document.getElementById(profileelement).innerHTML = closeHTML + document.getElementById("loading").innerHTML;
    document.getElementById(profileelement).style.display = "block";
    //load scores
    var theURL = dropdowns.contentserver + '?action=remembers&txid=' + san(retxid) + '&address=' + san(pubkey);
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents += getRememberDetailsHTML(userFromDataBasic(data[i], san(retxid) + i, 16), data[i].message, data[i].topic, data[i].txid);
        }
        document.getElementById(profileelement).innerHTML = closeHTML + contents;
        addDynamicHTMLElements();
    }, function (status) { //error detection....
        showErrorMessage(status, profileelement, theURL);
    });
}



function showPreviewProfile(profileelement) {
    profileelement.style.display = "block";
}

function addStarRatings(stem) {
    var matches = document.querySelectorAll("[id^='" + stem + "']");
    for (var i = 0; i < matches.length; i++) {
        addSingleStarsRating(matches[i]);
        //var test=matches[i];
    }
}

function addSingleStarsRating(theElement) {
    //var theElement = document.querySelector(querySelector);
    if (theElement == undefined) return;
    if (theElement.isdone) return;
    let name = theElement.dataset.ratingname;
    let theAddress = theElement.dataset.ratingaddress;
    let rawRating = theElement.dataset.ratingraw;
    let starSize = theElement.dataset.ratingsize;
    //this is very slow
    //let starSize = Number(getComputedStyle(theElement).fontSize);

    let disabledtext = theElement.dataset.disabledtext;

    var theRating = 0; if (rawRating != null && rawRating != 0) { theRating = (ds(rawRating) / 64) + 1; }
    var starRating1 = raterJs({
        starSize: starSize,
        rating: Math.round(theRating * 10) / 10,
        element: theElement,
        disableText: disabledtext ? disabledtext : getSafeTranslation('thisuserrates', 'This user rates ') + ds(name) + ' {rating}/{maxRating}',
        rateCallback: function rateCallback(rating, done) {
            var ratingText = document.getElementById("memberratingcommentinputbox" + theAddress);
            if (ratingText) {
                rateCallbackAction(rating, this, ratingText.value);
            } else {
                rateCallbackAction(rating, this);
            }
            done();
        }
    });
    starRating1.theAddress = theAddress;
    if (disabledtext) {
        starRating1.disable();
    }
    theElement.isdone = true;
    return starRating1;
}


function getHTMLForPost(data, rank, page, starindex, dataReply, alwaysShow) {

    //Always show if post is directly requested
    if (!alwaysShow) {
        if (checkForMutedWords(data)) return "";
        if (data.moderated != null) return "";
    }

    let mainRatingID = starindex + page + ds(data.address);
    var retHTML = "";
    var repostHTML1 = "";
    var repostHTML2 = "";

    if (data.repost) {
        //repost
        let repostRatingID = starindex + "repost" + ds(data.rpaddress);
        repostHTML1 = getRepostHeaderHTML(userFromDataBasic(data, repostRatingID, 8));
        repostHTML2 = getHTMLForPostHTML(data.rptxid, data.rpaddress, data.rpname, data.rplikes, data.rpdislikes, data.rptips, data.rpfirstseen, data.rpmessage, data.rproottxid, data.rptopic, data.rpreplies, data.rpgeohash, page, mainRatingID + "qr", data.rplikedtxid, data.rplikeordislike, data.rprepliesroot, data.rprating, starindex, data.rprepostcount, data.repostidtxid, data.rppagingid, data.rppublickey, data.rppicurl, data.rptokens, data.rpfollowers, data.rpfollowing, data.rpblockers, data.rpblocking, data.rpprofile, data.rpisfollowing, data.nametime, '');
        if (repostHTML2) {
            repostHTML2 = getDivClassHTML("quotepost", repostHTML2);
        }
    }

    if (data.message) {
        //post with message
        retHTML = getHTMLForPostHTML(data.txid, data.address, data.name, data.likes, data.dislikes, data.tips, data.firstseen, data.message, data.roottxid, data.topic, data.replies, data.geohash, page, mainRatingID, data.likedtxid, data.likeordislike, data.repliesroot, data.rating, starindex, data.repostcount, data.repostidtxid, data.pagingid, data.publickey, data.picurl, data.tokens, data.followers, data.following, data.blockers, data.blocking, data.profile, data.isfollowing, data.nametime, repostHTML2);
    } else {
        //repost with no message
        retHTML = getDivClassHTML("repostnoquote", repostHTML1 + repostHTML2);
    }


    if (dataReply != null) {
        retHTML += getHTMLForReply(dataReply, 0, page, starindex, null);
    }
    return retHTML;
}

function getHTMLForReply(data, depth, page, starindex, highlighttxid) {
    if (checkForMutedWords(data)) return "";
    let mainRatingID = starindex + page + ds(data.address);
    return getHTMLForReplyHTML(data.txid, data.address, data.name, data.likes, data.dislikes, data.tips, data.firstseen, data.message, depth, page, mainRatingID, highlighttxid, data.likedtxid, data.likeordislike, data.blockstxid, data.rating, starindex, data.topic, data.moderated, data.repostcount, data.repostidtxid, data.pagingid, data.publickey, data.picurl, data.tokens, data.followers, data.following, data.blockers, data.blocking, data.profile, data.isfollowing, data.nametime);
}

function showReplyButton(txid, page, divForStatus) {
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
    document.getElementById("replycompleted" + page + txid).innerText = "";

    var replytext = document.getElementById("replytext" + page + txid).value;
    const replyhex = new Buffer(replytext).toString('hex');
    //const decoded = new Buffer(encoded, 'hex').toString(); // decoded === "This is my string to be encoded/decoded"
    //no wait for the first reply
    sendReplyRaw(privkey, txid, replyhex, 0, divForStatus, function () { replySuccessFunction(page, txid); });
    return true;
}

function replySuccessFunction(page, txid) {
    //document.getElementById(divForStatus).innerHTML = "";
    document.getElementById("replytext" + page + txid).value = "";
    document.getElementById("replystatus" + page + txid).style.display = "none";
    document.getElementById("replybutton" + page + txid).style.display = "block";
    document.getElementById("replycompleted" + page + txid).innerHTML = "Message Sent. " + getRefreshButtonHTML();
}

function showReplyBox(txid) {
    //if (!checkForPrivKey()) return false;
    var replybox = document.querySelector("[id^='" + "reply" + txid.substr(0, 10) + "']");
    //document.getElementById("reply" + txid);
    replybox.style.display = "block";

    //set focus here .focus()
    //document.getElementById("replylink"+txid).style.display = "none";
    return true;
}

function decreaseGUILikes(txid) {
    
        var downarrow = document.getElementById('downvote' + txid);
        var downarrowAction = document.getElementById('downvoteaction' + txid);
        downarrowAction.onclick = null;
        var uparrow = document.getElementById('upvote' + txid);
        var likescount = Number(document.getElementById('likescount' + txid).innerText);
        document.getElementById('score' + txid).innerText = likescount - 1;
        
        //Change classes
        downarrow.className = "votearrowactivateddown rotate180";
        uparrow.className = "votearrow";
        
        if (theStyle.contains('compact')) {
            var dislikescount = Number(document.getElementById('dislikescount' + txid).innerText);
            document.getElementById('dislikescount' + txid).innerText = dislikescount + 1;
            uparrow.className = "votearrowactivateddown rotate180 post-footer-upvote";
            downarrow.className = "votearrow post-footer-downvote-activated";
        }else{
            document.getElementById('score' + txid).className = "betweenvotesscoredown";
        }

}

function increaseGUILikes(txid) {


        //increase number of likes, original themes
        var likescount = Number(document.getElementById('likescount' + txid).innerText);
        var uparrow = document.getElementById('upvote' + txid);
        var uparrowAction = document.getElementById('upvoteaction' + txid);
        uparrowAction.onclick = null;
        var downarrow = document.getElementById('downvote' + txid);
        //Change counts
        document.getElementById('likescount' + txid).innerText = likescount + 1;
        document.getElementById('score' + txid).innerText = likescount + 1;

        //Change classes
        if(uparrow)
        uparrow.className = "votearrowactivated";
        if(downarrow)
        downarrow.className = "votearrow rotate180";
        
        //Nifty
        if (theStyle.contains('compact')) {
            //Change classes
            if(uparrow)
            uparrow.className = "votearrowactivated post-footer-upvote-activated";
            if(downarrow)
            downarrow.className = "votearrow rotate180 post-footer-downvote";
            var upvotecontainer=document.getElementById('upvotecontainer' + txid)
            if(upvotecontainer)
            upvotecontainer.className = "post-footer-upvote-activated post-footer-relative";
        
        }else{
            //Change class
            document.getElementById('score' + txid).className = "betweenvotesscoreup";
        }

}

function increaseGUIReposts(txid) {
    //Change counts
    var repostscount = Number(document.getElementById('repostscount' + txid).innerHTML);
    document.getElementById('repostscount' + txid).innerHTML = repostscount + 1;
}

function likePost(txid, tipAddress) {
    if (!checkForPrivKey()) return false;

    increaseGUILikes(txid);

    if (numbers.oneclicktip >= 547) {
        var tipscount = Number(document.getElementById('tipscount' + txid).dataset.amount);
        document.getElementById('tipscount' + txid).innerHTML = balanceString(tipscount + numbers.oneclicktip, false);
        document.getElementById('tipscount' + txid).dataset.amount = tipscount + numbers.oneclicktip;
        sendTipRaw(txid, tipAddress, numbers.oneclicktip, privkey, null);
    } else {
        sendLike(txid);
    }
}

function dislikePost(txid, tipAddress) {
    if (!checkForPrivKey()) return false;

    decreaseGUILikes(txid);

    sendDislike(txid);
}

function repostPost(txid, page) {
    if (!checkForPrivKey()) return false;

    increaseGUIReposts(txid);

    //Change class
    //document.getElementById('score' + txid).className = "betweenvotesscoreup";

    repost(txid);

}

function sendTip(txid, tipAddress, page) {
    if (!checkForPrivKey()) return false;

    //document.getElementById("tipbox" + page + txid).style.display = "none";
    //document.getElementById("tiplink" + page + txid).style.display = "block";
    increaseGUILikes(txid);

    document.getElementById('tipbutton' + page + txid).style.display = "none";
    document.getElementById('tipstatus' + page + txid).style.display = "block";

    var tipAmount = parseInt(document.getElementById("tipamount" + page + txid).value);
    if (tipAmount < 547) {
        alert(getSafeTranslation('547min', "547 (dust+1) is the minimum tip possible"));
        return false;
    }
    defaulttip = tipAmount;

    document.getElementById('tipstatus' + page + txid).value = getSafeTranslation('sendingtip', "Sending Tip . .") + ' ' + tipAmount;
    var tipscount = Number(document.getElementById('tipscount' + txid).dataset.amount);
    document.getElementById('tipscount' + txid).dataset.amount = tipscount + tipAmount;
    document.getElementById('tipscount' + txid).innerHTML = balanceString(tipscount + tipAmount, false);

    sendTipRaw(txid, tipAddress, tipAmount, privkey,
        function () {
            document.getElementById('tipstatus' + page + txid).value = "sent";
        }
    );

}

function showTipBox(txid) {
    if (!checkForPrivKey()) return false;
    if (document.getElementById("tipamount" + txid).value == 0) {
        document.getElementById("tipamount" + txid).value = defaulttip;
    }

    document.getElementById("tipbox" + txid).style.display = "block";
    //document.getElementById("tiplink"+txid).style.display = "none";
    return true;
}

function showMore(show, hide) {
    document.getElementById(show).style.display = "contents";
    document.getElementById(hide).style.display = "none";
    return true;
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

//Threads

function removeDuplicates(data) {
    var replies = [];
    for (var i = 0; i < data.length; i++) {
        if (replies[data[i].txid] == null) {
            replies[data[i].txid] = 1;
        } else {
            data.splice(i, 1);
            i--;
        }
    }
    return data;
}

function mergeRepliesToRepliesBySameAuthor(data, isPrivateMessage) {

    var replies = [];
    var authors = [];
    //First build associative array
    for (var i = 0; i < data.length; i++) {
        replies[data[i].txid] = data[i].retxid;
        authors[data[i].txid] = data[i].address;
    }

    //console.log(data);
    for (var i = 0; i < data.length; i++) {

        //Do not merge root, or first reply, unless its a private message
        if (isPrivateMessage || (data[i].retxid != "" && data[i].retxid != data[i].roottxid)) {
            //if the author of the post is the same as the parent post
            if (data[i].address == authors[data[i].retxid]) {

                //Merge child post i into parent post
                //Find parent post
                for (var j = 0; j < data.length; j++) {
                    //replies must be within 6 hours of each other
                    if (data[i].retxid == data[j].txid && Math.abs(data[i].firstseen - data[j].firstseen) < 6 * 60 * 60) {
                        //After 8/11/2020 replies must begin with '|' to be mergeable
                        if (data[j].firstseen < 1604813359 || data[i].message.startsWith('|') || data[i].stamp) {
                            //Subtract one as each post is automatically liked by its own author
                            data[j].likes = (Number(data[j].likes) + Number(data[i].likes - 1)).toString();
                            data[j].dislikes = (Number(data[j].dislikes) + Number(data[i].dislikes)).toString();
                            data[j].tips = (Number(data[j].tips) + Number(data[i].tips)).toString();

                            //remove the | at the start of the string if it is present
                            data[j].message = data[j].message + data[i].message.replace(/^\|/, '');

                            //if any other posts reference the child post, have them reference the parent post instead
                            for (var k = 0; k < data.length; k++) {
                                if (data[k].retxid == data[i].txid) {
                                    data[k].retxid = data[j].txid;
                                }
                            }

                            //remove the post
                            data.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                }
            }
        }
    }
    return data;
}

function collapseComment(commentid) {
    document.getElementById('LI' + commentid).style.display = 'none';
    document.getElementById('CollapsedLI' + commentid).style.display = 'block';
}

function uncollapseComment(commentid) {
    document.getElementById('LI' + commentid).style.display = 'block';
    document.getElementById('CollapsedLI' + commentid).style.display = 'none';
}

