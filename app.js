require("dotenv").config();
const { Pool } = require("pg");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 4242;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const sampleRoutes = require("./routes/sampleRoutes");
const garageRoutes = require("./routes/garageRoutes");
app.use("/sampleRoute", sampleRoutes);
app.use("/garage", garageRoutes);

module.exports = app;
