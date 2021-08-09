"use strict";

function displayContentBasedOnURLParameters(suggestedurl) {

    //Be very careful with input here . . . this is the most dangerous part of the code
    //input comes from URL so can contain any characters, so we want to sanitize it before using.
    //Use sanitizeAlphanumeric or safeGPBN or numberGPBN
    //If using getParameterByName - it must be marked HOSTILE in any receiving function
    
    if (backForwardEvent) {
        window.scrollTo(0, scrollhistory[window.location.hash]);
    } else {
        window.scrollTo(0, 0);
    }

    if(suggestedurl){
        var url = suggestedurl;
    }else{
        var url = window.location.href;
    }
    
    var action;

    if (url.indexOf('#') != -1) {
        action = sanitizeAlphanumeric(url.substring(url.indexOf('#') + 1).toLowerCase());
        //navigation back to home page, clear topic

    } else if (url.indexOf('/p/') != -1) {
        var postid = sanitizeAlphanumeric(url.substr(url.indexOf('/p/') + 3, 10).toLowerCase().trim());
        showThread(sanitizeAlphanumeric(postid), sanitizeAlphanumeric(postid), 'thread');
        return;
    } else if (url.indexOf('/a/') != -1) {
        var postid = sanitizeAlphanumeric(url.substr(url.indexOf('/a/') + 3, 10).toLowerCase().trim());
        showThread(sanitizeAlphanumeric(postid), sanitizeAlphanumeric(postid), 'article');
        return;
    } else if (url.indexOf('/m/') != -1) {
        var pagingidHOSTILE = decodeURI(url.substring(url.indexOf('/m/') + 3).replace('@', '').toLowerCase()).trim();
        showMember('', safeGPBN(pagingidHOSTILE));
        return;
    } else if (url.indexOf('/t/') != -1) {
        var topicnameHOSTILE = decodeURI(url.substring(url.indexOf('/t/') + 3).toLowerCase()).trim();
        showTopic(0, numbers.results, safeGPBN(topicnameHOSTILE));
        return;
    } else if (url.indexOf('/list/') != -1) {
        var pagingidHOSTILE = decodeURI(url.substring(url.indexOf('/list/') + 6).replace('@', '').toLowerCase()).trim();
        showMember('', safeGPBN(pagingidHOSTILE), true);
        return;
    } else {
        setTopic("");
        action = "";
    }

    if (action.startsWith("show")) {
        showPostsNew(
            safeGPBN("order"),
            safeGPBN("content"),
            safeGPBN("topicname"),
            safeGPBN("filter"),
            numberGPBN("start"),
            numberGPBN("limit"),
            safeGPBN("qaddress")
        );
        setTopic(safeGPBN("topicname"));
    } else if (action.startsWith("list")) {
        showPostsNew("topd","posts","","list", 0, 25, safeGPBN("qaddress"));
    } else if (action.startsWith("notifications")) {
        showNotifications(numberGPBN("start"), numberGPBN("limit"), safeGPBN("qaddress"), safeGPBN("txid"), safeGPBN("nfilter"),numberGPBN("minrating"));
    } else if (action.startsWith("profile")) {
        showMember(sanitizeAlphanumeric(pubkey, ''));
    } else if (action.startsWith("member")) {
        showMember(safeGPBN("qaddress"), safeGPBN("pagingid"));
    } else if (action.startsWith("followers")) {
        showFollowers(safeGPBN("qaddress"));
    } else if (action.startsWith("following")) {
        showFollowing(safeGPBN("qaddress"));
    } else if (action.startsWith("blockers")) {
        showBlockers(safeGPBN("qaddress"));
    } else if (action.startsWith("blocking")) {
        showBlocking(safeGPBN("qaddress"));
    } else if (action.startsWith("rep")) {
        showReputation(safeGPBN("qaddress"));
    } else if (action.startsWith("posts")) {
        showPFC(numberGPBN("start"), numberGPBN("limit"), 'posts');
    } else if (action.startsWith("feed")) {
        showPFC(numberGPBN("start"), numberGPBN("limit"), 'posts');
    } else if (action.startsWith("comments")) {
        showPFC(numberGPBN("start"), numberGPBN("limit"), 'replies');
    } else if (action.startsWith("trustgraph")) {
        showReputation(safeGPBN("target"));
    } else if (action.startsWith("support")) {
        showBesties(safeGPBN("qaddress"));
    } else if (action.startsWith("topiclist")) {
        showTopicList();
    } else if (action.startsWith("topic")) {
        showTopic(numberGPBN("start"), numberGPBN("limit"), safeGPBN("topicname"), safeGPBN("type"));
    } else if (action.startsWith("article")) {
        showThread(safeGPBN("root"), safeGPBN("post"), 'article');
    } else if (action.startsWith("thread")) {
        showThread(safeGPBN("root"), safeGPBN("post"), 'thread');
    } else if (action.startsWith("settings")) {
        showSettings();
    } else if (action.startsWith("messages")) {
        showMessages(safeGPBN("messagetype"));
    } else if (action.startsWith("new")) {
        showNewPost(safeGPBN("txid"));
    } else if (action.startsWith("map")) {
        showMap(safeGPBN("geohash"), safeGPBN("post"));
    } else if (action.startsWith("myfeed") || action.startsWith("mypeople")) {
        showMyFeed();
    } else if (action.startsWith("mytags")) {
        showMyTags();
    } else if (action.startsWith("firehose")) {
        showFirehose();
    } else if (action.startsWith("wallet")) {
        showWallet();
    } else if (action.startsWith("custom")) {
        showCustom();
    } else if (action.startsWith("login")) {
        if (pubkey == "" || pubkey == null || pubkey == undefined) {
            showLogin();
        } else {
            showPFC(0, numbers.results, 'posts');
        }
    } else {
        showFirehose();
    }
}

function hideAll() {
    switchToRegularMode();

    //This should just hide and empty the main tabs (exception of settings)
    //member page
    document.getElementById('mcidmemberheader').style.display = "none";
    document.getElementById('mcidmemberanchor').style.display = "none";
    document.getElementById('mcidmemberanchor').innerHTML = "";
    document.getElementById('trustgraph').style.display = "none";
    document.getElementById('trustgraph').innerHTML = "";
    document.getElementById('besties').style.display = "none";
    document.getElementById('besties').innerHTML = "";
    
    document.getElementById('feed').style.display = "none";
    document.getElementById('posts').style.display = "none";
    document.getElementById('comments').style.display = "none";
    document.getElementById('thread').style.display = "none";
    document.getElementById('notifications').style.display = "none";
    //remove the content too, so that we don't get conflicting ids
    document.getElementById('feed').innerHTML = "";
    document.getElementById('posts').innerHTML = "";
    document.getElementById('comments').innerHTML = "";
    document.getElementById('thread').innerHTML = "";
    document.getElementById('notificationsbody').innerHTML = "";

    document.getElementById('settingsanchor').style.display = "none";
    document.getElementById('loginbox').style.display = "none";
    document.getElementById('followers').style.display = "none";
    document.getElementById('following').style.display = "none";
    document.getElementById('blockers').style.display = "none";
    document.getElementById('blocking').style.display = "none";
    
    document.getElementById('newpost').style.display = "none";
    //document.getElementById('anchorratings').style.display = "none";
    document.getElementById('map').style.display = "none";
    document.getElementById('footer').style.display = "block";//show the footer - it may have been hidden when the map was displayed
    
    //document.getElementById('trustgraph').style.display = "none";
    //document.getElementById('community').style.display = "none";
    document.getElementById('topiclistanchor').style.display = "none";
    document.getElementById('toolsanchor').style.display = "none";
    document.getElementById('messagesanchor').style.display = "none";
    document.getElementById('topicmeta').style.display = "none";

}

function setPageTitleFromID(translationID){
    var pageTitle=getUnSafeTranslation(translationID);
    setPageTitleRaw(pageTitle);
}

function setPageTitleRaw(newContent){
    document.getElementById('pagetitledivid').textContent = newContent;
}

function show(theDiv) {
    hideAll();
    document.getElementById(theDiv).style.display = "block";
}

function showOnly(theDiv) {
    document.getElementById(theDiv).style.display = "block";
}

function hide(theDiv) {
    document.getElementById(theDiv).style.display = "none";
}

function showWallet() {
    setPageTitleFromID("VVwallet");
    show('toolsanchor');    
}

function showLogin() {
    show("loginbox");
    setPageTitleFromID("VV0102a");
}

function showMap(geohash, posttrxid) {
    show("map");
    document.getElementById('footer').style.display = "none";
    setPageTitleFromID("VV0101");
    getAndPopulateMap(geohash, posttrxid);
    document.getElementById('map').style.display = "block";
}

function hideMap() {
    //show("map");
    //getAndPopulateMap();
    document.getElementById('map').style.display = "none";
}

function showNewPost(txid) {
    show("newpost");
    setPageTitleFromID("VV0096");
    document.getElementById('memorandumpreview').innerHTML = "";
    //let topicNameHOSTILE = "";
    //document.getElementById('memorandumtopic').value = topicNameHOSTILE;
    /*if (topicNameHOSTILE != "") {
        document.getElementById('memorandumtopicarea').style.display = "block";
        document.getElementById('memorandumtopicbutton').style.display = "none";
    } else {
        document.getElementById('memorandumtopicarea').style.display = "none";
        document.getElementById('memorandumtopicbutton').style.display = "block";
    }*/
    //Do calculations on maxlengths for topics and titles
    //topictitleChanged();
    
    if (txid) {
        getAndPopulateQuoteBox(txid);
        
        document.getElementById('quotetxid').value = txid;
        document.getElementById('memorandumtextarea').style.display = 'none';
        document.getElementById('memorandumtextbutton').style.display = 'none';

    } else {
        document.getElementById('quotetxid').value = '';
        document.getElementById('quotepost').style.display = 'none';
        document.getElementById('memorandumtextarea').style.display = 'none';
        document.getElementById('memorandumtextbutton').style.display = 'block';

        //Markdown editor doesn't seem to work well on Android
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1;
        if (!isAndroid) {
            initMarkdownEditor();
        }
    }
}


function showNotifications(start, limit, qaddress, txid, nfilter, minrating) {

    if (pubkey == "" || pubkey == null || pubkey == undefined) {
        showPFC(0, numbers.results, 'posts');
        return;
    }
    setPageTitleFromID("VV0095");

    if(!minrating){
        minrating=2;
    }
    getAndPopulateNotifications(start, limit, "notifications", pubkey, txid, nfilter, minrating);

}

function showSettings() {
    //Need to be logged in
    /*if (pubkey == "" || pubkey == null || pubkey == undefined) {
        showPosts(0, numbers.results, 'all');
        return;
    }*/
    hideAll();
    setPageTitleFromID("VV0166");
    show('settingsanchor');
    getAndPopulateSettings();

}


function showMember(qaddress, pagingID, isList) {
    //if pagingid is not empty - await qaddress
    if (!typeof headeraddress === 'undefined') {
        qaddress = headeraddress;
        headeraddress = undefined;
    }

    if (qaddress == '' && pagingID != '') {
        var theURL = dropdowns.contentserver + '?action=resolvepagingid&pagingid=' + encodeURIComponent(pagingID) + '&address=' + pubkey;
        getJSON(theURL).then(function (data) {
            if (data && data.length > 0) {
                showMember(san(data[0].address),sanitizeAlphanumericUnderscore(data[0].pagingid),isList);
                return;
            } else {
                hideAll();
                showOnly("mcidmemberheader");
                showOnly("mcidmembertabs");
                showOnly("mcidmemberanchor");
                document.getElementById('mcidmemberanchor').innerHTML =  getSafeTranslation('pagingidnotfount','This paging id not found.');
                return;
            }
        }, function (status) { //error detection....
            showErrorMessage(status, 'messageslist', theURL);
        });
        return;
    }

    if(isList){
        showPostsNew("topd","posts","","list", 0, 25, sanitizeAlphanumeric(qaddress));
    }else{
        //setPageTitleFromID("VV0063");
        hideAll();
        showOnly("mcidmemberheader");
        showOnly("mcidmembertabs");
        showOnly("mcidmemberanchor");
        setPageTitleRaw(". . .");
        getDataCommonToSettingsAndMember(sanitizeAlphanumeric(qaddress), null, "member", "mcidmember"); 
        var obj2 = {address: sanitizeAlphanumeric(qaddress),profileclass: 'filteron',reputationclass: 'filteroff',postsclass: 'filteroff',bestiesclass: 'filteroff'};
        document.getElementById('mcidmembertabs').innerHTML = templateReplace(membertabsHTML, obj2);  
    }

}

function showBesties(qaddress) {
    hideAll();
    showOnly("mcidmemberheader");
    showOnly("mcidmembertabs");
    showOnly("besties");
    getAndPopulateBesties(qaddress);   

    //Show Filter
    var obj2 = {address: qaddress, profileclass: 'filteroff', reputationclass: 'filteroff', postsclass: 'filteroff', bestiesclass: 'filteron'};
    document.getElementById('mcidmembertabs').innerHTML = templateReplace(membertabsHTML, obj2);
}

function showReputation(qaddress) {
    
    hideAll();
    showOnly("mcidmemberheader");
    showOnly("mcidmembertabs");
    showOnly("trustgraph");
    getAndPopulateTrustGraph(pubkey, qaddress);
   
    //Show Filter
    var obj2 = {address: qaddress, profileclass: 'filteroff', reputationclass: 'filteron', postsclass: 'filteroff', bestiesclass: 'filteroff'};
    document.getElementById('mcidmembertabs').innerHTML = templateReplace(membertabsHTML, obj2);
}

function showCustom(){
    hideAll();
    showOnly("mcidmemberheader");
    showOnly("mcidmembertabs");
    showOnly("besties");
     
    getAndPopulateCustom();
   
    //Show Filter
    //var obj2 = {address: qaddress, profileclass: 'filteroff', reputationclass: 'filteron', postsclass: 'filteroff', bestiesclass: 'filteroff'};
    //document.getElementById('mcidmembertabs').innerHTML = templateReplace(membertabsHTML, obj2);
}

function showMessages(messagetype, start, limit) {
    show("messagesanchor");
    setPageTitleFromID("VV0047");
    getAndPopulateMessages(messagetype, start, limit);
}

function showPFC(start, limit, page) {
    showPostsNew('hot', page, '', 'everyone', start, limit)
}

function showMyFeed() {
    setTopic('');
    getAndPopulateNew('new', 'posts', '', 'myfeed', 0, numbers.results, 'posts', '');
}

function showFirehose() {
    setTopic('');
    getAndPopulateNew('hot', 'posts', '', 'everyone', 0, numbers.results, 'posts', '');
}

function showMyTags() {
    setTopic('');
    getAndPopulateNew('new', 'posts', 'mytopics', 'everyone', 0, numbers.results, 'posts', '');
}

function showPostsNew(order, content, topicname, filter, start, limit, qaddress) {
    getAndPopulateNew(order, content, topicname, filter, start, limit, 'posts', qaddress);
}


//Topics
function showTopic(start, limit, topicname, type) {
    setTopic(topicname);
    if (!type) type = "new";
    getAndPopulateNew(type, 'posts', topicname, 'everyone', start, limit, 'posts', '');
}

function showTopicList() {
    setTopic("");
    setPageTitleFromID("VV0100");
    getAndPopulateTopicList(true);
}

//function postsSelectorChanged() {

    //get value from the 4 drop downs
    //var selector;

    //orderselector
    //selector = document.getElementById('orderselector');
    //var order = selector.options[selector.selectedIndex].value;

    //contentselector
    //selector = document.getElementById('contentselector');
    //var content = selector.options[selector.selectedIndex].value;

    //topicselector
    //selector = document.getElementById('topicselector');
    //var topicNameHOSTILE = selector.options[selector.selectedIndex].value;

    //filterselector
    //selector = document.getElementById('filterselector');
    //var filter = selector.options[selector.selectedIndex].value;

    //These two statements may trigger page load twice on firefox but not on other browsers

    //set the document location without triggering the back/forward function
    //assumeBackForwardEvent = false;
    //nlc();
    //document.location.hash = "#show?order=" + order + "&content=" + content + "&topicname=" + encodeURIComponent(topicNameHOSTILE) + "&filter=" + filter + "&start=0&limit=" + Number(numbers.results);
    //setTimeout(function () { assumeBackForwardEvent = true; }, 100);

    //show the posts
    //displayContentBasedOnURLParameters();
//}

/*function exitTopic(){
    //currentTopic = "";
    //document.getElementById('memotopic').value = "";
    //document.getElementById('memorandumtopic').value = "";
    enterTopic("");    
}*/
function setOrder(selectorvalue, order) {
    var selector = document.getElementById(selectorvalue);
    for (var i = 0; i < selector.length; i++) {
        if (selector.options[i].value == order) {
            selector.selectedIndex = i;
        }
    }
}


function setTopic(topicName) {
    
    if (topicName == null || topicName == "") {
        //selector.selectedIndex = 0;
        //hide("topicmeta");
        return;
    }

    if (topicName.toLowerCase() == "myfeed" || topicName.toLowerCase() == "mytopics") {
        //hide("topicmeta");
    } else {
        getAndPopulateTopic(topicName);
    }

    //selector.selectedIndex = 1;
    //selector.options[selector.selectedIndex].value = topicNameHOSTILE;
    //selector.options[selector.selectedIndex].text = capitalizeFirstLetter(topicNameHOSTILE.substring(0, 13));
    if(topicName.toLowerCase()=="mytopics"){
        setPageTitleFromID("VV0128");
    }else{
        setPageTitleRaw('#'+capitalizeFirstLetter(topicName));
    }
}


function showThread(roottxid, txid, articleStyle) {
    getAndPopulateThread(roottxid, txid, 'thread');
    if (articleStyle == "article") {
        switchToArticleMode(roottxid);
    }
}

function showFollowers(qaddress) {
    getAndPopulateFB('followers',qaddress);
}

function showFollowing(qaddress) {
    getAndPopulateFB('following',qaddress);
}

function showBlockers(qaddress) {
    getAndPopulateFB('blockers',qaddress);
}

function showBlocking(qaddress) {
    getAndPopulateFB('blocking',qaddress);

}


//suspend back/forward detection for map panning
var suspendPageReload = false;

let hashHistory = [window.location.hash];
let historyLength = window.history.length;

var detectBackOrForward = function () {

    var hash = window.location.hash, length = window.history.length;
    if (navlinkclicked) {
        navlinkclicked = false;
        //not a back/foward nav event
        hashHistory.push(hash);
        historyLength = length;
        backForwardEvent = false;
        if (!suspendPageReload) {
            displayContentBasedOnURLParameters();
        }
        return true;
    }
    else{
        //this is a back/foward nav event
        backForwardEvent = true;
        if (hashHistory[hashHistory.length - 2] == hash) {
            hashHistory = hashHistory.slice(0, -1);
        } else {
            hashHistory.push(hash);
        }
        if (!suspendPageReload){
            displayContentBasedOnURLParameters();
        }
        return true;
    } 
}

var scrollhistory = [];

var navlinkclicked = false;
function nlc() {
    //navlinkclicked
    navlinkclicked = true;
}


//Onhashchange is unreliable - try testing for location change 10 times a second
var lastdocumentlocation = location.hash;

setTimeout(testForHashChange, 100);
function testForHashChange() {

    if (lastdocumentlocation != location.hash || navlinkclicked) {
        lastdocumentlocation = location.hash;
        detectBackOrForward();
    }
    setTimeout(testForHashChange, 100);
}
var backForwardEvent=false;

document.addEventListener("click", function () { scrollhistory[window.location.hash] = window.scrollY; }, true);
document.getElementsByTagName('body')[0].onmouseleave = function () { scrollhistory[window.location.hash] = window.scrollY; }

/*
var assumeBackForwardEvent = true;
window.onhashchange = function () {
    if (assumeBackForwardEvent) {
        //usually, but not always a result of back/forward click
        window.innerDocClick = false;
    }
    assumeBackForwardEvent = true;
}
//record the scroll position


//User's mouse is inside the page.
document.getElementsByTagName('body')[0].onmouseover = function () { window.innerDocClick = true; }

//User's mouse has left the page.
document.getElementsByTagName('body')[0].onmouseleave = function () { window.innerDocClick = false; }
*/

function scrollToPosition(theElement) {
    if (backForwardEvent) {
        window.scrollTo(0, scrollhistory[window.location.hash]);
    } else if (theElement) {
        scrollToElement(theElement);
    }
    else {
        window.scrollTo(0, 0);
    }
    backForwardEvent=false;
}
