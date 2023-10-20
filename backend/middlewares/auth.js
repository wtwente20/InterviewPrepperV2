const DefaultAnswer = require('../models/defaultAnswer');
const Answer = require('../models/answer')
const jwt = require("jsonwebtoken");
const logger = require('../config/logger');
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// JWT Authentication Middleware
// This function is extracting the JWT token from the header, verifying it,
// and then adding the decoded user's role and userId to the request object.
const authenticate = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  if (!tokenHeader) {
    return res.status(403).send({ message: "Token is required" });
  }

  logger.info("Received Token Header:", tokenHeader);

  // Split the tokenHeader to extract only the token part after "Bearer "
  const token = tokenHeader.split(" ")[1];
  logger.info("Extracted Token:", token);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(401).send({ message: "Invalid Token!" });
    }
    logger.info("Decoded User:", user);
    req.user = {
      id: user.userId,
      role: user.role,
    };
    next();
  });
};

// Authorization Middleware (example for an admin check)
const requireAdmin = (req, res, next) => {
  // Assuming that your JWT payload has a role field
  const userRole = req.userRole;

  if (userRole !== "admin") {
    return res.status(403).send({ message: "Access denied. Admins only." });
  }

  next();
};

const checkAnswerOwnerOrAdmin = async (req, res, next) => {
  try {
    let resource;

    const defaultAnswer = await DefaultAnswer.findByPk(req.params.id);
    const answer = await Answer.findByPk(req.params.id);

    logger.info('Default Answer:', defaultAnswer);
    logger.info('Answer:', answer);
    
    // Check if it's a default answer or a regular answer
    if (defaultAnswer) {
      resource = defaultAnswer;
    } else if (answer) {
      resource = answer;
    } else {
      return res.status(404).json({ message: "Answer not found." });
    }

    logger.info('Resource User ID:', resource.user_id);
    logger.info('Request User ID:', req.userId);
    logger.info('Request User Role:', req.userRole);

    // Check if the user is the owner of the answer or an admin
    if (resource.user_id !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .send({
          message:
            "Access denied. You don't have permission to perform this action!",
        });
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error checking answer ownership.",
        error: error.message,
      });
  }
};


module.exports = {
  authenticate,
  requireAdmin,
  checkAnswerOwnerOrAdmin,
};
