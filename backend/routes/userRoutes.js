const express = require("express");
const { authenticate, requireAdmin } = require('../middlewares/auth');
const { registerUser, loginUser, deactivateUser, deleteUser, fetchDeactivatedUser, restoreUser, updateUserDetails, getUserDetails, changePassword } = require("../controllers/userController");
const router = express.Router();



//Registration Route
router.post("/register", registerUser);

// Login Route
router.post("/login", loginUser);

// Deactivation Route
router.post("/deactivate", authenticate, deactivateUser);

// Hard deletion of user
router.delete("/delete", authenticate, deleteUser)

// Set user details
router.patch("/details", authenticate, updateUserDetails);

// Get user details
router.get("/details", authenticate, getUserDetails);

// Change user password
router.put("/change-password", authenticate, changePassword);

//                                              //
//  Set above functions that need admin access  //
//                                              //

router.use(authenticate);

// Fetch deactivated users
router.get("/deactivated", requireAdmin, fetchDeactivatedUser);

// Restoring deactivated users
router.post("/restore/:userId", requireAdmin, restoreUser);

module.exports = router;
