//Some refactoring is possible in these functions

"use strict";

var eccryptoJs = null;

function getAndPopulateNew(order, content, topicnameHOSTILE, filter, start, limit, page, qaddress, hasNavButtons, minStarRating = 2) {
    if (order == "") order = "hot";
    if (content == "") content = "posts";
    if (filter == "") filter = "everyone";
    if (start == "") start = 0;
    if (limit == "") limit = numbers.results;
    if (page == "") page = "posts";

    //Show the relevant html element
    show(page);

    if (qaddress) {
        //hideAll();
        if (filter != "list") {
            showOnly("mcidmemberheader");
            showOnly("mcidmembertabs");
            var obj2 = { address: qaddress, profileclass: 'filteroff', reputationclass: 'filteroff', postsclass: 'filteron', bestiesclass: 'filteroff' };
            document.getElementById('mcidmembertabs').innerHTML = templateReplace(membertabsHTML, obj2);
        }
        setPageTitleRaw("List");
    } else if (topicnameHOSTILE.toLowerCase() == "mytopics") {
        setPageTitleFromID("VV0128");
    } else if (topicnameHOSTILE) {
        setPageTitleRaw("#" + topicnameHOSTILE);
    } else if (filter.toLowerCase() == "myfeed") {
        setPageTitleFromID("VV0134a");
    } else if (filter == "everyone") {
        setPageTitleFromID("VVfirehose");
    }

    //Show loading animation
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;

    if (topicnameHOSTILE == null || topicnameHOSTILE == "") {
        setTopic('');
        topicnameHOSTILE = '';
    }

    /*var networkOnly = '';
    if (dropdowns['contentnetwork'] != "-1") {
        networkOnly = `&network=${dropdowns['contentnetwork']}`;
    }*/



    //Request content from the server and display it when received
    var theURL = dropdowns.contentserver + '?action=show&shownoname=' + settings["shownonameposts"] + '&shownopic=' + settings["shownopicposts"] + '&order=' + order + '&content=' + content + '&topicname=' + encodeURIComponent(topicnameHOSTILE) + '&filter=' + filter + '&address=' + pubkeyhex.slice(0,16) + '&qaddress=' + qaddress + '&start=' + start + `&minrating=${Number(minStarRating)}&limit=` + limit;
    getJSON(theURL).then(function (data) {

        updateUSDRate(data);

        if (qaddress && data[0] && data[0].pagingid && filter != "list") {
            setPageTitleRaw("@" + data[0].pagingid);
        }

        let end = start + limit;
        if (data.length && data[0]) {
            if (order == 'new' || order == 'old') {
                end = data[data.length - 1].firstseen;
            } else if (order == 'hot') {
                end = data[data.length - 1].score2;
            } else if (order == 'topd') {
                end = data[data.length - 1].scoretop;
            } else if (order == 'topa') {
                end = data[data.length - 1].score;
            }

        }

        var navheader = getNavHeaderHTML(order, content, topicnameHOSTILE, filter, start, limit, 'show', qaddress, "getAndPopulateNew", data.length, minStarRating);
        //if(data.length>0){updateStatus("QueryTime:"+data[0].msc)};
        //Show navigation next/back buttons
        var navbuttons = getNavButtonsNewHTML(order, content, topicnameHOSTILE, filter, end, limit, 'show', qaddress, "getAndPopulateNew", data.length);
        //var navbuttons = getNavButtonsNewHTML(order, content, topicnameHOSTILE, filter, end, limit, 'show', qaddress, "getAndPopulateNew", data.length > 0 ? data[0].unduplicatedlength : 0);
        if (!hasNavButtons) {
            navheader = '';
            navbuttons = '';
        }

        //Server bug will sometimes return duplicates if a post is liked twice for example,
        // this is a workaround, better if fixed server side.
        data = removeDuplicates(data);

        //Why is this here? Should only be required in thread. removing 20/01/2022
        //data = mergeRepliesToRepliesBySameAuthor(data, false);

        var contents = "";

        contents = getItemListandNavButtonsHTMLHeader(navheader, contents, navbuttons, "posts", start)
            + contents
            + getItemListandNavButtonsHTMLFooter(navheader, contents, navbuttons, "posts", start);
        var pageElement = document.getElementById(page);
        pageElement.innerHTML = contents; //display the result in the HTML element

        var listElement = document.getElementById('itemlistol');

        if (!pubkey && order == 'hot' && !qaddress && Math.random() < adfrequency) {//Show member.cash explainer video
            //let membervid = { "address": "-2124810688269680833", "message": "Hit Play to Understand #Member in 90 seconds.\n\nhttps://youtu.be/SkaaPcjKI2E", "txid": "4828901585208465235", "firstseen": 1657702206, "retxid": "", "roottxid": "4828901585208465235", "likes": 2, "dislikes": 0, "tips": 1500, "topic": "member", "lat": null, "lon": null, "geohash": null, "repliesdirect": 0, "repliesroot": 0, "repliestree": 0, "repliesuniquemembers": 0, "repost": null, "canonicalid": "4828901585208465235", "repostcount": 0, "language": "", "amount": 0, "score": 1500000, "score2": 208943.26776183146, "network": 3, "posttype": 0, "memberscore": 236, "weightedlikes": 120721, "weighteddislikes": 0, "weightedreposts": 0, "weightedtips": 0, "contentflags": 1, "deleted": 0, "hivelink": "c303b46839abd7538da5ed16bbfb139bdabce45bf5013e178dcbc36179de1a9a", "format": null, "title": null, "scoretop": 12007.604013087894, "isfollowing": null, "name": "member.cash", "pagingid": "membercash", "publickey": "02b5a809307637d405a3165830bc603794cf5d67ce69a381424eca9a2e2f4d9c17", "picurl": "-8772705979516345993", "tokens": 55, "followers": 5252, "following": 1696, "blockers": 2, "blocking": 14, "profile": "Aggregator for multiple decentralized social networks\n\nhttps://member.cash\n\nCovering social posts from \n\nBitclout, Bitcoin Cash and Hive\n\n@FreeTrade\n\n", "nametime": 1625985623, "lastactive": 1657702333, "sysrating": 236, "hivename": null, "bitcoinaddress": "19ytLgLYamSdx6spZRLMqfFr4hKBxkgLj6", "rpname": null, "rppagingid": null, "rppublickey": null, "rppicurl": null, "rptokens": null, "rpfollowers": null, "rpfollowing": null, "rpblockers": null, "rpblocking": null, "rpprofile": null, "rpnametime": null, "rplastactive": null, "rpsysrating": null, "rphivename": null, "rpbitcoinaddress": null, "rating": null, "rprating": null, "replies": 0, "likedtxid": null, "likeordislike": null, "rplikedtxid": null, "rplikeordislike": null, "rpaddress": null, "rpamount": null, "rpdislikes": null, "rpfirstseen": null, "rpgeohash": null, "rplanguage": null, "rplat": null, "rplikes": null, "rplon": null, "rpmessage": null, "rprepliestree": null, "rprepliesuniquemembers": null, "rprepost": null, "rprepostcount": null, "rpretxid": null, "rproottxid": null, "rptips": null, "rptopic": null, "rptxid": null, "rpreplies": null, "rprepliesroot": null, "rphivelink": null, "rpsourcenetwork": null };
            //listElement.appendChild(htmlToElement(getPostListItemHTML(getHTMLForPost(membervid, 10000 + 1, page, 10000, null, true, true, false))));
        }

        let filtereditems = 0;
        let alwaysShow = (qaddress);
        for (var i = 0; i < data.length; i++) {
            try {
                if (settings["shownonameposts"] == 'false' && !data[i].name && !data[i].hivelink) { continue; } //nb, if there is a hive link, hiveid can be used for name
                if (settings["shownopicposts"] == 'false' && !data[i].picurl) { continue; }
                let postHTML = getHTMLForPost(data[i], i + 1, page, i, null, alwaysShow, true, false);
                if (postHTML) {
                    listElement.appendChild(htmlToElement(getPostListItemHTML(postHTML)));
                } else {
                    filtereditems++;
                }
            } catch (err) {
                console.log(err);
            }
        }

        if (filtereditems) {
            //contents += getDivClassHTML('message', filtereditems + getSafeTranslation("filtereditems", " posts have been hidden based on your content and network filters."));
            listElement.appendChild(htmlToElement(
                getDivClassHTML('message',
                    filtereditems
                    + getSafeTranslation("filtereditems1", " posts have been hidden based on ")
                    + `<a href='#settings'>`
                    + getSafeTranslation("filtereditems2", " your content and network filters")
                    + `</a>`
                )));
        }

        if (contents == "") {

            contents = getDivClassHTML('message', getSafeTranslation("nothinghere2", "Nothing here yet"));

            if (filter == "mypeeps" || filter == "myfeed" || topicnameHOSTILE == "MyFeed" || topicnameHOSTILE == "MyTopics") {
                contents = getDivClassHTML('message', getSafeTranslation("nothinginfeed2", "Nothing in your feed"));
            }

            if (data && data[0] && data[0].interrupted == "query timed out") {
                contents = getDivClassHTML('message', getSafeTranslation("servertimeout", "This request timed out - maybe it is too difficult or the server is under heavy load."));
            }
            pageElement.innerHTML = contents;
        }

        if (topicnameHOSTILE != null && topicnameHOSTILE != "" && topicnameHOSTILE.toLowerCase() != "mytopics" && topicnameHOSTILE.toLowerCase() != "myfeed" && topicnameHOSTILE.toLowerCase() != "mypeeps") {
            showOnly("topicmeta");
        }

        //if (!pubkey && !topicnameHOSTILE) {
        //contents=`<div><iframe src="https://www.youtube.com/embed/SkaaPcjKI2E" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" style="max-width: 100vw;max-height: 56.25vw;" width="770" height="433" frameborder="0"></iframe>`+contents;
        //}


        displayItemListandNavButtonsHTML(data, true);

        //Activate navigation filter star ratings
        let postsqualityfilter = document.getElementById('postsqualityfilter');


        postsqualityfilter = raterJs({
            extraClass: "systemscore",
            starSize: Number(postsqualityfilter.dataset.ratingsize),
            rating: minStarRating,
            element: postsqualityfilter,
            showToolTip: false,
            rateCallback: function rateCallback(rating, done) {
                postsqualityfilter.setRating(rating);
                done();
                //postsqualityfilter.minrating = rating;
                getAndPopulateNew(order, content, topicnameHOSTILE, filter, start, limit, page, qaddress, hasNavButtons, rating);
            }
        });

        if (postsqualityfilter) {
            postsqualityfilter.setRating(minStarRating);
        }

    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}


function getAndPopulateMessages(messagetype, start, limit) {

    if (!messagetype) {
        messagetype = 'all';
    }

    try {
        document.getElementById('messageslist').innerHTML = document.getElementById("loading").innerHTML;
    }
    catch (err) {
        console.log(err);
    }

    var theURL = dropdowns.contentserver + '?action=messages&address=' + pubkeyhex.slice(0,16) + '&messagetype=' + messagetype;
    getJSON(theURL).then(async function (data) {

        if (!eccryptoJs) {
            await loadScript("js/lib/eccrypto-js.js");
        }

        lastViewOfNotificationspm = parseInt(new Date().getTime() / 1000);
        localStorageSet(localStorageSafe, "lastViewOfNotificationspm", lastViewOfNotificationspm);
        setAlertCount("alertcountpm", 0);
        //document.title = "member.cash";


        data = mergeRepliesToRepliesBySameAuthor(data, true);
        var contents = "";
        for (let i = 0; i < data.length; i++) {
            data[i].address = data[i].senderaddress;
            contents += getMessageHTML(data[i], i);
        }
        if (contents == "") { contents = getSafeTranslation('nomessagesfound', "No messages found."); }


        document.getElementById('messageslist').innerHTML = contents;
        for (let i = 0; i < data.length; i++) {
            populateMessages(data[i], i);
        }
        addDynamicHTMLElements(data);
        scrollToPosition();
    }, function (status) { //error detection....
        showErrorMessage(status, 'messageslist', theURL);
    });
}

function getAndPopulateThread(roottxid, txid, pageName, articlestyle = 'thread') {
    if (pageName != "mapthread") {
        show(pageName);
        document.getElementById(pageName).innerHTML = document.getElementById("loading").innerHTML;
    }

    //Roottxid is used to get all the posts, txid is used to highligh the required post

    //If no post is specified, we'll use it as a top level
    if (txid === undefined || txid == "") { txid = roottxid; }

    var theURL = dropdowns.contentserver + '?action=thread&address=' + pubkeyhex.slice(0,16) + '&txid=' + txid;
    getJSON(theURL).then(async function (data) {
        updateUSDRate(data);
        //Server bug will sometimes return duplicates if a post is liked twice for example,
        // this is a workaround, better if fixed server side.
        data = removeDuplicates(data);

        data = manageRevisions(data);

        txid = setHighlightedPost(data, txid); //set the highlight posts - also use the number id for txid rather than hex if txid is hex

        data = await removeDuplicatesFromDifferentNetworks(data);

        data = mergeRepliesToRepliesBySameAuthor(data, false);

        //Make sure we have id of the top level post
        if (data.length > 0) { roottxid = data[0].roottxid; }

        //setTopic(data[0].topic);



        //Find the first reply by the thread starter, but only for article style
        let earliestReply = "none";
        let earliestReplyTXID = "none";
        if (articlestyle == 'article') {
            let earliestReplyTime = 9999999999;
            //Find who started the thread
            let threadstarter = null;
            for (var i = 0; i < data.length; i++) {
                if (data[i].txid == roottxid) {
                    threadstarter = data[i].address;
                }
            }
            for (var i = 0; i < data.length; i++) {
                if (data[i].retxid == roottxid && data[i].address == threadstarter) {
                    if (data[i].firstseen < earliestReplyTime) {
                        earliestReply = i;
                        earliestReplyTime = data[i].firstseen;
                        earliestReplyTXID = data[i].txid
                    }
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
        contents = '<div id="threaddisplay"></div>';
        var pageElement = document.getElementById(pageName);
        pageElement.innerHTML = contents; //display the result in the HTML element
        var listElement = document.getElementById('threaddisplay');

        for (var i = 0; i < data.length; i++) {
            if (data[i].txid == roottxid) {
                listElement.appendChild(htmlToElement(getDivClassHTML("fatitem", getHTMLForPost(data[i], 1, pageName, i, data[earliestReply], true, false, true))));

                var commentTree = getNestedPostHTML(data, data[i].txid, 0, pageName, earliestReplyTXID)

                if (commentTree == '<ul></ul>') {
                    commentTree = getNoCommentsYetHTML();
                } else {
                    commentTree = getDivClassHTML("comment-tree", commentTree);
                }

                listElement.appendChild(htmlToElement(commentTree));
            }
        }


        //Threads have no navbuttons
        displayItemListandNavButtonsHTML(data, false);

        //Repeat the title for article mode
        //This doesn't seem essential, but was causing some problems when viewing thread directly after post, so put in a try/catch
        try {
            let articleheaderelement = document.querySelector('[id^="articleheader' + roottxid + '"]');
            let postbodyroottxidelement = document.querySelector('[id^="postbody' + roottxid + '"]');
            articleheaderelement.innerHTML = postbodyroottxidelement.innerHTML;
        } catch (errortitle) {
            console.log("Article mode header set error");
            console.log(errortitle);
        }

        //if (popup != undefined) {
        //    popup.setContent(getDivClassHTML('mapthread', contents));
        //}
        addDynamicHTMLElements(data);
        scrollToPosition();

        if (!articlemode) {
            showReplyBox(san(txid) + pageName);
        }

        //Comment might be hidden because of mutes/low rating etc, make sure to uncollapse
        uncollapseCommentRecursive(txid);
        scrollToElement("highlightedcomment");

    }, function (status) { //error detection....
        showErrorMessage(status, pageName, theURL);
    });
}

function getAndPopulateTopic(topicNameHOSTILE) {
    var page = "topicmeta";
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;
    var theURL = dropdowns.contentserver + '?action=topiclist&topicname=' + encodeURIComponent(topicNameHOSTILE) + '&qaddress=' + pubkeyhex.slice(0,16);
    getJSON(theURL).then(function (data) {
        updateUSDRate(data);
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
    var theURL = dropdowns.contentserver + '?action=topiclist&qaddress=' + pubkeyhex.slice(0,16);
    getJSON(theURL).then(function (data) {
        updateUSDRate(data);
        /*
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
        */
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

function getAndPopulateQuoteBox(txid) {
    var page = 'quotepost';
    showOnly(page);
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;

    var theURL = dropdowns.contentserver + '?action=singlepost&address=' + pubkeyhex.slice(0,16) + '&txid=' + txid;
    getJSON(theURL).then(function (data) {
        var contents = "";
        if (data[0]) {
            contents = getHTMLForPost(data[0], 1, page, 0, null, true, true, false);
            document.getElementById(page).innerHTML = contents;
            document.getElementById('quotetxidnetwork').value = data[0].network;
        } else {
            throw error(getSafeTranslation('noresult', 'no result returned'));
        }
        addDynamicHTMLElements();
    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}


function displayItemListandNavButtonsHTML(data, adddynamic) {

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

    //remove min-height requirement for image. 
    //we need a min height to avoid google CLS penalites for content that shifts around too much
    //but the min-height can cause the image to be shown incorrectly
    let images = document.getElementsByClassName('imgurimage');
    for (let i = 0; i < images.length; i++) {
        if(images[i].complete){
            images[i].style.minHeight = '0';
        }else{
            images[i].addEventListener('load', function () {
                this.style.minHeight = '0';
            });
        }
    }

    if (data != null && data != undefined && data[0]) {
        //if (data.length > 0) {
        //let qt = (Math.round(data[0].msc * 100) / 100).toFixed(2);
        updateStatus(`QT: ${data[0].msc - data[0].qtmsc}/${data[0].qtmsc}`);
        //document.getElementById("version").title = qt;

        if (data[0].chainheight) {
            chainheight = data[0].chainheight;
            chainheighttime = new Date().getTime();
        }
        updateUSDRate(data);
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

    //delay by half a second to allow time to appear
    setTimeout(setVisibleContentFinal, 500);

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
        if (profileElement) {
            profileElement.onmouseleave = setDisplayNone;
            delay(matches[i], showPreviewProfile, profileElement);
        }
    }
}

function setDisplayNone() {
    this.style.display = "none";
}

function showScoresExpanded(retxid, profileelement) {
    /*if (this) {
        var profileelement = this.id.replace('scores', 'scoresexpanded');
        var retxid = profileelement.substr(14, 64);
    }*/
    var closeHTML = getCloseButtonHTML(profileelement);
    document.getElementById(profileelement).innerHTML = closeHTML + document.getElementById("loading").innerHTML;
    document.getElementById(profileelement).style.display = "block";
    //load scores
    var theURL = dropdowns.contentserver + '?action=likesandtips&txid=' + san(retxid) + '&address=' + pubkeyhex.slice(0,16);
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            var amount = Number(data[i].amount);
            contents += getTipDetailsHTML(userFromDataBasic(data[i], san(retxid) + i), amount, data[i].type);
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
    var theURL = dropdowns.contentserver + '?action=remembers&txid=' + san(retxid) + '&address=' + pubkeyhex.slice(0,16);
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents += getRememberDetailsHTML(userFromDataBasic(data[i], san(retxid) + i), data[i].message, data[i].topic, data[i].txid);
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
    let theAddress = theElement.dataset.ratingpublickey;
    let rawRating = theElement.dataset.ratingraw;
    let starSize = theElement.dataset.ratingsize;
    let isDisabled = theElement.dataset.ratingdisabled;
    //this is very slow
    //let starSize = Number(getComputedStyle(theElement).fontSize);

    let disabledtext = theElement.dataset.disabledtext;

    var theRatingRound = 0;
    if (rawRating) {
        theRatingRound = outOfFive(rawRating);
    }
    if (theElement.dataset.ratingsystem == 'systemscore') {
        disabledtext = 'MemBrain score ' + theRatingRound + '/5';
    } else {
        disabledtext = 'Your Rating ' + theRatingRound + '/5';
    }


    var starRating1 = raterJs({
        extraClass: theElement.dataset.ratingsystem,
        starSize: starSize,
        rating: theRatingRound,
        element: theElement,
        disableText: disabledtext ? disabledtext : getSafeTranslation('thisuserrates', 'This user rates ') + ds(name) + ' {rating}/{maxRating}',
        rateCallback: function rateCallback(rating, done) {
            var ratingText = document.getElementById("memberratingcommentinputbox" + theAddress);
            this.setRating(rating);
            sendRating(rating, ratingText, name, theAddress);
            done();
        }
    });
    starRating1.theAddress = theAddress;
    if (isDisabled) {
        starRating1.disable();
    }
    theElement.isdone = true;
    return starRating1;
}




//This is called to
//to show feed items
//to show main thread item
//to show quotebox
//insert member.cash explainer video
// for feed items, sometimes we mute
// for last three items, alwaysshow should be true

function getHTMLForPost(data, rank, page, starindex, dataReply, alwaysShow, truncate, includeArticleHeader) {

    //Always show if post is directly requested
    /*if (!alwaysShow) {
        if (checkForMutedWords(data)) return "";
        if (checkForMutedNetworks(data)) return "";
        if (data.moderated != null) return "";
    }*/

    let mainRatingID = starindex + page + ds(data.address);
    var retHTML = "";
    var repostHTML1 = "";
    var repostHTML2 = "";

    if (data.repost) {
        //repost
        let repostRatingID = starindex + "repost" + ds(data.rpaddress);
        repostHTML1 = getRepostHeaderHTML(userFromDataBasic(data, repostRatingID));
        let member = MemberFromData(data, "rp", mainRatingID + "qr");
        repostHTML2 = getHTMLForPostHTML3(member, data, 'rp', page, starindex, '', truncate, alwaysShow);

        //if (repostHTML2) {
        //    repostHTML2 = getDivClassHTML("quotepost", repostHTML2);
        //}
    }

    if (data.message) {

        //this is a quick hack to filter out multiple edits
        //a genuine response to self is also removed. look at this when revisiting edited posts
        /*if (data.address && (data.address == data.opaddress)) {
            return '';
        }*/

        //post with message
        if (repostHTML2) {
            repostHTML2 = getDivClassHTML("quotepost", repostHTML2);
        }

        let member = MemberFromData(data, "", mainRatingID);
        retHTML = getHTMLForPostHTML3(member, data, '', page, starindex, repostHTML2, truncate, alwaysShow);

        //reply post, include original post
        if (data.opaddress) {
            let opmember = MemberFromData(data, "op", mainRatingID + 'op');
            let oppost = getHTMLForPostHTML3(opmember, data, 'op', page, starindex + 'op', repostHTML2, truncate, alwaysShow);
            if (oppost && retHTML) {
                //if oppost, filtered out, will just use reply post as original post
                //if no original post, nothing will show
                //only if there is an original post and the reply will it show both
                retHTML = oppost + `<div class="replyinmainfeed">` + retHTML + `</div>`;
            }
        }



    } else {
        //repost with no message
        if (repostHTML2) { //repost might have been muted
            retHTML = getDivClassHTML("repostnoquote", repostHTML1 + getDivClassHTML("noquote", repostHTML2));
        }
    }
    if (includeArticleHeader) {
        retHTML += `<div id="articleheader` + san(data.txid) + `" class="articleheader"></div>`;
    }

    if (dataReply != null) {
        retHTML += getHTMLForReply(dataReply, 0, page, starindex);
    }
    return retHTML;
}

function getHTMLForReply(data, depth, page, starindex) {

    let mainRatingID = starindex + page + ds(data.address);
    let member = MemberFromData(data, '', mainRatingID);
    return getHTMLForReplyHTML2(member, data.txid, data.likes, data.dislikes, data.tips, data.firstseen, data.message, page, data.highlighted, data.likedtxid, data.likeordislike, data.blockstxid, starindex, data.topic, data.moderated, data.repostcount, data.repostidtxid, data.network, data.hivelink, data.deleted, data.edit, data.roottxid);
}

function showReplyButton(txid, page, divForStatus) {
    document.getElementById("replybutton" + page + txid).style.display = "block";
    document.getElementById("replytext" + page + txid).value = "";
}

async function sendReply(txid, page, divForStatus, parentSourceNetwork, origtxid, origroottxid) {
    //if (!checkForPrivKey()) return false;

    var replytext = document.getElementById("replytext" + page + txid).value;
    if (replytext.length == 0) {
        alert("Nothing to send");
        return false;
    }
    //Hide the reply button, show the reply status button
    document.getElementById("replybutton" + page + txid).style.display = "none";
    document.getElementById("replystatus" + page + txid).style.display = "block";
    document.getElementById("replycompleted" + page + txid).textContent = "";

    var replytext = document.getElementById("replytext" + page + txid).value;
    const replyhex = new Buffer(replytext).toString('hex');
    //const decoded = new Buffer(encoded, 'hex').toString(); // decoded === "This is my string to be encoded/decoded"
    //no wait for the first reply

    let successfunctionCompleted = false;
    var successFunction =
        function (membertxid) {
            if (!successfunctionCompleted) {
                successfunctionCompleted = true; //ensure it only gets sent once
                replySuccessFunction(page, txid);
                if (isBitCloutUser() && parentSourceNetwork == 1) {
                    sendBitCloutReply(origtxid, replytext, divForStatus, null, parentSourceNetwork, membertxid);
                    //sendBitCloutQuotePost(pathpermalinks+"/p/" + membertxid.substr(0, 10) + "\n\n" + replytext, '', origtxid, divForStatus, null, parentSourceNetwork);
                }
            }
        };

    if (checkForNativeUserAndHasBalance()) {
        sendReplyRaw(privkey, origtxid, replyhex, 0, divForStatus, successFunction);
        //successFunction = null;
    }

    let event = await sendNostrReply(origtxid, replytext, divForStatus, successFunction, txid);
    sendWrappedEvent(event);

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
    var replybox = document.querySelector("[id^='" + "reply" + txid + "']");
    //document.getElementById("reply" + txid);
    if (replybox)
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
    var likescount = Number(document.getElementById('likescount' + txid).textContent);
    document.getElementById('score' + txid).textContent = likescount - 1;

    //Change classes
    if (downarrow && uparrow) { //If post is flagged or is main post, these arrows won't be present. skip.
        downarrow.className = "votearrowactivateddown rotate180";
        uparrow.className = "votearrow";

        var dislikeElement = document.getElementById('dislikescount' + txid);
        if (dislikeElement) {
            var dislikescount = Number(dislikeElement.textContent);
            dislikeElement.textContent = dislikescount + 1;
        }
        uparrow.className = "votearrow post-footer-upvote";
        downarrow.className = "votearrowactivated rotate180 post-footer-downvote-activated";
    }

}

function increaseGUILikes(txid) {


    //increase number of likes, original themes
    var likescount = Number(document.getElementById('likescount' + txid).textContent);
    var uparrow = document.getElementById('upvote' + txid);
    var uparrowAction = document.getElementById('upvoteaction' + txid);
    uparrowAction.onclick = null;
    var downarrow = document.getElementById('downvote' + txid);
    //Change counts
    document.getElementById('likescount' + txid).textContent = likescount + 1;
    document.getElementById('score' + txid).textContent = likescount + 1;

    //Change classes
    if (uparrow)
        uparrow.className = "votearrowactivated";
    if (downarrow)
        downarrow.className = "votearrow rotate180";

    //Nifty
    //Change classes
    if (uparrow)
        uparrow.className = "votearrowactivated post-footer-upvote-activated";
    if (downarrow)
        downarrow.className = "votearrow rotate180 post-footer-downvote";
    var upvotecontainer = document.getElementById('upvotecontainer' + txid)
    if (upvotecontainer)
        upvotecontainer.className = "post-footer-upvote-activated post-footer-relative";

}

function increaseGUIReposts(txid) {
    //Change counts
    var repostscount = Number(document.getElementById('repostscount' + txid).innerHTML);
    document.getElementById('repostscount' + txid).innerHTML = repostscount + 1;
}

async function pinpost(txid) {
    //If bitclout user is logged in
    if (isBitCloutUser()) {
        bitCloutPinPost(txid, pubkey);
    }

    if (checkForNativeUserAndHasBalance()) {
        memoPinPost(txid, privkey);
    }

    let event= await nostrPinPost(txid);
    sendWrappedEvent(event);

}

async function likePost(txid, origtxid, tipAddress, amountSats, roottxid = null) {
    if (amountSats == 0) {
        amountSats = numbers.oneclicktip;
    }

    //if no identity login, then check for priv key 
    //if (!checkForPrivKey()) return false;

    //GUI update
    increaseGUILikes(txid);
    if (amountSats >= nativeCoin.dust) {
        let newAmount = Number(document.getElementById('tipscount' + txid).dataset.amount) + satsToUSD(amountSats);
        document.getElementById('tipscount' + txid).innerHTML = usdString(newAmount, true);
        document.getElementById('tipscount' + txid).dataset.amount = newAmount;
    }

    //If bitclout user is logged in
    if (isBitCloutUser()) {
        bitCloutLikePost(origtxid);
    }

    //If memo user is logged in
    if (checkForNativeUserAndHasBalance()) {
        if (amountSats >= nativeCoin.dust) {
            sendTipRaw(origtxid, tipAddress, amountSats, privkey, null);
        } else {
            sendLike(origtxid, privkey);
        }
    }

    let event = await nostrLikePost(origtxid, roottxid);
    sendWrappedEvent(event);
}

async function dislikePost(txid, origtxid, roottxid = null) {
    decreaseGUILikes(txid);

    if (checkForNativeUserAndHasBalance()) {
        sendDislike(origtxid);
    }
    let event = await nostrDislikePost(origtxid, roottxid);
    sendWrappedEvent(event);
}

async function repostPost(txid, origtxid, sourcenetwork) {

    increaseGUIReposts(txid);

    if (isBitCloutUser()) {
        bitCloutRePost(origtxid, sourcenetwork);
    }

    if (checkForNativeUserAndHasBalance()) {
        repost(origtxid, privkey);
    }

    let event = await nostrRePost(origtxid);
    sendWrappedEvent(event);

}

function sendTip(txid, origtxid, tipAddress, page) {
    if (!checkForNativeUserAndHasBalance()) return false;

    //document.getElementById("tipbox" + page + txid).style.display = "none";
    //document.getElementById("tiplink" + page + txid).style.display = "block";
    increaseGUILikes(txid);

    document.getElementById('tipbutton' + page + txid).style.display = "none";
    document.getElementById('tipstatus' + page + txid).style.display = "block";

    var tipAmount = parseInt(document.getElementById("tipamount" + page + txid).value);
    if (tipAmount < nativeCoin.dust) {
        alert(nativeCoin.dust + getSafeTranslation('547min', " is the minimum tip possible"));
        return false;
    }
    defaulttip = tipAmount;

    document.getElementById('tipstatus' + page + txid).value = getSafeTranslation('sendingtip', "Sending Tip . .") + ' ' + tipAmount;
    let newAmount = Number(document.getElementById('tipscount' + txid).dataset.amount) + satsToUSD(tipAmount);;
    document.getElementById('tipscount' + txid).dataset.amount = newAmount;
    document.getElementById('tipscount' + txid).innerHTML = balanceString(newAmount, false);

    sendTipRaw(origtxid, tipAddress, tipAmount, privkey,
        function () {
            document.getElementById('tipstatus' + page + txid).value = "sent";
        }
    );

}

function showTipBox(txid) {
    if (!checkForNativeUserAndHasBalance()) return false;
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

function checkForMutedWords(data, stub = '') {

    if (settings["mutegm"] == "true") {
        if (data[stub + 'message']) {
            let messagetext = data[stub + 'message'].toLowerCase();
            if (
                messagetext.startsWith('pv')
                || messagetext.startsWith('pura vida')
                || messagetext.startsWith('gm')
                || messagetext.startsWith('good morning')
                || messagetext.startsWith('gn')
                || messagetext.startsWith('good night')
            ) {
                return true;
            }
        }
    }

    for (var i = 0; i < mutedwords.length; i++) { //todo run tolowercase just once for each type for speed improvement
        if (mutedwords[i] == "") continue;
        var checkfor = mutedwords[i].toLowerCase();
        if (data[stub + 'message'] && data[stub + 'message'].toLowerCase().contains(checkfor)) return true;
        if (data[stub + 'name'] && data[stub + 'name'].toLowerCase().contains(checkfor)) return true;
        data[stub + 'address'] += "";//Ensure data address is a string.
        if (data[stub + 'address'] && data[stub + 'address'].toLowerCase().contains(checkfor)) return true;
        if (data[stub + 'topic'] && ("(" + data[stub + 'topic'].toLowerCase() + ")").contains(checkfor)) return true;

    }
    return false;
}

function checkForMutedNetworks(data) {

    if (settings["mutebitclout"] == "true" && data.network == 1) {
        return true;
    }
    if (settings["mutenostr"] == "true" && data.network == 5) {
        return true;
    }

    return false;
}

//Threads
async function removeDuplicatesFromDifferentNetworks(data) {
    //var replies = [];
    for (var i = 0; i < data.length; i++) {
        //for duplicates with message
        let messageWithReplacement = data[i].message.replace(/^https\:\/\/member\.cash\/p\/[0-9a-f]+\n\n/, '');
        data[i].contentauthorhash = await digestMessage(data[i].address + messageWithReplacement);

        //duplicates with just link
        let matches = data[i].message.match(/^https\:\/\/member\.cash\/p\/([0-9a-f]{10})+$/, '$2');
        if (matches) {
            data[i].permalinkstub = matches[1];
        }

    }

    //There is a lot of room to optimize this if it slows things down, and will on very large threads
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data.length; j++) {
            //if the message is the same, and the author is the same, combine as a single post
            if (i != j && data[i] && data[i].network == 3 && data[j].network != 3 &&
                ((data[i].contentauthorhash == data[j].contentauthorhash)
                    || (data[j].permalinkstub && (data[j].permalinkstub == data[i].hivelink.substr(0, 10))))) {
                //datai is on membercoin network(3) and dataj is an identical post and not on membercoin network so . . .
                //change all references to dataj to datai
                for (var k = 0; k < data.length; k++) {
                    if (data[k].retxid == data[j].txid) {
                        data[k].retxid = data[i].txid;
                        if (data[j].highlighted) {//if tx is highlighted, highlight duplicate tx.
                            data[k].highlighted = true;
                        }
                    }
                }
                data[j].setforremoval = true;
            }
        }
    }
    for (var j = 0; j < data.length; j++) {
        if (data[j].setforremoval) {
            data.splice(j, 1);
            j--;
        }
    }

    return data;
}

async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

function setHighlightedPost(data, highlightedtxid) {
    for (var i = 0; i < data.length; i++) {
        data[i].txid = data[i].txid + ""; //ensure it is a string.
        if (data[i].txid == highlightedtxid || data[i].hivelink.startsWith(highlightedtxid)) {
            data[i].highlighted = true;
            return data[i].txid + "";
        }
    }
    return highlightedtxid;
}



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

function manageRevisions(data) {
    /*var replies = [];
    for (var i = 0; i < data.length; i++) {
        if (replies[data[i].txid] == null) {
            replies[data[i].txid] = 1;
        } else {
            data.splice(i, 1);
            i--;
        }
    }*/

    //iterate through all data.
    for (var i = 0; i < data.length; i++) {
        if (data[i].edit < 0) {//where edit < 1, 
            for (var j = 0; j < data.length; j++) {
                if (data[j].edit == data[i].edit * -1 && data[j].retxid == data[i].txid) {//find the child with with revision edit*-1
                    let temp = data[i].message;//switch the content, date
                    let temptime = data[i].firstseen;//switch the content, date 
                    data[i].message = data[j].message;
                    data[j].message = temp;
                    data[i].firstseen = data[j].firstseen;
                    data[j].firstseen = temptime;
                    //data[i].edit=data[j].edit;
                    //data[j].edit=0;                    
                }
            }
        }
    }
    //change edit to 'rev00' 

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

function uncollapseCommentRecursive(commentid) {

    let targetElement = document.getElementById('LI' + commentid);
    //let targetElement=document.querySelector(`[id^="LI"+${commentid}]`)
    while (targetElement) {
        if (targetElement.id && targetElement.id.startsWith('LI')) {
            targetElement.style.display = 'block';
            let collapsedElement = document.getElementById('Collapsed' + targetElement.id);
            collapsedElement.style.display = 'none';

            //Also move this element to the top
            let parentNode = targetElement.parentNode;
            parentNode.insertBefore(parentNode.removeChild(targetElement), parentNode.firstChild);

        }
        targetElement = targetElement.parentNode;
    }
}