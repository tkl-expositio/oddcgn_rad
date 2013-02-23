// Datahandling App
        
var map, layer;
function init(){

navigator.geolocation.getCurrentPosition(successCallback,
                                           errorCallback,
                                          {maximumAge:600000});

function successCallback(position) {
          // By using the 'maximumAge' option above, the position
          // object is guaranteed to be at most 10 minutes old.
          map.setCenter(
            new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude).transform(
                new OpenLayers.Projection("EPSG:4326"),
                map.getProjectionObject()
            ), 15
            );
            console.log("LAT:" + position.coords.latitude +" LONG:" + position.coords.longitude);
}

function errorCallback(error) {
          // Update a div element with error.message.
        }

        map = new OpenLayers.Map( 'map');
        layer = new OpenLayers.Layer.OSM( "Simple OSM Map");
        map.addLayer(layer);
        // make_layer aus overpass_api -> alles nodes mit surface tag
        map.addLayers([
          make_layer("http://overpass-api.de/api/interpreter?data=[timeout:1];node[surface](bbox);out+skel;(way[surface](bbox);node(w););out+skel;", "green")])

    }

// OSM XML abrufen -> Nur Radwege in der bbox
function getNodes(bbox) {
    xmlUrl = "http://overpass-api.de/api/interpreter?data=way[highway=cycleway](50.995,6.995,51.005,7.005);out+meta;";
    var xmlData.load(xmlUrl);
    xmlDoc = $.parseXML(xmlData);
}

function senddata() {
  var surface;

  surface = $('#surface').val();
  

  return true;
}
