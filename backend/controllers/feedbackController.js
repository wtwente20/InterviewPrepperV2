const Feedback = require('../models/feedback');
const { createFeedbackValidation, feedbackIdValidation, updateFeedbackValidation } = require('../validators/feedbackValidator');
const logger = require('../config/logger');

//create feedback
const createFeedback = async (req, res) => {
  try {
    const { feedback_content, share_id, suggested_answer_id } = req.body;
    const user_id = req.user.id;

    //validate
    const { error } = createFeedbackValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const feedback = await Feedback.create({
      feedback_content,
      share_id,
      suggested_answer_id,
      user_id
    });

    //create
    return res.status(201).json(feedback);
  } catch (error) {
    logger.error('Error creating feedback: ', error);
    return res.status(500).json({ message: error.message });
  }
};

//get all feedbacks for a share
const getFeedbacks = async (req, res) => {
  try {
    const { share_id } = req.params;
    
    //validate share_id
    const { error } = feedbackIdValidation({ id: parseInt(share_id) });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const feedbacks = await Feedback.findAll({
      where: { share_id }
    });
    
    //get
    return res.json(feedbacks);
  } catch (error) {
    logger.error('Error getting feedbacks: ', error);
    return res.status(500).json({ message: error.message });
  }
};

//get specific feedback
const getFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    
    //validate feedback_id
    const { error } = feedbackIdValidation({ id: parseInt(id) });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    //get
    return res.json(feedback);
  } catch (error) {
    logger.error('Error getting feedback: ', error);
    return res.status(500).json({ message: error.message });
  }
};

// Update Feedback
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    //validate feedback_id
    const { error } = feedbackIdValidation({ id: parseInt(id) });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //get
    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    //check if the user is the owner of the feedback
    if (feedback.user_id !== user_id) {
      return res.status(403).json({ message: 'You do not have permission to update this feedback' });
    }

    //validate feedback content
    const { error: validationError } = updateFeedbackValidation(req.body);
    if (validationError) return res.status(400).send({ message: validationError.details[0].message });

    //await
    await feedback.update(req.body);

    //update
    return res.json(feedback);
  } catch (error) {
    logger.error('Error updating feedback: ', error);
    return res.status(500).json({ message: error.message });
  }
};

// Delete Feedback
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    //validate feedback_id
    const { error } = feedbackIdValidation({ id: parseInt(id) });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //get feedback
    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    //check if the user is the owner of the feedback
    if (feedback.user_id !== user_id) {
      return res.status(403).json({ message: 'You do not have permission to delete this feedback' });
    }

    //await
    await feedback.destroy();

    //delete
    res.status(200).send({ message: 'Feedback deleted successfully' });
  } catch (error) {
    logger.error('Error deleting feedback: ', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedback,
  updateFeedback,
  deleteFeedback
};
