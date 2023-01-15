const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");
const Ajv = require("ajv");
const ajv = new Ajv();
const carSchema = require("./schema/carSchema.js");
const driverSchema = require("./schema/driverSchema.js");
const { exec } = require("child_process");
const cors = require('cors');

// Allow cors origin from deployment-server
app.use(cors({
  origin: 'https://gdw2023.onrender.com'
}));

//Middleware for express
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname)));
app.use(express.json());

//GET google map
app.get("/", function (req, res) {
  res.render("index");
});

//GET sight nearby depending on current user
app.get("/sight", function (req, res) {
  //read json file and parse data
  fs.readFile("data/currSightsReq.json", "utf-8", (err, data) => {
    if (err) throw err;

    var obj = JSON.parse(data);
    res.status(200).json(obj);
  });
});

//GET all cars
app.get("/car", function (req, res) {
  //read json file if exists and parse data
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

//GET one specific car
app.get("/car/:id", async function (req, res) {
  try {
    //read json file async and parse data
    const data = await fs.promises.readFile("data/car.json", "utf8");
    const cars = JSON.parse(data);

    //search for matched car
    const car = Object.entries(cars).find(
      ([key, value]) => key == req.params.id
    );

    if (!car) {
      res.status(404).send("Car not found.");
    } else {
      //return matched car
      res.json(car[1]);
    }
  } catch (err) {
    res.status(500).send(`Error reading cars.json file: ${err}`);
  }
});

//DELETE all cars
app.delete("/car", function (req, res) {
  //delete json file
  fs.unlink("data/car.json", (err) => {
    if (err) {
      throw err;
    }
    res.status(200).json({ status: "Succesfully deleted" });
  });
});

//POST new car
app.post("/car", function (req, res) {
  //validate with carschema
  const validate = ajv.compile(carSchema);
  const valid = validate(req.body);

  if (!valid) {
    res.status(400).send(validate.errors);
  } else {
    // Check if the json file exists
    fs.access("data/car.json", fs.constants.F_OK, (err) => {
      let jsonData = {};
      if (!err) {
        // Read the json file
        fs.readFile("data/car.json", "utf8", (err, data) => {
          if (err) {
            console.log(err);
          }
          if (data) {
            jsonData = JSON.parse(data);
          }
          // Append the new car object to the existing data object
          jsonData = { ...jsonData, [req.body.carId]: req.body };
          // Write the updated data object to the json file
          fs.writeFile("data/car.json", JSON.stringify(jsonData), (err) => {
            if (err) {
              console.log(err);
            }
            res.send("Object added successfully");
          });
        });
      } else {
        jsonData = { [req.body.carId]: req.body };
        // Write the new data object to the json file
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

//POST new driver
app.post("/driver", function (req, res) {
  //validate with driverSchema
  const validate = ajv.compile(driverSchema);
  const valid = validate(req.body);

  if (!valid) {
    res.status(400).send(validate.errors);
  } else {
    // Check if the json file exists
    fs.access("data/driver.json", fs.constants.F_OK, (err) => {
      let jsonData = {};
      if (!err) {
        // Read the json file
        fs.readFile("data/driver.json", "utf8", (err, data) => {
          if (err) {
            console.log(err);
          }
          if (data) {
            jsonData = JSON.parse(data);
          }
          // Append the new driver object to the existing data object
          jsonData = { ...jsonData, [req.body.driverId]: req.body };
          // Write the updated data object to the json file
          fs.writeFile("data/driver.json", JSON.stringify(jsonData), (err) => {
            if (err) {
              console.log(err);
            }
            res.send("Object added successfully");
          });
        });
      } else {
        jsonData = { [req.body.driverId]: req.body };
        // Write the new data object to the json file
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

//GET all driver
app.get("/driver", function (req, res) {
  //read json file if exists and parse data
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

//GET one specific driver
app.get("/driver/:id", async function (req, res) {
  try {
    //read json file async and parse data
    const data = await fs.promises.readFile("data/driver.json", "utf8");
    const drivers = JSON.parse(data);

    //search for matched driver
    const driver = Object.entries(drivers).find(
      ([key, value]) => key == req.params.id
    );
    if (!driver) {
      res.status(404).send("Driver not found.");
    } else {
      //return driver
      res.json(driver[1]);
    }
  } catch (err) {
    res.status(500).send(`Error reading driver.json file: ${err}`);
  }
});

//DELETE all driver
app.delete("/driver", function (req, res) {
  //delete json file
  fs.unlink("data/driver.json", (err) => {
    if (err) {
      throw err;
    }
    res.status(200).json({ status: "Succesfully deleted" });
  });
});

//EXECUTE script for calculation
app.get("/insertData/:id", (req, res) => {
  let id = req.params.id;
  exec("npm run start " + id, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return res.status(500).send(error.message);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return res.status(500).send(stderr);
    }
    res.status(200).send("Script executed successfully");
  });
});

//Server listen on port 3000
app.listen(port);
console.log(`App listen on port ${port}`);
