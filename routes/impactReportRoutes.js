const express = require("express");
const router = express.Router();
const impactReportController = require("../controllers/impactReportController");
const charityAuth = require("../middleware/charityAuth");

router.post("/", charityAuth, impactReportController.createReport);
router.get("/charity/:charityId", impactReportController.getCharityReports);

module.exports = router;
