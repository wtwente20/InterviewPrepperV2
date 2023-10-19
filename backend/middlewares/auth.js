const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// JWT Authentication Middleware
// This function is extracting the JWT token from the header, verifying it,
// and then adding the decoded user's role and userId to the request object.
exports.authenticate = (req, res, next) => {
  const tokenHeader = req.headers['authorization'];
  if (!tokenHeader) {
    return res.status(403).send({ message: "Token is required" });
  }

  console.log("Received Token Header:", tokenHeader);

  // Split the tokenHeader to extract only the token part after "Bearer "
  const token = tokenHeader.split(' ')[1];
  console.log("Extracted Token:", token);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(401).send({ message: "Invalid Token!" });
    }
    console.log("Decoded User:", user);
    req.userRole = user.role;
    req.userId = user.userId;
    next();
  });
};


// Authorization Middleware (example for an admin check)
exports.requireAdmin = (req, res, next) => {
  // Assuming that your JWT payload has a role field
  const userRole = req.userRole;

  if (userRole !== 'admin') {
    return res.status(403).send({ message: "Access denied. Admins only." });
  }

  next();
};

// only the owner of the answer or an admin can update or delete an answer
exports.checkAnswerOwnerOrAdmin = async (req, res, next) => {
  try {
      const defaultAnswer = await DefaultAnswer.findByPk(req.params.id);

      if (!defaultAnswer) {
          return res.status(404).json({ message: "Default answer not found." });
      }

      // Check if the user is the owner of the answer or an admin
      if (defaultAnswer.user_id !== req.userId && req.userRole !== 'admin') {
          return res.status(403).send({ message: "Access denied. You don't have permission to perform this action." });
      }

      next();

  } catch (error) {
      res.status(500).json({ message: "Error checking answer ownership.", error: error.message });
  }
};

