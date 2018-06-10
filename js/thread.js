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



