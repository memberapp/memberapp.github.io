function getAndPopulateBlockers(qaddress){
    show('blockers');
    getJSON(server+'?action=blockers&qaddress='+qaddress+'&address='+pubkey).then(function(data) {
        var contents="";
        for(var i=0;i<data.length;i++){
            contents=contents+
                `<tr>
                <td><a href="#member?qaddress=`+ds(data[i].address)+`" onclick="showMember('`+ds(data[i].address)+`')">`+ds(data[i].name)+`</a></td>
                <td><a href="#member?qaddress=`+ds(data[i].address)+`" onclick="showMember('`+ds(data[i].address)+`')">`+ds(data[i].address)+`</a></td>
                </tr>`;
        }
        document.getElementById('blocks').innerHTML = contents;
        
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });

}

function getAndPopulateBlocking(qaddress){
    show('blocking');
    getJSON(server+'?action=blocking&qaddress='+qaddress+'&address='+pubkey).then(function(data) {
        var contents="";
        for(var i=0;i<data.length;i++){
            contents=contents+
                `<tr>
                <td><a href="#member?qaddress=`+ds(data[i].address)+`" onclick="showMember('`+ds(data[i].address)+`')">`+ds(data[i].name)+`</a></td>
                <td><a href="#member?qaddress=`+ds(data[i].address)+`" onclick="showMember('`+ds(data[i].address)+`')">`+ds(data[i].address)+`</a></td>
                </tr>`;
        }
        document.getElementById('blockingtable').innerHTML = contents;
        
    }, function(status) { //error detection....
        alert('Something went wrong.');
    });
}