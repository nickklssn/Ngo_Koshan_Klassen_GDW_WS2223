const fetch = require("node-fetch");
const fs = require("fs");

async function fetchFuelPricesJSON() {
  const url =
    "https://creativecommons.tankerkoenig.de/json/list.php?lat=50.9413&lng=6.95838&rad=1.5&sort=dist&type=all&apikey=0d666ee8-9682-db0a-4859-b167d84d84a4";
  const response = await fetch(url);
  const data = await response.json();
  const firstStation = data.stations[0];
  return {
    fueltypes: [
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
    ],
  };
}

module.exports = fetchFuelPricesJSON;
