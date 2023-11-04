const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  createMessage,
  getMessagesByConversationId,
  getMessageById,
  updateMessage,
  deleteMessage,
  getMessagesByUserId,
  markMessageAsRead,
  getMessageReadStatus
} = require("../controllers/messageController");
const router = express.Router();

// Logging middleware
router.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

//create message
router.post("/", authenticate, createMessage);

//get all messages for a specific conversation
router.get("/conversations/:conversationId", authenticate, getMessagesByConversationId);

//get all messages for a specific user
router.get("/user/:userId", authenticate, getMessagesByUserId);

//get message by id
router.get("/:messageId", authenticate, getMessageById);

// Mark message as read
router.patch("/:messageId/read", authenticate, markMessageAsRead);

// Get message read status
router.get("/:messageId/read-status", authenticate, getMessageReadStatus);

//update message
router.put("/:messageId", authenticate, updateMessage);

//delete message
router.delete("/:messageId", authenticate, deleteMessage);

module.exports = router;
