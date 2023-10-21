const express = require('express');
const router = express.Router();

const { authenticate } = require('../middlewares/auth');
const { createQuestion, getAllQuestions, getQuestionsByUserId, getQuestionById, updateQuestion, deleteQuestion } = require('../controllers/questions/questionController');

// Create a new question
router.post('/create', authenticate, createQuestion);

// Retrieve all questions
router.get('/', getAllQuestions);

// Retrieve question by user id
router.get('/user/:userId', getQuestionsByUserId);

// Retrieve a specific question by ID
router.get('/:id', getQuestionById);

// Update a question by ID
router.put('/:id', updateQuestion);

// Delete a question by ID
router.delete('/:id', deleteQuestion);

module.exports = router;
