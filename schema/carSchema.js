const Ajv = require("ajv");

//schema for the car json object
const carSchema = {
  type: "object",
  properties: {
    carId: { type: "integer" },
    name: { type: "string" },
    fuelType: { type: "string" },
    minConsumPer100Kilometers: { type: "number" },
    maxConsumPer100Kilometers: { type: "number" },
  },
  required: [
    "carId",
    "name",
    "fuelType",
    "minConsumPer100Kilometers",
    "maxConsumPer100Kilometers",
  ],
  additionalProperties: false,
};

//export the schema for usage in server
module.exports = carSchema;
