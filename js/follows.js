function getAndPopulateFollowers(address){
    show('followers');
    getJSON(server+'?action=followers&address='+address).then(function(data) {
        var contents="";
        for(var i=0;i<data.length;i++){
            contents=contents+
                `<tr>
                <td><a href="#member?address=`+ds(data[i].address)+`" onclick="showMember('`+ds(data[i].address)+`')">`+ds(data[i].name)+`</a></td>
                <td><a href="#member?address=`+ds(data[i].address)+`" onclick="showMember('`+ds(data[i].address)+`')">`+ds(data[i].address)+`</a></td>
                </tr>`;
        }
        document.getElementById('follows').innerHTML = contents; //display the result in an HTML element
        
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });

}

function getAndPopulateFollowing(address){
    show('following');
    getJSON(server+'?action=following&address='+address).then(function(data) {
        var contents="";
        for(var i=0;i<data.length;i++){
            contents=contents+
                `<tr>
                <td><a href="#member?address=`+ds(data[i].address)+`" onclick="showMember('`+ds(data[i].address)+`')">`+ds(data[i].name)+`</a></td>
                <td><a href="#member?address=`+ds(data[i].address)+`" onclick="showMember('`+ds(data[i].address)+`')">`+ds(data[i].address)+`</a></td>
                </tr>`;
        }
        document.getElementById('followingtable').innerHTML = contents; //display the result in an HTML element
        
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });
}