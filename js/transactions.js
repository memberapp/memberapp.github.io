function checkForPrivKey(){
    if(privkey==""){
        alert("This requires a transaction. You must login with a private key to do this.");
        return false;
    }
    return true;
}

var waitForTransactionToComplete=false;

function sendTransaction(tx, afterTransaction){
    if(waitForTransactionToComplete){
        updateStatus("Please wait for the last transaction first.");
    }else{
        waitForTransactionToComplete=true;
        MemberBoxSend(tx, afterTransaction);
    }
}

function afterTransaction(err, res) {
    waitForTransactionToComplete=false;
    if(err){
        console.log(err);
        updateStatus("Error:"+err);
        alert("There was an error processing the transaction required for this action. Make sure you have sufficient funds in your account and try again. Error:"+err);
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
      sendTransaction(tx, afterTransaction);     
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
      sendTransaction(tx, afterTransaction);
      popupOverlay.hide();
}

function geopost(lat,long){
    if(!checkForPrivKey())return false;

    document.getElementById('newgeopostbutton').style.display = "none";
    var txtarea=document.getElementById('newgeopostta');
    var posttext=txtarea.value;
    var geohash=encodeGeoHash(document.getElementById("lat").value,document.getElementById("lon").value);
    const tx = {
        data: ["0x6da8",geohash,posttext],
        cash: { key: privkey }
      }
      updateStatus("Sending Geotagged Post");
      sendTransaction(tx, afterTransaction);     
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
      sendTransaction(tx, afterTransaction);

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
      sendTransaction(tx, afterTransaction);
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
      sendTransaction(tx, afterTransaction);
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
      sendTransaction(tx, afterTransaction);      
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
      sendTransaction(tx, afterTransaction);
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
      sendTransaction(tx, afterTransaction);
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
      sendTransaction(tx, afterTransaction);
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
      sendTransaction(tx, afterTransaction);
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
      sendTransaction(tx, afterTransaction);
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
      sendTransaction(tx, afterTransaction);
    return true;
}

