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
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  roadDirection();
  calculateTime();

  document.getElementById("routeButton").addEventListener("click", function () {
    roadDirection(
      document.getElementById("origin").value,
      document.getElementById("dest").value
    );
  });

  //for Duration

  document.getElementById("routeButton").addEventListener("click", function () {
    calculateTime(
      document.getElementById("origin").value,
      document.getElementById("dest").value
    );
  });

  var onChangeHandler = function () {
    createRouteToSight(directionsService, directionsDisplay);
  };

  var autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("origin"),
    { types: ["geocode"] }
  );
  var autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("dest"),
    { types: ["geocode"] }
  );

  var origin = document.getElementById("origin").value;
  var destination = document.getElementById("dest").value;

  function roadDirection(origin, destination) {
    // Create a DirectionsService object to request directions
    var directionsService = new google.maps.DirectionsService();

    // Create a DirectionsRenderer object to display the directions
    var directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map); // The map to display the directions on

    // Set the origin and destination for the directions
    var request = {
      origin: origin,
      destination: destination,
      travelMode: "DRIVING", // Mode of transport
    };

    // Request the directions and render them on the map
    directionsService.route(request, function (response, status) {
      if (status == "OK") {
        directionsRenderer.setDirections(response);
      }
    });
  }

  async function getSights() {
    try {
      const response = await fetch("data/currSightsReq.json");
      const data = await response.json();
      for (const key in data) {
        return data[key].sights;
      }
    } catch (error) {
      console.log("An error occurred: " + error);
      return error;
    }
  }

  /*     const test = await getSights();
    console.log(test);
    console.log("This is a efefwefw"); */

  function calculateTime(origin, destination) {
    // Create a DirectionsService object to request directions
    var directionsService = new google.maps.DirectionsService();

    // Set the origin and destination for the directions
    var request = {
      origin: "Gummersbach",
      destination: "Köln",
      travelMode: "DRIVING", // Mode of transport
    };

    // Request the directions and get the duration
    directionsService.route(request, function (response, status) {
      if (status == "OK") {
        // Get the duration in seconds
        var duration = response.routes[0].legs[0].duration.value;

        // Convert the duration to hours and minutes
        var hours = Math.floor(duration / 3600);
        var minutes = Math.floor((duration % 3600) / 60);

        console.log("Duration: " + hours + "h " + minutes + "m");
      }
    });
  }

  async function createRouteToSight(directionsService, directionsDisplay) {
    const sight = await getSights();
    console.log(sight);

    let randomIndex = Math.floor(Math.random() * (sight.length - 1) + 1);
    console.log(randomIndex);

    var randomSight = sight[randomIndex].vicinity;
    console.log(randomSight);

    directionsService.route(
      {
        origin: currPos,
        destination: randomSight,
        travelMode: "DRIVING",
      },
      function (response, status) {
        if (status === "OK") {
          directionsDisplay.setDirections(response);
          console.log("Please create route");
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );

    console.log("This function should run");
  }

  document
    .getElementById("getSight")
    .addEventListener("click", onChangeHandler);

  infoWindow = new google.maps.InfoWindow();

  var subButton = document.getElementById("routeButton");

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

  let currPos = { lng: 0, lat: 0 };

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

          currPos = pos;
          console.log(currPos);

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

  // Elevations API //

  // Function to calculate average gain of a route
  function getAverageElevationGain(startLat, startLng, endLat, endLng) {
    // Create elevation object
    var elevator = new google.maps.ElevationService({
      apiKey: "AIzaSyA6PpTUvfOJ0l3P4ZtlOpSs2zMKMtZ57I0",
    });
    // Set start and end point
    var routeCoordinates = [
      { lat: startLat, lng: startLng }, // Start
      { lat: endLat, lng: endLng }, // End
    ];

    // Define the path by assign latitude and longitude
    var path = routeCoordinates.map(
      (coordinate) => new google.maps.LatLng(coordinate.lat, coordinate.lng)
    );

    // Create a Request
    var request = {
      path: path,
      samples: 256, // Amount of samples
    };

    // Do a request along the path to get heights
    elevator.getElevationAlongPath(request, function (results, status) {
      if (status === "OK") {
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
        console.log(
          "Die durchschnittliche Steigung der Route beträgt: " +
            roundAverageElevationGain +
            " Meter pro Kilometer."
        );
      } else {
        console.error(
          "Es ist ein Fehler beim Abrufen der Höhenpunkte aufgetreten: " +
            status
        );
      }
    });
  }

  // Test coordinates from Cologne -> Gummersbach
  getAverageElevationGain(
    50.94148075038749, // C1 Lat
    6.958224297010802, // C1 Lng
    51.02304632512543, // C2 Lat
    7.561820898187938 // C2 Lng
  );
}

async function getDriverById(driverId) {
  try {
    let response = await fetch("./data/driver.json");
    let driverData = await response.json();
    for (var key in driverData) {
      if (key == driverId) {
        return driverData[key];
      }
    }
  } catch (error) {
    console.log(error);
  }
  return true;
}

window.initMap = initMap;
