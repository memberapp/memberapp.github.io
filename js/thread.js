function getAndPopulateThread(roottxid,txid){
    show('thread');
    var pageName='thread';
    getJSON(server+'?action=thread&address='+pubkey+'&txid='+roottxid).then(function(data) {
        var contents="";
        for(var i=0;i<data.length;i++){
            if(data[i].txid==txid){
               contents+=`<table class="fatitem" border="0"><tbody>`+getHTMLForPost(data[i],1,pageName,i)+`</tbody></table>`;
               //break;
               contents+=`<table class="comment-tree" border="0"><tbody>`+getNestedPostHTML(data,data[i].txid,0,pageName)+`</tbody></table>`;
            }           
        }
        document.getElementById('thread').innerHTML = contents; //display the result in an HTML element
        addStarRatings(data,pageName);
        window.scrollTo(0, 0);
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });
}

function getNestedPostHTML(data, targettxid,depth,pageName){
    var contents="";
    for(var i=0;i<data.length;i++){
        if(data[i].retxid==targettxid){
            contents=contents+""+getHTMLForReply(data[i],depth,pageName,i)+getNestedPostHTML(data,data[i].txid,depth+20,pageName)+"";
        }
    }
    contents=contents+"";
    return contents;
}



