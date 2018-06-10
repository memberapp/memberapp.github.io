
function getAndPopulate(start,limit,page,qaddress){
    show(page);
    var navbuttons=`<div class="navbuttons">`;
        if(start!=0)navbuttons+=`<a class="next" href="#`+page+`?start=`+(start-25)+`&limit=`+limit+`&qaddress=`+qaddress+`" onclick="javascript:getAndPopulate(`+(start-25)+`,`+limit+`,'`+page+`','`+qaddress+`')">Back | </a> `;
        navbuttons+=`<a class="back" href="#`+page+`?start=`+(start+25)+`&limit=`+limit+`&qaddress=`+qaddress+`" onclick="javascript:getAndPopulate(`+(start+25)+`,`+limit+`,'`+page+`','`+qaddress+`')">Next</div>`;
    getJSON(server+'?action='+page+'&address='+pubkey+'&qaddress='+qaddress+'&start='+start+'&limit='+limit).then(function(data) {
        var contents="";        
        contents=contents+`<table class="itemlist" cellspacing="0" cellpadding="0" border="0"><tbody>`;
        for(var i=0;i<data.length;i++){
            contents=contents+getHTMLForPost(data[i],i+1+start);
        }
        contents=contents+"<tr><td/><td/><td>"+navbuttons+"</td></tr></tbody></table>";
        document.getElementById(page).innerHTML = contents; //display the result in an HTML element
        window.scrollTo(0, 0);
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });

}

function getAndPopulateTopic(start,limit,topicname){
    var page="topic";
    show(page);
    var navbuttons=`<div class="navbuttons">`;
        if(start!=0)navbuttons+=`<a class="next" href="#`+page+`?topicname=`+ encodeURIComponent(topicname)+`&start=`+(start-25)+`&limit=`+limit+`" onclick="javascript:getAndPopulateTopic(`+(start-25)+`,`+limit+`,'`+topicname+`')">Back | </a> `;
        navbuttons+=`<a class="back" href="#`+page+`?topicname=`+ encodeURIComponent(topicname)+`&start=`+(start+25)+`&limit=`+limit+`" onclick="javascript:getAndPopulateTopic(`+(start+25)+`,`+limit+`,'`+topicname+`')">Next</div>`;
    getJSON(server+'?action='+page+'&topicname='+encodeURIComponent(topicname)+'&start='+start+'&limit='+limit).then(function(data) {
        var contents="";        
        contents=contents+`<table class="itemlist" cellspacing="0" cellpadding="0" border="0"><tbody>`;
        for(var i=0;i<data.length;i++){
            contents=contents+getHTMLForPost(data[i],i+1+start);
        }
        contents=contents+"<tr><td/><td/><td>"+navbuttons+"</td></tr></tbody></table>";
        document.getElementById(page).innerHTML = contents; //display the result in an HTML element
        window.scrollTo(0, 0);
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });

}





function getHTMLForPost(data,rank){
    return `<tr class="athing">
                <td class="title" valign="top" align="right"><span class="rank">`+rank+`.</span></td>
                <td class="votelinks" valign="top"><center><a href="javascript:;" onclick="likePost('`+ds(data.txid)+`')"><div id="upvote`+ds(data.txid)+`" class="votearrow" title="upvote"></div></a></center></td>
                <td class="title"><a href="#thread?post=`+ds(data.roottxid)+`" onclick="showThread('`+ds(data.roottxid)+`')">`+anchorme(ds(data.message),{attributes:[{name:"target",value:"_blank"}]})+`</a> `+
                (data.topic==''?"":`<a href="#topic?topicname=`+encodeURIComponent(data.topic)+`&start=0&limit=25" onclick="showTopic(0,25,'`+ds(data.topic)+`')">(`+ds(data.topic)+`)</a>`)+
            `</td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td class="subtext"><span class="score">`+ds(data.likes)+` likes and `+ds(data.tips)+` sats</span> by <a href="#member?qaddress=`+ds(data.address)+`" onclick="showMember('`+ds(data.address)+`')" class="hnuser">`+ds(data.name)+`</a> <span class="age"><a>`+timeSince(data.firstseen)+`</a></span> | <a href="#thread?post=`+ds(data.roottxid)+`" onclick="showThread('`+ds(data.roottxid)+`')">`+(ds(data.replies)-1)+`&nbsp;comments</a>
                | <a id="replylink`+ds(data.txid)+`" onclick="showReplyBox('`+ds(data.txid)+`');" href="javascript:;">reply</a>
                | <a id="tiplink`+ds(data.txid)+`" onclick="showTipBox('`+ds(data.txid)+`');" href="javascript:;">tip</a> <span id="tipbox`+ds(data.txid)+`" style="display:none"><input id="tipamount`+ds(data.txid)+`" type="number" value="0" min="0" style="width: 6em;" step="1000"><input value="tip"  type="submit" onclick="sendTip('`+ds(data.txid)+`','`+ds(data.address)+`');"></span>
                 </td>
            </tr>
            <tr>
                <td colspan="2"></td>
                <td><div id="reply`+ds(data.txid)+`" style="display:none"><br/>
                <textarea maxlength="184" id="replytext`+ds(data.txid)+`" rows="3" cols="60"></textarea>
                  <br><br><input id="replybutton`+ds(data.txid)+`" value="reply" type="submit" onclick="sendReply('`+ds(data.txid)+`');"></form>
            </div></td>
            </tr>
            <tr class="spacer" style="height:5px"></tr>`;
}

function getHTMLForReply(data,depth){
    if (data.name==null){data.name=data.address.substring(0,10);}
    return `<tr class="athing comtr "><td>
            <table border="0"><tbody><tr>
                <td class="ind"><img src="s.gif" width="`+depth+`" height="1"></td>
                <td class="votelinks" valign="top"><center><a href="javascript:;" onclick="likePost('`+ds(data.txid)+`')"><div id="upvote`+ds(data.txid)+`" class="votearrow" title="upvote"></div></a></center></td>
                <td class="default"><div style="margin-top:2px; margin-bottom:-10px;"><span class="comhead"><a href="#member?qaddress=`+ds(data.address)+`" onclick="showMember('`+ds(data.address)+`')" class="hnuser">`+ds(data.name)+`</a> <span class="score">`+ds(data.likes)+` likes and `+ds(data.tips)+` sats</span> <span class="age"><a>`+timeSince(data.firstseen)+`</a></span> <span></span><span class="par"></span> <a class="togg" n="8" >[-]</a><span class="storyon"></span></span></div><br/><div class="comment"><span class="c00"><p>`+anchorme(ds(data.message),{attributes:[{name:"target",value:"_blank"}]})+`</p>
                <div class="reply">
                <font size="1">  <u><a id="replylink`+ds(data.txid)+`" onclick="showReplyBox('`+ds(data.txid)+`');" href="javascript:;">reply</a></u></font>
                <font size="1">| <u><a id="tiplink`+ds(data.txid)+`" onclick="showTipBox('`+ds(data.txid)+`');" href="javascript:;">tip</a></u></font> <span id="tipbox`+ds(data.txid)+`" style="display:none"><input id="tipamount`+ds(data.txid)+`" type="number" value="0" min="0" style="width: 6em;" step="1000"><input value="tip"  type="submit" onclick="sendTip('`+ds(data.txid)+`','`+ds(data.address)+`');"></span>
                </div>
                </span></div>
                <div id="reply`+ds(data.txid)+`" style="display:none"><br/>
                <textarea maxlength="184" id="replytext`+ds(data.txid)+`" rows="3" cols="60"></textarea>
                  <br><br><input id="replybutton`+ds(data.txid)+`" value="reply" type="submit" onclick="sendReply('`+ds(data.txid)+`');"></form>
            </div></td>
            </tr>
            </tbody></table>

        </td></tr>
            `;
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
    document.getElementById("tipamount"+txid).value = defaulttip;
    
    document.getElementById("tipbox"+txid).style.display = "block";
    document.getElementById("tiplink"+txid).style.display = "none";
    return true;
}




