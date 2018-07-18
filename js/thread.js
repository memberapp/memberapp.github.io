function getAndPopulateThread(roottxid,txid,pageName){
    if(pageName!="mapthread")show(pageName);

    document.getElementById(pageName).innerHTML ="";
    getJSON(server+'?action=thread&address='+pubkey+'&txid='+roottxid).then(function(data) {
        var contents="";
        for(var i=0;i<data.length;i++){
            if(data[i].txid==roottxid){
               contents+=`<table class="fatitem" border="0"><tbody>`+getHTMLForPost(data[i],1,pageName,i)+`</tbody></table>`;
               //break;
               contents+=`<table class="comment-tree" border="0"><tbody>`+getNestedPostHTML(data,data[i].txid,0,pageName,txid)+`</tbody></table>`;
            }           
        }
        document.getElementById(pageName).innerHTML = contents; //display the result in an HTML element
        addStarRatings(data,pageName);
        window.scrollTo(0, 0);
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });
}

function getNestedPostHTML(data, targettxid,depth,pageName,highlighttxid){
    var contents="";
    for(var i=0;i<data.length;i++){
        if(data[i].retxid==targettxid){
            contents=contents+""+getHTMLForReply(data[i],depth,pageName,i,highlighttxid)+getNestedPostHTML(data,data[i].txid,depth+20,pageName,highlighttxid)+"";
        }
    }
    contents=contents+"";
    return contents;
}



