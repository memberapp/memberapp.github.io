"use strict";

var map = null;
var popup;
var postpopup;
var markersDict = {};
var firstload=true;

function getAndPopulateMap(geohash,posttrxid) {

    if (map != null) return;

    map = L.map('map', { attributionControl: false });

    //Use attribution control as a close button
    var att = L.control.attribution();
    att.setPrefix("");
    att.addAttribution(`<font size="+3"><a href="#posts?type=top&amp;start=0&amp;limit=25" onclick="hideMap();showPosts(0,25,'top');">X</a></font>`).setPosition('topright').addTo(map);
    //Load locations onto map when bounds_changed event fires. Only want this to happen one time. 
    map.on('moveend', loadLocationListFromServerAndPlaceOnMap);

    //Set London location and open street map tiles
    map.setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

    //Attribution
    var att2 = L.control.attribution();
    att2.addAttribution('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.').setPosition('bottomright').addTo(map);

    //Popup for thread related to location
    //popup = L.popup({ autoPan: true, minWidth: 550, maxWidth: getWidth(), maxHeight: getHeight() });
    popup = L.popup({ autoPan: true });
    postpopup = L.popup({ autoPan: true });

    if(geohash==null || geohash==""){
        //Try to zoom to current position
        setTimeout(function () { navigator.geolocation.getCurrentPosition(function (location) { map.setView([location.coords.latitude, location.coords.longitude], 13); }); }, 1000);
    }else{
        var zoomLocation=decodeGeoHash(geohash);
        zoomLocation=[zoomLocation.latitude[0], zoomLocation.longitude[0]];
        setTimeout(function () {
            if(posttrxid!=null && posttrxid!=""){
                popup.txid=posttrxid;                
            }

            map.setView(zoomLocation, 13); 

            if(posttrxid!=null && posttrxid!=""){
                popup.setLatLng(zoomLocation).setContent("<div id='mapthread'>Loading...</div>").openOn(map);
                getAndPopulateThread(posttrxid, posttrxid, 'mapthread');
            }
            
        }, 1000);
    }

    //post to map by clicking on it
    map.on('click', onMapClick);

    //map.on('moveend', onMapMove);
    map.on('moveend', function () {
        if(firstload && popup.txid!=null){
            location.href="#map?geohash="+encodeGeoHash(map.getCenter().lat,map.getCenter().lng)+"&post="+popup.txid;
            firstload=false;
        }
        else if(popup.isOpen() && popup.txid!=null){
            location.href="#map?geohash="+encodeGeoHash(popup._latlng.lat,popup._latlng.lng)+"&post="+popup.txid;
        }else{
            location.href="#map?geohash="+encodeGeoHash(map.getCenter().lat,map.getCenter().lng);
        }
    });

    popup.on('close',function (e) {
        //This doesn't seem to fire.
        //Its purpose is to change the anchor link when the popup is closed
        popup.txid=null;
        map.moveend();
    });


}



function openOverlay(e) {
    var marker = e.sourceTarget;
    popup.setLatLng(e.latlng).setContent("<div id='mapthread'>Loading..." + ds(marker.preview) + "</div>").openOn(map);
    getAndPopulateThread(marker.roottxid, marker.txid, 'mapthread');
    popup.txid=marker.roottxid;
    popup.txidloc=e.latlng;
    location.href="#map?geohash="+encodeGeoHash(e.latlng.lat,e.latlng.lng)+"&post="+popup.txid;
    return;
}

function openPreview(e) {
    var marker = e.sourceTarget;
    marker.bindTooltip(ds(marker.preview)).openTooltip();
    return;
}


function onMapClick(e) {

    var loginhtml = "";
    var htmlContent = `<div id="newgeopost" class="bgcolor">
    <table class="table left">
        <tbody>
            <tr>
                <td><input id="lat" size="10" type="hidden" value="`+ e.latlng.lat + `"></td>
                <td><input id="lon" size="10" type="hidden" value="`+ e.latlng.lng + `"></td>
                <td><input id="geohash" size="15" type="hidden"></td>
            </tr>
            <tr>
                <td colspan="3">
                    <textarea id="newgeopostta" maxlength="217" name="text" rows="4" cols="30"></textarea>
                </td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>
                    <input id="newgeopostbutton" value="post" type="submit" onclick="geopost();">
                </td>
                <td></td>
                <td>`+ loginhtml + `</td>
            </tr>
            <tr style="height:20px"></tr>
        </tbody>
    </table>
</div>`;
    postpopup.setLatLng(e.latlng).setContent(htmlContent).openOn(map);
}


function loadLocationListFromServerAndPlaceOnMap(event) {

    var mapBounds = map.getBounds();
    var url = server + '?action=map&address=' + pubkey + "&north=" + mapBounds.getNorthEast().lat + "&east=" + mapBounds.getNorthEast().lng + "&south=" + mapBounds.getSouthWest().lat + "&west=" + mapBounds.getSouthWest().lng;
    getJSON(url).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            var pageName = data[i].txid;
            var marker = markersDict[pageName];
            if (marker == null) {
                var marker = L.marker([data[i].lat, data[i].lon]).addTo(map);
                marker.txid = data[i].txid;
                marker.roottxid = data[i].roottxid;
                marker.preview = data[i].message;
                markersDict[pageName] = marker;
                marker.on('click', openOverlay);
                marker.on('mouseover', openPreview);
            }
        }
    }, function (status) { //error detection....
        alert('Something went wrong.');
    });

}
