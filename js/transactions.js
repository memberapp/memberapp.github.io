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
        tq.queueTransaction(tx);
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
    document.getElementById('settingsnametext').disabled = true;

    var newName=document.getElementById('settingsnametext').value;
        
    const tx = {
        data: ["0x6d01",newName],
        cash: { key: privkey }
      }
      updateStatus("Setting Name");

      //TODO remove all 'afterTransaction stuff'
      //TODO, on error, this should really enable the text field and text button again
      tq.queueTransaction(tx, afterTransaction);     
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
      tq.queueTransaction(tx, afterTransaction);
      if(typeof popupOverlay !== "undefined"){
        popupOverlay.hide();
      }
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
      tq.queueTransaction(tx, afterTransaction);     
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
      tq.queueTransaction(tx, afterTransaction);

}

function sendTip(txid,tipAddress,page){
    if(!checkForPrivKey())return false;

    document.getElementById("tipbox"+page+txid).style.display = "none";
    document.getElementById("tiplink"+page+txid).style.display = "block";

    document.getElementById('tipbox'+page+txid).style.display = "none";
    var reversetx=txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');

    var tipAmount=parseInt(document.getElementById("tipamount"+page+txid).value);
    if(tipAmount<547){
        alert("547 (dust+1) is the minimum tip possible");
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
      tq.queueTransaction(tx, afterTransaction);
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
      tq.queueTransaction(tx, afterTransaction);
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
      tq.queueTransaction(tx, afterTransaction);      
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
      tq.queueTransaction(tx, afterTransaction);
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
      tq.queueTransaction(tx, afterTransaction);
}

function block(qaddress){
    if(!checkForPrivKey())return false;

    document.getElementById('memberblock').style.display = "none";
    var addressraw=toHexString(bch.deps.bs58.decode(qaddress)).substring(2);
    addressraw=addressraw.substring(0,addressraw.length-8);

    const tx = {
        data: ["0x6d16","0x"+addressraw],
        cash: { key: privkey }
      }
      updateStatus("Sending Block");
      tq.queueTransaction(tx, afterTransaction);
}

function unblock(qaddress){
    if(!checkForPrivKey())return false;

    document.getElementById('memberblock').style.display = "none";
    var addressraw=toHexString(bch.deps.bs58.decode(qaddress)).substring(2);
    addressraw=addressraw.substring(0,addressraw.length-8);

    const tx = {
        data: ["0x6d17","0x"+addressraw],
        cash: { key: privkey }
      }
      updateStatus("Sending unblock");
      tq.queueTransaction(tx, afterTransaction);
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
      tq.queueTransaction(tx, afterTransaction);
}

function rateUser(qaddress,rating,ratingcomment){
    if(!checkForPrivKey())return false;

    var addressraw=toHexString(bch.deps.bs58.decode(qaddress)).substring(2);
    addressraw=addressraw.substring(0,addressraw.length-8);

    var hexRating="0x"+toHexString([rating]);
    const tx = {
        data: ["0x6da5","0x"+addressraw,hexRating,ratingcomment],
        cash: { key: privkey }
      }
      updateStatus("Sending Rating");
      tq.queueTransaction(tx, afterTransaction);
    return true;
}

