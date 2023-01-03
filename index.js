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
  var directionService= new google.maps.directionService();
  
  var directionsDisplay= new google.maps.DirectionsRenderer();

  directionsDisplay.setMap(map);
  

  // funtion for calculate the road
  function calcuRoad(){
    var request= {
      origin: document.getElementsById("from").value,
      destination : document.getElementById("to").value,
    
      travelMode: google.maps.travelMode.DRIVING,// WALKING, BYCYCLING AND TRANSIT
      unitSystem: google.maps.UnitSystem.IMPERIAL
    }
 
    // pass the request to the map metohod
    
    directionService.route(request,(result,status)=>{
      if(status==google.maps.DirectionStatus.OK){
        // get distance and Time
        const output=document.querySelector("#output")
        output.innerHTML= "<div class= 'alert-info'> From:"+ document.getElementById("from").value+ ".<br />TO:"+ document.getElementById("to".value +result.routes[0].legs[0].distance.text +result.routes[0].legs[0].duration.text + ".</div");

        //display route
        directionsDisplay.setDirections(result);
        
        
      }
      else{
        //display route from map
        directionsDisplay.setDirections({routes:[]});

        //center map in spain
        map.setCenter(lat);

        //show error message
        output.innerHTML="<div class 'alert-danger'><i class 'fas fa-exclamation-triangle'></i Could not retreive driving distance </div";

      }
    })
  }

var options={
  types: ["cities"]

}
var input1= document.getElementById("from")
var autocomplete=new google.maps.places.Autocomplete(input1,options)

var input2= document.getElementById("to")
var autocomplete=new google.maps.places.Autocomplete(input2,options)
calcuRoad();
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
