const ImpactReport = require("../models/impactReport");
const Charity = require("../models/charity");
const Donation = require("../models/donation");
const User = require("../models/user");
const emailService = require("../utils/emailService");

exports.createReport = async (req, res) => {
  try {
    const {
      title,
      description,
      period,
      beneficiariesCount,
      achievements,
      images,
    } = req.body;
    const charityId = req.charity.id; // From charity auth middleware

    const report = await ImpactReport.create({
      title,
      description,
      period,
      beneficiariesCount,
      achievements,
      images,
      CharityId: charityId,
    });

    // Fetch unique donors for this charity
    const donors = await User.findAll({
      include: [
        {
          model: Donation,
          where: {
            CharityId: req.charity.id,
            status: "completed",
          },
          attributes: [],
        },
      ],
      group: ["User.id"],
    });

    // Send update emails to donors
    try {
      await emailService.sendCharityUpdate(report, donors);
    } catch (emailError) {
      console.error("Error sending update emails:", emailError);
    }

    res.status(201).json({
      message: "Impact report created successfully",
      report,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating report", error: error.message });
  }
};

exports.getCharityReports = async (req, res) => {
  try {
    const reports = await ImpactReport.findAll({
      where: { CharityId: req.params.charityId },
      order: [["createdAt", "DESC"]],
    });

    res.json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reports", error: error.message });
  }
};
