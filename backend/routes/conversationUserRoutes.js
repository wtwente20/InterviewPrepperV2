const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  addUsersToConversation,
  removeUserFromConversation,
  updateLastReadAt,
  getUsersInConversation,
} = require("../controllers/conversationUserController");
const router = express.Router();

//add users to conversation
router.post("/", authenticate, addUsersToConversation);

//get users in conversation
router.get('/:id', authenticate, getUsersInConversation);

//update last read time
router.put("/:conversationId/users/:userId/last-read", authenticate, updateLastReadAt);

//remove user from conversation
router.delete("/:conversationId/users/:userId", authenticate, removeUserFromConversation);

// Logging middleware
router.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

module.exports = router;
