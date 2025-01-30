const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Charity authentication
router.post("/charity/login", authController.charityLogin);

module.exports = router;
