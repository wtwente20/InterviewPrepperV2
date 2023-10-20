const express = require("express");
const {
  authenticate,
  checkAnswerOwnerOrAdmin
} = require("../middlewares/auth");
const {
  createDefaultAnswer,
  getDefaultAnswerById,
  getDefaultAnswersByUserId,
  updateDefaultAnswer,
  deleteDefaultAnswer,
} = require("../controllers/answers/defaultAnswerController");
const {
  createAnswer,
  deleteAnswer,
  updateAnswer,
  getAnswersByUserId,
  getAnswerByQuestionId,
} = require("../controllers/answers/answerController");
const router = express.Router();

//post a new answer
router.post("/", authenticate, createAnswer);

//get a specific answer by question id
router.get("/question/:id", authenticate, getAnswerByQuestionId);

//get all answers by user id
router.get("/user/:userId", authenticate, getAnswersByUserId);

//update an answer
router.put("/:id", authenticate, checkAnswerOwnerOrAdmin, updateAnswer);

//delete an answer
router.delete("/:id", authenticate, checkAnswerOwnerOrAdmin, deleteAnswer);

// Answer a default question
router.post("/default", authenticate, createDefaultAnswer);

// Get a specific default answer by question id
router.get("/default/:id", authenticate, getDefaultAnswerById);

// Get all default answers by user id
router.get("/default/user/:userId", authenticate, getDefaultAnswersByUserId);

//update a default answer
router.put(
  "/default/:id",
  authenticate,
  checkAnswerOwnerOrAdmin,
  updateDefaultAnswer
);

//delete default answer
router.delete(
  "/default/:id",
  authenticate,
  checkAnswerOwnerOrAdmin,
  deleteDefaultAnswer
);

//logging middleware
router.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});


module.exports = router;
