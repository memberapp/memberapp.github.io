
function getAndPopulateSettings(){
    document.getElementById('legacyformat').innerHTML=pubkey;
    document.getElementById('cashaddrformat').innerHTML=qpubkey;
    document.getElementById('qrformat').innerHTML=`<img src="https://chart.googleapis.com/chart?chs=100x100&amp;cht=qr&amp;chl=`+qpubkey+`&amp;choe=UTF-8">`;

    getJSON(server+'?action=settings&qaddress='+pubkey+'&address='+pubkey).then(function(data) {
        //alert('Your Json result is:  ' + data.result); //you can comment this, i used it to debug
        var contents="";
        contents=contents+`<h2>New Posts</h2>`
        document.getElementById('followersnumber').innerText = ds(data[0].followers); 
        document.getElementById('followersnumber').href = "#followers?address="+pubkey; 
        document.getElementById('followersnumber').onclick = function(){showFollowers(pubkey);}; 
        document.getElementById('followingnumber').innerText = ds(data[0].following); 
        document.getElementById('followingnumber').href = "#following?address="+pubkey; 
        document.getElementById('followingnumber').onclick = function(){showFollowing(pubkey);}; 
        document.getElementById('nametext').innerText = ds(data[0].name); 
        document.getElementById('profiletext').innerText = ds(data[0].profile); 
        var escaped='"'+pubkey+'"'; 
        if(ds(data[0].isfollowing)=="0"){
            document.getElementById('settingsfollow').innerHTML = "<a href='javascript:;' onclick='follow("+escaped+");'>follow</a>";
        }else{
            document.getElementById('settingsfollow').innerHTML = "<a href='javascript:;' onclick='unfollow("+escaped+");'>unfollow</a>";
        }

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

function getAndPopulateMember(qaddress){
    document.getElementById('memberlegacyformat').innerHTML=qaddress;
    setTimeout(function(){populateQAddressesForMember(qaddress);},10);
    
    getJSON(server+'?action=settings&qaddress='+qaddress+'&address='+pubkey).then(function(data) {
        //alert('Your Json result is:  ' + data.result); //you can comment this, i used it to debug
        var contents="";
        contents=contents+`<h2>New Posts</h2>`
        document.getElementById('memberfollowersnumber').innerText = ds(data[0].followers); 
        document.getElementById('memberfollowersnumber').href = "#followers?qaddress="+qaddress; 
        document.getElementById('memberfollowersnumber').onclick = function(){showFollowers(qaddress);}; 
        document.getElementById('memberfollowingnumber').innerText = ds(data[0].following); 
        document.getElementById('memberfollowingnumber').href = "#following?qaddress="+qaddress; 
        document.getElementById('memberfollowingnumber').onclick = function(){showFollowing(qaddress);}; 
        
        document.getElementById('membernametext').innerText = ds(data[0].name); 
        document.getElementById('memberprofiletext').innerText = ds(data[0].profile);
        var escaped='"'+qaddress+'"'; 
        if(ds(data[0].isfollowing)=="0"){
            document.getElementById('memberfollow').innerHTML = "<a href='javascript:;' onclick='follow("+escaped+");'>follow</a>";
        }else{
            document.getElementById('memberfollow').innerHTML = "<a href='javascript:;' onclick='unfollow("+escaped+");'>unfollow</a>";
        }
        if(ds(data[0].isblocked)=="0"){
            document.getElementById('memberblock').innerHTML = "<a href='javascript:;' onclick='block("+escaped+");'>block</a>";
        }else{
            document.getElementById('memberblock').innerHTML = "<a href='javascript:;' onclick='unblock("+escaped+");'>unblock</a>";
        }
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });
}



