//Some refactoring is possible in these functions

"use strict";

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

    //Request content from the server and display it when received
    getJSON(dropdowns.contentserver + '?action=show&order=' + order + '&content=' + content + '&topicname=' + encodeURIComponent(topicnameHOSTILE) + '&filter=' + filter + '&address=' + qaddress + '&start=' + start + '&limit=' + limit).then(function (data) {

        //if(data.length>0){updateStatus("QueryTime:"+data[0].msc)};
        //Show navigation next/back buttons
        var navbuttons = getNavButtonsNewHTML(order, content, topicnameHOSTILE, filter, start, limit, page, qaddress, "getAndPopulateNew", data.length);

        //Server bug will sometimes return duplicates if a post is liked twice for example,
        // this is a workaround, better if fixed server side.
        data = removeDuplicates(data);

        data = mergeRepliesToRepliesBySameAuthor(data, false);

        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + getPostListItemHTML(getHTMLForPost(data[i], i + 1 + start, page, i, null));
        }

        if (contents == "") {
            contents = getNothingFoundMessageHTML("Nothing here yet - Try hot or new, or a different topic or a longer time period");

            if (filter == "mypeeps" || filter == "myfeed" || topicnameHOSTILE == "MyFeed" || topicnameHOSTILE == "MyTopics") {
                contents = getNothingFoundMessageHTML("Nothing in your feed - Try following more people or subscribing to more topics");
            }

        }
        displayItemListandNavButtonsHTML(contents, navbuttons, page, data, "posts", start);
        //Render identicons
        jdenticon();
    }, function (status) { //error detection....
        console.log('Something is wrong:' + status);
        document.getElementById(page).innerHTML = 'Something is wrong:' + status;
        updateStatus(status);
    });

}

function getAndPopulate(start, limit, page, qaddress, type, topicNameHOSTILE) {
    console.log("deprecated getAndPopulate old called");
    if (type == "") type = "all";
    //Clear Topic
    //currentTopic == "";
    //document.getElementById('topicdiv').innerHTML = "";

    //Show the relevant html element
    show(page);

    //Show loading animation
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;



    //Request content from the server and display it when received
    getJSON(dropdowns.contentserver + '?action=' + page + '&topicname=' + encodeURIComponent(topicNameHOSTILE) + '&address=' + pubkey + '&type=' + type + '&qaddress=' + qaddress + '&start=' + start + '&limit=' + limit).then(function (data) {

        //Show navigation next/back buttons
        var navbuttons = getNavButtonsHTML(start, limit, page, type, qaddress, topicNameHOSTILE, "getAndPopulate", data.length);

        //Server bug will sometimes return duplicates if a post is liked twice for example,
        // this is a workaround, better if fixed server side.
        data = removeDuplicates(data);

        data = mergeRepliesToRepliesBySameAuthor(data, false);

        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + getPostListItemHTML(getHTMLForPost(data[i], i + 1 + start, page, i, null));
        }
        displayItemListandNavButtonsHTML(contents, navbuttons, page, data, "posts", start);
        //detectMultipleIDS();
        //Render identicons
        jdenticon();
    }, function (status) { //error detection....
        console.log('Something is wrong:' + status);
        document.getElementById(page).innerHTML = 'Something is wrong:' + status;
        updateStatus(status);
    });

}

function getAndPopulateMessages(start, limit) {

    document.getElementById('messageslist').innerHTML = document.getElementById("loading").innerHTML;

    getJSON(dropdowns.contentserver + '?action=messages&address=' + pubkey).then(function (data) {

        lastViewOfNotificationspm = parseInt(new Date().getTime() / 1000);
        localStorageSet(localStorageSafe, "lastViewOfNotificationspm", lastViewOfNotificationspm);
        document.getElementById("alertcountpm").innerHTML = "";


        data = mergeRepliesToRepliesBySameAuthor(data, true);
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            data[i].address = data[i].senderaddress;
            contents += getMessageHTML(data[i], i);
        }
        if (contents == "") { contents = "No messages found."; }


        document.getElementById('messageslist').innerHTML = contents;
        addStarRatings(data, "privatemessages");
        //detectMultipleIDS();
        //Render identicons
        jdenticon();
    }, function (status) { //error detection....
        console.log('Something is wrong:' + status);
        document.getElementById('messageslist').innerHTML = 'Something is wrong:' + status;
        updateStatus(status);
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

    getJSON(dropdowns.contentserver + '?action=thread&address=' + pubkey + '&txid=' + txid).then(function (data) {
        //Server bug will sometimes return duplicates if a post is liked twice for example,
        // this is a workaround, better if fixed server side.
        data = removeDuplicates(data);

        data = mergeRepliesToRepliesBySameAuthor(data, false);

        //Make sure we have id of the top level post
        if (data.length > 0) { roottxid = data[0].roottxid; }

        setTopic(data[0].topic);

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

        var contents = "";
        for (var i = 0; i < data.length; i++) {
            if (data[i].txid == roottxid) {
                contents += getDivClassHTML("fatitem", getHTMLForPost(data[i], 1, pageName, i, data[earliestReply]));
                contents += getDivClassHTML("comment-tree", getNestedPostHTML(data, data[i].txid, 0, pageName, txid, earliestReplyTXID));
            }
        }
        //Threads have no navbuttons
        displayItemListandNavButtonsHTML(contents, "", "thread", data, "", 0);

        if (popup != undefined) {
            popup.setContent("<div id='mapthread'>" + contents + "</div>");
        }
        scrollTo("highlightedcomment");
        //Render identicons
        jdenticon();
        //detectMultipleIDS();
    }, function (status) { //error detection....
        console.log('Something is wrong:' + status);
        document.getElementById(pageName).innerHTML = 'Something is wrong:' + status;
        updateStatus(status);
    });
}


function getAndPopulateTopicList(showpage) {
    var page = "topiclistanchor";
    if (showpage) {
        show(page);
    }
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;
    getJSON(dropdowns.contentserver + '?action=topiclist&qaddress=' + pubkey).then(function (data) {

        var selectboxIndex = 5;
        var selectbox = document.getElementById('topicselector');
        while (selectbox.options[selectboxIndex]) {
            selectbox.remove(selectboxIndex)
        }


        var lastValue = "";
        for (var i = 0; i < 40; i++) {
            var option = document.createElement("option");
            //Caution, topicname can contain anything
            if (data[i].topicname == null) continue;

            option.text = capitalizeFirstLetter(data[i].topicname.substr(0, 13));
            option.value = data[i].topicname;
            if (option.value == lastValue) continue;
            lastValue = option.value;
            selectbox.add(option, [selectboxIndex]);
            selectboxIndex++;
        }

        var contents = "<br/><table><tr><td class='tltopicname'>Topic</td><td class='tlmessagescount'>Posts</td><td class='tlsubscount'>Subs</td><td class='tlaction'>Action</td></tr>";

        //group data rows by moderater before displaying
        var modsArray = [];
        for (var i = 0; i < data.length; i++) {
            if (i == 0 || (i < data.length && data[i].topicname == data[i - 1].topicname)) {
                modsArray.push(data[i]);
            } else {
                contents += getHTMLForTopicArray(modsArray);
                modsArray = [];
                modsArray.push(data[i]);
            }
        }


        contents += "</table>";
        //Threads have no navbuttons
        //displayItemListandNavButtonsHTML(contents, "", "thread", data, "",0);
        document.getElementById(page).innerHTML = contents;
        //detectMultipleIDS();
    }, function (status) { //error detection....
        console.log('Something is wrong:' + status);
        document.getElementById(page).innerHTML = 'Something is wrong:' + status;
        updateStatus(status);
    });
}



function displayItemListandNavButtonsHTML(contents, navbuttons, page, data, styletype, start) {
    contents = getItemListandNavButtonsHTML(contents, navbuttons, styletype, start);
    var pageElement = document.getElementById(page);
    pageElement.innerHTML = contents; //display the result in the HTML element
    listenForTwitFrameResizes();
    addStarRatings(data, page);
    window.scrollTo(0, 0);
    //detectMultipleIDS();
    return;
}



function addStarRatings(data, page, disable) {
    for (var i = 0; i < data.length; i++) {

        //Standard message display
        //var name = data[i].name;
        var theAddress = ds(data[i].address);
        //var rawRating = data[i].rating;

        if (data[i].type == "reply" || data[i].type == "like" || data[i].type == "follow" || data[i].type == "rating" || data[i].type == "page") {
            //Notifications, or like, or follow reply
            theAddress = ds(data[i].origin);
            //name = ds(data[i].originname);
        }

        //For ratings, we're looking for members view of the rater
        /*if (data[i].type == "like" || data[i].type == "follow" || data[i].type == "rating") {
            rawRating = data[i].raterrating;
        }*/

        var querySelector = "#rating" + i + page + theAddress;
        var theElement = document.querySelector(querySelector);
        addSingleStarsRating(disable, theElement);


        //Add second one for reply
        if (data[i].type == "reply" || data[i].type == "page") {
            var querySelector = "#rating" + i + page + theAddress + data[i].type;
            var theElement = document.querySelector(querySelector);
            addSingleStarsRating(disable, theElement);
        }

        //Add second one for like
        if (data[i].type == "like") {
            //var rawRating = data[i].selfrating;
            var theAddress = ds(data[i].address);
            var querySelector = "#rating" + i + page + theAddress + data[i].type;
            var theElement = document.querySelector(querySelector);
            addSingleStarsRating(disable, theElement);
        }

    }
}

function addSingleStarsRating(disable, theElement) {
    //var theElement = document.querySelector(querySelector);
    if (theElement == undefined) return;
    let name = theElement.dataset.ratingname;
    let theAddress = theElement.dataset.ratingaddress;
    let rawRating = theElement.dataset.ratingraw;
    let starSize = theElement.dataset.ratingsize;

    var theRating = 0; if (rawRating != null && rawRating != 0) { theRating = (ds(rawRating) / 64) + 1; }
    var starRating1 = raterJs({
        starSize: starSize,
        rating: Math.round(theRating * 10) / 10,
        element: theElement,
        disableText: 'This user rates ' + ds(name) + ' as {rating}/{maxRating}',
        rateCallback: function rateCallback(rating, done) {
            var ratingText = document.getElementById("memberratingcommentinputbox" + theAddress);
            if (ratingText !== undefined) {
                rateCallbackAction(rating, this, ratingText.value);
            } else {
                rateCallbackAction(rating, this);
            }
            done();
        }
    });
    starRating1.theAddress = theAddress;
    if (disable) {
        starRating1.disable();
    }
    return starRating1;
}

//markdown editor
var simplemde;

function initMarkdownEditor() {
    if (simplemde == null) {
        simplemde = new SimpleMDE({
            element: document.getElementById("newposttamemorandum"),
            autoDownloadFontAwesome: false,
            autosave: {
                enabled: true,
                uniqueId: "MyUniqueID",
                delay: 10000,
            },
            forceSync: true,
            promptURLs: true,
            spellChecker: false,
            showIcons: ["code", "table", "strikethrough", "heading-1", "heading-2", "heading-3", "quote"],
            hideIcons: ["preview", "side-by-side", "fullscreen", "guide", "heading"]
        });
        simplemde.codemirror.on("change", function () {
            memorandumPreview();
        });
    }
    memorandumPreview();

}

function getMemorandumText() {
    return simplemde.value();
}

function switchToArticleMode() {
    setAddonStyle("article.css");
}

function switchToRegularMode() {
    setAddonStyle("none.css");
}

function memorandumPreview() {
    var name = document.getElementById('settingsnametext').value;
    var time = new Date().getTime() / 1000;
    document.getElementById('memorandumpreview').innerHTML =
        ``
        + getHTMLForPostHTML('000', pubkey, name, 1, 0, 0, time, document.getElementById('memorandumtitle').value, '', document.getElementById('memorandumtopic').value, 0, 0, null, "MAINRATINGID", '000', 1, 0, null, 'preview')
        + getHTMLForReplyHTML('000', pubkey, name, 1, 0, 0, time, getMemorandumText(), '', 'page', "MAINRATINGID", null, '000', 1, null, null, 'preview', document.getElementById('memorandumtopic').value);
}

function getHTMLForPost(data, rank, page, starindex, dataReply) {
    if (checkForMutedWords(data)) return "";
    let mainRatingID = starindex + page + ds(data.address);
    var retHTML = getHTMLForPostHTML(data.txid, data.address, data.name, data.likes, data.dislikes, data.tips, data.firstseen, data.message, data.roottxid, data.topic, data.replies, data.geohash, page, mainRatingID, data.likedtxid, data.likeordislike, data.repliesroot, data.rating, starindex);
    if (dataReply != null) {
        retHTML += getHTMLForReply(dataReply, 0, page, starindex, null);
    }
    return retHTML;
}

function getHTMLForReply(data, depth, page, starindex, highlighttxid) {
    if (checkForMutedWords(data)) return "";
    let mainRatingID = starindex + page + ds(data.address);
    return getHTMLForReplyHTML(data.txid, data.address, data.name, data.likes, data.dislikes, data.tips, data.firstseen, data.message, depth, page, mainRatingID, highlighttxid, data.likedtxid, data.likeordislike, data.blockstxid, data.rating, starindex, data.topic);
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
    if (privkey == "") {
        alert(___i18n('log in to reply'));
        return false;
    }
    var replybox = document.getElementById("reply" + txid);
    replybox.style.display = "block";
    //document.getElementById("replylink"+txid).style.display = "none";
    return true;
}

function decreaseGUILikes(txid) {
    var downarrow = document.getElementById('downvote' + txid);
    downarrow.className = "votearrowactivateddown rotate180";
    var downarrowAction = document.getElementById('downvoteaction' + txid);
    downarrowAction.onclick = null;

    var uparrow = document.getElementById('upvote' + txid);
    uparrow.className = "votearrow";

    var likescount = Number(document.getElementById('likescount' + txid).innerHTML);
    document.getElementById('likescount' + txid).innerHTML = likescount - 1;
    document.getElementById('score' + txid).innerHTML = likescount - 1;

}

function increaseGUILikes(txid) {
    //increase number of likes,
    var uparrow = document.getElementById('upvote' + txid);
    uparrow.className = "votearrowactivated";
    var uparrowAction = document.getElementById('upvoteaction' + txid);
    uparrowAction.onclick = null;

    var downarrow = document.getElementById('downvote' + txid);
    downarrow.className = "votearrow rotate180";

    //Change counts
    var likescount = Number(document.getElementById('likescount' + txid).innerHTML);
    document.getElementById('likescount' + txid).innerHTML = likescount + 1;
    document.getElementById('score' + txid).innerHTML = likescount + 1;
}

function likePost(txid, tipAddress) {
    if (privkey == "") {
        alert("You must login to like posts.");
        return false;
    }

    increaseGUILikes(txid);

    //Change class
    document.getElementById('score' + txid).className = "betweenvotesscoreup";

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
    if (privkey == "") {
        alert("You must login to dislike posts.");
        return false;
    }

    decreaseGUILikes(txid);


    //Change class
    document.getElementById('score' + txid).className = "betweenvotesscoredown";

    sendDislike(txid);
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
        alert("547 (dust+1) is the minimum tip possible");
        return false;
    }
    defaulttip = tipAmount;

    document.getElementById('tipstatus' + page + txid).value = "Sending Tip . . " + tipAmount;
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
    if (privkey == "") {
        alert("You must login to tip.");
        return false;
    }
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


function topictitleChanged(elementName) {
    if (document.getElementById(elementName + 'topic').value.length == 0) {
        document.getElementById(elementName + 'title').maxLength = 217;
        document.getElementById(elementName + 'topic').maxLength = Math.max(0, 214 - document.getElementById(elementName + 'title').value.length);
    } else {
        document.getElementById(elementName + 'title').maxLength = Math.max(0, 214 - document.getElementById(elementName + 'topic').value.length);
        document.getElementById(elementName + 'topic').maxLength = Math.max(0, 214 - document.getElementById(elementName + 'title').value.length);
    }
    document.getElementById(elementName + 'titlelengthadvice').innerHTML = "(" + document.getElementById(elementName + 'title').value.length + "/" + document.getElementById(elementName + 'title').maxLength + ")";
    document.getElementById(elementName + 'topiclengthadvice').innerHTML = "(" + document.getElementById(elementName + 'topic').value.length + "/" + document.getElementById(elementName + 'topic').maxLength + ")";
}

function geopost(lat, long) {
    if (!checkForPrivKey()) return false;

    var txtarea = document.getElementById('newgeopostta');
    var posttext = txtarea.value;
    if (posttext.length == 0) {
        alert("No Message Body");
        return false;
    }
    var geohash = encodeGeoHash(document.getElementById("lat").value, document.getElementById("lon").value);

    document.getElementById('newpostgeocompleted').innerText = "";
    document.getElementById('newpostgeobutton').style.display = "none";
    document.getElementById('newpostgeostatus').style.display = "block";
    document.getElementById('newpostgeostatus').value = "Posting...";

    postgeoRaw(posttext, privkey, geohash, "newpostgeostatus", geocompleted);

}

function postmemorandum() {
    if (!checkForPrivKey()) return false;
    var posttext = document.getElementById('memorandumtitle').value;
    if (posttext.length == 0) {
        alert("No Memo - Try adding something in the memo box");
        return false;
    }
    var postbody = document.getElementById('newposttamemorandum').value;
    var topic = document.getElementById('memorandumtopic').value;
    //topic may be empty string

    document.getElementById('newpostmemorandumcompleted').innerText = "";
    document.getElementById('newpostmemorandumbutton').style.display = "none";
    document.getElementById('newpostmemorandumstatus').style.display = "block";
    document.getElementById('newpostmemorandumstatus').value = "Sending Title...";

    if (postbody.length == 0 || document.getElementById('memorandumtextarea').style.display == 'none') {
        //post a regular memo
        postRaw(posttext, privkey, topic, "newpostmemorandumstatus", memorandumpostcompleted);
    } else {
        postmemorandumRaw(posttext, postbody, privkey, topic, "newpostmemorandumstatus", memorandumpostcompleted);
    }



    //if (typeof popupOverlay !== "undefined") {
    //    popupOverlay.hide();
    //}
}

function memorandumpostcompleted(txid) {
    txid=san(txid);
    var encodedURL = `https://twitter.com/intent/tweet?text=`+encodeURIComponent(document.getElementById('memorandumtitle').value + '\r\n'+` member.cash/?` + txid.substr(0, 4) + `#thread?post=` + txid.substr(0, 10));
    //document.getElementById('newpostmemorandumcompleted').innerHTML = `Sent. <a onclick="showThread('`+txid+`')" href="#thread?post=`+txid+`">View It</a> or  <a rel='noopener noreferrer' target="_blank" href="` + encodedURL + `">Also Post To Twitter (opens a new window)</a>`;
    document.getElementById('newpostmemorandumcompleted').innerHTML = `Sent. <a onclick="showThread('`+txid+`')" href="#thread?post=`+txid+`">View It</a> or  <a href="" onclick="window.open('` + encodedURL + `', 'twitterwindow', 'width=300,height=250');return false;">Also Post To Twitter (opens a new window)</a>`;


    
    //iframe not allowed by twitter
    //document.getElementById('newpostmemorandumcompleted').innerHTML = `Sent. <a rel='noopener noreferrer' onclick="createiframe('`+encodedURL+`','posttotwitter');return false;" href="">Also Post To Twitter</a><div id="posttotwitter"></div>`;
    


    document.getElementById('memorandumtitle').value = "";
    document.getElementById('newposttamemorandum').value = "";
    document.getElementById('newpostmemorandumstatus').style.display = "none";
    document.getElementById('newpostmemorandumbutton').style.display = "block";
    if(simplemde){
        simplemde.value("");
    }

}

function memocompleted() {
    document.getElementById('memotitle').value = "";
    document.getElementById('newpoststatus').style.display = "none";
    document.getElementById('newpostbutton').style.display = "block";
    document.getElementById('newpostcompleted').innerHTML = "Message Sent. ";
}

function geocompleted() {
    document.getElementById('newgeopostta').value = "";
    document.getElementById('newpostgeostatus').style.display = "none";
    document.getElementById('newpostgeobutton').style.display = "block";
    document.getElementById('newpostgeocompleted').innerHTML = "Message Sent. ";
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
                        //Subtract one as each post is automatically liked by its own author
                        data[j].likes = (Number(data[j].likes) + Number(data[i].likes - 1)).toString();
                        data[j].dislikes = (Number(data[j].dislikes) + Number(data[i].dislikes)).toString();
                        data[j].tips = (Number(data[j].tips) + Number(data[i].tips)).toString();

                        data[j].message = data[j].message + data[i].message;

                        //if any other posts reference the child post, have them refence the parent post instead
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
    return data;
}

