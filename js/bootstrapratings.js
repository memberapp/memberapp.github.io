"use strict";

function somethingwentwrong(status) {
    alert('Something went wrong.');
}

async function getAndPopulateBootstrap(qaddress) {
    bootstrapnames={};
    bstcount=0;
    document.getElementById('bootstraptable1').innerHTML = document.getElementById("loading").innerHTML;
    document.getElementById('bootstraptable2').innerHTML = document.getElementById("loading").innerHTML;
    document.getElementById('bootstraptable3').innerHTML = document.getElementById("loading").innerHTML;
    
    getJSON(server + '?action=bootstrap1&qaddress=' + qaddress + '&address=' + pubkey).then(processdataintoratings, somethingwentwrong);
    await sleep(2000);
    getJSON(server + '?action=bootstrap2&qaddress=' + qaddress + '&address=' + pubkey).then(processdataintoratings, somethingwentwrong);
    await sleep(2000);
    getJSON(server + '?action=bootstrap3&qaddress=' + qaddress + '&address=' + pubkey).then(processdataintoratings, somethingwentwrong);
}
var bstcount=0;
var bootstrapnames={};


function processdataintoratings(data) {
    var lbstcount=++bstcount;
    var contents = "";
    for (var i = 0; i < data.length; i++) {
        if(bootstrapnames[data[i].testaddress]>0){continue;}
        bootstrapnames[data[i].testaddress]=1;

        contents = contents + getBootStrapHTML(pubkey,data[i],lbstcount);
            
    }
    document.getElementById('bootstraptable'+lbstcount).innerHTML = contents;

    for (var i = 0; i < data.length; i++) {
        if(bootstrapnames[data[i].testaddress]>1){continue;}
        bootstrapnames[data[i].testaddress]=2;

        if(document.getElementById("#rating" + lbstcount+theAddress)===undefined){continue;}
        var theRating = 0; if (data[i].rating != null) { theRating = (parseInt(data[i].rating) / 64) + 1; }
        var theAddress = ds(data[i].testaddress);
        var starRating1 = raterJs({
            starSize: 24,
            rating: Math.round( theRating * 10) / 10,
            element: document.querySelector("#rating" + lbstcount+theAddress),
            disableText: ds(data[i].ratername)+' rates '+ds(data[i].name)+' as {rating}/{maxRating}',
            rateCallback: function rateCallback(rating, done) {
                rateCallbackAction(rating, this);
                done();
            }
        });
        starRating1.theAddress = theAddress;
        //starRating1.disable();

    }
}