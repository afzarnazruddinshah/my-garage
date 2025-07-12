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

router.get("/garage/:id", async (req, res) => {
  const garageId = req.params.id;
  db.any(
    `SELECT 
      garages.gid, garages.name, garages.address, garages.city, garages.state, garages.zipcode, 
      garage_owners.name AS garage_owner_name, garage_owners.phone, garage_owners.email
      FROM garages
      JOIN garage_owners
      ON garages.owner_id = garage_owners.gid
      WHERE garages.gid = ${garageId};`
  )
    .then((data) => {
      res.json({ status: constants.successStatus, data: data });
    })
    .catch((error) => {
      res.json({ error, status: constants.errorStatus });
    });
});

router.get("/vehicles", async (req, res) => {
  db.any(
    `SELECT 
      vehicles.vin, 
      vehicles.make, 
      vehicles.model, 
      vehicles.make_year, 
      vehicles.owner_id, 
      vehicles.odo_reading, 
      vehicles.last_service
    FROM vehicles;`
  )
    .then((data) => {
      res.json({ status: constants.successStatus, data: data });
    })
    .catch((error) => {
      res.json({ error, status: constants.errorStatus });
    });
});

module.exports = router;
