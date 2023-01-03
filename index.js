// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 6,
  });
  infoWindow = new google.maps.InfoWindow();

  var subButton = document.getElementById("subButton");

  // This function sets a custom marker depending on user input
  function setCustomMarker() {

    let marker = new google.maps.Marker({
      position: null,
      map: map,
      zoom: 6,
    });

    var lat = document.getElementById("lat").value;
    var lng = document.getElementById("lng").value;
    const pos = { lat: parseFloat(lat), lng: parseFloat(lng) };

    marker.position = pos;

    map.setCenter(pos);
  }
// find the current Position automaticly
  subButton.addEventListener("click", setCustomMarker);

  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);

          new google.maps.Marker({
            position: pos,
            map,
          });

          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

////////////////////
// Elevations API //
////////////////////

  // Function to calculate average gain of a route
  function getAverageElevationGain(startLat, startLng, endLat, endLng) {
    // Create elevation object
    var elevator = new google.maps.ElevationService({
      apiKey: 'AIzaSyA6PpTUvfOJ0l3P4ZtlOpSs2zMKMtZ57I0'
    });
    // Set start and end point
    var routeCoordinates = [
      {lat: startLat, lng: startLng},  // Start
      {lat: endLat, lng: endLng}       // End
    ];

    // Define the path by assign latitude and longitude
    var path = routeCoordinates.map(coordinate => new google.maps.LatLng(coordinate.lat, coordinate.lng));

    // Create a Request
    var request = {
      path: path,
      samples: 256  // Amount of samples
    };

    // Do a request along the path to get heights
    elevator.getElevationAlongPath(request, function(results, status) {
      if (status === 'OK') {
        // Calculate the average gain of the route
        var totalElevationGain = 0;
        var previousElevation = 0;
        for (var i = 0; i < results.length; i++) {
          var elevation = results[i].elevation;
          if (i > 0) {
            totalElevationGain += Math.max(0, elevation - previousElevation);
          }
          previousElevation = elevation;
        }
        var averageElevationGain = totalElevationGain / (results.length - 1);
        var roundAverageElevationGain = averageElevationGain.toFixed(2);
        console.log("Die durchschnittliche Steigung der Route beträgt: " + roundAverageElevationGain + " Meter pro Kilometer.");
      } else {
        console.error("Es ist ein Fehler beim Abrufen der Höhenpunkte aufgetreten: " + status);
      }
    });
  }

  // Test from Cologne -> Gummersbach
  getAverageElevationGain(50.94148075038749, 6.958224297010802, 51.02304632512543, 7.561820898187938);

}
//This function handles error if geolocation does not work
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
  
}

window.initMap = initMap;

// Rufe die Funktion auf und übergebe Start- und Endpunkt-Koordinaten


