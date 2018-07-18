function hideAll() {
    document.getElementById('feed').style.display = "none";
    document.getElementById('posts').style.display = "none";
    document.getElementById('comments').style.display = "none";
    document.getElementById('settings').style.display = "none";
    document.getElementById('loginbox').style.display = "none";
    document.getElementById('followers').style.display = "none";
    document.getElementById('following').style.display = "none";
    document.getElementById('blockers').style.display = "none";
    document.getElementById('blocking').style.display = "none";
    document.getElementById('thread').style.display = "none";
    document.getElementById('member').style.display = "none";
    document.getElementById('topic').style.display = "none";
    document.getElementById('memberposts').style.display = "none";
    document.getElementById('newpost').style.display = "none";
    document.getElementById('ratings').style.display = "none";
    document.getElementById('map').style.display = "none";
}

function show(theDiv) {
    hideAll();
    document.getElementById(theDiv).style.display = "block";
}

function showMap() {
    show("map");
    getAndPopulateMap();
    document.getElementById('map').style.display = "block";
}

function showSettings() {
    getAndPopulateSettings();
    getAndPopulate(0, 25, 'memberposts', pubkey);
    document.getElementById('settings').style.display = "block";
    document.getElementById('settingsfollow').style.display = "block";
    document.getElementById('ratings').style.display = "block";
}

function showNewPost() {
    show("newpost");
    document.getElementById('newpostbutton').style.display = "block";
}


function showMember(qaddress) {
    getAndPopulateMember(qaddress);
    getAndPopulate(0, 25, 'memberposts', qaddress);
    document.getElementById('member').style.display = "block";
    document.getElementById('memberfollow').style.display = "block";
    document.getElementById('memberblock').style.display = "block";
    document.getElementById('ratings').style.display = "block";
}

function showMemberPosts(start, limit, qaddress) {
    getAndPopulate(start, limit, 'memberposts', qaddress);
}

function showFeed(start, limit, type) {
    getAndPopulate(start, limit, 'feed', pubkey, type);
}

function showPosts(start, limit, type) {
    getAndPopulate(start, limit, 'posts', pubkey, type);
}

function showComments(start, limit, type) {
    getAndPopulate(start, limit, 'comments', pubkey, type);
}

function showTopic(start, limit, topicname) {
    getAndPopulateTopic(start, limit, topicname);
}

function showThread(roottxid, txid) {
    getAndPopulateThread(roottxid, txid, 'thread');
}

function showFollowers(qaddress) {
    getAndPopulateFollowers(qaddress);
}

function showFollowing(qaddress) {
    getAndPopulateFollowing(qaddress);
}

function showBlockers(qaddress) {
    getAndPopulateBlockers(qaddress);
}

function showBlocking(qaddress) {
    getAndPopulateBlocking(qaddress);
}

function displayContentBasedOnURLParameters() {

    //Careful with input here . . . comes from URL so can contain any characters, so we want to sanitize it before using.

    var url = window.location.href;
    var action = url.substring(url.indexOf('#') + 1).toLowerCase();
    if (action.startsWith("memberposts")) {
        showMemberPosts(Number(getParameterByName("start")), Number(getParameterByName("limit")), sanitizeAlphanumeric(getParameterByName("qaddress")));
    } else if (action.startsWith("member")) {
        showMember(sanitizeAlphanumeric(getParameterByName("qaddress")));
    } else if (action.startsWith("followers")) {
        showFollowers(sanitizeAlphanumeric(getParameterByName("qaddress")));
    } else if (action.startsWith("following")) {
        showFollowing(sanitizeAlphanumeric(getParameterByName("qaddress")));
    } else if (action.startsWith("blockers")) {
        showBlockers(sanitizeAlphanumeric(getParameterByName("qaddress")));
    } else if (action.startsWith("blocking")) {
        showBlocking(sanitizeAlphanumeric(getParameterByName("qaddress")));
    } else if (action.startsWith("posts")) {
        showPosts(Number(getParameterByName("start")), Number(getParameterByName("limit")), sanitizeAlphanumeric(getParameterByName("type")));
    } else if (action.startsWith("feed")) {
        showFeed(Number(getParameterByName("start")), Number(getParameterByName("limit")), sanitizeAlphanumeric(getParameterByName("type")));
    } else if (action.startsWith("comments")) {
        showComments(Number(getParameterByName("start")), Number(getParameterByName("limit")), sanitizeAlphanumeric(getParameterByName("type")));
    } else if (action.startsWith("topic")) {
        //Warning - topicname may contain special characters
        showTopic(Number(getParameterByName("start")), Number(getParameterByName("limit")), getParameterByName("topicname"));
    } else if (action.startsWith("thread")) {
        showThread(sanitizeAlphanumeric(getParameterByName("root")), sanitizeAlphanumeric(getParameterByName("post")));
    } else if (action.startsWith("settings")) {
        showSettings();
    } else if (action.startsWith("new")) {
        showNewPost();
    } else if (action.startsWith("map")) {
        showMap();
    }
    else if (pubkey == "" || pubkey == null || pubkey == undefined) {
        showPosts(0, 25);
    } else {
        showFeed(0, 25);
    }
}

var detectBackOrForward = function (onBack, onForward) {
    //Note, sometimes onForward is being called even though it a regular navigation click event
    hashHistory = [window.location.hash];
    historyLength = window.history.length;

    return function () {
        var hash = window.location.hash, length = window.history.length;
        if (hashHistory.length && historyLength == length) {
            if (hashHistory[hashHistory.length - 2] == hash) {
                hashHistory = hashHistory.slice(0, -1);
                onBack();
            } else {
                hashHistory.push(hash);
                onForward();
            }
        } else {
            hashHistory.push(hash);
            historyLength = length;
        }
    }
};

window.addEventListener("hashchange", detectBackOrForward(
    function () { console.log("bk"); displayContentBasedOnURLParameters(); },
    function () { console.log("fw"); displayContentBasedOnURLParameters(); /*This doesn't seem to work accurately if history is over 50*/ }
));

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}



