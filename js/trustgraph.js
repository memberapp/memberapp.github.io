"use strict";

function getAndPopulateTrustGraph(member, target) {

    var page = 'trustgraphdetails';
    //First clear old graph
    document.getElementById('trustgraph').innerHTML = trustgraphHTML;
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;


    var theURL = dropdowns.contentserver + '?action=trustgraph&address=' + member + '&qaddress=' + target;
    getJSON(theURL).then(async function (data) {


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
                //if ((i < 10 && Number(data[i].memberrating) > 190) || Number(data[i].memberrating) > 191) {
                oneRemoveRating += Number(data[i].interrating);
                oneRemoveRatingCount++;
                //}
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


        if (!cytoscape) { await loadScript("js/lib/cytoscape.min.js"); }

        var cy = cytoscape({
            container: document.getElementById('cy'),

            boxSelectionEnabled: false,
            autounselectify: true,


            style: cytoscape.stylesheet()
                .selector('node')
                .css({
                    'label': 'data(label)',
                    'height': 80,
                    'width': 80,
                    'background-fit': 'cover',
                    'border-color': '#000',
                    'border-width': 3,
                    'border-opacity': 0.75,
                    'text-margin-y': 5,
                    'color': '#999',
                })
                .selector('.bottom-center')
                .css({
                    "text-valign": "bottom",
                    "text-halign": "center"
                })
                .selector('.eater')
                .css({
                    'border-width': 9
                })
                .selector('edge')
                .css({
                    'curve-style': 'bezier',
                    'width': 6,
                    'target-arrow-shape': 'triangle',
                    'line-color': '#ffaaaa',
                    'target-arrow-color': '#ffaaaa'
                })
        }); // cy init

        var eles = cy.add([{ group: 'nodes', data: { id: data[0].target, label: data[0].targetname, textnote: data[0].targetname }, classes: 'bottom-center ', position: { x: 0, y: 0 } },]);
        cy.add(eles);
        cy.style().selector('#' + data[0].member).css({ 'background-image': getPicURL(data[0].memberpicurl,profilepicbase,data[0].member) });
        cy.style().selector('#' + data[0].target).css({ 'background-image': getPicURL(data[0].targetpicurl,profilepicbase,data[0].target) });


        var items = data.length;
        for (var i = 0; i < items; i++) {

            var position = i;
            if (i % 2 == 1) {
                position = (i + 1) / 2;
            } else {
                position = items - (i / 2);
            }

            var x = -250 * Math.sin(2 * Math.PI * position / items);
            var y = -250 * Math.cos(2 * Math.PI * position / items);

            var theRating = outOfFive(data[i].memberrating);
            var theRating2 = outOfFive(data[i].interrating);

            var textNoteNode = data[i].membername + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].intername) + ' ' + theRating + '/5 (' + data[i].memberreason + ')';
            var textNoteEdge = data[i].intername + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].targetname) + ' ' + theRating2 + '/5 (' + data[i].interreason + ')';


            var eles = cy.add([


                { group: 'nodes', data: { label: data[i].intername, id: data[i].inter, textnote: textNoteNode }, classes: 'bottom-center', position: { x: x, y: y } },
                /*{ group: 'edges', data: { id: data[i].member+data[i].inter, source: data[i].member, target: data[i].inter }, classes: edgecolorsize1 },*/
                { group: 'edges', data: { id: data[i].inter + data[i].target, source: data[i].inter, target: data[i].target, textnote: textNoteEdge } }

            ]);
            cy.add(eles);

            cy.style().selector('#' + data[i].inter).css({ 'background-image': getPicURL(data[i].interpicurl,profilepicbase,data[i].inter) });

            let theRatingAbs=Math.abs(theRating2-3);
            let linecolor='rgb('+(214-98*theRatingAbs)+','+(244-60*theRatingAbs)+','+(255-35*theRatingAbs)+')';
            if(theRating2<3){linecolor='rgb(242,'+(228-92*theRatingAbs)+','+(228-97*theRatingAbs)+')';}
            cy.style().selector('#'+data[i].inter+data[i].target).css({'width': (4+theRatingAbs*8), 'line-color':linecolor, 'target-arrow-color': linecolor});

            theRatingAbs=Math.abs(theRating-3);
            linecolor='rgb('+(214-98*theRatingAbs)+','+(244-60*theRatingAbs)+','+(255-35*theRatingAbs)+')';
            if(theRating<3){linecolor='rgb(242,'+(228-92*theRatingAbs)+','+(228-97*theRatingAbs)+')';}
            cy.style().selector('#'+data[i].inter).css({'border-width': (4+theRatingAbs*4), 'border-color':linecolor});
            
            //'width': 12,
            //'line-color': '#61aff0',
            //'target-arrow-color': '#61aff0',

            //cy.data(data[i].inter,data[i].intername);
        }

        cy.userZoomingEnabled(false);
        cy.center();
        cy.fit();

        cy.on('tap', 'node', function () {
            window.location.href = "#rep?qaddress=" + this.data('id');
        });

        cy.on('mouseover', 'node', function (event) {
            document.getElementById('cynote').textContent = this.data('textnote');
        });

        cy.on('mouseover', 'edge', function (event) {
            document.getElementById('cynote').textContent = this.data('textnote');
        });


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
                var theRating = (rawRating / 64) + 1;
                var starRating1 = raterJs({
                    starSize: 24,
                    rating: Math.round(theRating * 10) / 10,
                    element: document.querySelector("#trust" + san(data[i].member) + san(data[i].target)),
                    disableText: rts(data[i].membername) + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].targetname) + ' {rating}/{maxRating}' + textNote,
                });
                starRating1.disable();

            } else {

                var theRating = (Number(data[i].memberrating) / 64) + 1;
                var rawRating = Number(data[i].memberrating);
                var textNote = "";
                textNote = data[i].memberreason;
                var starRating1 = raterJs({
                    starSize: 18,
                    rating: Math.round(theRating * 10) / 10,
                    element: document.querySelector("#trust" + san(data[i].member) + san(data[i].inter)),
                    disableText: rts(data[i].membername) + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].intername) + ' {rating}/{maxRating} (' + textNote + ')',
                });
                starRating1.disable();

                var theRating2 = (Number(data[i].interrating) / 64) + 1;
                var rawRating = Number(data[i].interrating);
                var textNote2 = "";
                textNote2 = data[i].interreason;

                var starRating2 = raterJs({
                    starSize: 18,
                    rating: Math.round(theRating2 * 10) / 10,
                    element: document.querySelector("#trust" + san(data[i].inter) + san(data[i].target)),
                    disableText: rts(data[i].intername) + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].targetname) + ' {rating}/{maxRating} (' + textNote2 + ')',
                });
                starRating2.disable();
            }

        }

        addDynamicHTMLElements();

    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });
}