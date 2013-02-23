// Datahandling App

var LON = 0,
     LAT= 0;
        
var map, layer;
function init(){



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
                // alert(" " + LON + " " + LAT);

                // Grenzen für die Karte (wie unten bei getNodes())
                var extent = new OpenLayers.Bounds((LON - 0.005), (LAT - 0.005), (LON + 0.005), (LAT + 0.005));
                extent.transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        map.getProjectionObject()
                )

                // Karten auf die Grenzen zoomen
                map.zoomToExtent(extent);
                map.setOptions({restrictedExtent: extent});

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
    make_layer("http://overpass-api.de/api/interpreter?data=[timeout:1];node[surface=asphalt](bbox);out+skel;(way[surface=asphalt](bbox);node(w););out+skel;", "#2c2c2c"),
    make_layer("http://overpass-api.de/api/interpreter?data=[timeout:1];node[surface=dirt](bbox);out+skel;(way[surface=dirt](bbox);node(w););out+skel;", "#5DE232"),
    make_layer("http://overpass-api.de/api/interpreter?data=[timeout:1];node[surface=paving_stones](bbox);out+skel;(way[surface=paving_stones](bbox);node(w););out+skel;", "#B6B6B6"),
    make_layer("http://overpass-api.de/api/interpreter?data=[timeout:1];node[surface=compacted](bbox);out+skel;(way[surface=compacted](bbox);node(w););out+skel;", "#A52A2A")
    ]);




}

// OSM XML abrufen -> Nur Radwege in der bbox
function getNodes(bbox, surface) {


  url = "http://overpass-api.de/api/interpreter?data=way[highway=cycleway](" + (LAT - 0.005) + "," + (LON - 0.005) + "," + (LAT + 0.005) + "," + (LON + 0.005) + ");out+meta;";
//   url = "http://overpass-api.de/api/interpreter?data=way[highway=cycleway](" + bbox.bottom + "," + bbox.left + "," + bbox.top + "," + bbox.right + ");out+meta;";
   xml = $.get(url, function(data) {
      // alert("Data Loaded: " + data);

      // filter "way id"
      wayid = xml.responseText;
      wayid = wayid.match(/.*way id=\"(\d*)*./)[1];
      // generate proxy url
      surfurl = "http://overpass-api.de/api/wegmarker?id="+wayid+"&value="+surface;
    return data;});
}


function senddata() {
  var surface = 0;

  surface = $('#surface').val();
  bbox = map.getMaxExtent();
  getNodes(bbox,surface);
  
  alert('Weg wurde eingetragen');
  return true;
}
