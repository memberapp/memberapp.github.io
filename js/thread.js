function getAndPopulateThread(roottxid){
    show('thread');
    getJSON(server+'?action=thread&txid='+roottxid).then(function(data) {
        var contents="";
        for(var i=0;i<data.length;i++){
            if(data[i].txid==roottxid){
               contents+=`<table class="fatitem" border="0"><tbody>`+getHTMLForPost(data[i],1)+`</tbody></table>`;
               //break;
            }
        }
        contents+=`<table class="comment-tree" border="0"><tbody>`+getNestedPostHTML(data,roottxid,0)+`</tbody></table>`;
        document.getElementById('thread').innerHTML = contents; //display the result in an HTML element
        
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });
}

function getNestedPostHTML(data, targettxid,depth){
    var contents="";
    for(var i=0;i<data.length;i++){
        if(data[i].retxid==targettxid){
            contents=contents+""+getHTMLForReply(data[i],depth)+getNestedPostHTML(data,data[i].txid,depth+20)+"";
        }
    }
    contents=contents+"";
    return contents;
}

function getHTMLForReply(data,depth){
    if (data.name==null){data.name=data.address.substring(0,10);}
    return `<tr class="athing comtr "><td>
            <table border="0"><tbody><tr>
                <td class="ind"><img src="s.gif" width="`+depth+`" height="1"></td>
                <td class="votelinks" valign="top"><center><a href="javascript:;" onclick="likePost('`+ds(data.txid)+`')"><div  id="upvote`+ds(data.txid)+`" class="votearrow" title="upvote"></div></a></center></td>
                <td class="default"><div style="margin-top:2px; margin-bottom:-10px;"><span class="comhead"><a href="#member?address=`+ds(data.address)+`" onclick="showMember('`+ds(data.address)+`')" class="hnuser">`+ds(data.name)+`</a> <span class="score">`+ds(data.likes)+` likes and `+ds(data.tips)+` sats</span> <span class="age"><a>`+timeSince(data.firstseen)+`</a></span> <span></span><span class="par"></span> <a class="togg" n="8" >[-]</a><span class="storyon"></span></span></div><br/><div class="comment"><span class="c00"><p>`+anchorme(ds(data.message),{attributes:[{name:"target",value:"_blank"}]})+`</p><div class="reply" id="replylink`+ds(data.txid)+`"><p><font size="1"><u><a onclick="showReplyBox('`+ds(data.txid)+`');" href="javascript:;">reply</a></u></font></p></div></span></div>
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

function sendReply(txid){
    if(privkey==""){
        alert("You must login with a private key to like posts.");
        return false;
    }

    document.getElementById('replybutton'+txid).style.display = "none";
    //var compresskey=new bch.PrivateKey(privkey).toString(bch.PrivateKey.compresskey);
    //alert(compresskey);
    var reversetx=txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    var replytext=document.getElementById("replytext"+txid).value;
    const tx = {
        data: ["0x6d03","0x"+reversetx,replytext],
        cash: { key: privkey }
      }
      updateStatus("Sending Reply");
      datacash.send(tx, function(err, res) {
          if(err){
              alert("Error Replying To Post:"+err);
          }
        console.log(err);
        if(res.length>10){
            updateStatus("txid:"+res);
        }else{
            updateStatus(res);    
        }        
      })
}