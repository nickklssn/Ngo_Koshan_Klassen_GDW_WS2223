const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

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

app.get("/car/:id", function (req, res) {
  fs.readFile("data/car.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    var obj = JSON.parse(data);
    var choosedCar = obj[req.params.id - 1];
    res.status(200).json(choosedCar);
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
  var car = JSON.stringify(req.body);

  fs.writeFile("data/car.json", driver, (err) => {
    if (err) {
      throw err;
    }
  });
  res.status(201).json({ status: "Created" });
});

app.post("/driver", function (req, res) {
  var driver = JSON.stringify(req.body);

  fs.writeFile("data/driver.json", driver, (err) => {
    if (err) {
      throw err;
    }
    res.status(201).json({ status: "Created" });
  });
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

app.get("/driver/:id", function (req, res) {
  fs.readFile("data/driver.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    var obj = JSON.parse(data);
    var choosedDriver = obj[req.params.id - 1];
    res.status(200).json(choosedDriver);
  });
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
