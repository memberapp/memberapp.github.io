"use strict";

var globalusersearchtimeoutcount=0;
async function userSearchChanged(){

    var searchtermHOSTILE=document.getElementById('usersearch').value;

    if(searchtermHOSTILE.length<3){
        return;
    }


    var localCountTimeOut=++globalusersearchtimeoutcount;
    //Show loading animation
    document.getElementById('usersearchresults').innerHTML = document.getElementById("loading").innerHTML;
    await sleep(500);

    //Check if there has been a more recent request (from later keypress)
    if(localCountTimeOut!=globalusersearchtimeoutcount){
        return;
    }

    //Request content from the server and display it when received
    getJSON(dropdowns.contentserver + '?action=usersearch&address=' + pubkey + '&searchterm=' + encodeURIComponent(searchtermHOSTILE)).then(function (data) {
        var test =data;
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            contents = contents + userHTML(data[i].address, data[i].name, i + "usersearch" + data[i].address, data[i].rating, 16)+"<br/>";
        }
        document.getElementById('usersearchresults').innerHTML = contents;
        addStarRatings(data, "usersearch");

    }, function (status) { //error detection....
        console.log('Something is wrong:' + status);
        document.getElementById(page).innerHTML = 'Something is wrong:' + status;
        updateStatus(status);
    });


    
}