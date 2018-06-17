function getAndPopulateFollowers(qaddress) {
    show('followers');
    var page="followers";
    getJSON(server + '?action=followers&qaddress=' + qaddress + '&address=' + pubkey).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents +
                `<tr>
                <td><div id="rating`+i+page+ ds(data[i].address) + `"</div></td>
                <td><a href="#member?qaddress=`+ ds(data[i].address) + `" onclick="showMember('` + ds(data[i].address) + `')">` + ds(data[i].name) + `</a></td>
                <td><a href="#member?qaddress=`+ ds(data[i].address) + `" onclick="showMember('` + ds(data[i].address) + `')">` + ds(data[i].address) + `</a></td>
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
                <td><a href="#member?qaddress=`+ ds(data[i].address) + `" onclick="showMember('` + ds(data[i].address) + `')">` + ds(data[i].name) + `</a></td>
                <td><a href="#member?qaddress=`+ ds(data[i].address) + `" onclick="showMember('` + ds(data[i].address) + `')">` + ds(data[i].address) + `</a></td>
                </tr>`;
        }
        document.getElementById('followingtable').innerHTML = contents;

        addStarRatings(data,page);
    }, function (status) { //error detection....
        alert('Something went wrong.');
    });
}