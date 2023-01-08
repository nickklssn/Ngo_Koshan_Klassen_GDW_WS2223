const axios = require("axios");
const { fuel } = require("./fuel.js");

var config = {
  method: "get",
  url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.0266668%2C7.569283&radius=3000&type=tourist_attraction&key=AIzaSyA6PpTUvfOJ0l3P4ZtlOpSs2zMKMtZ57I0",
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
