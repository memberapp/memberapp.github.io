var map = null;
var popup;
var postpopup;
var markersDict = {};

function getAndPopulateMap() {

    if (map != null) return;

    map = L.map('map', { attributionControl: false });

    //Use attribution control as a close button
    var att = L.control.attribution();
    att.setPrefix("");
    att.addAttribution('<font size="+3"><a href="#" onclick="hideMap();">X</a></font>').setPosition('topright').addTo(map);

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

    //Try to zoom to current position
    setTimeout(function () { navigator.geolocation.getCurrentPosition(function (location) { map.setView([location.coords.latitude, location.coords.longitude], 13); }); }, 1000);

    //post to map by clicking on it
    map.on('click', onMapClick);
}



function openOverlay(e) {
    var marker = e.sourceTarget;
    popup.setLatLng(e.latlng).setContent("<div id='mapthread'>Loading..." + ds(marker.preview) + "</div>").openOn(map);
    getAndPopulateThread(marker.roottxid, marker.txid, 'mapthread');
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
                    <textarea id="newgeopostta" maxlength="200" name="text" rows="4" cols="30"></textarea>
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
