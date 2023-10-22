const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { createCollectionQuestion, deleteCollectionQuestion, updateCollectionQuestion, getCollectionQuestions, getCollectionQuestion } = require('../controllers/collectionQuestionController');
const router = express.Router();

//create collection question
router.post("/", authenticate, createCollectionQuestion);

//get one
router.get('/:id', authenticate, getCollectionQuestion);

//get all
router.get('/collection/:collection_id', authenticate, getCollectionQuestions);

//update collection question
router.put('/:id', authenticate, updateCollectionQuestion);

//delete collection question
router.delete('/:id', authenticate, deleteCollectionQuestion);

module.exports = router;