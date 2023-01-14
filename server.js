const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");
const Ajv = require("ajv");
const ajv = new Ajv();
const carSchema = require("./schema/carSchema.js");
const driverSchema = require("./schema/driverSchema.js");
const { raw } = require("express");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/car", function (req, res) {
  if (fs.existsSync("data/car.json")) {
    fs.readFile("data/car.json", "utf-8", (err, data) => {
      if (err) {
        throw err;
      }

      var obj = JSON.parse(data);
      res.status(200).json(obj);
    });
  } else {
    res.status(404).json({ status: "No cars available" });
  }
});

app.get("/car/:id", async function (req, res) {
  try {
    // Use fs.promises.readFile() to read the contents of the 'cars.json' file
    const data = await fs.promises.readFile("data/car.json", "utf8");
    // Parse the contents of the file as JSON
    const cars = JSON.parse(data);

    // Use Object.entries() to extract the key-value pairs of the object
    // Use Array.prototype.find() method to find the key-value pair with a matching key
    const car = Object.entries(cars).find(
      ([key, value]) => key == req.params.id
    );

    // If a matching car is not found
    if (!car) {
      // Send a 404 status code and message to the client
      res.status(404).send("Car not found.");
    } else {
      // If a matching car is found, Send the car object to the client as a JSON response
      res.json(car[1]);
    }
  } catch (err) {
    // If an error occurs while reading the file, send a 500 status code and error message to the client
    res.status(500).send(`Error reading cars.json file: ${err}`);
  }
});
//Does not work yet
app.delete("/car/:id", (req, res) => {
  const id = req.params.id;
  // read the json file
  fs.readFile("data/car.json", "utf-8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.status(404).send({ error: "car.json not found" });
      } else {
        res.status(500).send({ error: err });
      }
      return;
    }
    try {
      const cars = JSON.parse(data);
      // find the index of the car object that matches the id
      const index = cars.findIndex((car) => car.id == id);
      if (index === -1) {
        res.status(404).send({ error: "Car not found" });
        return;
      }
      // remove the car object from the array
      cars.splice(index, 1);
      // write the new cars array to the json file
      fs.writeFile("data/car.json", JSON.stringify(cars), (err) => {
        if (err) {
          res.status(500).send({ error: err });
          return;
        }
        res.send({ message: `Car with id ${id} is deleted` });
      });
    } catch (err) {
      if (err instanceof SyntaxError) {
        res.status(500).send({ error: "car.json is not a valid JSON file" });
      } else {
        res.status(500).send({ error: err });
      }
    }
  });
});

app.delete("/car", function (req, res) {
  fs.unlink("data/car.json", (err) => {
    if (err) {
      throw err;
    }
    res.status(200).json({ status: "Succesfully deleted" });
  });
});

app.post("/car", function (req, res) {
  // Validate the request body against the carSchema
  const validate = ajv.compile(carSchema);
  const valid = validate(req.body);

  // If the request body is not valid, send a 400 status with the validation errors
  if (!valid) {
    res.status(400).send(validate.errors);
  } else {
    // Check if the data.json file exists
    fs.access("data/car.json", fs.constants.F_OK, (err) => {
      let jsonData = {};
      if (!err) {
        // Read the data.json file
        fs.readFile("data/car.json", "utf8", (err, data) => {
          if (err) {
            console.log(err);
          }
          if (data) {
            jsonData = JSON.parse(data);
          }
          // Append the new car object to the existing data object
          jsonData = { ...jsonData, [req.body.carId]: req.body };
          // Write the updated data object to the data.json file
          fs.writeFile("data/car.json", JSON.stringify(jsonData), (err) => {
            if (err) {
              console.log(err);
            }
            res.send("Object added successfully");
          });
        });
      } else {
        jsonData = { [req.body.carId]: req.body };
        // Write the new data object to the data.json file
        fs.writeFile("data/car.json", JSON.stringify(jsonData), (err) => {
          if (err) {
            console.log(err);
          }
          res.send("Object added successfully");
        });
      }
    });
  }
});

app.post("/driver", function (req, res) {
  // Validate the request body against the driverSchema
  const validate = ajv.compile(driverSchema);
  const valid = validate(req.body);

  // If the request body is not valid, send a 400 status with the validation errors
  if (!valid) {
    res.status(400).send(validate.errors);
  } else {
    // Check if the data.json file exists
    fs.access("data/driver.json", fs.constants.F_OK, (err) => {
      let jsonData = {};
      if (!err) {
        // Read the data.json file
        fs.readFile("data/driver.json", "utf8", (err, data) => {
          if (err) {
            console.log(err);
          }
          if (data) {
            jsonData = JSON.parse(data);
          }
          // Append the new driver object to the existing data object
          jsonData = { ...jsonData, [req.body.driverId]: req.body };
          // Write the updated data object to the data.json file
          fs.writeFile("data/driver.json", JSON.stringify(jsonData), (err) => {
            if (err) {
              console.log(err);
            }
            res.send("Object added successfully");
          });
        });
      } else {
        jsonData = { [req.body.driverId]: req.body };
        // Write the new data object to the data.json file
        fs.writeFile("data/driver.json", JSON.stringify(jsonData), (err) => {
          if (err) {
            console.log(err);
          }
          res.send("Object added successfully");
        });
      }
    });
  }
});

app.get("/driver", function (req, res) {
  if (fs.existsSync("data/driver.json")) {
    fs.readFile("data/driver.json", "utf-8", (err, data) => {
      if (err) {
        throw err;
      }
      var obj = JSON.parse(data);
      res.status(200).json(obj);
    });
  } else {
    res.status(404).json({ status: "No driver available" });
  }
});

app.get("/driver/:id", async function (req, res) {
  try {
    const data = await fs.promises.readFile("data/driver.json", "utf8");
    const drivers = JSON.parse(data);
    const driver = Object.entries(drivers).find(
      ([key, value]) => key == req.params.id
    );
    if (!driver) {
      res.status(404).send("Driver not found.");
    } else {
      res.json(driver[1]);
    }
  } catch (err) {
    res.status(500).send(`Error reading driver.json file: ${err}`);
  }
});

app.delete("/driver/:id", async function (req, res) {
  try {
    const data = await fs.promises.readFile("data/driver.json", "utf-8");
    const drivers = JSON.parse(data);
    const notMatchedDriver = Object.fromEntries(drivers).find(
      ([key, value]) => key != req.params.id
    );
    console.log(notMatchedDriver);
    if (!notMatchedDriver) {
      res.status(404).send("No driver available");
    } else {
      fs.writeFile("data/car.json", JSON.stringify(notMatchedDriver), (err) => {
        if (err) {
          console.log(err);
        }
        res.send("Object deleted successfully");
      });
    }
  } catch {}
});

app.delete("/driver", function (req, res) {
  fs.unlink("data/driver.json", (err) => {
    if (err) {
      throw err;
    }
    res.status(200).json({ status: "Succesfully deleted" });
  });
});

app.listen(port);
console.log(`App listen on port ${port}`);
