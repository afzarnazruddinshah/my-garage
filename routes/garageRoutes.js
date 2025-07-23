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

router.get("/customers", async (req, res) => {
  db.any(
    `SELECT 
  customers.cid, 
  customers.name, 
  customers.gender, 
  customers.phone, 
  customers.email, 
  customers.veh1_id, 
  customers.veh2_id, 
  customers.veh3_id, 
  customers.veh4_id
FROM customers;`
  )
    .then((data) => {
      res.json({ status: constants.successStatus, data: data });
    })
    .catch((error) => {
      res.json({ error, status: constants.errorStatus });
    });
});

router.get("/assignments", async (req, res) => {
  db.any(
    `SELECT 
      assignments.aid, 
      assignments.vin, 
      customers.name as owner_name, 
      assignments.checkin_date, 
      assignments.issue, 
      assignments.status, 
      technicians.name as technician_name
    FROM assignments
    LEFT JOIN customers
    ON assignments.owner_id = customers.cid
    LEFT JOIN technicians
    ON assignments.technician_id = technicians.emp_id;`
  )
    .then((data) => {
      res.json({ status: constants.successStatus, data: data });
    })
    .catch((error) => {
      res.json({ error, status: constants.errorStatus });
    });
});

router.get("/transactions", async (req, res) => {
  db.any(
    `SELECT 
      transactions.txn_id, 
      transactions.assignment_id, 
      transactions.cost, 
      transactions.status, 
      transactions.payment_mode 
     FROM transactions;`
  )
    .then((data) => {
      res.json({ status: constants.successStatus, data: data });
    })
    .catch((error) => {
      res.json({ error, status: constants.errorStatus });
    });
});

router.get("/getTransactions", async (req, res) => {
  let date = String(req.query.date);
  let operator = "<";
  if (!date) {
    date = "2025-01-01";
    operator = ">=";
  }
  db.any(
    `SELECT txn_id, assignment_id, cost, status, payment_mode, txn_date
     FROM transactions
     WHERE txn_date ${operator} '${date}'
     ORDER BY txn_date desc
     LIMIT 10;`
  )
    .then((data) => {
      res.json({ status: constants.successStatus, data: data });
    })
    .catch((error) => {
      res.json({ error, status: constants.errorStatus });
    });
});
module.exports = router;
