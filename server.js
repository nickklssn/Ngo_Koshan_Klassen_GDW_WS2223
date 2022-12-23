const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const Datastore = require("nedb");
const exp = require("constants");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const database = new Datastore("database.db");
database.loadDatabase();

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/driver", function (req, res) {
  console.log(req.body);
  const data = req.body;
  database.insert(data);
  res.end();
});

app.get("/driver", function (req, res) {
  database.find({}, (err, data) => {
    res.json({ data });
    console.log(data);
  });
});

/* app.delete("/driver/:id", function (req, res) {
  const { id } = req.params.driverName;

  database.remove(
    { driverName: id },
    { multi: true },
    function (err, numRemoved) {}
  );

  database.persistence.compactDatafile();
  res.redirect("driver");
}); */

app.listen(port);
console.log(`App listen on port ${port}`);
