var pubkey="";
var privkey="";
var qpubkey="";
var mutedwords=new Array();


function init(){
    //check local app storage for key
    
    if(typeof Storage !== void(0)){
        var loginprivkey=localStorage.getItem("privkey");
        var loginpubkey=localStorage.getItem("pubkey");
        
        if(loginprivkey!="null"&&loginprivkey!=null&&loginprivkey!=""){
            trylogin(loginprivkey);
        }else if(loginpubkey!="null"&&loginpubkey!=null&&loginpubkey!=""){
            trylogin(loginpubkey);
        }else{
            displayContentBasedOnURLParameters();
        }
    }
}






function maintainListOfValidUTXOs(){
    //request current UTXOs from server
    //maintain FIFO list of UTXOs
}

function postMessage(){
    //disable button
    //Check have a UTXO
    //Encode, sign, message
    //https://github.com/bitcoincashjs/bitcoincashjs/blob/master/docs/examples.md#create-a-transaction
    //Send to server
    //https://blockexplorer.com/tx/send
    //https://pool.viabtc.com/tools/BCH/broadcast/
    //if success, clear box,
    //post status
    //re-enable button
    //add UTXOs to list    
}


