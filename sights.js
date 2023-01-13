import axios from 'axios';

export function sights(lng, lat, radius) {
  var config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lng}%2C${lat}&radius=${radius}&type=tourist_attraction&key=AIzaSyA6PpTUvfOJ0l3P4ZtlOpSs2zMKMtZ57I0`,
    headers: {},
  };

  axios(config)
    .then(function (response) {
      var sights = JSON.stringify(response.data);
      var parsedData = JSON.parse(sights);
      console.log(parsedData);
    }) 
    .catch(function (error) {
      console.log(error);
    });

  console.log(fuel);
  }

