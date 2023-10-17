//markdown editor
var SimpleMDE = null;
var simplemde;

async function loadMDE() {
    if (!SimpleMDE) {
        document.getElementById("mde1style").setAttribute("href", "js/lib/mde/simplemde.min.css");
        document.getElementById("mde2style").setAttribute("href", "js/lib/mde/fareplacements.css");
        await loadScript("js/lib/mde/simplemde.1.11.2.min.js");
    }
}
async function initMarkdownEditor() {
    await loadMDE();
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
    if (!simplemde) {
        return '';
    }

    return simplemde.value();
}

var articlemode = false;
function switchToArticleMode(roottxid) {
    //changeStyle('base none', false);
    //'articleheader'+roottxid
    //document.querySelector('[id^="articleheader'+roottxid+'"]').innerHTML=document.querySelector('[id^="postbody'+roottxid+'"]').innerHTML;
    setBodyStyle("article");
    articlemode = true;
}

function switchToRegularMode() {
    if (articlemode) {
        //loadStyle();
        setBodyStyle("none");
        articlemode = false;
    }
}

//This is used for profile upload pic as well as file upload pic
async function uploadFile(elementid, uploadURL, targettextarea, memorandumpreviewelement, uploadimagelink, uploadimagestatus, callback, hiddeninput) {
    const formData = document.getElementById(elementid);
    //document.getElementById(memorandumpreviewelement).style.display = 'block';
    document.getElementById(uploadimagelink).style.visibility = 'hidden';
    if (uploadimagestatus) {
        document.getElementById(uploadimagestatus).style.display = 'block';
    }
    getJSON(uploadURL, null, formData).then(function (data) {
        //formData.firstfile.value = null;
        document.getElementById(uploadimagelink).style.visibility = 'visible';
        if (uploadimagestatus) {
            document.getElementById(uploadimagestatus).style.display = 'none';
        }
        if (memorandumpreviewelement) {
            document.getElementById(memorandumpreviewelement).style.display = 'block';
        }
        console.log(data);
        let textarea = document.getElementById(targettextarea);
        let initValue = "\n" + textarea.value;
        if (elementid == 'profilepicfile') {
            initValue = "";
        }
        if (data.error) {
            alert(sane(data.error));
        } else if (data.arweaveid) {
            textarea.value = "arweave:" + data.arweaveid + initValue;
        } else if (data.memberurl) {
            if (hiddeninput) {
                document.getElementById(hiddeninput).value = data.memberurl;
            }
            textarea.value = data.memberurl + initValue;

        }
        callback();
    });
}

function checkLength(elementName, maxcharlength) {
    let element = document.getElementById(elementName);
    let text = element.value;
    let hextext = new Buffer(text).toString('hex');
    let length = hextext.length;
    if (length > maxcharlength * 2) {
        //alert('too long');
        element.value = Buffer.from(hextext.substring(0, maxcharlength * 2), 'hex').toString();
    }
}

function showMemorandumPreview() {
    document.getElementById('memorandumpreviewarea').style.display = 'block';
    document.getElementById('memorandumpreviewareabutton').style.display = 'none';
    memorandumPreview();
}

function memorandumPreview() {
    if (document.getElementById('memorandumpreviewarea').style.display == 'none') {
        //Only run the preview if the preview area is visible
        return;
    }


    var time = new Date().getTime() / 1000;

    //Grab needed values from settings page
    var name = document.getElementById('settingsnametext').value;
    //var followers = document.getElementById('settingsfollowersnumber').innerHTML;
    //var following = document.getElementById('settingsfollowingnumber').innerHTML; 
    //var blockers = document.getElementById('settingsblockersnumber').innerHTML; 
    //var blocking = document.getElementById('settingsblockingnumber').innerHTML; 
    let followers = 0, following = 0, blockers = 0, blocking = 0;

    var pagingid = document.getElementById('settingspagingid').value;
    var profile = document.getElementById('settingsprofiletext').value;
    var publickey = document.getElementById('settingspublickey').value;
    var picurl = document.getElementById('settingspicurl').value;
    var tokens = document.getElementById('settingstokens').value;
    var nametime = document.getElementById('settingsnametime').value;
    var rating = document.getElementById('settingsrating').value;
    var numberaddress = document.getElementById('settingsaddress').value;

    var isfollowing = true;

    var repostedHTML = document.getElementById('quotepost').outerHTML;


    let member = new Member(numberaddress, name, "MAINRATINGID", rating, pagingid, publickey, picurl, tokens, followers, following, blockers, blocking, profile, isfollowing, nametime, 0, 0, '', null);

    document.getElementById('memorandumpreview').innerHTML =
        getHTMLForPostHTML2(member, 'previewpage', 'preview', repostedHTML, false, '000', 1, 0, 0, time, document.getElementById('memorandumtitle').value, '', '', 0, 0, '000', 1, 0, 0, '', 3, '000', false)
        + `<div id="articleheader000" class="articleheader"></div>`
        + getHTMLForReplyHTML2(member, '000', 1, 0, 0, time, getMemorandumText(), 'page', false, 1, null, null, 'preview', '', null, 0, '', 3, '000', false, 0,'000');

    //Repeat the title for article mode
    document.querySelector('[id^="articleheader000"]').innerHTML = document.querySelector('[id^="postbody000"]').innerHTML;

    //document.getElementById('articleheader000').innerHTML=document.getElementById('postbody000').innerHTML;

    addDynamicHTMLElements();
}

async function geopost() {
    //if (!checkForPrivKey()) return false;

    var txtarea = document.getElementById('newgeopostta');
    var posttext = txtarea.value;
    if (posttext.length == 0) {
        alert(getSafeTranslation('nomessagebody', "No Message Body"));
        return false;
    }
    var lat = Number(document.getElementById("lat").value);
    var lon = Number(document.getElementById("lon").value);

    //Leaflet bug allow longitude values outside proper range
    while (lon < -180) {
        lon = lon + 180;
    }
    while (lon > 180) {
        lon = lon - 180;
    }
    var geohash = encodeGeoHash(lat, lon);


    document.getElementById('newpostgeocompleted').textContent = "";
    document.getElementById('newpostgeobutton').style.display = "none";
    document.getElementById('newpostgeostatus').style.display = "block";
    document.getElementById('newpostgeostatus').value = getSafeTranslation('posting', "Posting...");

    let successFunction = geocompleted;

    let taggedPostText = posttext + ` \n${pathpermalinks}/geotag/` + geohash;
    if (checkForNativeUserAndHasBalance()) {
        //postgeoRaw(posttext, privkey, geohash, "newpostgeostatus", successFunction);
        postmemorandumRaw(taggedPostText, '', privkey, '', "newpostgeostatus", successFunction, null);
        //successFunction = null;
    }
    if (isBitCloutUser()) {
        sendBitCloutPost(posttext + ` \n${pathpermalinks}/geotag/` + geohash, '', "newpostgeostatus", successFunction, { GeoHash: geohash });
    }

    let event = await sendNostrPost(posttext + ` \n${pathpermalinks}/geotag/` + geohash, '', null, "newpostgeostatus", successFunction, true, 1, geohash);
    sendWrappedEvent(event);

}

async function postmemorandum() {
    //if (!checkForPrivKey()) return false;
    var posttext = document.getElementById('memorandumtitle').value;
    if (!posttext.includes('#')) {
        if (!confirm(getSafeTranslation('notagareyousure', `Are you sure you want to post this without a #hashtag?  Include a #hashtag to help members find your post. Click OK to post or Cancel to add a #hashtag.`))) {
            return false;
        }
    }
    var txid = document.getElementById('quotetxid').value;
    var network = document.getElementById('quotetxidnetwork').value;
    var postbody = document.getElementById('newposttamemorandum').value;
    //var topic = document.getElementById('memorandumtopic').value;

    var postLength = new Buffer(posttext).toString('hex').length / 2;
    var bodyLength = new Buffer(postbody).toString('hex').length / 2;
    if (postLength > 20000) {
        alert("Post size is " + postLength + ". Maximum size of 20,000 chars exceeded. This can't be posted.");
        return;
    }
    if (bodyLength > 20000) {
        alert("Body size is " + bodyLength + ". Maximum size of 20,000 chars exceeded. This can't be posted.");
        return;
    }

    var topic = '';

    if (!txid) {
        if (posttext == defaultTag || posttext.length == 0) {
            alert(getSafeTranslation('nomemo', "No Post - Try adding some text"));
            return false;
        }
    }/*else{
        if (posttext.length == 0 && topic.length == 0) {
            alert(getSafeTranslation('nopost',"No post or topic. Try a regular remember instead."));
            return false;
        }
    }*///nb allow empty remember for compact theme
    //topic may be empty string

    document.getElementById('newpostmemorandumcompleted').textContent = "";
    document.getElementById('newpostmemorandumbutton').style.display = "none";
    document.getElementById('newpostmemorandumstatus').style.display = "block";
    document.getElementById('newpostmemorandumstatus').value = getSafeTranslation('sendingtitle', "Sending Title...");

    var successFunction = memorandumpostcompleted;

    let memberImageURL = document.getElementById('memberimageurl').value

    if (txid) {
        //Repost
        if (checkForNativeUserAndHasBalance()) {
            //quotepostRaw(posttext, privkey, topic, "newpostmemorandumstatus", function (txidnew) { sendRepostNotification(txid, "newpostmemorandumstatus", topic, txidnew); }, txid);
            postmemorandumRaw(posttext, '', privkey, topic, "newpostmemorandumstatus", successFunction, txid);
            //function (txidnew) { sendRepostNotification(txid, "newpostmemorandumstatus", topic, txidnew); }//
            //successFunction = null;
        }
        if (isBitCloutUser()) {
            sendBitCloutQuotePost(posttext, topic, txid, "newpostmemorandumstatus", successFunction, network, memberImageURL);
        }

        let event= await sendNostrQuotePost(posttext, topic, txid, "newpostmemorandumstatus", successFunction, txid);
        sendWrappedEvent(event);
    }
    else {
        //Don't post body if it is not visible - it may contain old elements that the user is not expecting to post
        if (document.getElementById('memorandumtextarea').style.display == 'none') {
            postbody = '';
        }

        if (checkForNativeUserAndHasBalance()) {
            postmemorandumRaw(posttext, postbody, privkey, topic, "newpostmemorandumstatus", successFunction, null);
            //successFunction = null;
        }
        if (isBitCloutUser()) {
            sendBitCloutPostLong(posttext, postbody, topic, "newpostmemorandumstatus", successFunction, memberImageURL);
        }
        
        //Should always be possible to send Nostr event if user is logged in.
        let event= await sendNostrPost(posttext, postbody, topic, "newpostmemorandumstatus", successFunction);
        sendWrappedEvent(event);
    }

    //if (typeof popupOverlay !== "undefined") {
    //    popupOverlay.hide();
    //}
}



/*
function sendRepostNotification(txid, divForStatus, topic, newtxid) {

    var replytext = getSafeTranslation('postremembered', "Your post was remembered");
    if (topic) {
        replytext += " " + getSafeTranslation('intopic', "in tag") + " " + topic;
    }
    replytext += ` ${pathpermalinks}/p/` + newtxid;
    var replyHex = new Buffer(replytext).toString('hex');

    sendReplyRaw(privkey, txid, replyHex, 0, divForStatus, function (txidnew) { memorandumpostcompleted(newtxid); });
}*/

function memorandumpostcompleted(txid) {
    txid = san(txid);
    //document.getElementById('newpostmemorandumcompleted').innerHTML = `Sent. <a onclick="showThread('`+txid+`')" href="#thread?post=`+txid+`">View It</a> or  <a rel='noopener noreferrer' target="_blank" href="` + encodedURL + `">Also Post To Twitter (opens a new window)</a>`;
    document.getElementById('newpostmemorandumcompleted').innerHTML = completedPostHTML(txid, document.getElementById('memorandumtitle').value);
    //TODO - bit heavy to retranslate the whole page, maybe just translate the new element
    translatePage();

    /*
    var encodedURL = `https://twitter.com/intent/tweet?text=` + encodeURIComponent(document.getElementById('memorandumtitle').value + '\r\n' + ` member.cash/p/` + txid.substr(0, 10));
    `Sent. <a onclick="showThread('` + txid + `')" href="#thread?post=` + txid + `" onclick="nlc();">View It</a> or  <a href="" onclick="window.open('` + encodedURL + `', 'twitterwindow', 'width=300,height=250');return false;">Also Post To Twitter (opens a new window)</a>`;
    */
    //iframe not allowed by twitter
    //document.getElementById('newpostmemorandumcompleted').innerHTML = `Sent. <a rel='noopener noreferrer' onclick="createiframe('`+encodedURL+`','posttotwitter');return false;" href="">Also Post To Twitter</a><div id="posttotwitter"></div>`;
    document.getElementById('quotetxid').value = "";
    document.getElementById('quotetxidnetwork').value = "";
    document.getElementById('memberimageurl').value = "";
    document.getElementById('memorandumtitle').value = "";
    document.getElementById('newposttamemorandum').value = "";
    document.getElementById('newpostmemorandumstatus').style.display = "none";
    document.getElementById('newpostmemorandumbutton').style.display = "block";
    if (simplemde) {
        simplemde.value("");
    }

}

function memocompleted() {
    document.getElementById('memotitle').value = "";
    document.getElementById('newpoststatus').style.display = "none";
    document.getElementById('newpostbutton').style.display = "block";
    document.getElementById('newpostcompleted').innerHTML = getSafeTranslation('messagesent', "Message Sent.");
}

function geocompleted() {
    document.getElementById('newgeopostta').value = "";
    document.getElementById('newpostgeostatus').style.display = "none";
    document.getElementById('newpostgeobutton').style.display = "block";
    document.getElementById('newpostgeocompleted').innerHTML = getSafeTranslation('messagesent', "Message Sent.");
}