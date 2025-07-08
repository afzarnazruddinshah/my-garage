const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

//separate routes inside routes folder - modularity
const sampleRoutes = require('./routes/sampleRoutes');
app.use('/sampleRoute', sampleRoutes);

module.exports = app;
