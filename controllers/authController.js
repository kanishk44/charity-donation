const User = require("../models/user");
const Charity = require("../models/charity");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, isAdmin, adminCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Validate admin registration
    if (isAdmin) {
      if (!adminCode) {
        return res
          .status(400)
          .json({ message: "Admin code is required for admin registration" });
      }
      if (adminCode !== process.env.ADMIN_CODE) {
        return res.status(400).json({ message: "Invalid admin code" });
      }
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      isAdmin: isAdmin && adminCode === process.env.ADMIN_CODE,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

exports.charityLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Attempting charity login for:", email); // Debug log
    const charity = await Charity.findOne({ where: { email } });
    if (!charity) {
      console.log("Charity not found"); // Debug log
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Found charity:", {
      id: charity.id,
      email: charity.email,
      hasPassword: !!charity.password,
      passwordLength: charity.password?.length,
    });

    if (charity.status !== "approved") {
      console.log("Charity not approved:", charity.status); // Debug log
      return res.status(403).json({
        message:
          "Your charity account is pending approval or has been rejected",
      });
    }

    // Validate password
    console.log("Attempting to validate password:", {
      providedPassword: password,
      storedPasswordHash: charity.password,
    });
    const isValidPassword = await charity.validatePassword(password);
    console.log("Password validation result:", isValidPassword); // Debug log

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: charity.id, type: "charity" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      charity: {
        id: charity.id,
        name: charity.name,
        email: charity.email,
      },
    });
  } catch (error) {
    console.error("Charity login error:", error); // Debug log
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
};
