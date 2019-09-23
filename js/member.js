var pubkey=""; //Public Key (Legacy)
var privkey=""; //Private Key
var qpubkey=""; //Public Key (q style address)
var mutedwords=new Array(); 
let tq = new TransactionQueue(updateStatus);
let currentTopic=""; //Be careful, current Topic can contain anything, including code.


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



