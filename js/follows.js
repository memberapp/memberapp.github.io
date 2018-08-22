function getAndPopulateFollowers(qaddress) {
    show('followers');
    var page="followers";
    getJSON(server + '?action=followers&qaddress=' + qaddress + '&address=' + pubkey).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents +
                `<tr>
                <td><div id="rating`+i+page+ ds(data[i].address) + `"</div></td>
                <td>`+getMemberLink(data[i].address, ds(data[i].name))+`</td>
                <td>`+getAddressLink(data[i].address, ds(data[i].name))+`</td>                
                </tr>`;
        }

        document.getElementById('follows').innerHTML = contents;
        addStarRatings(data,page);
    }, function (status) { //error detection....
        alert('Something went wrong.');
    });

}

function getAndPopulateFollowing(qaddress) {
    show('following');
    var page="following";
    getJSON(server + '?action=following&qaddress=' + qaddress + '&address=' + pubkey).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents +
                `<tr>
                <td><div id="rating`+i+page+ ds(data[i].address) + `"</div></td>
                <td>`+getMemberLink(data[i].address, ds(data[i].name))+`</td>
                <td>`+getAddressLink(data[i].address, ds(data[i].name))+`</td>
                </tr>`;
        }
        document.getElementById('followingtable').innerHTML = contents;

        addStarRatings(data,page);
    }, function (status) { //error detection....
        alert('Something went wrong.');
    });
}