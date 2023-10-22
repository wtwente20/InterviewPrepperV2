const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  createUserCategory,
  getUserCategoriesByUserId,
  getUserCategoryById,
  updateUserCategory,
  deleteUserCategory,
} = require("../controllers/userCategoryController");
const router = express.Router();

//create user category
router.post("/", authenticate, createUserCategory);

//get all user categories for a specific user
router.get("/user/:userId", authenticate, getUserCategoriesByUserId);

//get user category by id
router.get("/:userCategoryId", authenticate, getUserCategoryById);

//update user category
router.put("/:userCategoryId", authenticate, updateUserCategory);

//delete user category
router.delete("/:userCategoryId", authenticate, deleteUserCategory);

// Logging middleware
router.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

module.exports = router;
