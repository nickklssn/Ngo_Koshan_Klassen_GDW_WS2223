const fs = require("fs");
const getWriteSightsForDriver = require("./sights");
const fetchFuelPricesJSON = require("./fuel");
const passedParameter = process.argv[2];

////////////////////////////////////////////////////////////
// Calculation of the range for the budget and the fuel type
////////////////////////////////////////////////////////////

async function getCarData(carId) {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/car.json", "utf8", (err, data) => {
      if (err) reject(err);
      let carData = JSON.parse(data);
      let car = Object.values(carData).find((car) => car.carId === carId);
      resolve(car);
    });
  });
}
// calculates the amount of fuel buyable with a budget
async function calculateFuelAmount(budget, fuelType) {
  let fuelData = await fetchFuelPricesJSON(fuelType);

  for (const fuel in fuelData.fueltypes) {
    let obj = fuelData.fueltypes[fuel];
    if (obj.name === fuelType) {
      let fuelAmount = budget / obj.pricePerLiter;
      return fuelAmount;
    }
  }

  return "Fehlerhafter Kraftstofftyp";
}

async function calculateRange(fuelAmount, carId) {
  let car = await getCarData(carId);
  let minCon = car.minConsumPer100Kilometers;
  let maxCon = car.maxConsumPer100Kilometers;
  return {
    minRange: fuelAmount / (maxCon / 100),
    maxRange: fuelAmount / (minCon / 100),
  };
}

async function getDriverById(driverId) {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/driver.json", "utf8", (err, data) => {
      if (err) reject(err);
      let driverData = JSON.parse(data);
      for (var key in driverData) {
        if (key == driverId) {
          resolve(driverData[key]);
        }
      }
      resolve(true);
    });
  });
}


async function calcData(driverId, carId) {
  let driverData = await getDriverById(driverId);
  let carData = await getCarData(carId);
  let budget = driverData.budget;
  let fuelAmount = await calculateFuelAmount(budget, carData.fuelType);
  let range = await calculateRange(fuelAmount, carId);

  // console.log(
  //   `Es kann mit einem Budget von ${budget} Euro ${fuelAmount.toFixed(2)} Liter ${carData.fuelType} für Ihren ${carData.name} kaufen.
  //    Damit kommen Sie bis zu ${range.maxRange.toFixed(2)} Kilometer und mindestens ${range.minRange.toFixed(2)} weit`
  // );

  return {
    budget: budget,
    liter: fuelAmount,
    fueltype: carData.fuelType,
    carName: carData.name,
    maxRange: range.maxRange,
    minRange: range.minRange,
  };
}

async function writeSightsJSON(driverId) {
  let driverData = await getDriverById(driverId);
  let lat = driverData.currentPos.lat;
  let lng = driverData.currentPos.lng;
  let maxRange = (await calcData(driverId, driverData.carId)).maxRange;
  let minRange = (await calcData(driverId, driverData.carId)).minRange;
  let avgRange = (maxRange + minRange) / 2;

  getWriteSightsForDriver(lat, lng, avgRange, driverId);
}

// Write sights into currSightsReq.json
writeSightsJSON(passedParameter);
