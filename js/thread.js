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
                <td class="votelinks" valign="top"><center><a href="javascript:;" onclick="likePost('`+ds(data.txid)+`')"><div class="votearrow" title="upvote"></div></a></center></td>
                <td class="default"><div style="margin-top:2px; margin-bottom:-10px;"><span class="comhead"><a href="#member?address=`+ds(data.address)+`" onclick="showMember('`+ds(data.address)+`')" class="hnuser">`+ds(data.name)+`</a> <span class="score">`+ds(data.likes)+` likes and `+ds(data.tips)+` sats</span> <span class="age"><a>`+timeSince(data.firstseen)+`</a></span> <span></span><span class="par"></span> <a class="togg" n="8" >[-]</a><span class="storyon"></span></span></div><br/><div class="comment"><span class="c00"><p>`+anchorme(ds(data.message),{attributes:[{name:"target",value:"_blank"}]})+`</p><div class="reply"><p><font size="1"><u><a target="memo" href="https://memo.cash/memo/reply/`+ds(data.txid)+`">reply</a></u></font></p></div></span></div></td>
            </tr></tbody></table>
        </td></tr>`;
}

