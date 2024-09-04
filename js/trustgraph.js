"use strict";

function getAndPopulateTrustGraphPair(source, target) {

    var page = 'trustgraphdetails';
    //First clear old graph
    document.getElementById('trustgraph').innerHTML = trustgraphHTML;
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;


    let theURL = dropdowns.txbroadcastserver + 'trustgraph?source=' + source + '&qaddress=' + target;
    getJSON(theURL).then(async function (data) {

        let getUsers = '';
        for (let i = 0; i < data.length; i++) {
            if (data[i][2])
                getUsers = getUsers + ',' + data[i][2];
            if (data[i][6])
                getUsers = getUsers + ',' + data[i][6];
            if (data[i][10])
                getUsers = getUsers + ',' + data[i][10];
            if (data[i][14])
                getUsers = getUsers + ',' + data[i][14]; //three levels deep (x->1->2->t)    
            if (data[i][18])
                getUsers = getUsers + ',' + data[i][18]; //four levels deep (x->1->2->3->t)    
        }

        let theURL = dropdowns.contentserver + '?action=getusers&list=' + getUsers;

        let weighttotal = 0;
        let scoretotal = 0;
        for (let i = 0; i < data.length; i++) {
            weighttotal += data[i][0];
            scoretotal += data[i][0] * data[i][1];
        }
        let score = (scoretotal / weighttotal) * 2 + 3;





        getJSON(theURL).then(async function (dataUsers) {
            //data contains the users
            //display the users, the edges and links
            
            if(!data[0]){
                document.getElementById(page).innerHTML = getTrustPairHeading()+'No trust paths found. Try choosing more closely connected people.';
                return;
            }

            let targetid = data[0][data[0].length - 1];
            let sourceid = data[0][2];

            let ratee='';
            let rater='';
            for (var i = 0; i < dataUsers.length; i++) {
                if (dataUsers[i].address == targetid) {
                    ratee='@' + dataUsers[i].pagingid;
                    setPageTitleRaw(ratee);
                }
                if (dataUsers[i].address == sourceid) {
                    rater='@' + dataUsers[i].pagingid;
                }
                contentsHTML = getTrustPairHeading() + getTrustRatingTableHTML('', score.toFixed(1), rater, ratee,'');
                document.getElementById(page).innerHTML = contentsHTML;
            }

            if (!cytoscape) { await loadScript("js/lib/cytoscape3.19.patched.min.js"); }

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

            //var eles = cy.add([{ group: 'nodes', data: { id: data[0].target, label: data[0].targetname, textnote: data[0].targetname }, classes: 'bottom-center ', position: { x: 0, y: 0 } },]);
            //cy.add(eles);
            //cy.style().selector('#' + data[0].member).css({ 'background-image': getPicURL(data[0].memberpicurl, profilepicbase, data[0].member) });
            //cy.style().selector('#' + data[0].target).css({ 'background-image': getPicURL(data[0].targetpicurl, profilepicbase, data[0].target) });

            

            for (var i = 0; i < dataUsers.length; i++) {
                
                let directratingtext;
                for (let j = 0; j < data.length; j++) {
                    if (data[j][6]==dataUsers[i].address){
                        ratingcomment=data[j][4];
                        ratingscore=(data[j][3]*2+3).toFixed(1);
                        directratingtext=ratingcomment+' '+ratingscore+'/5.0';
                    }
   
                }

                var eles = cy.add([
                    //users
                    { group: 'nodes', data: { label: dataUsers[i].name, id: dataUsers[i].address, textnote: dataUsers[i].profile, textnote2: directratingtext }, classes: 'bottom-center' },
                    //{ group: 'edges', data: { id: data[i].inter +'line'+ data[i].target, source: data[i].inter, target: data[i].target, textnote: textNoteEdge } }
                    //var eles = cy.add([{ group: 'nodes', data: { id: data[0].target, label: data[0].targetname, textnote: data[0].targetname }, classes: 'bottom-center ', position: { x: 0, y: 0 } },]);


                ]);
                cy.add(eles);
                //background images
                cy.style().selector('#' + dataUsers[i].address).css({ 'background-image': getPicURL(dataUsers[i].picurl, profilepicbase, dataUsers[i].address) });
            }

            for (var i = 0; i < data.length; i++) {
                for (var j = data[i].length < 9 ? 2 : 6; data[i][j + 4]; j = j + 4) {
                    //edges
                    theRatingOutOfFive=' ('+((data[i][j + 1] * 2) + 3).toFixed(1)+'/5.0)';
                    var eles = cy.add([{ group: 'edges', data: { id: data[i][j] + 'line' + data[i][j + 4], source: data[i][j], target: data[i][j + 4], textnote: data[i][j + 2]+theRatingOutOfFive, txid: data[i][j + 3] } }]);
                    cy.add(eles);
                    //color of edges
                    let theRatingAbs = Math.abs(data[i][j + 1] * 2);
                    let linecolor = 'rgb(' + (214 - 98 * theRatingAbs) + ',' + (244 - 60 * theRatingAbs) + ',' + (255 - 35 * theRatingAbs) + ')';
                    if (data[i][j + 1] < 0) { linecolor = 'rgb(242,' + (228 - 92 * theRatingAbs) + ',' + (228 - 97 * theRatingAbs) + ')'; }
                    let theLine = cy.style().selector('#' + data[i][j] + 'line' + data[i][j + 4]);
                    theLine.css({ 'width': (4 + theRatingAbs * 8), 'line-color': linecolor, 'target-arrow-color': linecolor });
                }

                //color of halos
                let theRatingAbs = Math.abs(data[i][3] * 2);
                linecolor = 'rgb(' + (214 - 98 * theRatingAbs) + ',' + (244 - 60 * theRatingAbs) + ',' + (255 - 35 * theRatingAbs) + ')';
                //linecolor = 'rgb(' + (214 - 98 * theRatingAbs) + ',' + (255) + ',' + (155 - 35 * theRatingAbs) + ')';
                if (data[i][3] < 0) { linecolor = 'rgb(242,' + (228 - 92 * theRatingAbs) + ',' + (228 - 97 * theRatingAbs) + ')'; }
                cy.style().selector('#' + data[i][6]).css({ 'border-width': (4 + theRatingAbs * 4), 'border-color': linecolor });
            }


            let options = {
                name: 'cose',

                // Called on `layoutready`
                ready: function () { },

                // Called on `layoutstop`
                stop: function () { },

                // Whether to animate while running the layout
                // true : Animate continuously as the layout is running
                // false : Just show the end result
                // 'end' : Animate with the end result, from the initial positions to the end positions
                animate: true,

                // Easing of the animation for animate:'end'
                animationEasing: undefined,

                // The duration of the animation for animate:'end'
                animationDuration: undefined,

                // A function that determines whether the node should be animated
                // All nodes animated by default on animate enabled
                // Non-animated nodes are positioned immediately when the layout starts
                animateFilter: function (node, i) { return true; },


                // The layout animates only after this many milliseconds for animate:true
                // (prevents flashing on fast runs)
                animationThreshold: 250,

                // Number of iterations between consecutive screen positions update
                refresh: 20,

                // Whether to fit the network view after when done
                fit: true,

                // Padding on fit
                padding: 30,

                // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
                boundingBox: undefined,

                // Excludes the label when calculating node bounding boxes for the layout algorithm
                nodeDimensionsIncludeLabels: false,

                // Randomize the initial positions of the nodes (true) or use existing positions (false)
                randomize: false,

                // Extra spacing between components in non-compound graphs
                componentSpacing: 40,

                // Node repulsion (non overlapping) multiplier
                nodeRepulsion: function (node) { return 2048; },

                // Node repulsion (overlapping) multiplier
                nodeOverlap: 4,

                // Ideal edge (non nested) length
                idealEdgeLength: function (edge) { return 64; },

                // Divisor to compute edge forces
                edgeElasticity: function (edge) { return 64; },

                // Nesting factor (multiplier) to compute ideal edge length for nested edges
                nestingFactor: 1.2,

                // Gravity force (constant)
                gravity: 1,

                // Maximum number of iterations to perform
                numIter: 1000,

                // Initial temperature (maximum node displacement)
                initialTemp: 1000,

                // Cooling factor (how the temperature is reduced between consecutive iterations
                coolingFactor: 0.99,

                // Lower temperature threshold (below this point the layout will end)
                minTemp: 1.0
            };


            cy.userZoomingEnabled(false);



            let layout = cy.layout(options);
            layout.run();

            
            cy.center();
            cy.resize();
            cy.fit();

            cy.on('tap', 'node', function () {
                window.location.href = `#trustgraphpair?source=${source}&qaddress=` + this.data('id');
            });

            cy.on('mouseover', 'node', function (event) {
                document.getElementById('cynote').textContent = this.data('textnote');
                document.getElementById('cynote2').textContent = this.data('textnote2');
                
            });

            cy.on('mouseover', 'edge', function (event) {
                document.getElementById('cynote').textContent = this.data('textnote');
                document.getElementById('cynote2').textContent = '';
            });

            cy.on('tap', 'edge', function () {
                if (this.data('textnote'))
                    window.location.href = "#thread?root=" + this.data('txid');
            });

        })

    })

}

function getAndPopulateTrustGraph2(member, target) {

    var page = 'trustgraphdetails';
    //First clear old graph
    document.getElementById('trustgraph').innerHTML = trustgraphHTML;
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;


    let theURL = dropdowns.txbroadcastserver + 'trustgraph?address=' + member + '&qaddress=' + target;
    getJSON(theURL).then(async function (data) {

        let getUsers = '';
        for (let i = 0; i < data.length; i++) {
            if (data[i][2])
                getUsers = getUsers + ',' + data[i][2];
            if (data[i][6])
                getUsers = getUsers + ',' + data[i][6];
            if (data[i][10])
                getUsers = getUsers + ',' + data[i][10];
            if (data[i][14])
                getUsers = getUsers + ',' + data[i][14]; //three levels deep (x->1->2->t)    
            if (data[i][18])
                getUsers = getUsers + ',' + data[i][18]; //four levels deep (x->1->2->3->t)    
        }

        let theURL = dropdowns.contentserver + '?action=getusers&list=' + getUsers;

        let weighttotal = 0;
        let scoretotal = 0;
        for (let i = 0; i < data.length; i++) {
            weighttotal += data[i][0];
            scoretotal += data[i][0] * data[i][1];
        }
        let score = (scoretotal / weighttotal) * 2 + 3;





        getJSON(theURL).then(async function (dataUsers) {
            //data contains the users
            //display the users, the edges and links
            
            if(!data[0]){
                document.getElementById(page).innerHTML = 'No trust paths found. Try rating some more users that you trust.';
                return;
            }

            let targetid = data[0][data[0].length - 1];
            let sourceid = data[0][2];

            let ratee='';
            let rater='';
            for (var i = 0; i < dataUsers.length; i++) {
                if (dataUsers[i].address == targetid) {
                    ratee='@' + dataUsers[i].pagingid;
                    setPageTitleRaw(ratee);
                }
                if (dataUsers[i].address == sourceid) {
                    rater='@' + dataUsers[i].pagingid;
                }
                contentsHTML = getTrustRatingTableHTML('', score.toFixed(1), rater, ratee);
                document.getElementById(page).innerHTML = contentsHTML;
            }

            if (!cytoscape) { await loadScript("js/lib/cytoscape3.19.patched.min.js"); }

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

            //var eles = cy.add([{ group: 'nodes', data: { id: data[0].target, label: data[0].targetname, textnote: data[0].targetname }, classes: 'bottom-center ', position: { x: 0, y: 0 } },]);
            //cy.add(eles);
            //cy.style().selector('#' + data[0].member).css({ 'background-image': getPicURL(data[0].memberpicurl, profilepicbase, data[0].member) });
            //cy.style().selector('#' + data[0].target).css({ 'background-image': getPicURL(data[0].targetpicurl, profilepicbase, data[0].target) });

            

            for (var i = 0; i < dataUsers.length; i++) {
                
                let directratingtext;
                for (let j = 0; j < data.length; j++) {
                    if (data[j][6]==dataUsers[i].address){
                        ratingcomment=data[j][4];
                        ratingscore=(data[j][3]*2+3).toFixed(1);
                        directratingtext=ratingcomment+' '+ratingscore+'/5.0';
                    }
   
                }

                var eles = cy.add([
                    //users
                    { group: 'nodes', data: { label: dataUsers[i].name, id: dataUsers[i].address, textnote: dataUsers[i].profile, textnote2: directratingtext }, classes: 'bottom-center' },
                    //{ group: 'edges', data: { id: data[i].inter +'line'+ data[i].target, source: data[i].inter, target: data[i].target, textnote: textNoteEdge } }
                    //var eles = cy.add([{ group: 'nodes', data: { id: data[0].target, label: data[0].targetname, textnote: data[0].targetname }, classes: 'bottom-center ', position: { x: 0, y: 0 } },]);


                ]);
                cy.add(eles);
                //background images
                cy.style().selector('#' + dataUsers[i].address).css({ 'background-image': getPicURL(dataUsers[i].picurl, profilepicbase, dataUsers[i].address) });
            }

            for (var i = 0; i < data.length; i++) {
                for (var j = data[i].length < 9 ? 2 : 6; data[i][j + 4]; j = j + 4) {
                    //edges
                    theRatingOutOfFive=' ('+((data[i][j + 1] * 2) + 3).toFixed(1)+'/5.0)';
                    var eles = cy.add([{ group: 'edges', data: { id: data[i][j] + 'line' + data[i][j + 4], source: data[i][j], target: data[i][j + 4], textnote: data[i][j + 2]+theRatingOutOfFive, txid: data[i][j + 3] } }]);
                    cy.add(eles);
                    //color of edges
                    let theRatingAbs = Math.abs(data[i][j + 1] * 2);
                    let linecolor = 'rgb(' + (214 - 98 * theRatingAbs) + ',' + (244 - 60 * theRatingAbs) + ',' + (255 - 35 * theRatingAbs) + ')';
                    if (data[i][j + 1] < 0) { linecolor = 'rgb(242,' + (228 - 92 * theRatingAbs) + ',' + (228 - 97 * theRatingAbs) + ')'; }
                    let theLine = cy.style().selector('#' + data[i][j] + 'line' + data[i][j + 4]);
                    theLine.css({ 'width': (4 + theRatingAbs * 8), 'line-color': linecolor, 'target-arrow-color': linecolor });
                }

                //color of halos
                let theRatingAbs = Math.abs(data[i][3] * 2);
                linecolor = 'rgb(' + (214 - 98 * theRatingAbs) + ',' + (244 - 60 * theRatingAbs) + ',' + (255 - 35 * theRatingAbs) + ')';
                //linecolor = 'rgb(' + (214 - 98 * theRatingAbs) + ',' + (255) + ',' + (155 - 35 * theRatingAbs) + ')';
                if (data[i][3] < 0) { linecolor = 'rgb(242,' + (228 - 92 * theRatingAbs) + ',' + (228 - 97 * theRatingAbs) + ')'; }
                cy.style().selector('#' + data[i][6]).css({ 'border-width': (4 + theRatingAbs * 4), 'border-color': linecolor });
            }


            let options = {
                name: 'cose',

                // Called on `layoutready`
                ready: function () { },

                // Called on `layoutstop`
                stop: function () { },

                // Whether to animate while running the layout
                // true : Animate continuously as the layout is running
                // false : Just show the end result
                // 'end' : Animate with the end result, from the initial positions to the end positions
                animate: true,

                // Easing of the animation for animate:'end'
                animationEasing: undefined,

                // The duration of the animation for animate:'end'
                animationDuration: undefined,

                // A function that determines whether the node should be animated
                // All nodes animated by default on animate enabled
                // Non-animated nodes are positioned immediately when the layout starts
                animateFilter: function (node, i) { return true; },


                // The layout animates only after this many milliseconds for animate:true
                // (prevents flashing on fast runs)
                animationThreshold: 250,

                // Number of iterations between consecutive screen positions update
                refresh: 20,

                // Whether to fit the network view after when done
                fit: true,

                // Padding on fit
                padding: 30,

                // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
                boundingBox: undefined,

                // Excludes the label when calculating node bounding boxes for the layout algorithm
                nodeDimensionsIncludeLabels: false,

                // Randomize the initial positions of the nodes (true) or use existing positions (false)
                randomize: false,

                // Extra spacing between components in non-compound graphs
                componentSpacing: 40,

                // Node repulsion (non overlapping) multiplier
                nodeRepulsion: function (node) { return 2048; },

                // Node repulsion (overlapping) multiplier
                nodeOverlap: 4,

                // Ideal edge (non nested) length
                idealEdgeLength: function (edge) { return 64; },

                // Divisor to compute edge forces
                edgeElasticity: function (edge) { return 64; },

                // Nesting factor (multiplier) to compute ideal edge length for nested edges
                nestingFactor: 1.2,

                // Gravity force (constant)
                gravity: 1,

                // Maximum number of iterations to perform
                numIter: 1000,

                // Initial temperature (maximum node displacement)
                initialTemp: 1000,

                // Cooling factor (how the temperature is reduced between consecutive iterations
                coolingFactor: 0.99,

                // Lower temperature threshold (below this point the layout will end)
                minTemp: 1.0
            };


            cy.userZoomingEnabled(false);



            let layout = cy.layout(options);
            layout.run();

            /*var nodeToSelect = cy.getElementById(data[0][2]);
            nodeToSelect.position({ x: 335, y: 100 });
            let nodeToSelect = cy.getElementById(data[0][data[0].length-1]);
            nodeToSelect.position({ x: 0, y: 0 });*/


            /*
            //second layout run
            options = {
                name: 'cose',
              
                // Called on `layoutready`
                ready: function(){},
              
                // Called on `layoutstop`
                stop: function(){},
              
                // Whether to animate while running the layout
                // true : Animate continuously as the layout is running
                // false : Just show the end result
                // 'end' : Animate with the end result, from the initial positions to the end positions
                animate: true,
              
                // Easing of the animation for animate:'end'
                animationEasing: undefined,
              
                // The duration of the animation for animate:'end'
                animationDuration: undefined,
              
                // A function that determines whether the node should be animated
                // All nodes animated by default on animate enabled
                // Non-animated nodes are positioned immediately when the layout starts
                animateFilter: function ( node, i ){ return true; },
              
              
                // The layout animates only after this many milliseconds for animate:true
                // (prevents flashing on fast runs)
                animationThreshold: 250,
              
                // Number of iterations between consecutive screen positions update
                refresh: 20,
              
                // Whether to fit the network view after when done
                fit: true,
              
                // Padding on fit
                padding: 30,
              
                // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
                boundingBox: undefined,
              
                // Excludes the label when calculating node bounding boxes for the layout algorithm
                nodeDimensionsIncludeLabels: false,
              
                // Randomize the initial positions of the nodes (true) or use existing positions (false)
                randomize: false,
              
                // Extra spacing between components in non-compound graphs
                componentSpacing: 40,
              
                // Node repulsion (non overlapping) multiplier
                nodeRepulsion: function( node ){ return 2048; },
              
                // Node repulsion (overlapping) multiplier
                nodeOverlap: 4,
              
                // Ideal edge (non nested) length
                idealEdgeLength: function( edge ){ return 32; },
              
                // Divisor to compute edge forces
                edgeElasticity: function( edge ){ return 32; },
              
                // Nesting factor (multiplier) to compute ideal edge length for nested edges
                nestingFactor: 1.2,
              
                // Gravity force (constant)
                gravity: 1,
              
                // Maximum number of iterations to perform
                numIter: 1000,
              
                // Initial temperature (maximum node displacement)
                initialTemp: 1000,
              
                // Cooling factor (how the temperature is reduced between consecutive iterations
                coolingFactor: 0.99,
              
                // Lower temperature threshold (below this point the layout will end)
                minTemp: 1.0
              };

            layout = cy.layout(options);
            layout.run();
*/
            cy.center();
            cy.resize();
            cy.fit();

            /*
            cy.on('tap', 'node', function () {
                if (this.data('membertxid')) {
                    window.location.href = "#thread?root=" + this.data('membertxid');
                }
                //window.location.href = "#rep?qaddress=" + this.data('id');
                //must add txid of rating to db first before can enable this
            });*/

            cy.on('tap', 'node', function () {
                window.location.href = "#rep?qaddress=" + this.data('id');
            });

            cy.on('mouseover', 'node', function (event) {
                document.getElementById('cynote').textContent = this.data('textnote');
                document.getElementById('cynote2').textContent = this.data('textnote2');
                
            });

            cy.on('mouseover', 'edge', function (event) {
                document.getElementById('cynote').textContent = this.data('textnote');
                document.getElementById('cynote2').textContent = '';
            });

            cy.on('tap', 'edge', function () {
                if (this.data('textnote'))
                    window.location.href = "#thread?root=" + this.data('txid');
            });

        })

    })

}

function getAndPopulateTrustGraph(member, target) {

    var page = 'trustgraphdetails';
    //First clear old graph
    document.getElementById('trustgraph').innerHTML = trustgraphHTML;
    document.getElementById(page).innerHTML = document.getElementById("loading").innerHTML;


    let theURL = dropdowns.contentserver + '?action=trustgraph&address=' + member + '&qaddress=' + target;
    getJSON(theURL).then(async function (data) {

        if (data[0]) {
            setPageTitleRaw("@" + data[0].targetpagingid);
        } else {
            document.getElementById('trustgraphdetails').innerHTML = "No information on this right now.";
            return;
        }

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

        let warning=(pubkeyhex? "":"*You are not logged it, the trust graph is based on the ratings of @arjuna.");
        contentsHTML = getTrustRatingTableHTML(contentsHTML, overallRating.toFixed(1),warning);

        document.getElementById(page).innerHTML = contentsHTML;


        if (!cytoscape) { await loadScript("js/lib/cytoscape3.19.patched.min.js"); }

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
        cy.style().selector('#' + data[0].member).css({ 'background-image': getPicURL(data[0].memberpicurl, profilepicbase, data[0].member) });
        cy.style().selector('#' + data[0].target).css({ 'background-image': getPicURL(data[0].targetpicurl, profilepicbase, data[0].target) });


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
                { group: 'edges', data: { id: data[i].inter + 'line' + data[i].target, source: data[i].inter, target: data[i].target, textnote: textNoteEdge } }

            ]);
            cy.add(eles);

            cy.style().selector('#' + data[i].inter).css({ 'background-image': getPicURL(data[i].interpicurl, profilepicbase, data[i].inter) });

            let theRatingAbs = Math.abs(theRating2 - 3);
            let linecolor = 'rgb(' + (214 - 98 * theRatingAbs) + ',' + (244 - 60 * theRatingAbs) + ',' + (255 - 35 * theRatingAbs) + ')';
            if (theRating2 < 3) { linecolor = 'rgb(242,' + (228 - 92 * theRatingAbs) + ',' + (228 - 97 * theRatingAbs) + ')'; }
            let theLine = cy.style().selector('#' + data[i].inter + 'line' + data[i].target);
            theLine.css({ 'width': (4 + theRatingAbs * 8), 'line-color': linecolor, 'target-arrow-color': linecolor });

            theRatingAbs = Math.abs(theRating - 3);
            linecolor = 'rgb(' + (214 - 98 * theRatingAbs) + ',' + (244 - 60 * theRatingAbs) + ',' + (255 - 35 * theRatingAbs) + ')';
            if (theRating < 3) { linecolor = 'rgb(242,' + (228 - 92 * theRatingAbs) + ',' + (228 - 97 * theRatingAbs) + ')'; }
            cy.style().selector('#' + data[i].inter).css({ 'border-width': (4 + theRatingAbs * 4), 'border-color': linecolor });

            //'width': 12,
            //'line-color': '#61aff0',
            //'target-arrow-color': '#61aff0',

            //cy.data(data[i].inter,data[i].intername);
        }

        cy.userZoomingEnabled(false);
        cy.center();
        cy.fit();

        cy.on('tap', 'node', function () {
            if (this.data('membertxid')) {
                window.location.href = "#thread?root=" + this.data('membertxid');
            }
            //window.location.href = "#rep?qaddress=" + this.data('id');
            //must add txid of rating to db first before can enable this
        });

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

function getAndPopulateBesties(target) {

    var page = 'besties';
    //First clear old graph

    document.getElementById('besties').innerHTML = document.getElementById("loading").innerHTML;


    let theURL = dropdowns.contentserver + '?action=support&address=' + (pubkeyhex ? pubkeyhex.slice(0, 16) : '') + '&qaddress=' + target;
    getJSON(theURL).then(async function (data) {

        if (data[0]) {
            setPageTitleRaw("@" + data[0].pagingid);
        } else {
            document.getElementById('besties').innerHTML = "No information on this right now.";
            return;
        }

        document.getElementById('besties').innerHTML = bestiesHTML;
        if (!cytoscape) { await loadScript("js/lib/cytoscape3.19.patched.min.js"); }

        var cy = cytoscape({
            container: document.getElementById('bestiescy'),

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
                    'line-color': 'rgb(71,137,75)',
                    'target-arrow-color': 'rgb(71,137,75)'
                })
        }); // cy init

        var eles = cy.add([{ group: 'nodes', data: { id: data[0].address, label: data[0].name, textnote: data[0].name }, classes: 'bottom-center ', position: { x: 0, y: 0 } },]);
        cy.add(eles);
        cy.style().selector('#' + data[0].address).css({ 'background-image': getPicURL(data[0].picurl, profilepicbase, data[0].address), 'height': 160, 'width': 160, });


        var items = data.length;

        var max = Number(data[1].totalconnection);
        var min = Number(data[data.length - 1].totalconnection);
        var min = 0;
        var spread = max - min;

        for (var i = 1; i < items; i++) {


            var position = i;
            if (position % 2 == 1) {
                position = (position + 1) / 2;
            } else {
                position = items - (position / 2);
            }

            let distance = -250;
            var x = distance * Math.sin(2 * Math.PI * position / items);
            var y = distance * Math.cos(2 * Math.PI * position / items);

            //var theRating = outOfFive(data[i].memberrating);
            //var theRating2 = outOfFive(data[i].interrating);
            //var textNoteNode = data[i].membername + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].intername) + ' ' + theRating + '/5 (' + data[i].memberreason + ')';
            //var textNoteEdge = data[i].intername + ' ' + getSafeTranslation('rates', 'rates') + ' ' + rts(data[i].targetname) + ' ' + theRating2 + '/5 (' + data[i].interreason + ')';

            //let size=(Number(data[i].totalconnection)-min)/spread;

            let valreceived = (Number(data[i].weightedpointsfromreposts) * 5 + Number(data[i].likevaluereceivedonposts));
            let valgiven = (Number(data[i].weightedpointstoreposts) * 5 + Number(data[i].likevaluegiventoposts));

            /*
            let ratio;            
            let baseRatio=valgiven/valreceived;
            if(valgiven>valreceived){
                baseRatio=valgiven/valreceived;
            }else{
                baseRatio=valreceived/valgiven;
            }*/
            //ratio=Math.min(baseRatio,12);

            //let totalsupportgiven= (data[i].likevaluegiventoposts + data[i].likevaluegiventoreplies/5 + data[i].weightedpointstoreposts*5);
            //let totalsupportreceived= (data[i].likevaluereceivedonposts + data[i].likevaluereceivedonreplies/5 + data[i].weightedpointsfromreposts*5);

            let textNote1 = `Support Received:${(valreceived / 1000000).toFixed(0)}`;
            let textNote2 = `Support Given:${(valgiven / 1000000).toFixed(0)}`;
            //var eles = cy.add([{ group: 'nodes', data: { id: data[0].address+"-"+i, label: data[0].name, textnote: data[0].name }, classes: 'bottom-center ', position: { x: 0, y: i*100 } },]);
            //cy.add(eles);
            //cy.style().selector('#' + data[0].address+"-"+i).css({ 'background-image': getPicURL(data[0].picurl,profilepicbase,data[0].address) });


            var eles = cy.add([
                { group: 'nodes', data: { label: data[i].name, id: data[i].address, textnote: data[i].name }, classes: 'bottom-center', position: { x: x, y: y } },
                //{ group: 'nodes', data: { label: data[i].name, id: data[i].address+"-2", textnote: data[i].name }, classes: 'bottom-center', position: { x: 200, y: i*100 } },

                /*{ group: 'edges', data: { id: data[i].member+data[i].inter, source: data[i].member, target: data[i].inter }, classes: edgecolorsize1 },*/
                { group: 'edges', data: { id: data[i].address + "edge", source: data[i].address, target: data[0].address, textnote: textNote1 } },
                { group: 'edges', data: { id: data[i].address + "edge2", source: data[0].address, target: data[i].address, textnote: textNote2 } },
            ]);
            cy.add(eles);

            cy.style().selector('#' + data[i].address).css({ 'background-image': getPicURL(data[i].picurl, profilepicbase, data[i].address) });
            cy.style().selector('#' + data[i].address).css({ 'background-image': getPicURL(data[i].picurl, profilepicbase, data[i].address) });


            //let width=Math.min((8+size*12),24);
            //let styles={'width': (8+size*12), 'target-arrow-shape': 'none'};
            //if (ratio>=2){
            //    styles={'width': (8+size*12), 'target-arrow-shape': 'triangle'};
            //}
            //if(valgiven>valreceived){
            let sizeReceived = valgiven / data[1].totalconnection;
            let sizeGiven = valreceived / data[1].totalconnection;

            cy.style().selector('#' + data[i].address + "edge2").css({ 'width': Math.min((4 + sizeReceived * 24), 20) });
            cy.style().selector('#' + data[i].address + "edge").css({ 'width': Math.min((4 + sizeGiven * 24), 20) });
            //}else{
            //    cy.style().selector('#'+data[i].address+"edge").css(styles);
            //    cy.style().selector('#'+data[i].address+"edge2").css({'width': 0});    
            //}

            //let theRatingAbs=Math.abs(theRating2-3);
            //let linecolor='rgb('+(214-98*theRatingAbs)+','+(244-60*theRatingAbs)+','+(255-35*theRatingAbs)+')';
            //if(theRating2<3){linecolor='rgb(242,'+(228-92*theRatingAbs)+','+(228-97*theRatingAbs)+')';}
            //let lineWidth=((Number(data[i].likevaluereceivedonposts)+Number(data[i].likevaluereceivedonreplies)/5)*10-min)/spread;
            //let lineWidth2=((Number(data[i].likevaluegivenonposts)+Number(data[i].likevaluegivenonreplies)/5)*10-min)/spread;



            //cy.style().selector('#'+data[i].address+"edge").css({'width': (4+lineWidth), 'line-color':linecolor, 'target-arrow-color': linecolor});
            //cy.style().selector('#'+data[i].address+"edge").css({'width': (4+Math.abs(ratio)*5)});
            //cy.style().selector('#'+data[i].address+"edge2").css({'width': (4+lineWidth2)});

            //theRatingAbs=Math.abs(theRating-3);
            //linecolor='rgb('+(214-98*theRatingAbs)+','+(244-60*theRatingAbs)+','+(255-35*theRatingAbs)+')';
            //if(theRating<3){linecolor='rgb(242,'+(228-92*theRatingAbs)+','+(228-97*theRatingAbs)+')';}
            //cy.style().selector('#'+data[i].inter).css({'border-width': (4+theRatingAbs*4), 'border-color':linecolor});

        }

        cy.userZoomingEnabled(false);
        cy.center();
        cy.fit();

        cy.on('tap', 'node', function () {
            window.location.href = "#support?qaddress=" + this.data('id').split('-')[0];
        });

        cy.on('mouseover', 'node', function (event) {
            document.getElementById('cynote').textContent = this.data('textnote');
        });

        cy.on('mouseover', 'edge', function (event) {
            document.getElementById('cynote').textContent = this.data('textnote');
        });

        addDynamicHTMLElements();

    }, function (status) { //error detection....
        showErrorMessage(status, page, theURL);
    });

}



