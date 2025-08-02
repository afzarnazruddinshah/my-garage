const express = require("express");
const router = express.Router();
const db = require("../db");
const constants = require("../_utils/constants");

router.post("/analytics/most-serviced", async (req, res) => {
  let { hasModel, startDate, endDate } = req.query;
  let modelColumn = "";
  let groupByModelStatement = "";
  if (hasModel) {
    modelColumn = "vehicles.model,";
    groupByModelStatement = ",vehicles.model";
  }
  if (!startDate) {
    startDate = "2025-01-01";
  }
  if (!endDate) {
    endDate = "2026-01-01";
  }
  let selectStatement = `SELECT vehicles.make, ${modelColumn} COUNT(assignments.issue) as service_count`;
  const dbQuery = `
    ${selectStatement}
    FROM vehicles
    INNER JOIN assignments
    ON assignments.vin = vehicles.vin
    WHERE assignments.checkin_date < '${endDate}' AND assignments.checkin_date > '${startDate}'
    GROUP BY  vehicles.make ${groupByModelStatement}
    ORDER BY service_count DESC;`;
  db.any(dbQuery)
    .then((data) => {
      res.json({ status: constants.successStatus, data: data });
    })
    .catch((error) => {
      res.json({ error, status: constants.errorStatus });
    });
});

module.exports = router;
