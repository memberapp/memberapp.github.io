//Some refactoring is possible in these functions

"use strict";

function getAndPopulate(start, limit, page, qaddress, type, topicname) {
    //Clear Topic
    currentTopic == "";
    document.getElementById('topicdiv').innerHTML = "";

    //Clear existing content
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;

    //Show the relevant html element
    show(page);

    //Show navigation next/back buttons
    var navbuttons = getNavButtonsHTML(start, limit, page, type, qaddress,"", "getAndPopulate");
    
    //Request content from the server and display it when received
    getJSON(server + '?action=' + page + '&address=' + pubkey + '&type=' + type + '&qaddress=' + qaddress + '&start=' + start + '&limit=' + limit).then(function (data) {
        data = mergeRepliesToRepliesBySameAuthor(data);
        
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            if(page=="posts"){
                contents = contents + getHTMLForPost(data[i], i + 1 + start, page, i);
            }else{
                contents = contents + getHTMLForReply(data[i], i + 1 + start, page, i, null);
            }
        }
        displayItemListandNavButtonsHTML(contents,navbuttons,page,data);
    }, function (status) { //error detection....
        alert('Something went wrong.');
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

    getJSON(server + '?action=thread&address=' + pubkey + '&txid=' + txid).then(function (data) {
        data = mergeRepliesToRepliesBySameAuthor(data);
        
        //Make sure we have id of the top level post
        if (data.length > 0 && roottxid == "") { roottxid = data[0].roottxid; }

        var contents = "";
        for (var i = 0; i < data.length; i++) {
            if (data[i].txid == roottxid) {
                contents += getTableClassHTML("fatitem",getHTMLForPost(data[i], 1, pageName, i));
                contents += getTableClassHTML("comment-tree",getNestedPostHTML(data, data[i].txid, 0, pageName, txid));
            }
        }
        //Threads have no navbuttons
        displayItemListandNavButtonsHTML(contents,"","thread",data);

        if (popup != undefined) {
            popup.setContent("<div id='mapthread'>" + contents + "</div>");
        }
    }, function (status) { //error detection....
        alert('Something went wrong.');
    });
}



function getAndPopulateTopic(start, limit, page, qaddress, type, topicname) {
    //Note topicname may contain hostile code - treat with extreme caution
    var page = "topic";
    show(page);
    document.getElementById('topicdiv').innerHTML = `<a href="#topic?topicname=` + encodeURIComponent(topicname) + `&start=0&limit=25&type=top" onclick="showTopic(0,25,'` + unicodeEscape(topicname) + `','top')"> - ` + ds(topicname) + `</a> <a href="#topic?topicname=` + encodeURIComponent(topicname) + `&start=0&limit=25&type=new" onclick="showTopic(0,25,'` + unicodeEscape(topicname) + `','new')">(new)</a> |`;
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;
    
    var navbuttons = getNavButtonsHTML(start, limit, page, type, qaddress, topicname, "getAndPopulateTopic");
    
    getJSON(server + '?action=' + page + '&address=' + pubkey + '&topicname=' + encodeURIComponent(topicname) + '&type=' + type + '&start=' + start + '&limit=' + limit).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + getHTMLForPost(data[i], i + 1 + start, page, i);
        }
        displayItemListandNavButtonsHTML(contents,navbuttons,page,data);

    }, function (status) { //error detection....
        alert('Something went wrong.');
    });

}

function displayItemListandNavButtonsHTML(contents,navbuttons,page,data){
    contents = getItemListandNavButtonsHTML(contents,navbuttons);
    document.getElementById(page).innerHTML = contents; //display the result in the HTML element
    addStarRatings(data, page);
    window.scrollTo(0, 0);
    return;
}



function addStarRatings(data, page, disable) {
    for (var i = 0; i < data.length; i++) {

        //Standard message display
        var name = data[i].name;
        var theAddress = ds(data[i].address);
        var rawRating = data[i].rating;
        
        if (data[i].type == "reply" || data[i].type == "like" || data[i].type == "follow" || data[i].type == "rating") {
            //Notifications, or like, or follow reply
            theAddress = ds(data[i].origin);
            name = ds(data[i].originname);
        }

        //For ratings, we're looking for members view of the rater
        if (data[i].type == "rating") {
            rawRating = data[i].raterrating;
        }

        var querySelector = "#rating" + i + page + theAddress;
        addSingleStarsRating(data, page, disable, name, theAddress, rawRating, querySelector);
    
        //Add second one for reply
        if (data[i].type == "reply") {
            var querySelector = "#rating" + i + page + theAddress + data[i].type;
            addSingleStarsRating(data, page, disable, name, theAddress, rawRating, querySelector);
        }

        //Add second one for like
        if (data[i].type == "like") {
            var rawRating = data[i].selfrating;
            var theAddress = ds(data[i].address);
            var querySelector = "#rating" + i + page + theAddress + data[i].type;
            addSingleStarsRating(data, page, disable, name, theAddress, rawRating, querySelector);
        }

    }
}

function addSingleStarsRating(data, page, disable, name, theAddress, rawRating, querySelector) {
    var theElement = document.querySelector(querySelector);
    if (theElement == undefined) return;
    var theRating = 0; if (rawRating != null) { theRating = (ds(rawRating) / 64) + 1; }
    var starRating1 = raterJs({
        starSize: 8,
        rating: Math.round(theRating * 10) / 10,
        element: document.querySelector(querySelector),
        disableText: 'This user rates ' + ds(name) + ' as {rating}/{maxRating}',
        rateCallback: function rateCallback(rating, done) {
            rateCallbackAction(rating, this);
            done();
        }
    });
    starRating1.theAddress = theAddress;
    if (disable) {
        starRating1.disable();
    }
}




function getHTMLForPost(data, rank, page, starindex) {
    if (checkForMutedWords(data)) return "";
    let mainRatingID=starindex + page + ds(data.address);
    return getHTMLForPostHTML(data.txid, data.address, data.name, data.likes, data.dislikes, data.tips, data.firstseen, data.message, data.roottxid, data.topic, data.replies, rank, page, mainRatingID);
}

function getHTMLForReply(data, depth, page, starindex, highlighttxid) {
    if (checkForMutedWords(data)) return "";
    let mainRatingID=starindex + page + ds(data.address);
    return getHTMLForReplyHTML(data.txid, data.address, data.name, data.likes, data.dislikes, data.tips, data.firstseen, data.message, depth, page, mainRatingID, highlighttxid);
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
    sendReplyRaw(privkey, txid, replyhex, 0, divForStatus, replySuccessFunction);
    return true;
}

function replySuccessFunction() {
    //document.getElementById(divForStatus).innerHTML = "";
    document.getElementById("replystatus" + page + txid).style.display = "none";
    document.getElementById("replybutton" + page + txid).style.display = "block";
    document.getElementById("replycompleted" + page + txid).innerText = "Message Sent.";
}

function showReplyBox(txid) {
    if (privkey == "") {
        alert("You must login to reply to posts.");
        return false;
    }
    document.getElementById("reply" + txid).style.display = "block";
    //document.getElementById("replylink"+txid).style.display = "none";
    return true;
}



function sendTip(txid, tipAddress, page) {
    if (!checkForPrivKey()) return false;

    //document.getElementById("tipbox" + page + txid).style.display = "none";
    //document.getElementById("tiplink" + page + txid).style.display = "block";

    document.getElementById('tipbutton' + page + txid).style.display = "none";
    document.getElementById('tipstatus' + page + txid).style.display = "block";

    var tipAmount = parseInt(document.getElementById("tipamount" + page + txid).value);
    if (tipAmount < 547) {
        alert("547 (dust+1) is the minimum tip possible");
        return false;
    }
    defaulttip = tipAmount;

    document.getElementById('tipstatus' + page + txid).value = "Sending Tip . . " + tipAmount;

    sendTipRaw(txid, tipAddress, page, tipAmount, privkey,
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

function post() {
    if (!checkForPrivKey()) return false;
    var txtarea = document.getElementById('memotitle');
    var posttext = txtarea.value;
    if (posttext.length == 0) {
        alert("No Message Body");
        return false;
    }

    var topic = document.getElementById('memotopic').value;

    document.getElementById('newpostcompleted').innerText = "";
    document.getElementById('newpostbutton').style.display = "none";
    document.getElementById('newpoststatus').style.display = "block";
    document.getElementById('newpoststatus').value = "Sending Title...";

    postRaw(posttext, privkey, topic, "newpoststatus", memocompleted);

    //if (typeof popupOverlay !== "undefined") {
    //    popupOverlay.hide();
    //}
}

function postmemorandum() {
    if (!checkForPrivKey()) return false;
    var posttext = document.getElementById('memorandumtitle').value;
    if (posttext.length == 0) {
        alert("No Title");
        return false;
    }
    var postbody = document.getElementById('newposttamemorandum').value;
    if (postbody.length == 0) {
        alert("No Message Body");
        return false;
    }

    var topic = document.getElementById('memorandumtopic').value;
    //topic may be empty string

    document.getElementById('newpostmemorandumcompleted').innerText = "";
    document.getElementById('newpostmemorandumbutton').style.display = "none";
    document.getElementById('newpostmemorandumstatus').style.display = "block";
    document.getElementById('newpostmemorandumstatus').value = "Sending Title...";



    postmemorandumRaw(posttext, postbody, privkey, topic, "newpostmemorandumstatus", memorandumpostcompleted);

    //if (typeof popupOverlay !== "undefined") {
    //    popupOverlay.hide();
    //}
}

function memorandumpostcompleted() {
    document.getElementById('memorandumtitle').value = "";
    document.getElementById('newposttamemorandum').value = "";
    document.getElementById('newpostmemorandumstatus').style.display = "none";
    document.getElementById('newpostmemorandumbutton').style.display = "block";
    document.getElementById('newpostmemorandumcompleted').innerText = "Message Sent.";
}

function memocompleted() {
    document.getElementById('memotitle').value = "";
    document.getElementById('newpoststatus').style.display = "none";
    document.getElementById('newpostbutton').style.display = "block";
    document.getElementById('newpostcompleted').innerText = "Message Sent.";
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



function mergeRepliesToRepliesBySameAuthor(data) {

    var replies = [];
    var authors = [];
    //First build associative array
    for (var i = 0; i < data.length; i++) {
        replies[data[i].txid] = data[i].retxid;
        authors[data[i].txid] = data[i].address;
    }

    //console.log(data);
    for (var i = 0; i < data.length; i++) {

        //Do not merge root, or first reply
        if (data[i].retxid != "" && data[i].retxid != data[i].roottxid) {
            //if the author of the post is the same as the parent post
            if (data[i].address == authors[data[i].retxid]) {

                //Merge child post i into parent post
                //Find parent post
                for (var j = 0; j < data.length; j++) {
                    if (data[i].retxid == data[j].txid) {
                        data[j].likes = (Number(data[j].likes) + Number(data[i].likes)).toString();
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

function getNestedPostHTML(data, targettxid, depth, pageName, highlighttxid) {
    var contents = "";
    for (var i = 0; i < data.length; i++) {
        if (data[i].retxid == targettxid) {
            contents = contents + "" + getHTMLForReply(data[i], depth, pageName, i, highlighttxid) + getNestedPostHTML(data, data[i].txid, depth + 20, pageName, highlighttxid) + "";
        }
    }
    contents = contents + "";
    return contents;
}
