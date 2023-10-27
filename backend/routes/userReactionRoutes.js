const express = require("express");
const {
  createUserReaction,
  getUserReactions,
  deleteUserReaction,
} = require("../controllers/userReactionController");
const { authenticate } = require("../middlewares/auth");
const router = express.Router();

//create user reaction
router.post("/", authenticate, createUserReaction);

//get user reactions by item id
router.get("/:itemType/:itemId", authenticate, getUserReactions);

//delete user reaction
router.delete("/:reactionId", authenticate, deleteUserReaction);

module.exports = router;
