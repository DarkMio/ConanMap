"use strict";



document.addEventListener('DOMContentLoaded', function() {

    var map_scale = function() {
        var min = [-1088, 130];
        var max = [-135, 1944];
        return function(x, y) {
            return [min[0] + (max[0] - min[0]) * (1 - x), min[1] + (max[1] - min[1]) * y];
        };
    }();




    var map = L.map('mapid', { crs: L.CRS.Simple, minZoom: -5 , center: [0.0, 0.0]});

    // the map is 3627 x 1920 big - this means:
    // 1 px is 0.3 map units
    var bounds = [[0, 0], [640, 1209]];
    // var image = L.imageOverlay('static/tiles/__map.png', bounds).addTo(map);

    map.fitBounds([[-1088, 130], [-135, 1944]]);

    L.tileLayer('static/tiles/{z}_{x}_{y}.png', {
        // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        noWrap: true,
        minZoom: -5,
        maxZoom: 7,
        zoomOffset: 6,
        bounds: [[-135, 130], [-1088, 1944]]
    }).addTo(map);

    map.setView(map_scale(0.5, 0.5), -1);

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


    L.marker([0, 0]).addTo(map);

    map.on('click', function(e) {
        console.log(e.latlng);
    });

    for(var i = 0; i < 1; i += 0.1) {
        L.marker(map_scale(i, i)).addTo(map);
    }

});