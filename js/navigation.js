function hideAll(){
    document.getElementById('feed').style.display="none";
    document.getElementById('posts').style.display="none";
    document.getElementById('comments').style.display="none";
    document.getElementById('settings').style.display="none";
    document.getElementById('loginbox').style.display="none";
    document.getElementById('followers').style.display="none";
    document.getElementById('following').style.display="none"; 
    document.getElementById('thread').style.display="none";
    document.getElementById('member').style.display="none";
    document.getElementById('topic').style.display="none";
    document.getElementById('memberposts').style.display="none";
    document.getElementById('newpost').style.display="none";
}

function show(theDiv){
    hideAll();
    document.getElementById(theDiv).style.display="block";
}

function showSettings(){
    getAndPopulateSettings();
    getAndPopulate(0,25,'memberposts',pubkey);
    document.getElementById('settings').style.display="block";
    document.getElementById('settingsfollow').style.display = "block";
    
}

function showNewPost(){
    show("newpost");
    document.getElementById('newpostbutton').style.display="block";
}


function showMember(qaddress){
    getAndPopulateMember(qaddress);
    getAndPopulate(0,25,'memberposts',qaddress);
    document.getElementById('member').style.display="block";
    document.getElementById('memberfollow').style.display = "block";
}

function showMemberPosts(qaddress){
    getAndPopulate(start,limit,'memberposts',qaddress);
}

function showFeed(start,limit){
    getAndPopulate(start,limit,'feed',pubkey);
}

function showPosts(start,limit){
    getAndPopulate(start,limit,'posts');
}

function showComments(start,limit){
    getAndPopulate(start,limit,'comments');
}

function showTopic(start,limit,topicname){
    getAndPopulateTopic(start,limit,topicname);
}

function showThread(txid){
    getAndPopulateThread(txid);
}

function showFollowers(qaddress){
    getAndPopulateFollowers(qaddress);
}

function showFollowing(qaddress){
    getAndPopulateFollowing(qaddress);
}

function displayContentBasedOnURLParameters(){
    var url = window.location.href;
    var action = url.substring(url.indexOf('#')+1).toLowerCase();
    if(action.startsWith("member")){
        showMember(getParameterByName("qaddress"));
    }else if(action.startsWith("followers")){
        showFollowers(getParameterByName("qaddress"));
    }else if(action.startsWith("following")){
        showFollowing(getParameterByName("qaddress"));
    }else if(action.startsWith("posts")){
        showPosts(Number(getParameterByName("start")),Number(getParameterByName("limit")));
    }else if(action.startsWith("feed")){
        showFeed(Number(getParameterByName("start")),Number(getParameterByName("limit")));
    }else if(action.startsWith("comments")){
        showComments(Number(getParameterByName("start")),Number(getParameterByName("limit")));
    }else if(action.startsWith("topic")){
        showTopic(Number(getParameterByName("start")),Number(getParameterByName("limit")),getParameterByName("topicname"));
    }else if(action.startsWith("memberposts")){
        showMemberPosts(Number(getParameterByName("start")),Number(getParameterByName("limit")),getParameterByName("qaddress"));
    }
    else if(action.startsWith("thread")){
        showThread(getParameterByName("post"));
    }else if(action.startsWith("settings")){
        showSettings();
    }else if(action.startsWith("new")){
        showNewPost();
    }
    else if(pubkey==""||pubkey==null||pubkey==undefined){
        showPosts(0,25);  
    }else{
        showFeed(0,25);
    }
}

var detectBackOrForward = function(onBack, onForward) {
    //Note, sometimes onForward is being called even though it a regular navigation click event
    hashHistory = [window.location.hash];
    historyLength = window.history.length;
  
    return function() {
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
    function() { console.log("bk"); displayContentBasedOnURLParameters(); },
    function() { console.log("fw"); displayContentBasedOnURLParameters(); /*This doesn't seem to work accurately if history is over 50*/}
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