
function getAndPopulate(start,limit,page,qaddress,type){
    show(page);
    var navbuttons=`<div class="navbuttons">`;
        if(start!=0)navbuttons+=`<a class="next" href="#`+page+`?start=`+(start-25)+`&limit=`+limit+`&type=`+type+`&qaddress=`+qaddress+`" onclick="javascript:getAndPopulate(`+(start-25)+`,`+limit+`,'`+page+`','`+qaddress+`','`+type+`')">Back | </a> `;
        navbuttons+=`<a class="back" href="#`+page+`?start=`+(start+25)+`&limit=`+limit+`&type=`+type+`&qaddress=`+qaddress+`" onclick="javascript:getAndPopulate(`+(start+25)+`,`+limit+`,'`+page+`','`+qaddress+`','`+type+`')">Next</div>`;
    getJSON(server+'?action='+page+'&address='+pubkey+'&type='+type+'&qaddress='+qaddress+'&start='+start+'&limit='+limit).then(function(data) {
        var contents="";        
        contents=contents+`<table class="itemlist" cellspacing="0" cellpadding="0" border="0"><tbody>`;
        for(var i=0;i<data.length;i++){
            contents=contents+getHTMLForPost(data[i],i+1+start,page,i);
        }
        contents=contents+"<tr><td/><td/><td>"+navbuttons+"</td></tr></tbody></table>";
        document.getElementById(page).innerHTML = contents; //display the result in an HTML element
        addStarRatings(data,page);
        window.scrollTo(0, 0);
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });

}

function addStarRatings(data,page){
    for(var i=0;i<data.length;i++){
        var theAddress=ds(data[i].address);
        var theElement=document.querySelector("#rating"+i+page+theAddress);
        if(theElement==undefined)continue;
        var theRating = 0; if (data[i].rating != null) { theRating = (ds(data[i].rating) / 64) + 1; }
        var starRating1 = raterJs({
                starSize: 8,
                rating: theRating,
                element: document.querySelector("#rating"+i+page+theAddress),
                rateCallback: function rateCallback(rating, done) {
                    rateCallbackAction(rating, this);
                    done();
                }
            });
        starRating1.theAddress=theAddress;
    }
}

function getAndPopulateTopic(start,limit,topicname){
    //Note topicname may contain hostile code - treat with extreme caution
    var page="topic";
    show(page);
    var navbuttons=`<div class="navbuttons">`;
        if(start!=0)navbuttons+=`<a class="next" href="#`+page+`?topicname=`+ encodeURIComponent(topicname)+`&start=`+(start-25)+`&limit=`+limit+`" onclick="javascript:getAndPopulateTopic(`+(start-25)+`,`+limit+`,'`+unicodeEscape(topicname)+`')">Back | </a> `;
        navbuttons+=`<a class="back" href="#`+page+`?topicname=`+ encodeURIComponent(topicname)+`&start=`+(start+25)+`&limit=`+limit+`" onclick="javascript:getAndPopulateTopic(`+(start+25)+`,`+limit+`,'`+unicodeEscape(topicname)+`')">Next</div>`;
    getJSON(server+'?action='+page+'&address='+pubkey+'&topicname='+encodeURIComponent(topicname)+'&start='+start+'&limit='+limit).then(function(data) {
        var contents="";        
        contents=contents+`<table class="itemlist" cellspacing="0" cellpadding="0" border="0"><tbody>`;
        for(var i=0;i<data.length;i++){
            contents=contents+getHTMLForPost(data[i],i+1+start,page,i);
        }
        contents=contents+"<tr><td/><td/><td>"+navbuttons+"</td></tr></tbody></table>";
        document.getElementById(page).innerHTML = contents; //display the result in an HTML element
        addStarRatings(data,page);
        window.scrollTo(0, 0);
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });

}





function getHTMLForPost(data,rank,page,starindex){
    if(checkForMutedWords(data)) return "";
    return `<tr class="athing">
                <td class="title" valign="top" align="right"><span class="rank">`+rank+`.</span></td>
                <td class="votelinks" valign="top" rowspan="2">
                    <center><a href="javascript:;" onclick="likePost('`+ds(data.txid)+`')"><div id="upvote`+ds(data.txid)+`" class="votearrow" title="upvote"></div></a></center>
                    <center><a href="javascript:;" onclick="dislikePost('`+ds(data.txid)+`')"><div id="downvote`+ds(data.txid)+`" class="votearrow rotate180" title="downvote"></div></a></center>
                </td>
                <td class="title">
                    <a href="#thread?root=`+ds(data.roottxid)+`&post=`+ds(data.txid)+`" onclick="showThread('`+ds(data.roottxid)+`','`+ds(data.txid)+`')">`+anchorme(ds(data.message),{attributes:[{name:"target",value:"_blank"}]})+`</a> `+
                    (data.topic==''?"":`<a href="#topic?topicname=`+encodeURIComponent(data.topic)+`&start=0&limit=25" onclick="showTopic(0,25,'`+unicodeEscape(data.topic)+`')">(`+ds(data.topic)+`)</a>`)+
                `</td>
            </tr>
            <tr>
                <td></td>
                <td class="subtext">
                    <span class="score">`+(ds(data.likes)-ds(data.dislikes))+` likes and `+ds(data.tips)+` sats</span>`
                    +(ds(data.name)==""?" ":`by <a href="#member?qaddress=`+ds(data.address)+`" onclick="showMember('`+ds(data.address)+`')" class="hnuser">`+ds(data.name)+`</a> <div id="rating`+starindex+page+ ds(data.address) + `"></div> `)  
                    +`<span class="age"><a>`+timeSince(ds(data.firstseen))+`</a></span> | `
                    //+(((ds(data.replies)-1)>-1)?`<a href="#thread?post=`+ds(data.roottxid)+`" onclick="showThread('`+ds(data.roottxid)+`')">`+(ds(data.replies)-1)+`&nbsp;comments</a> | `:``)
                    +`<a href="#thread?root=`+ds(data.roottxid)+`&post=`+ds(data.txid)+`" onclick="showThread('`+ds(data.roottxid)+`','`+ds(data.txid)+`')">`+(ds(data.replies))+`&nbsp;comments</a> | `
                    +`<a id="replylink`+page+ds(data.txid)+`" onclick="showReplyBox('`+page+ds(data.txid)+`');" href="javascript:;">reply</a>
                    | <a id="tiplink`+page+ds(data.txid)+`" onclick="showTipBox('`+page+ds(data.txid)+`');" href="javascript:;">tip</a>
                    <span id="tipbox`+page+ds(data.txid)+`" style="display:none">
                        <input id="tipamount`+page+ds(data.txid)+`" type="number" value="0" min="0" style="width: 6em;" step="1000"/>
                        <input value="tip"  type="submit" onclick="sendTip('`+ds(data.txid)+`','`+ds(data.address)+`','`+ds(page)+`');"/>
                    </span>
                 </td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td>
                    <div id="reply`+page+ds(data.txid)+`" style="display:none">
                        <br/>
                        <textarea maxlength="184" id="replytext`+page+ds(data.txid)+`" rows="3" cols="60"></textarea>
                        <br/><br/>
                        <input id="replybutton`+page+ds(data.txid)+`" value="reply" type="submit" onclick="sendReply('`+ds(data.txid)+`','`+ds(page)+`');"/>
                    </div>
                </td>
            </tr>
            <tr class="spacer" style="height:5px"></tr>`;
}

function getHTMLForReply(data,depth,page,starindex,highlighttxid){
    if(checkForMutedWords(data)) return "";
    if (data.name==null){data.name=data.address.substring(0,10);}
    return `<tr class="athing comtr `
    +(data.txid==highlighttxid?"highlight":"")+
    `"><td>
            <table border="0"><tbody><tr>
                <td class="ind"><img src="s.gif" width="`+depth+`" height="1"/></td>
                <td class="votelinks" valign="top">
                    <center><a href="javascript:;" onclick="likePost('`+ds(data.txid)+`')"><div id="upvote`+ds(data.txid)+`" class="votearrow" title="upvote"></div></a></center>
                    <center><a href="javascript:;" onclick="dislikePost('`+ds(data.txid)+`')"><div id="downvote`+ds(data.txid)+`" class="votearrow rotate180" title="downvote"></div></a></center>
                </td>
                <td class="default">
                    <div style="margin-top:2px; margin-bottom:-10px;">
                        <span class="comhead">
                            <a href="#member?qaddress=`+ds(data.address)+`" onclick="showMember('`+ds(data.address)+`')" class="hnuser">`+ds(data.name)+`</a>
                            <div id="rating`+starindex+page+ ds(data.address) + `"></div>
                            <span class="score">`+(ds(data.likes)-ds(data.dislikes))+` likes and `+ds(data.tips)+` sats</span>
                            <span class="age"><a>`+timeSince(ds(data.firstseen))+`</a></span>
                            <span></span>
                            <span class="par"></span>
                            <a class="togg" n="8" >[-]</a>
                            <span class="storyon"></span>
                        </span>
                    </div>
                    <br/>
                    <div class="comment">
                        <span class="c00">`+anchorme(ds(data.message),{attributes:[{name:"target",value:"_blank"}]})+`
                            <div class="reply">
                                <font size="1">  <u><a id="replylink`+page+ds(data.txid)+`" onclick="showReplyBox('`+page+ds(data.txid)+`');" href="javascript:;">reply</a></u></font>
                                <font size="1">| <u><a id="tiplink`+page+ds(data.txid)+`" onclick="showTipBox('`+page+ds(data.txid)+`');" href="javascript:;">tip</a></u></font>
                                <span id="tipbox`+page+ds(data.txid)+`" style="display:none">
                                    <input id="tipamount`+page+ds(data.txid)+`" type="number" value="0" min="0" style="width: 6em;" step="1000"/>
                                    <input value="tip"  type="submit" onclick="sendTip('`+ds(data.txid)+`','`+ds(data.address)+`','`+ds(page)+`');"/>
                                </span>
                            </div>
                        </span>
                    </div>
                    <div id="reply`+page+ds(data.txid)+`" style="display:none">
                        <br/>
                        <textarea maxlength="184" id="replytext`+page+ds(data.txid)+`" rows="3" cols="60"></textarea>
                        <br/><br/>
                        <input id="replybutton`+page+ds(data.txid)+`" value="reply" type="submit" onclick="sendReply('`+ds(data.txid)+`','`+ds(page)+`');"/>
                    </div>
                </td>
            </tr></tbody></table>
            </td></tr>`;
}

function showReplyBox(txid){
    if(privkey==""){
        alert("You must login with a private key to reply to posts.");
        return false;
    }
    document.getElementById("reply"+txid).style.display = "block";
    document.getElementById("replylink"+txid).style.display = "none";
    return true;
}

var defaulttip=10000;

function showTipBox(txid){
    if(privkey==""){
        alert("You must login with a private key to tip.");
        return false;
    }
    if(document.getElementById("tipamount"+txid).value ==""){
        document.getElementById("tipamount"+txid).value = defaulttip;
    }
    
    document.getElementById("tipbox"+txid).style.display = "block";
    document.getElementById("tiplink"+txid).style.display = "none";
    return true;
}

function checkForMutedWords(data){
    for (var i = 0; i < mutedwords.length; i++) {
        if(mutedwords[i]=="")continue;
        var checkfor=mutedwords[i].toLowerCase();
        if(data.message!=undefined&&data.message.toLowerCase().contains(checkfor))return true;
        if(data.name!=undefined&&data.name.toLowerCase().contains(checkfor))return true;
        if(data.address!=undefined&&data.address.toLowerCase().contains(checkfor))return true;
        if(data.topic!=undefined&&("("+data.topic.toLowerCase()+")").contains(checkfor))return true;
        
    }
    return false;
}

