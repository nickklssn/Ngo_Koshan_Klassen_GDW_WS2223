const fs = require('fs');
const axios = require("axios");

function getWriteSightsForDriver(lat, lng, radius, driverId) {
  var config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&radius=${radius * 1000}&type=tourist_attraction&key=AIzaSyA6PpTUvfOJ0l3P4ZtlOpSs2zMKMtZ57I0`,
    headers: {},
  };

  axios(config)
    .then(function (response) {
      var sights = response.data.results;
      var coordinates = [];
      for (var i = 0; i < sights.length; i++) {
        var lat = sights[i].geometry.location.lat;
        var lng = sights[i].geometry.location.lng;
        var place_id = sights[i].place_id;
        var vicinity = sights[i].vicinity;
        var sight = {
          place_id: place_id,
          lat: lat,
          lng: lng,
          vicinity: vicinity
        };
        coordinates.push(sight);
      }
      var data = {};
      data[driverId] = {
        driverId: driverId,
        sights: coordinates
      };
      fs.writeFileSync('data/currSightsReq.json', JSON.stringify(data));
    })
    .catch(function (error) {
      console.log(error);
    });
}
module.exports = getWriteSightsForDriver;