const express = require("express");
const { getAllReactions, getReactionById } = require("../controllers/reactionController");
const router = express.Router();

//get all reactions
router.get("/", getAllReactions);

//get a specific reaction by ID
router.get("/:reactionId", getReactionById);

module.exports = router;
