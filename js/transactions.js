function checkForPrivKey(){
    if(privkey==""){
        alert("This requires a transaction. You must login with a private key to do this.");
        return false;
    }
    return true;
}

function afterTransaction(err, res) {
    if(err){
        console.log(err);
        updateStatus("Error:"+err);
        alert("Error:"+err);
        return;
    }
  
  if(res.length>10){
      updateStatus("<a target='blockchair' href='https://blockchair.com/bitcoin-cash/transaction/"+res+"'>txid:"+res+"</a>");
  }else{
      updateStatus(res);    
  }        
}

function setName(){
    if(!checkForPrivKey())return false;


    document.getElementById('settingsnametextbutton').disabled=true;
    var newName=document.getElementById('settingsnametext').value;
        
    const tx = {
        data: ["0x6d01",newName],
        cash: { key: privkey }
      }
      updateStatus("Setting Name");
      datacash.send(tx, afterTransaction);      
}

function post(){
    if(!checkForPrivKey())return false;

    document.getElementById('newpostbutton').style.display = "none";
    var txtarea=document.getElementById('newpostta');
    var posttext=txtarea.value;
    const tx = {
        data: ["0x6d02",posttext],
        cash: { key: privkey }
      }
      updateStatus("Sending Post");
      datacash.send(tx, afterTransaction);      
}

function sendReply(txid,page){
    if(!checkForPrivKey())return false;

    document.getElementById("reply"+page+txid).style.display = "none";
    document.getElementById("replylink"+page+txid).style.display = "block";
    
    var reversetx=txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    var replytext=document.getElementById("replytext"+page+txid).value;
    const tx = {
        data: ["0x6d03","0x"+reversetx,replytext],
        cash: { key: privkey }
      }
      updateStatus("Sending Reply");
      datacash.send(tx, afterTransaction);

}

function sendTip(txid,tipAddress,page){
    if(!checkForPrivKey())return false;

    document.getElementById("tipbox"+page+txid).style.display = "none";
    document.getElementById("tiplink"+page+txid).style.display = "block";

    document.getElementById('tipbox'+page+txid).style.display = "none";
    var reversetx=txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');

    var tipAmount=parseInt(document.getElementById("tipamount"+page+txid).value);
    if(tipAmount<546){
        alert("546 (dust) is the minimum tip possible");
        return false;
    }
    defaulttip=tipAmount;

    const tx = {
        data: ["0x6d04","0x"+reversetx],
        cash: { key: privkey,
                to: [{address: tipAddress,value: tipAmount}]
            }
      }
      updateStatus("Sending Tip");
      datacash.send(tx, afterTransaction);
}

function likePost(txid){
    if(!checkForPrivKey())return false;

    document.getElementById('upvote'+txid).style.display = "none";
    var reversetx=txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6d04","0x"+reversetx],
        cash: { key: privkey }
      }
      updateStatus("Sending Like");
      datacash.send(tx, afterTransaction);
}

function setProfile(){
    if(!checkForPrivKey())return false;


    document.getElementById('settingsprofiletextbutton').disabled=true;
    var newProfile=document.getElementById('settingsprofiletext').value;
        
    const tx = {
        data: ["0x6d05",newProfile],
        cash: { key: privkey }
      }
      updateStatus("Setting Profile");
      datacash.send(tx, afterTransaction);      
}

function follow(qaddress){
    if(!checkForPrivKey())return false;

    document.getElementById('memberfollow').style.display = "none";
    var addressraw=toHexString(bch.deps.bs58.decode(qaddress)).substring(2);
    addressraw=addressraw.substring(0,addressraw.length-8);

    const tx = {
        data: ["0x6d06","0x"+addressraw],
        cash: { key: privkey }
      }
      updateStatus("Sending Follow");
      datacash.send(tx, afterTransaction);
}

function unfollow(qaddress){
    if(!checkForPrivKey())return false;

    document.getElementById('memberfollow').style.display = "none";
    var addressraw=toHexString(bch.deps.bs58.decode(qaddress)).substring(2);
    addressraw=addressraw.substring(0,addressraw.length-8);

    const tx = {
        data: ["0x6d07","0x"+addressraw],
        cash: { key: privkey }
      }
      updateStatus("Sending unfollow");
      datacash.send(tx, afterTransaction);
}

function block(qaddress){
    if(!checkForPrivKey())return false;

    document.getElementById('memberblock').style.display = "none";
    var addressraw=toHexString(bch.deps.bs58.decode(qaddress)).substring(2);
    addressraw=addressraw.substring(0,addressraw.length-8);

    const tx = {
        data: ["0x6da6","0x"+addressraw],
        cash: { key: privkey }
      }
      updateStatus("Sending Block");
      datacash.send(tx, afterTransaction);
}

function unblock(qaddress){
    if(!checkForPrivKey())return false;

    document.getElementById('memberblock').style.display = "none";
    var addressraw=toHexString(bch.deps.bs58.decode(qaddress)).substring(2);
    addressraw=addressraw.substring(0,addressraw.length-8);

    const tx = {
        data: ["0x6da7","0x"+addressraw],
        cash: { key: privkey }
      }
      updateStatus("Sending unblock");
      datacash.send(tx, afterTransaction);
}

function dislikePost(txid){
    if(!checkForPrivKey())return false;

    document.getElementById('downvote'+txid).style.display = "none";
    var reversetx=txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    const tx = {
        data: ["0x6db4","0x"+reversetx],
        cash: { key: privkey }
      }
      updateStatus("Sending Dislike");
      datacash.send(tx, afterTransaction);
}

function rateUser(qaddress,rating){
    if(!checkForPrivKey())return false;

    var addressraw=toHexString(bch.deps.bs58.decode(qaddress)).substring(2);
    addressraw=addressraw.substring(0,addressraw.length-8);

    var hexRating="0x"+toHexString([rating]);
    const tx = {
        data: ["0x6da5","0x"+addressraw,hexRating],
        cash: { key: privkey }
      }
      updateStatus("Sending Rating");
      datacash.send(tx, afterTransaction);
    return true;
}

