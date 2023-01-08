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

  var autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("origin"),
    { types: ["geocode"] }
  );
  var autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("dest"),
    { types: ["geocode"] }
  );
  function roadDirection() {
    // Create a DirectionsService object to request directions
    var directionsService = new google.maps.DirectionsService();

    // Create a DirectionsRenderer object to display the directions
    var directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map); // The map to display the directions on

    // Set the origin and destination for the directions
    var request = {
      origin: "Köln, Germany",
      destination: "Gummersbach, Germany",
      travelMode: "DRIVING", // Mode of transport
    };

    // Request the directions and render them on the map
    directionsService.route(request, function (response, status) {
      if (status == "OK") {
        directionsRenderer.setDirections(response);
      }
    });
  }

  function calculateTime() {
    // Create a DirectionsService object to request directions
    var directionsService = new google.maps.DirectionsService();

    // Set the origin and destination for the directions
    var request = {
      origin: "Köln, DE",
      destination: "Gummersbach, DE",
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
      7.561820898187938  // C2 Lng
    );

}

////////////////////////////////////////////////////////////
// Calculation of the range for the budget and the fuel type

async function getCarData(carId) {

  // request
  let response = await fetch('/car/car.json');
  // convert into json format
  let carData = await response.json();

  // search car by carId
  let car = carData.find(car => car.carId === carId);

  return car;
}

async function fetchFuelPricesJSON() {
  const url ="https://creativecommons.tankerkoenig.de/json/list.php?lat=52.6056456&lng=8.3707878&rad=1.5&sort=dist&type=all&apikey=0d666ee8-9682-db0a-4859-b167d84d84a4";
  const response = await fetch(url);
  const data = await response.json();
  const firstStation = data.stations[0];
  return {"fueltypes": [
    {
      fuelId: 1,
      name: "Diesel",
      pricePerLiter: firstStation.diesel,
    },

    {
      fuelId: 2,
      name: "E5",
      pricePerLiter: firstStation.e5,
    },

    {
      fuelId: 3,
      name: "E10",
      pricePerLiter: firstStation.e10,
    },
  ]
}
}
fetchFuelPricesJSON().then((data) => console.log(data));

// calculates the amount of fuel buyable with a budget
async function calculateFuelAmount(budget, fuelType) {

  let fuelData = await fetchFuelPricesJSON(fuelType);

  for(const fuel in fuelData.fueltypes) {
    let obj = fuelData.fueltypes[fuel];
    if(obj.name === fuelType) {

      let fuelAmount = budget / obj.pricePerLiter;
      return fuelAmount;
    }
  }

  return "Fehlerhafter Kraftstofftyp";
}

async function testCalc() {
  let carId = 1;
  let budget = 10;

  let carData = await getCarData(carId);

  await calculateFuelAmount(budget, carData.fuelType);
  let fuelAmount = await calculateFuelAmount(budget, carData.fuelType);

  console.log(`Du kannst mit einem Budget von ${budget} Euro ${fuelAmount} Liter ${carData.fueltype} kaufen.`);
}

testCalc();

window.initMap = initMap;
