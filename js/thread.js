function getAndPopulateThread(roottxid,txid,pageName){
    if(pageName!="mapthread"){
        show(pageName);
        document.getElementById(pageName).innerHTML = document.getElementById("loading").innerHTML;
    }
    getJSON(server+'?action=thread&address='+pubkey+'&txid='+roottxid).then(function(data) {
        data=mergeRepliesToRepliesBySameAuthor(data);
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
        if(popup!=undefined){
            popup.setContent("<div id='mapthread'>"+contents+"</div>");
        }
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });
}

function mergeRepliesToRepliesBySameAuthor(data){
    
    var replies = [];
    var authors = [];
    //First build associative array
    for(var i=0;i<data.length;i++){
        replies[data[i].txid]=data[i].retxid;
        authors[data[i].txid]=data[i].address;
    }

    //console.log(data);
    for(var i=0;i<data.length;i++){
        //console.log("PASS");
        //for(var k=0;k<data.length;k++){
        //    console.log(k+":"+data[k].txid+":"+data[k].retxid+":"+data[k].address);
        //}

        //Do not merge root, or first reply
        if(data[i].retxid!="" && data[i].retxid!=data[i].roottxid){
            //if the author of the post is the same as the parent post
            if(data[i].address==authors[data[i].retxid]){
                //console.log("Address Match:"+data[i].address+":"+authors[data[i].retxid]);
                
                //Merge child post i into parent post
                //console.log("Merge");
                //Find parent post
                for(var j=0;j<data.length;j++){
                    if(data[i].retxid==data[j].txid){
                        //console.log("found parent post match, merging data");
                        //console.log("child "+i+" references parent "+j); 
                        data[j].likes=(Number(data[j].likes)+Number(data[i].likes)).toString();
                        data[j].dislikes=(Number(data[j].dislikes)+Number(data[i].dislikes)).toString();
                        data[j].tips=(Number(data[j].tips)+Number(data[i].tips)).toString();
                        
                        //console.log("Parent Message:"+data[j].message);
                        //console.log("Child Message:"+data[i].message);
                        
                        data[j].message=data[j].message+data[i].message;
                        
                        //console.log("New Parent Message:"+data[j].message);

                        //if any other posts reference the child post, have them refence the parent post instead
                        for(var k=0;k<data.length;k++){
                            if(data[k].retxid==data[i].txid){
                                //console.log("child "+k+" references child "+i);
                                //console.log("child "+data[k].retxid+" references child "+data[i].txid);
                                data[k].retxid=data[j].txid;
                                //console.log("update: child "+k+" now references parent "+j);
                                //console.log("update: child "+data[k].retxid+" now references parent "+data[j].txid);
                            }
                        }
                        //replies[data[i].txid]=data[j].txid;

                        //remove the post
                        //console.log("removing child "+i);
                        data.splice(i, 1);
                        //console.log(data);
                        i--;
                        break;
                    }
                }
            }
        }
    }
    return data;
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



