const jwt = require("jsonwebtoken");
const Charity = require("../models/charity");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const charity = await Charity.findOne({
      where: {
        id: decoded.id,
        status: "approved",
      },
    });

    if (!charity) {
      return res
        .status(403)
        .json({ message: "Charity not found or not approved" });
    }

    req.charity = charity;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
