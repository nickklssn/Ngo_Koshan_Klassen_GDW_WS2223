const fetch = require("node-fetch");

const url =
  "https://creativecommons.tankerkoenig.de/json/list.php?lat=52.6056456&lng=8.3707878&rad=1.5&sort=dist&type=all&apikey=0d666ee8-9682-db0a-4859-b167d84d84a4";

async function fetchFuelPricesJSON() {
  const response = await fetch(url);
  const data = await response.json();
  const firstStation = data.stations[0];
  return {
    fuelId: 1,
    name: "diesel",
    pricePerLiter: firstStation.diesel,
  };
}

fetchFuelPricesJSON().then((data) => console.log(data));
