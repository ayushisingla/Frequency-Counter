const fetch = require("node-fetch");
var http = require("http");
var fs = require("fs");
const PORT = 3000;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/", (req, res) => {
  // res.send(`Feswwdwull name is:${req.body.n}.`);
  const url = "https://terriblytinytales.com/test.txt";
  let str = "";
  const num = req.body.n;

  fetch(url)
    .then((resp) => resp.text())
    .then((data) => data.split(/\s+/))
    .then((data) => {
      var wordTable = {};
      // create map for word counts
      data.forEach(function (key) {
        if (wordTable.hasOwnProperty(key)) {
          //hasOwnProperty() method is used to check if the word exists as a key
          wordTable[key]++;
        } else {
          //If the word doesn’t exist again, then we add it to the map and give it an initial value of 1
          wordTable[key] = 1;
        }
      });
      // return wordTable;
      var result = [];
      result = Object.keys(wordTable).map(function (key) {
        return {
          name: key,
          total: wordTable[key],
        };
      });

      result.sort(function (a, b) {
        return b.total - a.total;
      });

      // Function for getting N top most results
      let final = [];
      for (var i = 0; i < num; i++) {
        //console.log(result[i]);
        final.push(result[i]);
      }

      // Format and render html
      fs.readFile("./Table.html", "utf8", function (err, data) {
        // data
        // console.log("ttt1: ", data);
        // add data in html
        var tabularData = "";
        var i = 0;
        final.map((d) => {
          tabularData = tabularData + "<p>" + d.name + " - " + d.total + "</p>";
        });

        data = data.replace("//data//", tabularData);
        res.writeHead(200, { "Content-Type": "text/HTML" });
        res.write(data);
        res.end();
        // res.end(JSON.stringify(final));
      });
    });
});
app.get("/", (req, res) => {
  fs.readFile("./index.html", function (err, data) {
    res.writeHead(200, { "Content-Type": "text/HTML" });
    res.write(data);
    res.end();
  });
});
app.listen(PORT, () => {
  console.log(`Server running on port${PORT}`);
});
