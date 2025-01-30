const express = require("express");
const router = express.Router();
const charityController = require("../controllers/charityController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

// Public routes
router.post("/register", charityController.register);
router.get("/search", charityController.searchCharities);
router.get("/:id", charityController.getProfile);

// Protected routes
router.put("/:id", auth, charityController.updateProfile);

// Admin routes
router.get("/", auth, charityController.getAllCharities);
router.get("/:id/details", auth, charityController.getCharityDetails);
router.put("/:id/status", auth, adminAuth, charityController.updateStatus);

module.exports = router;
