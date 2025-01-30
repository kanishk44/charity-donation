const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donationController");
const auth = require("../middleware/auth");

router.get("/razorpay-key", auth, donationController.getRazorpayKey);
router.post("/create-order", auth, donationController.createOrder);
router.post("/verify-payment", auth, donationController.verifyPayment);
router.get("/history", auth, donationController.getDonationHistory);
router.get("/receipt/:id", auth, donationController.downloadReceipt);

module.exports = router;
