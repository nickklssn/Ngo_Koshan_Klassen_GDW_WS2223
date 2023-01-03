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
  roadDirection();
  calculateTime();

  
  function roadDirection() {
  // Create a DirectionsService object to request directions
  var directionsService = new google.maps.DirectionsService();

  // Create a DirectionsRenderer object to display the directions
  var directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);  // The map to display the directions on

  // Set the origin and destination for the directions
  var request = {
    origin: 'Köln, Germany',
    destination: 'Gummersbach, Germany',
    travelMode: 'DRIVING'  // Mode of transport
  };

  // Request the directions and render them on the map
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {
      directionsRenderer.setDirections(response);
    }
  });
}


function calculateTime() {
  // Create a DirectionsService object to request directions
  var directionsService = new google.maps.DirectionsService();

  // Set the origin and destination for the directions
  var request = {
    origin: 'Köln, DE',
    destination: 'Gummersbach, DE',
    travelMode: 'DRIVING'  // Mode of transport
  };

  // Request the directions and get the duration
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {
      // Get the duration in seconds
      var duration = response.routes[0].legs[0].duration.value;

      // Convert the duration to hours and minutes
      var hours = Math.floor(duration / 3600);
      var minutes = Math.floor((duration % 3600) / 60);

      console.log('Duration: ' + hours + 'h ' + minutes + 'm');
    }
  });
}

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
