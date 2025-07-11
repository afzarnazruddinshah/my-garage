const express = require("express");
const router = express.Router();
const db = require("../db");
const constants = require("../_utils/constants");

router.get("/technicians", async (req, res) => {
  db.any(
    `SELECT 
      technicians.emp_id, 
      technicians.name, 
      technicians.gender, 
      technicians.age, 
      technicians.years_of_exp, 
      technicians.specialization, 
      technicians.phone, 
      technicians.email 
      FROM technicians`
  )
    .then((data) => {
      res.json({ status: constants.successStatus, data: data });
    })
    .catch((error) => {
      res.json({ error, status: constants.errorStatus });
    });
});

module.exports = router;
