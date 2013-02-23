// Datahandling App
        
var map, layer;
function init(){
 var LON = 0,
     LAT= 0;




    function successCallback(position) {
              // By using the 'maximumAge' option above, the position
              // object is guaranteed to be at most 10 minutes old.
              map.setCenter(
                new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude).transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    map.getProjectionObject()
                ), 15
                );

                LON = parseFloat(position.coords.longitude);
                LAT = parseFloat(position.coords.latitude);
                console.log("LAT:" + position.coords.latitude +" LONG:" + position.coords.longitude);

                // Grenzen für die Karte (wie unten bei getNodes())
                var extent = new OpenLayers.Bounds((LON - 0.0005), (LAT - 0.0005), (LON + 0.0005), (LAT + 0.0005));
                extent.transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        map.getProjectionObject()
                )
                // Verschieben der Karte verhindern
                map.setOptions({restrictedExtent: extent})
                // Karten auf die Grenzen zoomen
                map.zoomToExtent(extent);

                    var lonLat = new OpenLayers.LonLat( LON , LAT )
                                .transform(
                                  new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                                  map.getProjectionObject() // to Spherical Mercator Projection
                                );

                    var markers = new OpenLayers.Layer.Markers( "Markers" );
                    map.addLayer(markers);

                    markers.addMarker(new OpenLayers.Marker(lonLat));

    }



    function errorCallback(error) {
              // Update a div element with error.message.
    }

    // Map options
    var options = {
             //   restrictedExtent: extent
            };

    map = new OpenLayers.Map( 'map', options);
    navigator.geolocation.getCurrentPosition(successCallback,
                                           errorCallback,
                                          {maximumAge:600000});



    layer = new OpenLayers.Layer.OSM( "Simple OSM Map");
    map.addLayer(layer);
    // make_layer aus overpass_api -> alles nodes mit surface tag
    map.addLayers([
    make_layer("http://overpass-api.de/api/interpreter?data=[timeout:1];node[surface](bbox);out+skel;(way[surface](bbox);node(w););out+skel;", "green")]);




}

// OSM XML abrufen -> Nur Radwege in der bbox
function getNodes(bbox) {
  url = "http://overpass-api.de/api/interpreter?data=way[highway=cycleway](" + (LAT - 0.0005) + "," + (LON - 0.0005) + "," + (LAT + 0.0005) + "," + (LON + 0.0005) + ");out+meta;";
  $.get(url, function(data) {
    alert("Data Loaded: " + data);
  return data;});
}

function senddata() {
  var surface = 0;
  getNodes();

  surface = $('#surface').val();
  

  return true;
}
