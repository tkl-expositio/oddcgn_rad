// Datahandling App
// LON and LAT keep the user gps position
var LON = 0,
     LAT= 0;
        
var map, layer;
function init(){

    // callback function for navigator.geolocation.getCurrentPosition
    function successCallback(position) {

             // center map on user position 
             map.setCenter(
                new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude).transform(
                    new OpenLayers.Projection("EPSG:4326"), // user coords are in WGS84
                    map.getProjectionObject()
                ), 15
                );

                LON = parseFloat(position.coords.longitude);
                LAT = parseFloat(position.coords.latitude);

                // debug info
                console.log("LAT:" + position.coords.latitude +" LONG:" + position.coords.longitude);
                // alert(" " + LON + " " + LAT);

                // set map extent approx. 0.005 degrees around the user position. 
                // Should be same distance as in getNodes())
                var extent = new OpenLayers.Bounds((LON - 0.005), (LAT - 0.005), (LON + 0.005), (LAT + 0.005));
                extent.transform(
                        new OpenLayers.Projection("EPSG:4326"),
                        map.getProjectionObject()
                )

                // zoom map to extent
                map.zoomToExtent(extent);
               
                // restrict map to extent
                map.setOptions({restrictedExtent: extent});

                // add marker for user position on the map
                // convert position to LonLat object
                // TODO: create position only once (also needed in set map center)
                var lonLat = new OpenLayers.LonLat( LON , LAT )
                            .transform(
                              new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                              map.getProjectionObject() // to Spherical Mercator Projection
                            );

                // add marker layer and add layer to map
                var markers = new OpenLayers.Layer.Markers( "Markers" );
                map.addLayer(markers);
                markers.addMarker(new OpenLayers.Marker(lonLat));
    }



    function errorCallback(error) {
              // Update a div element with error.message.
              // TODO: message if position is unknown
    }

    // set map options
    // TODO: needed?
    var options = {};

    // create map object
    map = new OpenLayers.Map( 'map', options);

    // Get user position (WGS84)
    // By using the 'maximumAge' option above, the position
    // object is guaranteed to be at most 10 minutes old.
     navigator.geolocation.getCurrentPosition(successCallback,
                                           errorCallback,
                                          {maximumAge:600000});

    // add OSM layer
    layer = new OpenLayers.Layer.OSM( "Simple OSM Map");
    map.addLayer(layer);

    // add layer with overpass_api -for different surface tags
    map.addLayers([
    make_layer("http://overpass-api.de/api/interpreter?data=[timeout:1];node[surface=asphalt](bbox);out+skel;(way[surface=asphalt](bbox);node(w););out+skel;", "#2c2c2c"),
    make_layer("http://overpass-api.de/api/interpreter?data=[timeout:1];node[surface=dirt](bbox);out+skel;(way[surface=dirt](bbox);node(w););out+skel;", "#5DE232"),
    make_layer("http://overpass-api.de/api/interpreter?data=[timeout:1];node[surface=paving_stones](bbox);out+skel;(way[surface=paving_stones](bbox);node(w););out+skel;", "#B6B6B6"),
    make_layer("http://overpass-api.de/api/interpreter?data=[timeout:1];node[surface=compacted](bbox);out+skel;(way[surface=compacted](bbox);node(w););out+skel;", "#A52A2A")
    ]);

} // end init()


// get OSM XML with overpass-api for the bounding box und extract way id
function getNodes(surface) {
    
    // create url with bounding box around the user position
  url = "http://overpass-api.de/api/interpreter?data=way[highway=cycleway](" + (LAT - 0.005) + "," + (LON - 0.005) + "," + (LAT + 0.005) + "," + (LON + 0.005) + ");out+meta;";
   
   // read xml
   xml = $.get(url, function(data) {
      // alert("Data Loaded: " + data);

      // filter "way id"
      wayid = xml.responseText;
      wayid = wayid.match(/.*way id=\"(\d*)*./)[1];

      // generate url for proxy call and open url
      // proxy script sets surface tag to value "surface" for way "wayid"
      surfurl = "http://overpass-api.de/api/wegmarker?id="+wayid+"&value="+surface;
      $.get(surfurl, function(data) {});
    return data;});
}

// function called by change of select box
//
function senddata() {
  var surface = 0;

  // get selected value
  surface = $('#surface').val();

  // do changes in OSM DB
  getNodes(surface);
  
  alert('Weg wurde eingetragen');
  return true;
}
