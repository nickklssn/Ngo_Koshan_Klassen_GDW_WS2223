const Ajv = require("ajv");

//schema for the driver json object
const driverSchema = {
  type: "object",
  properties: {
    driverId: { type: "integer" },
    name: { type: "string" },
    age: { type: "integer" },
    carId: { type: "integer" },
    budget: { type: "number" },
    currentPos: {
      type: "object",
      properties: {
        lat: { type: "number" },
        lng: { type: "number" },
      },
    },
  },
  required: ["driverId", "name", "age", "budget", "currentPos"],
  additionalProperties: false,
};

//export the schema for usage in server
module.exports = driverSchema;
