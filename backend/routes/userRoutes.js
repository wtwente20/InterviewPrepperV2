const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { Op } = require("sequelize");
const { authenticate, requireAdmin } = require('../middlewares/auth');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME;

//Registration Route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, status } = req.body;

    // Make sure user doesn't already exist
    const existingUserEmail = await User.findOne({ where: { email: email } }); // Check email likeness
    const existingUsername = await User.findOne({ where: { username: username } }); // Check username likeness
    // If email exists
    if (existingUserEmail) {
      return res
        .status(409)
        .send({ message: "User with this email already exists." });
    }
    // If username exists
    if (existingUsername) {
      return res.status(409).send({ message: "Username is already taken!" });
    }

    // Create user
    const newUser = await User.create({
      username,
      email,
      password,
      status,
    });

    res.status(201).send({
      message: "User registered successfully!",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error("Error in /register route:", error);
    res.status(500).send({ message: "Server error for registration route." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body; // set to identifier for username OR email
    // Identifier will need to be sent via front end

    const user = await User.findOne({
      where: { [Op.or]: [{ username: identifier }, { email: identifier }] },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Incorrect password." });
    }

    //Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION_TIME + 's' }
    );

    res.status(200).send({
      message: "Logged in successfully.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Server error for login route" });
  }
});

// Deactivate user account
router.post("/deactivate", [authenticate], async (req, res) => {
  console.log("UserID in Deactivate Route:", req.userId);
  try {
    const userId = req.userId; // needs to be retrieved from the JWT

    await User.update({ isActive: false }, {where: { id: userId } });

    res.status(200).send({ message: "User deactivation successful!"});
  } catch (error) {
    console.error("Error in user deactivation : ", error);
    res.status(500).send({ message: "Server error during user deactivation"})
  }
});

// Hard deletion of user
router.post("/delete", [authenticate], async (req, res) => {
  try {
    const userId = req.userId;

    await User.destroy({ where: { id: userId } });

    res.status(200).send({ message: "User deleted permanently."});
  } catch (error) {
    console.error("Error in user deletion : ", error);
    res.status(500).send({ message: "Server error during user deactivation"})
  }
});

router.use(authenticate);

// Fetch deactivated users
router.get("/deactivated", requireAdmin, async (req, res) => {
  try {
    const users = await User.findAll({ where: { isActive: false } });

    res.status(200).send(users);
  } catch (error) {
    console.error("error fetching deactivated users : ", error);
    res.status(500).send({ message: "Server error during fetch of deactivated users."})
  }
});

// Restoring deactivated users
router.post("/restore/:userId", requireAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;

    await User.update({ isActive: true }, { where: { id: userId } });

    res.status(200).send({ message: "User restoration complete."});
  } catch (error) {
    console.error("Error in restoring user:", error);
    res.status(500).send({ message: "Server error during user restoration" });
  }
});

module.exports = router;
