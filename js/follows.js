function getAndPopulateFollowers(qaddress) {
    show('followers');
    getJSON(server + '?action=followers&qaddress=' + qaddress + '&address=' + pubkey).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents +
                `<tr>
                <td><div id="rating`+ ds(data[i].address) + `"</div></td>
                <td><a href="#member?qaddress=`+ ds(data[i].address) + `" onclick="showMember('` + ds(data[i].address) + `')">` + ds(data[i].name) + `</a></td>
                <td><a href="#member?qaddress=`+ ds(data[i].address) + `" onclick="showMember('` + ds(data[i].address) + `')">` + ds(data[i].address) + `</a></td>
                </tr>`;
        }

        document.getElementById('follows').innerHTML = contents;

        for (var i = 0; i < data.length; i++) {

            var theRating = 0; if (data[i].rating != null) { theRating = (ds(data[i].rating) / 64) + 1; }
            var theAddress=ds(data[i].address);
            var starRating1 = raterJs({
                starSize: 24,
                rating: theRating,
                element: document.querySelector("#rating" + theAddress),
                rateCallback: function rateCallback(rating, done) {
                    rateCallbackAction(rating, this);
                    done();
                }
            });
            starRating1.theAddress=theAddress;
        }

    }, function (status) { //error detection....
        alert('Something went wrong.');
    });

}

function getAndPopulateFollowing(qaddress) {
    show('following');
    getJSON(server + '?action=following&qaddress=' + qaddress + '&address=' + pubkey).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents +
                `<tr>
                <td><div id="rating`+ ds(data[i].address) + `"</div></td>
                <td><a href="#member?qaddress=`+ ds(data[i].address) + `" onclick="showMember('` + ds(data[i].address) + `')">` + ds(data[i].name) + `</a></td>
                <td><a href="#member?qaddress=`+ ds(data[i].address) + `" onclick="showMember('` + ds(data[i].address) + `')">` + ds(data[i].address) + `</a></td>
                </tr>`;
        }
        document.getElementById('followingtable').innerHTML = contents;

        for (var i = 0; i < data.length; i++) {
        
        var theRating = 0; if (data[i].rating != null) { theRating = (ds(data[i].rating) / 64) + 1; }
        var theAddress=ds(data[i].address);
        var starRating1 = raterJs({
                starSize: 24,
                rating: theRating,
                element: document.querySelector("#rating" + theAddress),
                rateCallback: function rateCallback(rating, done) {
                    rateCallbackAction(rating, this);
                    done();
                }
            });
        starRating1.theAddress=theAddress;
                
        }
    }, function (status) { //error detection....
        alert('Something went wrong.');
    });
}