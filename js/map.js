var map = null;
var markersDict = {};
function getAndPopulateMap() {

    if (map!=null)return;
    var latlng = new google.maps.LatLng(37.8693891,-122.25931);
    //var latlng = new google.maps.LatLng(0, 0);
    var myOptions = {
    };

    var element = document.getElementById("map");

    //OSM maps API initialisation
    map = new google.maps.Map(element, {
        zoom: 10,
        center: latlng,
        mapTypeId: "OSM",
        //mapTypeControl: false,
        streetViewControl: false,
        scaleControl: false,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        }
    });

    //Define OSM map type pointing at the OpenStreetMap tile server
    map.mapTypes.set("OSM", new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            // "Wrap" x (logitude) at 180th meridian properly
            // NB: Don't touch coord.x because coord param is by reference, and changing its x property breakes something in Google's lib 
            var tilesPerGlobe = 1 << zoom;
            var x = coord.x % tilesPerGlobe;
            if (x < 0) {
                x = tilesPerGlobe + x;
            }
            // Wrap y (latitude) in a like manner if you want to enable vertical infinite scroll

            return "https://tile.openstreetmap.org/" + zoom + "/" + x + "/" + coord.y + ".png";
        },
        tileSize: new google.maps.Size(256, 256),
        name: "OpenStreetMap",
        maxZoom: 21
    }));

    setTimeout(function(){ navigator.geolocation.getCurrentPosition(function(location) {
        map.setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));
      }); }, 3000);

    
    
    //Load locations onto map when bounds_changed event fires. Only want this to happen one time. 
    google.maps.event.addListener(map, 'idle', loadLocationListFromServerAndPlaceOnMap);


    

    postMessageHereMarker = new google.maps.Marker({ position: latlng, map: map, title: "Post Message Here",icon: {
        path: google.maps.SymbolPath.CIRCLE,
        strokeColor: "blue",
        scale: 6
    }, });
    google.maps.event.addListener(postMessageHereMarker, 'click', postMessageHere());

    popupOverlay = new Window({ className: "bluelighting", title: "Member", opacity: 1, top: 0, right: 0, width: (Math.min(600, getWidth() - 24)), height: getHeight() - 60, maxHeight: getHeight() - 60, destroyOnClose: false, recenterAuto: false });
}

var postMessageHereMarker;


function loadLocationListFromServerAndPlaceOnMap(event) {
    var mapBounds = map.getBounds();
    postMessageHereMarker.setPosition(map.getCenter());
    setCoordsInNewGeoPost(map.getCenter());

    var url = server + '?action=map&address=' + pubkey + "&north=" + mapBounds.getNorthEast().lat() + "&east=" + mapBounds.getNorthEast().lng() + "&south=" + mapBounds.getSouthWest().lat() + "&west=" + mapBounds.getSouthWest().lng();
    getJSON(url).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            var pageName = data[i].txid;
            var marker = markersDict[pageName];
            if (marker == null) {
                var marker = new google.maps.Marker({ position: new google.maps.LatLng(data[i].lat, data[i].lon), map: map, title: data[i].message });
                markersDict[pageName] = marker;
                google.maps.event.addListener(marker, 'click', openOverlay(data[i].roottxid, data[i].txid));
            }
        }
    }, function (status) { //error detection....
        alert('Something went wrong.');
    });

}

var popupOverlay;
var openOverlay = function (roottxid, txid) {
    return function () {
        popupOverlay.setHTMLContent("<div id='mapthread'></div>");
        getAndPopulateThread(roottxid, txid, 'mapthread');
        popupOverlay.show();
        return;
    }
}

var postMessageHere = function () {
    return function () {
        var loginhtml="";
        if(!checkForPrivKey()){
            loginhtml=`<a id="loginbutton" class="btn" href="#login" onclick="showLogin();">login</a>`;
        }
        popupOverlay.setHTMLContent(`<div id="newgeopost" class="bgcolor">
        <table class="table left">
            <tbody>
                <tr>
                    <td></td>
                    <td>lat:<input id="lat" size="10" disabled></td>
                    <td>long:<input id="lon" size="10" disabled></td>
                    <td>geohash:<input id="geohash" size="15" disabled></td>
                </tr>
                <tr>
                    <td>text</td>
                    <td colspan="3">
                        <textarea id="newgeopostta" maxlength="200" name="text" rows="4" cols="50"></textarea>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <input id="newgeopostbutton" value="post" type="submit" onclick="geopost();">
                    </td>
                    <td></td>
                    <td>`+loginhtml+`</td>
                </tr>
                <tr style="height:20px"></tr>
            </tbody>
        </table>
    </div>`);
        setCoordsInNewGeoPost(map.getCenter());
        popupOverlay.show();
        return;
    }
}

function setCoordsInNewGeoPost(coords){
    var lat=document.getElementById("lat");
    if(lat!=undefined){
        lat.value=coords.lat();
    }
    var lon=document.getElementById("lon");
    if(lon!=undefined){
        lon.value=coords.lng();
    }
    var geohash=document.getElementById("geohash");
    if(geohash!=undefined){
        geohash.value=encodeGeoHash(coords.lat(),coords.lng());
    }
}

