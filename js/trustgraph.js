

function getAndPopulateTrustGraph(member, target) {




    getJSON(graphserver + '?action=trustgraph&member=' + member + '&target=' + target).then(function (data) {


        var directrating = 0.0;
        var oneRemoveRating = 0.0;
        var oneRemoveRatingCount = 0.0;
        var overallRating = 0.0;

        var contents = "<div id='overall'></div><br/><br/>";
        contents += "<table>";
        for (var i = 0; i < data.length; i++) {
            contents += "<tr>";

            if (i == 0 && data[i][3] == '') {
                //Direct Rating
                contents += "<td>" + getMemberLink(data[i][0], data[i][1]) + "</td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td><td></td><td></td><td align='center'> <div id='trust" + ds(data[i][0]) + ds(data[i][6]) + "'></div>  </td><td></td><td></td>" + "<td align='center'><img height='24' width='24' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data[i][6], data[i][7]) + "</td>";
                directrating = parseInt(data[i][2]);
            } else {
                contents += "<td>" + getMemberLink(data[i][0], data[i][1]) + "</td>" + "<td><img height='16' width='16' src='img/rightarrow.png'/></td><td> <div id='trust" + ds(data[i][0]) + ds(data[i][3]) + "'></div> </td><td><img height='16' width='16' src='img/rightarrow.png'/></td>" + "<td align='center'>" + getMemberLink(data[i][3], data[i][4]) + "</td>" + `<td><img height='16' width='16' src='img/rightarrow.png'/></td><td> <div id='trust` + ds(data[i][3]) + ds(data[i][6]) + "'> </div> </td><td><img height='16' width='16' src='img/rightarrow.png'/></td>" + "<td>" + getMemberLink(data[i][6], data[i][7]) + "</td>";
                if (i < 6) {
                    oneRemoveRating += Math.min(parseInt(data[i][2]), parseInt(data[i][5]));
                    oneRemoveRatingCount++;
                }
            }
            contents += "</tr>";

        }
        contents += "</table>";
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
        contents = "<span style='font-size:2em'>Overall Rating:" + overallRating.toFixed(1) + "/5.0</span> " + contents;
        document.getElementById('trustgraphdetails').innerHTML = contents;


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
                var theRating = (parseInt(data[i][2]) / 64) + 1;
                var starRating1 = raterJs({
                    starSize: 24,
                    rating: Math.round( theRating * 10) / 10,
                    element: document.querySelector("#trust" + ds(data[i][0]) + ds(data[i][6])),
                    disableText: ds(data[i][1])+' rates '+ds(data[i][7])+' as {rating}/{maxRating}',
                    //rateCallback: function rateCallback(rating, done) {
                    //rateCallbackAction(rating, this);
                    //    done();
                    //}
                });
                starRating1.disable();

            } else {

                var theRating = (parseInt(data[i][2]) / 64) + 1;
                var starRating1 = raterJs({
                    starSize: 18,
                    rating: Math.round( theRating * 10) / 10,
                    element: document.querySelector("#trust" + ds(data[i][0]) + ds(data[i][3])),
                    disableText: ds(data[i][1])+' rates '+ds(data[i][4])+' as {rating}/{maxRating}',
                    //rateCallback: function rateCallback(rating, done) {
                    //rateCallbackAction(rating, this);
                    //    done();
                    //}
                });
                starRating1.disable();

                var theRating2 = (parseInt(data[i][5]) / 64) + 1;
                var starRating2 = raterJs({
                    starSize: 18,
                    rating: Math.round( theRating2 * 10) / 10,
                    element: document.querySelector("#trust" + ds(data[i][3]) + ds(data[i][6])),
                    disableText: ds(data[i][4])+' rates '+ds(data[i][7])+' as {rating}/{maxRating}',
                    //rateCallback: function rateCallback(rating, done) {
                    //rateCallbackAction(rating, this);
                    //    done();
                    //}
                });
                starRating2.disable();
            }

        }

        /* var node={ data: { id:data[i][3],name:data[i][4], weight: 100, faveColor: '#6FB1FC', faveShape: 'triangle' } };
         nodes.push(node);
         var edge={ data: { source: data[i][0], target: data[i][3], faveColor: '#6FB1FC', strength: data[i][2]/2.5 } };
         edges.push(edge);
         var edge2={ data: { source: data[i][3], target: data[i][6], faveColor: '#6FB1FC', strength: data[i][5]/2.5 } };
         edges.push(edge2);
         contents+="<tr>";
            
     */

        /*var nodes=[];
        var edges=[];
        var member= { data: { id:data[0][0],name:data[0][1], weight: 300, faveColor: '#6FB1FC', faveShape: 'triangle' } };
        
        nodes.push(member);
        for (var i = 0; i < data.length; i++) {
            var node={ data: { id:data[i][3],name:data[i][4], weight: 100, faveColor: '#6FB1FC', faveShape: 'triangle' } };
            nodes.push(node);
            var edge={ data: { source: data[i][0], target: data[i][3], faveColor: '#6FB1FC', strength: data[i][2]/2.5 } };
            edges.push(edge);
            var edge2={ data: { source: data[i][3], target: data[i][6], faveColor: '#6FB1FC', strength: data[i][5]/2.5 } };
            edges.push(edge2);
            
        }
        var target= {data: { id:data[0][6],name:data[0][7], weight: 100, faveColor: '#6FB1FC', faveShape: 'triangle' } };
        nodes.push(target);
        */
        /*
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
                
        }*/



    }, function (status) { //error detection....
        alert('Something went wrong.');
    });
}