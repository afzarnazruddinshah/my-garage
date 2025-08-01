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
  customers.cust_id, 
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
      assignments.assgn_id, 
      assignments.vin, 
      customers.name as owner_name, 
      assignments.checkin_date, 
      assignments.issue, 
      assignments.status, 
      technicians.name as technician_name
    FROM assignments
    LEFT JOIN customers
    ON assignments.owner_id = customers.cust_id
    LEFT JOIN technicians
    ON assignments.technician_id = technicians.tid;`
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

/*
page1: /getTransactions?direction=forward
page2: /getTransactions?direction=forward&last=2025-11-22
page3: /getTransactions?direction=forward&last=2025-10-28
From Page3 to Page2:
/getTransactions?direction=backwards&last=2025-10-28&first=2025-11-17
*/
router.get("/getTransactions", async (req, res) => {
  let { direction, first, last } = req.query;
  first = String(first || "");
  last = String(last || "2026-01-01");
  let whereStatement = "";
  if (direction === "forward") {
    whereStatement = `WHERE txn_date < '${last}'`;
  } else {
    whereStatement = `WHERE txn_date <= '${first}' AND txn_date >= '${last}'`;
  }
  db.any(
    `SELECT txn_id, assignment_id, cost, status, payment_mode, txn_date
     FROM transactions 
     ${whereStatement} 
     ORDER BY txn_date DESC
     LIMIT 10;`
  )
    .then((data) => {
      res.json({ status: constants.successStatus, data: data });
    })
    .catch((error) => {
      res.json({ error, status: constants.errorStatus });
    });
});

router.get("/getTotalTransactions", async (req, res) => {
  
  db.any(
    `SELECT count(txn_id) FROM transactions;`
  )
    .then((data) => {
      res.json({ status: constants.successStatus, data: data });
    })
    .catch((error) => {
      res.json({ error, status: constants.errorStatus });
    });
});

router.post("/customer", async (req, res) => {
console.log("req", req);
console.log("body", req.body);
  let { name, gender, phone, email, vehicleNum } = req.body;
  if (name && gender && phone && email && vehicleNum) {
    db.one(
      `INSERT INTO CUSTOMERS VALUES(
        '${name}', '${gender}', '${phone}', '${email}', '${vehicleNum}', 0, 0, 0) RETURNING cust_id;`
    ).then((data) => {
      res.json({ status: constants.successStatus, data: data });
    });
  } else {
    res.json({
      status: {
        statusCode: 200,
        statusFlag: "ERROR",
        statusMsg: "Please fill all the Required Fields",
      },
    });
  }
});

router.post("/vehicle", async (req, res) => {
  let { vehicleNum, make, model, year, owner_id, odo_reading, last_service } =
    req.body;
  if (
    vehicleNum &&
    make &&
    model &&
    year &&
    owner_id &&
    odo_reading &&
    last_service
  ) {
    db.one(
      `INSERT INTO vehicles VALUES (
        '${vehicleNum}', '${make}', '${model}', ${year}, ${owner_id}, ${odo_reading}, '${last_service}') RETURNING vin;`
    ).then((data) => {
      res.json({ status: constants.successStatus, data: data });
    });
  } else {
    res.json({
      status: {
        statusCode: 200,
        statusFlag: "ERROR",
        statusMsg: "Please fill all the Required Fields",
      },
    });
  }
});

router.post("/assignment", async (req, res) => {
  let { vehicleNum, owner_id, checkin_date, issue } = req.body;
  if (vehicleNum && owner_id && checkin_date && issue) {
    db.one(
      `INSERT INTO assignments VALUES (
'${vehicleNum}', ${owner_id}, '${checkin_date}', '${issue}', 'PENDING', 10) RETURNING assgn_id;`
    ).then((data) => {
      res.json({ status: constants.successStatus, data: data });
    });
  } else {
    res.json({
      status: {
        statusCode: 200,
        statusFlag: "ERROR",
        statusMsg: "Please fill all the Required Fields",
      },
    });
  }
});
module.exports = router;
