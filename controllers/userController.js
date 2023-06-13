const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { body } = require("express-validator");
require("dotenv").config();

// SignUp
exports.signup = [
  // Sanitize and validate inputs
  body("firstName").trim().escape(),
  body("lastName").trim().escape(),
  body("email").trim().escape().isEmail(),
  body("password").trim().escape().isLength({ min: 3 }),

  async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();

      res
        .status(201)
        .json({ message: "User created successfully!", savedUser });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];

// LogIn
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare provided password with the hashed password
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({ message: "Invaild email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.SECRET, {
      expiresIn: "1day",
    });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create test user
exports.test_user = async (req, res, next) => {
  try {
    const email = {
      email: "test@user.com",
    };

    const user = await User.findOne(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid test user" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.SECRET, {
      expiresIn: "1day",
    });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
