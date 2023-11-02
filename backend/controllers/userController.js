const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { Op } = require("sequelize");
const logger = require("../config/logger");
const {
  validateLogin,
  validateChangePassword,
  validateRegister,
  validateUpdateDetails
} = require("../validators/userValidator");
const PrivacySetting = require("../models/privacySetting");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME;

// Register user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, status } = req.body;

    const validation = validateRegister(req.body);
    if (validation.error) {
      return res
        .status(400)
        .send({ message: validation.error.details[0].message });
    }

    // Make sure user doesn't already exist
    const existingUserEmail = await User.findOne({ where: { email: email } }); // Check email likeness
    const existingUsername = await User.findOne({
      where: { username: username },
    }); // Check username likeness
    // If email exists
    if (existingUserEmail) {
      return res
        .status(409)
        .send({ message: "User with this email already exists." });
    }
    // If username exists
    if (existingUsername) {
      return res.status(409).send({ message: "Username is already taken!" });
    } // Create user
    const newUser = await User.create({
      username,
      email,
      password,
      status,
    });

    // Create default privacy settings for the new user
    await PrivacySetting.create({
      user_id: newUser.id,
      show_email: "PRIVATE",
      show_name: "PRIVATE",
      show_city: "PRIVATE",
      show_state_province: "PRIVATE",
      show_country: "PRIVATE",
      show_current_occupation: "PRIVATE",
      show_goal_occupation: "PRIVATE",
      show_profile_picture: "PRIVATE",
      show_resume: "PRIVATE",
      show_status: "PRIVATE",
      show_category: "PRIVATE",
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
    logger.error("Error in /register route:", error);
    res.status(500).send({ message: "Server error for registration route." });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    //
    logger.info("Attempting login with payload:", req.body);

    const { identifier, password } = req.body; // set to identifier for username OR email
    // Identifier will need to be sent via front end

    // Validate user input
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    //
    logger.info("Looking for user with identifier:", identifier);

    const user = await User.findOne({
      where: { [Op.or]: [{ username: identifier }, { email: identifier }] },
    });
    if (!user) {
      //
      logger.info("User not found for identifier:", identifier);

      return res.status(404).send({ message: "User not found" });
    }

    // check inactive users
    if (!user.isActive) {
      return res.status(403).send({ message: "Account is deactivated." });
    }

    //
    logger.info("User found. Checking password...");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      //
      logger.info("Password mismatch for user:", user.username || user.email);

      return res.status(401).send({ message: "Incorrect password." });
    }

    //
    logger.info("Password verified. Generating JWT...");

    //Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION_TIME + "s" }
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
    logger.error("Server error during login:", error.message, error.stack);
    res.status(500).send({ message: "Server error for login route" });
  }
};

// Soft delete
const deactivateUser = async (req, res) => {
  logger.info("UserID in Deactivate Route:", req.userId);
  try {
    const userId = req.user.id; // needs to be retrieved from the JWT

    await User.update({ isActive: false }, { where: { id: userId } });

    res.status(200).send({ message: "User deactivation successful!" });
  } catch (error) {
    console.error("Error in user deactivation : ", error);
    res.status(500).send({ message: "Server error during user deactivation" });
  }
};

// Hard delete
const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.destroy({ where: { id: userId } });

    res.status(200).send({ message: "User deleted permanently." });
  } catch (error) {
    logger.error("Error in user deletion : ", error);
    res.status(500).send({ message: "Server error during user deactivation" });
  }
};

// Fetch deactivated users
const fetchDeactivatedUser = async (req, res) => {
  try {
    const users = await User.findAll({ where: { isActive: false } });

    res.status(200).send(users);
  } catch (error) {
    logger.error("error fetching deactivated users : ", error);
    res
      .status(500)
      .send({ message: "Server error during fetch of deactivated users." });
  }
};

// Restore deactivated user
const restoreUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    await User.update({ isActive: true }, { where: { id: userId } });

    res.status(200).send({ message: "User restoration complete." });
  } catch (error) {
    logger.error("Error in restoring user:", error);
    res.status(500).send({ message: "Server error during user restoration" });
  }
};

// Update user details
const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate user input
    // const { error } = validateUpdateDetails(req.body);
    // if (error)
    //   return res.status(400).send({ message: error.details[0].message });

    // Updatable fields
    const updatableFields = [
      "name",
      "city",
      "state_province",
      "country",
      "profile_picture",
      "current_occupation",
      "goal_occupation",
      "resume",
    ];
    let updates = {};

    // Loop through the updatable fields and add them to the updates object if they exist in the request body
    for (let field of updatableFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    

    // Expect user to update fields
    await User.update(updates, { where: { id: userId } });

    // All good status
    const updatedUser = await User.update(updates, { where: { id: userId }, returning: true });
    res.status(200).send({ message: "User details updated successfully!", user: updatedUser });

  } catch (error) {
    logger.error("Error updating user details: ", error);
    res
      .status(500)
      .send({ message: "Server error while updating user details!" });
  }
};

// Get user ID from username
const getUserIdByUsername = async (req, res) => {
  console.log('Getting user ID for username:', req.params.username);
  try {
    const username = req.params.username;

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    res.status(200).send({ userId: user.id });
  } catch (error) {
    logger.error("Error fetching user ID:", error);
    res.status(500).send({ message: "Server error while fetching user ID" });
  }
};



// Fetch user details
const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId, {
      attributes: [
        "username",
        "email",
        "name",
        "city",
        "state_province",
        "country",
        "profile_picture",
        "current_occupation",
        "goal_occupation",
        "resume",
      ],
    });

    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }

    // All good status
    res.status(200).send(user);
  } catch (error) {
    logger.error("Error fetching user details:", error);
    res
      .status(500)
      .send({ message: "Server error while fetching user details" });
  }
};

// Change user password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // had to change for middleware connection
    const { oldPassword, newPassword } = req.body;

    // Validate user input
    const { error } = validateChangePassword(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    // Find by userId
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).send({ message: "User not found." });

    // validate old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid)
      return res.status(401).send({ message: "Old password is incorrect." });

    // Hash new password and save
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // All good status
    res.status(200).send({ message: "Password changed successfully." });
  } catch (error) {
    logger.error("Error in changhing password: ", error);
    res.status(500).send({ message: "Server error during password change." });
  }
};

module.exports = {
  loginUser,
  registerUser,
  deactivateUser,
  deleteUser,
  fetchDeactivatedUser,
  restoreUser,
  updateUserDetails,
  getUserDetails,
  getUserIdByUsername,
  changePassword,
};
