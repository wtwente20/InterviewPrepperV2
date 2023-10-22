const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  createUserResource,
  getUserResourcesByUserId,
  getUserResourceById,
  updateUserResource,
  deleteUserResource,
} = require("../controllers/userResourceController");
const router = express.Router();

//create user resource
router.post("/", authenticate, createUserResource);

//get all user resources for a specific user
router.get("/user/:userId", authenticate, getUserResourcesByUserId);

//get user resource by id
router.get("/:userResourceId", authenticate, getUserResourceById);

//update user resource
router.put("/:userResourceId", authenticate, updateUserResource);

//delete user resource
router.delete("/:userResourceId", authenticate, deleteUserResource);

// Logging middleware
router.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

module.exports = router;
