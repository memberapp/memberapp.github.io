
function getAndPopulateSettings(){
    document.getElementById('legacyformat').innerHTML=pubkey;
    document.getElementById('cashaddrformat').innerHTML=qpubkey;
    document.getElementById('qrformat').innerHTML=`<img src="https://chart.googleapis.com/chart?chs=100x100&amp;cht=qr&amp;chl=`+qpubkey+`&amp;choe=UTF-8">`;

    getJSON(server+'?action=settings&address='+pubkey).then(function(data) {
        //alert('Your Json result is:  ' + data.result); //you can comment this, i used it to debug
        var contents="";
        contents=contents+`<h2>New Posts</h2>`
        document.getElementById('followersnumber').innerText = ds(data[0].followers); //display the result in an HTML element
        document.getElementById('followersnumber').href = "#followers?address="+pubkey; //display the result in an HTML element
        document.getElementById('followersnumber').onclick = function(){showFollowers(pubkey);}; //display the result in an HTML element
        document.getElementById('followingnumber').innerText = ds(data[0].following); //display the result in an HTML element
        document.getElementById('followingnumber').href = "#following?address="+pubkey; //display the result in an HTML element
        document.getElementById('followingnumber').onclick = function(){showFollowing(pubkey);}; //display the result in an HTML element
        document.getElementById('nametext').innerText = ds(data[0].name); //display the result in an HTML element
        document.getElementById('profiletext').innerText = ds(data[0].profile); //display the result in an HTML element
        
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });

}

function populateQAddressesForMember(address){
    try{
        var publicaddress = new bch.Address(address);
        var memberqpubkey=publicaddress.toString(bch.Address.CashAddrFormat);
        document.getElementById('membercashaddrformat').innerHTML=memberqpubkey;
        document.getElementById('memberqrformat').innerHTML=`<img src="https://chart.googleapis.com/chart?chs=100x100&amp;cht=qr&amp;chl=`+memberqpubkey+`&amp;choe=UTF-8">`;
    }catch(e){
        setTimeout(function(){populateQAddressesForMember(address);},1000);
        //Possible script for converting addresses hasn't loaded yet.
    }
}

function getAndPopulateMember(address){
    document.getElementById('memberlegacyformat').innerHTML=address;
    setTimeout(function(){populateQAddressesForMember(address);},10);
    
    getJSON(server+'?action=settings&address='+address).then(function(data) {
        //alert('Your Json result is:  ' + data.result); //you can comment this, i used it to debug
        var contents="";
        contents=contents+`<h2>New Posts</h2>`
        document.getElementById('memberfollowersnumber').innerText = ds(data[0].followers); //display the result in an HTML element
        document.getElementById('memberfollowersnumber').href = "#followers?address="+address; //display the result in an HTML element
        document.getElementById('memberfollowersnumber').onclick = function(){showFollowers(address);}; //display the result in an HTML element
        document.getElementById('memberfollowingnumber').innerText = ds(data[0].following); //display the result in an HTML element
        document.getElementById('memberfollowingnumber').href = "#following?address="+address; //display the result in an HTML element
        document.getElementById('memberfollowingnumber').onclick = function(){showFollowing(address);}; //display the result in an HTML element
        
        document.getElementById('membernametext').innerText = ds(data[0].name); //display the result in an HTML element
        document.getElementById('memberprofiletext').innerText = ds(data[0].profile); //display the result in an HTML element
        
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });

  
}