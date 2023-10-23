const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  createFeedback,
  getFeedbacks,
  getFeedback,
  updateFeedback,
  deleteFeedback
} = require("../controllers/feedbackController");
const router = express.Router();

//create feedback
router.post("/", authenticate, createFeedback);

//get all feedbacks for a share
router.get('/shares/:share_id', authenticate, getFeedbacks);

//get a specific feedback by id
router.get('/:id', authenticate, getFeedback);

//update a specific feedback by id
router.put('/:id', authenticate, updateFeedback);

//delete a specific feedback by id
router.delete('/:id', authenticate, deleteFeedback);

// Logging middleware
router.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

module.exports = router;
