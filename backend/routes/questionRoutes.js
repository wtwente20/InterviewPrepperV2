const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");
const {
  createQuestion,
  getAllQuestions,
  getQuestionsByUserId,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getAllDefaultQuestions,
  getDefaultQuestionById,
} = require("../controllers/questionController");

// Create a new question
router.post("/create", authenticate, createQuestion);

// Retrieve all questions
router.get("/", getAllQuestions);

// Retrieve question by user id
router.get("/user/:userId", authenticate, getQuestionsByUserId);

// Retrieve all default questions
router.get("/default", getAllDefaultQuestions);

// Retrieve a specific default question by ID
router.get("/default/:id", getDefaultQuestionById);

// Retrieve a specific question by ID
router.get("/:id", getQuestionById);

// Update a question by ID
router.put("/:id", authenticate, updateQuestion);

// Delete a question by ID
router.delete("/:id", authenticate, deleteQuestion);

module.exports = router;
