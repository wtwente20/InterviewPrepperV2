const express = require("express");
const { authenticate } = require("../middlewares/auth");
const { createConversation, getConversationsByUserId, updateConversation, getConversationById, deleteConversation } = require("../controllers/conversationController");
const router = express.Router();

//create new conversation
router.post("/", authenticate, createConversation);

//get all conversations for a specific user
router.get("/", authenticate, getConversationsByUserId);

//update conversation
router.put("/:id", authenticate, updateConversation);

//get conversation by id
router.get("/:id", authenticate, getConversationById);

//delete a conversation
router.delete("/:id", authenticate, deleteConversation);


module.exports = router;
