function getAndPopulateFollowers(qaddress){
    show('followers');
    getJSON(server+'?action=followers&qaddress='+qaddress+'&address='+pubkey).then(function(data) {
        var contents="";
        for(var i=0;i<data.length;i++){
            contents=contents+
                `<tr>
                <td><a href="#member?qaddress=`+ds(data[i].address)+`" onclick="showMember('`+ds(data[i].address)+`')">`+ds(data[i].name)+`</a></td>
                <td><a href="#member?qaddress=`+ds(data[i].address)+`" onclick="showMember('`+ds(data[i].address)+`')">`+ds(data[i].address)+`</a></td>
                </tr>`;
        }
        document.getElementById('follows').innerHTML = contents;
        
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });

}

function getAndPopulateFollowing(qaddress){
    show('following');
    getJSON(server+'?action=following&qaddress='+qaddress+'&address='+pubkey).then(function(data) {
        var contents="";
        for(var i=0;i<data.length;i++){
            contents=contents+
                `<tr>
                <td><a href="#member?qaddress=`+ds(data[i].address)+`" onclick="showMember('`+ds(data[i].address)+`')">`+ds(data[i].name)+`</a></td>
                <td><a href="#member?qaddress=`+ds(data[i].address)+`" onclick="showMember('`+ds(data[i].address)+`')">`+ds(data[i].address)+`</a></td>
                </tr>`;
        }
        document.getElementById('followingtable').innerHTML = contents;
        
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });
}