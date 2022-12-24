const url = "https://maps.googleapis.com/maps/api/elevation/json?locations=39.7391536%2C-104.9847034&key=AIzaSyA6PpTUvfOJ0l3P4ZtlOpSs2zMKMtZ57I0"

var elevator = new google.maps.ElevationService();

// Define route coordinates
var routeCoordinates = [
  {lat: 37.78, lng: -122.42},  // Start
  {lat: 37.78, lng: -122.45},  // Second point
  {lat: 37.79, lng: -122.45},  // Third point 
  {lat: 37.79, lng: -122.44}   // End
];

// Create a path object
var path = new google.maps.PathElevationRequest({
  'path': routeCoordinates,
  'samples': 256  // Abtastpunkte
});


elevator.getElevationAlongPath(path, function(results, status) {
  if (status === 'OK') {
    // Calculate average slope
    var totalElevationGain = 0;
    var previousElevation = 0;
    for (var i = 0; i < results.length; i++) {
      var elevation = results[i].elevation;
      if (i > 0) {
        totalElevationGain += Math.max(0, elevation - previousElevation);
      }
      previousElevation = elevation;
    }

    //Output
    var averageElevationGain = totalElevationGain / (results.length - 1);
    console.log("Die durchschnittliche Steigung der Route beträgt: " + averageElevationGain + " Meter pro Kilometer.");
  } else {
    console.error("Es ist ein Fehler beim Abrufen der Höhenpunkte aufgetreten: " + status);
  }
});