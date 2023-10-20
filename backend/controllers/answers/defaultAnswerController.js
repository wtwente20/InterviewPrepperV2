const { createAnswerValidation, updateAnswerValidation } = require('../../validators/answerValidator');

const logger = require('../../config/logger');
const DefaultAnswer = require('../../models/defaultAnswer');

// create answer
const createDefaultAnswer = async (req, res) => {
    try {
        const { answer_text, default_question_id } = req.body;
        const user_id = req.user.id;
        logger.info("Extracted user_id:", user_id);

        logger.info("Request Body: ", req.body);
        // validate default answer entry

        const { error } = createAnswerValidation(req.body);
        if (error) {
          console.log("Validation error: ", error.details);
          return res.status(400).send({ message: error.details[0].message });
      }
      
        
        //create answer
        const answer = await DefaultAnswer.create({
            answer_text,
            default_question_id,
            user_id
        });

        //All good status
        res.status(201).send(answer);
    } catch (error) {
        logger.error("Error creating default answer: ", error);
        res.status(500).send({ message: "Server error while creating default answer!" });
    }
};

// read answer
const getDefaultAnswerById = async (req, res) => {
  try {
    const defaultAnswer = await DefaultAnswer.findByPk(req.params.id);
    if (!defaultAnswer) {
      return res.status(404).json({ message: "Default answer not found." });
    }
    res.json(defaultAnswer);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving default answer.", error: error.message });
  }
};


// read all default answers by user id
const getDefaultAnswersByUserId = async (req, res) => {
  try {
    const defaultAnswers = await DefaultAnswer.findAll({ where: { user_id: req.params.userId } });
    res.json(defaultAnswers);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving default answers.", error: error.message });
  }
};

//update default answer
const updateDefaultAnswer = async (req, res) => {
  try {
    const { error } = updateAnswerValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const defaultAnswer = await DefaultAnswer.findByPk(req.params.id);
    if (!defaultAnswer) {
      return res.status(404).json({ message: "Default answer not found." });
    }
    await defaultAnswer.update(req.body);
    res.json({ message: "Default answer updated successfully.", defaultAnswer });
  } catch (error) {
    res.status(500).json({ message: "Error updating default answer.", error: error.message });
  }
};

//delete an answer to default question
const deleteDefaultAnswer = async (req, res) => {
  try {
    const defaultAnswer = await DefaultAnswer.findByPk(req.params.id);
    if (!defaultAnswer) {
      return res.status(404).json({ message: "Default answer not found." });
    }
    await defaultAnswer.destroy();
    res.json({ message: "Default answer deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting default answer.", error: error.message });
  }
};



module.exports = {
  createDefaultAnswer,
  getDefaultAnswerById,
  getDefaultAnswersByUserId,
  updateDefaultAnswer,
  deleteDefaultAnswer
};
