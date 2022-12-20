const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname)));

app.get("/", function (req, res) {
  res.render("index");
});

app.listen(port);
console.log(`App listen on port ${port}`);
