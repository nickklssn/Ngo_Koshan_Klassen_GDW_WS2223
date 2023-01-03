const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname)));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/car", function (req, res) {
  fs.readFile("car/car.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    var obj = JSON.parse(data);
    res.json(obj);
  });
});

app.listen(port);
console.log(`App listen on port ${port}`);
