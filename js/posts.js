
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
                <td class="subtext"><span class="score">`+ds(data.likes)+` likes and `+ds(data.tips)+` sats</span> by <a href="#member?qaddress=`+ds(data.address)+`" onclick="showMember('`+ds(data.address)+`')" class="hnuser">`+ds(data.name)+`</a> <span class="age"><a>`+timeSince(data.firstseen)+`</a></span> | <a href="#thread?post=`+ds(data.roottxid)+`" onclick="showThread('`+ds(data.roottxid)+`')">`+(ds(data.replies)-1)+`&nbsp;comments</a> | <a id="replylink`+ds(data.txid)+`" onclick="showReplyBox('`+ds(data.txid)+`');" href="javascript:;">reply</a></td>
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


function likePost(txid){
    if(privkey==""){
        alert("You must login with a private key to like posts.");
        return false;
    }

    document.getElementById('upvote'+txid).style.display = "none";
    //var compresskey=new bch.PrivateKey(privkey).toString(bch.PrivateKey.compresskey);
    //alert(compresskey);
    var reversetx=txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6d04","0x"+reversetx],
        cash: { key: privkey }
      }
      updateStatus("Sending Like");
      datacash.send(tx, function(err, res) {
          if(err){
              alert("Error Liking Post:"+err);
          }
        console.log(err);
        if(res.length>10){
            updateStatus("txid:"+res);
        }else{
            updateStatus(res);    
        }        
      })
}

function updateStatus(message){
    document.getElementById("status").innerHTML = message;
}


