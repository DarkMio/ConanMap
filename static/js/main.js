"use strict";



document.addEventListener('DOMContentLoaded', function() {

    var map = L.map('mapid', { crs: L.CRS.Simple, minZoom: 0 });

    // the map is 3627 x 1920 big - this means:
    // 1 px is 0.3 map units
    var bounds = [[0, 0], [640, 1209]];
    var image = L.imageOverlay('static/tiles/__map.png', bounds).addTo(map);

    map.fitBounds(bounds);

    var greenIcon = L.icon({
        iconUrl: 'static/img/priest_marker_small.png',
        // shadowUrl: 'leaf-shadow.png',

        iconSize:     [35, 41], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   [17.5, 40], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [0, -41] // point from which the popup should open relative to the iconAnchor
    });

    L.marker([130.25, 655], {icon: greenIcon}).addTo(map).bindPopup("Teacher of Yog");
    L.marker([466.5, 767.5], {icon: greenIcon}).addTo(map).bindPopup("Teacher of Set");
    L.marker([403, 988], {icon: greenIcon}).addTo(map).bindPopup("Teacher of Mitra");



    map.on('click', function(e) {
        console.log(e.latlng);
    })

});