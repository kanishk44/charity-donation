const Charity = require("../models/charity");
const { Op } = require("sequelize");
const Donation = require("../models/donation");
const { sequelize } = require("../models/charity");

// Register a new charity
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      description,
      mission,
      website,
      phone,
      address,
      category,
      city,
      state,
      country,
      registrationNumber,
      documents,
    } = req.body;

    // Check if charity already exists
    const existingCharity = await Charity.findOne({ where: { email } });
    if (existingCharity) {
      return res.status(400).json({ message: "Charity already registered" });
    }

    // Create new charity
    const charity = await Charity.create({
      name,
      email,
      password,
      description,
      mission,
      website,
      phone,
      address,
      category,
      city,
      state,
      country,
      registrationNumber,
      documents,
      status: "pending",
    });

    res.status(201).json({
      message: "Charity registration submitted for approval",
      charity: {
        id: charity.id,
        name: charity.name,
        status: charity.status,
      },
    });
  } catch (error) {
    console.error("Charity registration error:", error);
    res
      .status(500)
      .json({ message: "Error registering charity", error: error.message });
  }
};

// Get charity profile
exports.getProfile = async (req, res) => {
  try {
    const charity = await Charity.findByPk(req.params.id);
    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }

    res.json(charity);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching charity", error: error.message });
  }
};

// Update charity profile
exports.updateProfile = async (req, res) => {
  try {
    const charity = await Charity.findByPk(req.params.id);
    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }

    const allowedUpdates = [
      "name",
      "description",
      "mission",
      "website",
      "phone",
      "address",
    ];

    allowedUpdates.forEach((update) => {
      if (req.body[update]) {
        charity[update] = req.body[update];
      }
    });

    await charity.save();

    res.json({
      message: "Charity profile updated successfully",
      charity,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating charity", error: error.message });
  }
};

// Admin: Get all charities
exports.getAllCharities = async (req, res) => {
  try {
    const { status = "pending" } = req.query;

    const charities = await Charity.findAll({
      where: { status },
      order: [["createdAt", "DESC"]],
    });
    res.json(charities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching charities", error: error.message });
  }
};

// Admin: Update charity status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const charity = await Charity.findByPk(req.params.id);

    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    charity.status = status;
    await charity.save();

    res.json({
      message: "Charity status updated successfully",
      charity,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

// Search and filter charities
exports.searchCharities = async (req, res) => {
  try {
    const {
      search,
      category,
      city,
      state,
      country,
      status = "approved",
      page = 1,
      limit = 10,
    } = req.query;

    const whereClause = { status };

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { mission: { [Op.like]: `%${search}%` } },
      ];
    }

    if (category) whereClause.category = category;
    if (city) whereClause.city = city;
    if (state) whereClause.state = state;
    if (country) whereClause.country = country;

    const charities = await Charity.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [["name", "ASC"]],
    });

    res.json({
      charities: charities.rows,
      total: charities.count,
      pages: Math.ceil(charities.count / limit),
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error searching charities", error: error.message });
  }
};

// Get charity details with statistics
exports.getCharityDetails = async (req, res) => {
  try {
    const charity = await Charity.findByPk(req.params.id);

    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }

    // Get donation statistics
    const stats = await Donation.findOne({
      where: { CharityId: charity.id },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalDonations"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.fn("DISTINCT", sequelize.col("UserId"))
          ),
          "uniqueDonors",
        ],
      ],
    });

    const charityData = charity.toJSON();
    charityData.stats = {
      totalDonations: parseInt(stats?.getDataValue("totalDonations") || 0),
      totalAmount: parseFloat(stats?.getDataValue("totalAmount") || 0),
      uniqueDonors: parseInt(stats?.getDataValue("uniqueDonors") || 0),
    };

    res.json(charityData);
  } catch (error) {
    console.error("Error fetching charity details:", error);
    res.status(500).json({
      message: "Error fetching charity details",
      error: error.message,
    });
  }
};
