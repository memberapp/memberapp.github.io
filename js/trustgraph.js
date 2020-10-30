"use strict";

function getAndPopulateTrustGraph(member, target) {

    var page = 'trustgraphdetails';
    //First clear old graph
    document.getElementById('trustgraph').innerHTML = trustgraphHTML;
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;


    var theURL = dropdowns.contentserver + '?action=trustgraph&address=' + member + '&qaddress=' + target;
    getJSON(theURL).then(function (data) {


        var directrating = 0.0;
        var oneRemoveRating = 0.0;
        var oneRemoveRatingCount = 0.0;
        var overallRating = 0.0;


        var contentsHTML = "";

        for (var i = 0; i < data.length; i++) {
            if (i == 0 && data[i].inter == '') {
                //Direct Rating
                contentsHTML += getDirectRatingHTML(data[i]);
                directrating = Number(data[i].memberrating);
            } else {
                contentsHTML += getIndirectRatingHTML(data[i]);
                //Try to get at least 10 ratings, or all the ratings if they are not follow based ratings 
                if ((i < 10 && Number(data[i].memberrating) > 190) || Number(data[i].memberrating) > 191) {
                    oneRemoveRating += Number(data[i].interrating);
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

        if (oneRemoveRatingCount == 0) {
            overallRating = 0;
        }

        contentsHTML = getTrustRatingTableHTML(contentsHTML, overallRating.toFixed(1));

        document.getElementById(page).innerHTML = contentsHTML;


        var overallStarRating = raterJs({
            starSize: 48,
            rating: Math.round(overallRating * 10) / 10,
            element: document.querySelector("#overall"),
            //rateCallback: function rateCallback(rating, done) {
            //rateCallbackAction(rating, this);
            //    done();
            //}
        });
        overallStarRating.disable();

        for (var i = 0; i < data.length; i++) {
            if (i == 0 && data[i].inter == '') {
                var rawRating = Number(data[i].memberrating);
                var textNote = "";
                if (rawRating == 191) {
                    textNote = " (Follows)";
                } else if (rawRating == 63) {
                    textNote = " (Blocks)";
                }
                var theRating = (rawRating / 64) + 1;
                var starRating1 = raterJs({
                    starSize: 24,
                    rating: Math.round(theRating * 10) / 10,
                    element: document.querySelector("#trust" + san(data[i].member) + san(data[i].target)),
                    disableText: rts(data[i].membername) + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].targetname) + ' {rating}/{maxRating}' + textNote,
                    //rateCallback: function rateCallback(rating, done) {
                    //rateCallbackAction(rating, this);
                    //    done();
                    //}
                });
                starRating1.disable();

            } else {

                var theRating = (Number(data[i].memberrating) / 64) + 1;
                var rawRating = Number(data[i].memberrating);
                var textNote = "";
                if (rawRating == 191) {
                    textNote = " (Follows)";
                } else if (rawRating == 63) {
                    textNote = " (Blocks)";
                }
                var starRating1 = raterJs({
                    starSize: 18,
                    rating: Math.round(theRating * 10) / 10,
                    element: document.querySelector("#trust" + san(data[i].member) + san(data[i].inter)),
                    disableText: rts(data[i].membername) + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].intername) + ' {rating}/{maxRating}' + textNote,
                    //rateCallback: function rateCallback(rating, done) {
                    //rateCallbackAction(rating, this);
                    //    done();
                    //}
                });
                starRating1.disable();

                var theRating2 = (Number(data[i].interrating) / 64) + 1;
                var rawRating = Number(data[i].interrating);
                var textNote2 = "";
                if (rawRating == 191) {
                    textNote2 = " (Follows)";
                } else if (rawRating == 63) {
                    textNote2 = " (Blocks)";
                }
                var starRating2 = raterJs({
                    starSize: 18,
                    rating: Math.round(theRating2 * 10) / 10,
                    element: document.querySelector("#trust" + san(data[i].inter) + san(data[i].target)),
                    disableText: rts(data[i].intername) + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].targetname) + ' {rating}/{maxRating}' + textNote2,
                    //rateCallback: function rateCallback(rating, done) {
                    //rateCallbackAction(rating, this);
                    //    done();
                    //}
                });
                starRating2.disable();
            }

        }

        addDynamicHTMLElements();

    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}