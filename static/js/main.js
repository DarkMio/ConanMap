"use strict";



document.addEventListener('DOMContentLoaded', function() {

    var map_scale = function() {
        var min = [-1088, 130];
        var max = [-135, 1944];
        return {
            pixel: function(x, y) {

            },
            relative: function(x, y) {
                return [min[0] + (max[0] - min[0]) * (1 - x), min[1] + (max[1] - min[1]) * y];
            }
        };
    }();

    var IconFactory = L.Icon.extend({
        options: {
            iconUrl: 'static/img/default_marker.png',
            iconSize:     [35, 41],
            iconAnchor:   [17.5, 40],
            popupAnchor:  [0, -41]
        }
    });


    var map = L.map('mapid', { crs: L.CRS.Simple, minZoom: -1, maxZoom: 1, center: [0.0, 0.0]});

    // the map is 3627 x 1920 big - this means:
    // 1 px is 0.3 map units
    var bounds = [[0, 0], [640, 1209]];
    // var image = L.imageOverlay('static/tiles/__map.png', bounds).addTo(map);

    // map.fitBounds([[-1088, 130], [-135, 1944]]);

    L.tileLayer('static/tiles/{z}_{x}_{y}.png', {
        // attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        noWrap: true,
        minZoom: -1,
        maxZoom: 1,
        zoomOffset: 6,
        bounds: [[-135, 130], [-1088, 1944]]
    }).addTo(map);


    map.on('click', function(e) {
        console.log(e.latlng);
    });




    var jsonLoad = function(path, success, error) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (success) {
                        success(JSON.parse(xhr.responseText));
                    }
                } else {
                    if (error) {
                        error(xhr);
                    }
                }
            }
        };
        xhr.open("GET", path, true);
        xhr.send();
    };


    var defaultIcon = new IconFactory({iconUrl: 'static/img/default_marker.png'});
    var priestIcon = new IconFactory({iconUrl: 'static/img/priest_marker.png'});
    var dragonIcon = new IconFactory({iconUrl: 'static/img/dragon_marker.png'});
    var undeadIcon = new IconFactory({iconUrl: 'static/img/undead_marker.png'});
    var campIcon = new IconFactory({iconUrl: 'static/img/camp_marker.png'});

   jsonLoad('static/js/data.json', function(data) {
       for(var i = 0; i < data.length; i++) {
           var set = data[i];

           var iconType = defaultIcon;
           switch(set.type.toLowerCase()) {
               case "teacher":
                   iconType = priestIcon;
                   break;
               case "dragon":
                   iconType = dragonIcon;
                   break;
               case "undead":
                   iconType = undeadIcon;
                   break;
               case "camp":
                   iconType = campIcon;
                   break;
               default:
                   break;
           }

           var marker = L.marker(set.position, {icon: iconType}).addTo(map);
           if(set.description) {
               marker.bindPopup(set.description);
           }

       }
   });

    map.setView(map_scale.relative(0.5, 0.5), 0);



});