const express = require('express');
const { authenticate, checkAnswerOwnerOrAdmin } = require('../middlewares/auth');
const { createDefaultAnswer, getDefaultAnswerById, getDefaultAnswersByUserId, updateDefaultAnswer, deleteDefaultAnswer } = require('../controllers/answers/defaultAnswerController');
const router = express.Router();

// Answer a default question
router.post('/defaultanswers', authenticate, createDefaultAnswer);

// Get a specific default answer by question id
router.get('/defaultanswers/:id', getDefaultAnswerById);

// Get all default answers by user id
router.get('/defaultanswers/user/:userId', getDefaultAnswersByUserId);

//update a default answer
router.put('/defaultanswers/:id', authenticate, checkAnswerOwnerOrAdmin, updateDefaultAnswer);

//delete default answer
router.delete('/defaultanswers/:id', authenticate, checkAnswerOwnerOrAdmin, deleteDefaultAnswer);


module.exports = router;