///////////////////////////////////////////////////////////////////////////
// Enter your mapbox map id here to reference it for the base layer

var mapId = 'nualacowan.19f0c413'; //<- this references the ugly green map that I made
var token = 'pk.eyJ1IjoibnVhbGFjb3dhbiIsImEiOiJPLXBKU0pVIn0.vvBTkh_wd3dHhu6Y_llAOA'; //<- this is my token, use yours.

//Create the map object with your mapId and token
L.mapbox.accessToken = token;
var map = L.mapbox.map('map', mapId);

//Set the view of the map to the whole US
map.setView([39, -96], 4);

///////////////////////////////////////////////////////////////////////////
// This is the area we're going to use to add data to our map

var dataFileToAdd = 'data/bike_routes.geojson'; //<- Point this to the file that you want to include on the map

var featureLayer = L.mapbox.featureLayer()
    .loadURL(dataFileToAdd)
    .addTo(map);

featureLayer.on('ready', function() {
    this.setStyle({
        "color": '#ec008c',
        "fillColor": '#ec008c',
        "weight": 6,
        "opacity": 1
    });
    map.fitBounds(featureLayer.getBounds());
});

///////////////////////////////////////////////////////////////////////////
// Add some basic click handling

// featureLayer.on('ready', function(){
//   this.eachLayer(function(layer){
//     layer.bindPopup('Hi, my ID value is ' + layer.feature.properties.id);
//   });
// });

///////////////////////////////////////////////////////////////////////////
// Lets add some more interesting click handling

// Clear out the info panel when you click somewhere in the map
map.on('click',function(e){
	$('#info').fadeOut(200);
    $('#info').empty();
});

// Use this function to handle the click event on the data
var clickHandler = function(e){
  $('#info').empty();

  //e is the click event that is moving up in the browser, it's target is our element that was clicked
  var feature = e.target.feature;

  $('#info').fadeIn(400,function(){
    var info = '';

    info = '<div>Sweet bike route named ' + feature.properties.name + '</div>';

    $('#info').append(info);
  });
};

// Register the click event on each of the features in the map
featureLayer.on('ready', function(){
  this.eachLayer(function(layer){
    layer.on('click', clickHandler);
  });
});


var myLocation = L.mapbox.featureLayer().addTo(map);
map.locate();
map.on('locationfound', function(e) {

    myLocation.setGeoJSON({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
        },
        properties: {
            'title': 'Here I am!',
            'marker-color': '#ff8888',
            'marker-symbol': 'star'
        }
    });
});
map.locate();
