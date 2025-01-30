const Donation = require("../models/donation");
const Charity = require("../models/charity");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const ImpactReport = require("../models/impactReport");
const User = require("../models/user");
const generateReceipt = require("../utils/receiptGenerator");
const emailService = require("../utils/emailService");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get Razorpay key
exports.getRazorpayKey = async (req, res) => {
  try {
    res.json({ key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching key", error: error.message });
  }
};

// Create donation order
exports.createOrder = async (req, res) => {
  try {
    const { amount, charityId } = req.body;

    const charity = await Charity.findByPk(charityId);
    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `don_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating donation order", error: error.message });
  }
};

// Verify and complete donation
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      charityId,
      amount,
    } = req.body;

    // Verify payment signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Create donation record
    const donation = await Donation.create({
      amount,
      paymentId: razorpay_payment_id,
      status: "completed",
      UserId: req.user.id,
      CharityId: charityId,
      receiptNumber: `RCP${Date.now()}`,
      receiptUrl: `/receipts/${razorpay_payment_id}.pdf`, // We'll generate this later
    });

    // Send donation confirmation email
    try {
      const user = await User.findByPk(req.user.id);
      const charity = await Charity.findByPk(charityId);
      await emailService.sendDonationConfirmation(donation, user, charity);
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError);
      // Don't throw error as donation is already processed
    }

    res.json({
      message: "Donation successful",
      donation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying payment", error: error.message });
  }
};

// Get user's donation history with details
exports.getDonationHistory = async (req, res) => {
  try {
    const donations = await Donation.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: Charity,
          attributes: ["name", "email", "phone"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!donations || donations.length === 0) {
      return res.status(404).json({ message: "No donations found" });
    }

    res.json(donations);
  } catch (error) {
    console.error("Error in getDonationHistory:", error);
    res
      .status(500)
      .json({ message: "Error fetching donations", error: error.message });
  }
};

// Download donation receipt
exports.downloadReceipt = async (req, res) => {
  try {
    const donation = await Donation.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
      include: [
        {
          model: Charity,
          attributes: ["name", "address"],
        },
        {
          model: User,
          attributes: ["name", "email"],
        },
      ],
    });

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    const receipt = generateReceipt(donation);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${donation.receiptNumber}.pdf`
    );

    receipt.end(); // End the document
    receipt.pipe(res).on("finish", () => {
      res.end();
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error downloading receipt", error: error.message });
  }
};
