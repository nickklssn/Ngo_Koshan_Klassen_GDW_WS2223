// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to

async function getDrivers() {
  try {
    let response = await fetch("./data/driver.json");
    let driverData = await response.json();
  
    return driverData
    
  } catch (error) {
    console.log(error);
  }
}

document.getElementById("reqSightData").addEventListener("click", async function(){

  const choice =  document.querySelector('input[name=driver]:checked').value;
  const driverData = await getDrivers();
  let id = driverData[choice].driverId;

  fetch(`http://localhost:3000/insertData/${id}`)
  .then(response => response.text())
  .then(data => {
    console.log(data);

  })
  .catch(error => {
    console.error('Error:', error);
  });
});

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

const radioGroup = document.getElementById("driver-group");

async function insertDrivers() {
  let drivers = await getDrivers();

  // clear radioBoxes 
  radioGroup.innerHTML = "";

  // append driver-choices to frontend
  let first = true;
  for (let keys in drivers) {
    let newInput = document.createElement("input");
    let newLabel = document.createElement("label");

    newInput.name = "driver";
    newInput.id = "driver-" + drivers[keys].driverId;
    newInput.type = "radio";
    newInput.value = drivers[keys].driverId;

    if (first) {
      newInput.checked = true;
      first = false;
    }

    newLabel.for = "driver-" + drivers[keys].driverId;
    newLabel.innerHTML = drivers[keys].name;

    radioGroup.appendChild(newInput);
    radioGroup.appendChild(newLabel);
  }
}

// Load drivers once
insertDrivers()
// Button to insert drivers
document.getElementById('getDriversButton').addEventListener("click", insertDrivers);


// locate you.
let map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 51.00, lng: 10.00 },
    zoom: 6,
  });
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  var onChangeHandler = function () {
    createRouteToSight(directionsService, directionsDisplay);
  };

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

  async function createRouteToSight(directionsService, directionsDisplay) {
    const choice =  document.querySelector('input[name=driver]:checked').value;
    const driverData = await getDrivers();
    const sight = await getSights();
    console.log("Aktuelle Position des Fahrers: " + " Lat: " + driverData[choice].currentPos.lat + " Lng: " + driverData[choice].currentPos.lng);
    console.log(sight);

    let randomIndex = Math.floor(Math.random() * (sight.length - 1) + 1);
    console.log(randomIndex);

    var randomSight = sight[randomIndex].vicinity;
    console.log(randomSight);

    directionsService.route(
      {
        origin: driverData[choice].currentPos,
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

  const locationButton = document.createElement("button");


}

window.initMap = initMap;
