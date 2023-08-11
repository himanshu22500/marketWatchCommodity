const express = require("express");
require("dotenv").config();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("db.db");
const app = express();
app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log("Server is listening on port http://localhost:3000/");
});

app.get("/distinctCommodities", (req, res) => {
  const query = "SELECT DISTINCT Commodity FROM CommodityData";

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "An error occurred" });
    }

    const commodities = rows.map((row) => row.Commodity);
    res.json(commodities);
  });
});

app.get("/distinctCommodities/:commodity", (req, res) => {
  const { commodity } = req.params;
  const query = `SELECT DISTINCT Quality FROM CommodityData where commodity like '%${commodity}%'`;

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'An error occurred' });
      }

      const commodities = rows.map(row => row.Quality);
      res.json(commodities);
    });
});


app.get("/distinctlocationsForCommodity/:commodity", (req, res) => {
  const { commodity } = req.params;
  const query = `SELECT DISTINCT Location FROM CommodityData where commodity like '%${commodity}%'`;

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'An error occurred' });
      }

      const commodities = rows.map(row => row.Location);
      res.json(commodities);
    });
});
