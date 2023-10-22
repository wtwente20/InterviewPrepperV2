const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  createMessage,
  getMessagesByConversationId,
  getMessageById,
  updateMessage,
  deleteMessage,
  getMessagesByUserId
} = require("../controllers/messageController");
const router = express.Router();

//create message
router.post("/", authenticate, createMessage);

//get all messages for a specific conversation
router.get("/conversation/:conversationId", authenticate, getMessagesByConversationId);

//get all messages for a specific user
router.get("/user/:userId", authenticate, getMessagesByUserId);

//get message by id
router.get("/:messageId", authenticate, getMessageById);

//update message
router.put("/:messageId", authenticate, updateMessage);

//delete message
router.delete("/:messageId", authenticate, deleteMessage);

// Logging middleware
router.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

module.exports = router;
