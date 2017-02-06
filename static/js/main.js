"use strict";



document.addEventListener('DOMContentLoaded', function() {
    var map_scale = function() {
        var min = [-1088, 130];
        var max = [-135, 1944];
        return {
            pixel: function(x, y) {

            },
            toRelative: function(x, y) {


                return [ 1 + ((min[0] - x) / (max[0] - min[0])), -((min[1] - y) / (max[1] - min[1]))];
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

    /**
     * Translates layer names to real names
     * @param name - Name of the layer
     * @returns {*} - Returns the english name of the layer, or the layer name if not found
     */
    var translator = function(name) {
        switch(name) {
            case "default":
                return "Default";
            case "enemy":
                return "Enemies";
            case "resource":
                return "Resources";
            case "friendly":
                return "Friendly NPCs";
            case "cave":
                return "Caves";
            case "camp":
                return "Encampments";
            default:
                return name;
        }
    };




    var map = L.map('map', { crs: L.CRS.Simple, minZoom: -1, maxZoom: 1, center: [0.0, 0.0]});

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


    // entire chunk for markers and their logic

    var defaultIcon = new IconFactory({iconUrl: 'static/img/default_marker.png'});
    var priestIcon = new IconFactory({iconUrl: 'static/img/priest_marker.png'});
    var dragonIcon = new IconFactory({iconUrl: 'static/img/dragon_marker.png'});
    var undeadIcon = new IconFactory({iconUrl: 'static/img/undead_marker.png'});
    var campIcon = new IconFactory({iconUrl: 'static/img/camp_marker.png'});

    var layers = {
        'default':  L.layerGroup(),
        'enemy':  L.layerGroup(),
        'camp':  L.layerGroup(),
        'resource':  L.layerGroup(),
        'friendly':  L.layerGroup(),

        'cave':  L.layerGroup()
    };

    var selector = document.getElementById("layerSelector");

    var keys = Object.keys(layers);


    var clickCallback =  function(key) {
        var enabled = true;

        return function(e) {
            e.preventDefault();
            if(enabled) {
                layers[key].remove();
            } else {
                layers[key].addTo(map);
            }
            enabled = !enabled;
        }
    };

    for(var i = 0; i < keys.length; i++){
        var key = keys[i];
        layers[key].addTo(map);
        if(key == 'default') {
            continue;
        }
        var node = document.createElement('a');
        node.setAttribute('href', '');
        node.setAttribute('class', 'mdl-navigation__link');
        node.addEventListener('click', clickCallback(key));
        node.innerText = translator(key);
        selector.appendChild(node);
    }



   jsonLoad('static/js/data.json', function(data) {
       for(var i = 0; i < data.length; i++) {
           var set = data[i];

           var iconType = defaultIcon;
           var selectLayer = "default";
           switch(set.type.toLowerCase()) {
               case "teacher":
                   iconType = priestIcon;
                   selectLayer = "friendly";
                   break;
               case "dragon":
                   iconType = dragonIcon;
                   selectLayer = "enemy";
                   break;
               case "undead":
                   iconType = undeadIcon;
                   selectLayer = "enemy";
                   break;
               case "camp":
                   iconType = campIcon;
                   selectLayer = "camp";
                   break;
               default:
                   break;
           }

           var marker = L.marker(set.position, {icon: iconType}).addTo(layers[selectLayer]);
           if(set.description) {
               marker.bindPopup(set.description);
           }
       }
   });

    map.setView(map_scale.relative(0.5, 0.5), 0);

    map.on('click', function(e) {
        console.log(e.latlng);
    });



    var dataPanel = document.getElementById('data_panel');
    dataPanel.addEventListener('click', function() {
        var isOpen = dataPanel.classList.contains('slide-in');
        dataPanel.setAttribute('class', isOpen ? 'click slide-out' : 'click slide-in');
    });

    var mouse_debug = document.getElementById('mouse_info');
    var tile_selector = document.getElementById('tile_info');
    map.on('mousemove', function(e) {
        var ll = e.latlng;
        mouse_debug.innerText = "mouse=[x=" + ll['lat'].toFixed(1) + ", y=" + ll['lng'].toFixed(1) + "] \n";
        var x = map_scale.toRelative(ll['lat'], ll['lng']);
        var clamp = function(_) { return Math.min(0.999, Math.max(0.0001, _))};
        x = [clamp(x[0]), clamp(x[1])];
        mouse_debug.innerText += "rel=[x=" + x[0].toFixed(2) + ", y=" + x[1].toFixed(2) + ']';
        tile_selector.innerText = String.fromCharCode(65 + parseInt(26 * x[1])) + (parseInt(14 * x[0]) + 1);

    });

});