"use strict";

function getAndPopulateTrustGraph(member, target) {

    //First clear old graph
    document.getElementById('trustgraphdetails').innerHTML = document.getElementById("loading").innerHTML;

    getJSON(graphserver + '?action=trustgraph&member=' + member + '&target=' + target).then(function (data) {


        var directrating = 0.0;
        var oneRemoveRating = 0.0;
        var oneRemoveRatingCount = 0.0;
        var overallRating = 0.0;


        var contentsHTML="";
        for (var i = 0; i < data.length; i++) {
            if (i == 0 && data[i][3] == '') {
                //Direct Rating
                contentsHTML += getDirectRatingHTML(data[i]);
                directrating = parseInt(data[i][2]);
            } else {
                contentsHTML += getIndirectRatingHTML(data[i]); 
                if (i < 6) {
                    oneRemoveRating += Math.min(parseInt(data[i][2]), parseInt(data[i][5]));
                    oneRemoveRatingCount++;
                }
            }
        }
        

        //alert(contents);

        var oneRemove = 0.0;
        if (oneRemoveRatingCount > 0) {
            oneRemove = oneRemoveRating / oneRemoveRatingCount;
        }

        if (directrating > 0 && oneRemoveRatingCount > 0) {
            overallRating = (directrating + oneRemove) / 2;
        } else if (directrating > 0 && oneRemoveRatingCount == 0) {
            overallRating = directrating;
        } else if (directrating == 0 && oneRemoveRatingCount > 0) {
            overallRating = oneRemove;
        }

        overallRating = (overallRating / 64) + 1;

        contentsHTML=getTrustRatingTableHTML(contentsHTML,overallRating.toFixed(1));
        
        document.getElementById('trustgraphdetails').innerHTML = contentsHTML;


        var overallStarRating = raterJs({
            starSize: 48,
            rating: Math.round( overallRating * 10) / 10,
            element: document.querySelector("#overall"),
            //rateCallback: function rateCallback(rating, done) {
            //rateCallbackAction(rating, this);
            //    done();
            //}
        });
        overallStarRating.disable();

        for (var i = 0; i < data.length; i++) {
            if (i == 0 && data[i][3] == '') {
                var rawRating=parseInt(data[i][2]);
                var textNote="";
                if (rawRating==193){
                    textNote=" (Follows)";
                }else if (rawRating==63){
                    textNote=" (Blocks)";
                }
                var theRating = (rawRating / 64) + 1;
                var starRating1 = raterJs({
                    starSize: 24,
                    rating: Math.round( theRating * 10) / 10,
                    element: document.querySelector("#trust" + san(data[i][0]) + san(data[i][6])),
                    disableText: rts(data[i][1])+' rates '+rts(data[i][7])+' as {rating}/{maxRating}'+textNote,
                    //rateCallback: function rateCallback(rating, done) {
                    //rateCallbackAction(rating, this);
                    //    done();
                    //}
                });
                starRating1.disable();

            } else {

                var theRating = (parseInt(data[i][2]) / 64) + 1;
                var rawRating=parseInt(data[i][2]);
                var textNote="";
                if (rawRating==193){
                    textNote=" (Follows)";
                }else if (rawRating==63){
                    textNote=" (Blocks)";
                }
                var starRating1 = raterJs({
                    starSize: 18,
                    rating: Math.round( theRating * 10) / 10,
                    element: document.querySelector("#trust" + san(data[i][0]) + san(data[i][3])),
                    disableText: rts(data[i][1])+' rates '+rts(data[i][4])+' as {rating}/{maxRating}'+textNote,
                    //rateCallback: function rateCallback(rating, done) {
                    //rateCallbackAction(rating, this);
                    //    done();
                    //}
                });
                starRating1.disable();

                var theRating2 = (parseInt(data[i][5]) / 64) + 1;
                var rawRating=parseInt(data[i][5]);
                var textNote2="";
                if (rawRating==193){
                    textNote2=" (Follows)";
                }else if (rawRating==63){
                    textNote2=" (Blocks)";
                }
                var starRating2 = raterJs({
                    starSize: 18,
                    rating: Math.round( theRating2 * 10) / 10,
                    element: document.querySelector("#trust" + san(data[i][3]) + san(data[i][6])),
                    disableText: rts(data[i][4])+' rates '+rts(data[i][7])+' as {rating}/{maxRating}'+textNote2,
                    //rateCallback: function rateCallback(rating, done) {
                    //rateCallbackAction(rating, this);
                    //    done();
                    //}
                });
                starRating2.disable();
            }

        }

    }, function (status) { //error detection....
        alert('Something went wrong.');
    });
}