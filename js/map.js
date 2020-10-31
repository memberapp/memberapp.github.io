"use strict";

var map = null;
var popup;
var postpopup;
var markersDict = {};
var firstload = true;
var mapTileProvider = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
var L=null;

async function getAndPopulateMap(geohash, posttrxid) {

    geohash = san(geohash);
    posttrxid = san(posttrxid);

    if (map == null) {

        if(!L){
            await loadScript("js/lib/leaflet/leaflet.js");
        }

        map = L.map('map', { attributionControl: false });

        //Use attribution control as a close button
        var att = L.control.attribution();
        att.setPrefix("");
        att.addAttribution(getMapCloseButtonHTML()).setPosition('topright').addTo(map);
        //Load locations onto map when bounds_changed event fires. Only want this to happen one time. 
        map.on('moveend', loadLocationListFromServerAndPlaceOnMap);

        //Set London location and open street map tiles
        map.setView([51.505, -0.09], 13);
        L.tileLayer(mapTileProvider, {}).addTo(map);

        //Attribution
        var att2 = L.control.attribution();
        att2.addAttribution(getOSMattributionHTML()).setPosition('bottomright').addTo(map);

        //Popup for thread related to location
        //popup = L.popup({ autoPan: true, minWidth: 550, maxWidth: getWidth(), maxHeight: getHeight() });
        popup = L.popup({ autoPan: true });
        postpopup = L.popup({ autoPan: true, minWidth: 300 });
    }
    if (geohash == null || geohash == "") {
        //Try to zoom to current position
        setTimeout(function () { navigator.geolocation.getCurrentPosition(function (location) { map.setView([location.coords.latitude, location.coords.longitude], 13); }); }, 1000);
    } else {
        var zoomLocation = decodeGeoHash(geohash);
        zoomLocation = [zoomLocation.latitude[0], zoomLocation.longitude[0]];
        setTimeout(function () {
            if (posttrxid != null && posttrxid != "") {
                popup.txid = posttrxid;
            }

            map.setView(zoomLocation, 15);

            if (posttrxid != null && posttrxid != "") {
                popup.setLatLng(zoomLocation).setContent(mapThreadLoadingHTML("")).openOn(map);
                getAndPopulateThread(posttrxid, posttrxid, 'mapthread');
            }

        }, 1000);
    }

    //post to map by clicking on it
    map.on('click', onMapClick);

    //map.on('moveend', onMapMove);
    map.on('moveend', function () {
        suspendPageReload=true;
        if (firstload && popup.txid != null) {
            location.href = "#map?geohash=" + encodeGeoHash(map.getCenter().lat, map.getCenter().lng) + "&post=" + popup.txid;
            firstload = false;
        }
        else if (popup.isOpen() && popup.txid != null) {
            location.href = "#map?geohash=" + encodeGeoHash(popup._latlng.lat, popup._latlng.lng) + "&post=" + popup.txid;
        } else {
            location.href = "#map?geohash=" + encodeGeoHash(map.getCenter().lat, map.getCenter().lng);
        }
        setTimeout(function () {suspendPageReload=false;},1000);
    });

    popup.on('close', function (e) {
        //This doesn't seem to fire.
        //Its purpose is to change the anchor link when the popup is closed
        console.log('map popup closed');
        popup.txid = null;
        map.moveend();
    });


}



function openOverlay(e) {
    var marker = e.sourceTarget;
    popup.setLatLng(e.latlng).setContent(mapThreadLoadingHTML(marker.previewHTML)).openOn(map);
    getAndPopulateThread(marker.roottxid, marker.txid, 'mapthread');
    popup.txid = marker.roottxid;
    popup.txidloc = e.latlng;
    suspendPageReload=true;
    location.href = "#map?geohash=" + encodeGeoHash(e.latlng.lat, e.latlng.lng) + "&post=" + popup.txid;
    setTimeout(function () {suspendPageReload=false;},1000);
    return;
}

function openPreview(e) {
    var marker = e.sourceTarget;
    marker.bindTooltip(marker.previewHTML).openTooltip();
    return;
}


function onMapClick(e) {

    var htmlContent = getMapPostHTML(e.latlng.lat, e.latlng.lng, (pubkey==''));

    postpopup.setLatLng(e.latlng).setContent(htmlContent).openOn(map);
}


function loadLocationListFromServerAndPlaceOnMap(event) {

    var mapBounds = map.getBounds();
    var theURL = dropdowns.contentserver + '?action=map&address=' + pubkey + "&north=" + mapBounds.getNorthEast().lat + "&east=" + mapBounds.getNorthEast().lng + "&south=" + mapBounds.getSouthWest().lat + "&west=" + mapBounds.getSouthWest().lng;
    getJSON(theURL).then(function (data) {
        var contents = "";
        for (var i = 0; i < data.length; i++) {
            var pageName = san(data[i].txid);
            var marker = markersDict[pageName];
            if (marker == null) {
                var marker = L.marker([Number(data[i].lat), Number(data[i].lon)]).addTo(map);
                marker.txid = san(data[i].txid);
                marker.roottxid = san(data[i].roottxid);
                marker.previewHTML = ds(data[i].message);
                markersDict[pageName] = marker;
                marker.on('click', openOverlay);
                marker.on('mouseover', openPreview);
            }
        }
    }, function (status) { //error detection....
        showErrorMessage(status, null, theURL);
    });
}

