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

function sendReply(txid){
    if(!checkForPrivKey())return false;

    document.getElementById('replybutton'+txid).style.display = "none";
    var reversetx=txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');
    var replytext=document.getElementById("replytext"+txid).value;
    const tx = {
        data: ["0x6d03","0x"+reversetx,replytext],
        cash: { key: privkey }
      }
      updateStatus("Sending Reply");
      datacash.send(tx, afterTransaction);
}

function sendTip(txid,tipAddress){
    if(!checkForPrivKey())return false;

    document.getElementById('tipbox'+txid).style.display = "none";
    var reversetx=txid.match(/[a-fA-F0-9]{2}/g).reverse().join('');

    var tipAmount=parseInt(document.getElementById("tipamount"+txid).value);
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



