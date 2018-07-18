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



