const express = require('express');
const { createUserReaction, getUserReactionsByItemId, deleteUserReaction } = require('../controllers/userReactionController');
const router = express.Router();

//routes need to be tested, waiting for shares and feedbacks to be finished

//create user reaction
router.post('/', createUserReaction);

//get user reactions by item id
router.get('/:itemId/:itemType', getUserReactionsByItemId);

//delete user reaction
router.delete('/:userReactionId', deleteUserReaction);

module.exports = router;
