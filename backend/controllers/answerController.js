const Answer = require("../models/answer");
const logger = require("../config/logger");
const {
  createAnswerValidation,
  updateAnswerValidation,
} = require("../validators/answerValidator");

//create answer
const createAnswer = async (req, res) => {
  try {
    const { answer_text, question_id } = req.body;
    const user_id = req.user.id;

    //create validator
    const { error } = createAnswerValidation(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // await answer creation
    const answer = await Answer.create({
      answer_text,
      question_id,
      user_id,
    });

    // All good status 201
    res.status(201).send(answer);
  } catch (error) {
    logger.error("Error creating answer: ", error);
    res.status(500).send({ message: "Server error while creating answer!" });
  }
};

//get answer by question id
const getAnswerByQuestionId = async (req, res) => {
  try {
    const answers = await Answer.findAll({
      where: { question_id: req.params.id },
    });
    res.json(answers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving answers.", error: error.message });
  }
};


//get all answers by user id
const getAnswersByUserId = async (req, res) => {
  try {
    const answers = await Answer.findAll({
      where: { user_id: req.params.userId },
    });
    res.json(answers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving answers.", error: error.message });
  }
};

//get answers by question and user id
const getAnswersByQuestionIdAndUserId = async (req, res) => {
  const questionId = req.params.questionId;
  const userId = req.user.id;

  try {
    const answers = await Answer.findAll({
      where: {
        question_id: questionId,
        user_id: userId
      }
    });
    res.json(answers);
  } catch (error) {
    console.error('Error retrieving answers:', error);
    res.status(500).json({ message: "Error retrieving answers.", error: error.message });
  }
};


//update answer
const updateAnswer = async (req, res) => {
  try {
    //update validator
    const { error } = updateAnswerValidation(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const answer = await Answer.findByPk(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found." });
    }
    await answer.update(req.body);
    res.json({ message: "Answer updated successfully.", answer });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating answer.", error: error.message });
  }
};

//delete answer
const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByPk(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found." });
    }
    await answer.destroy();
    res.json({ message: "Answer deleted successfully." });
  } catch (error) {
    logger.error("Error deleting answer: ", error);
    res.status(500).send({ message: "Server error while deleting answer!" });
  }
};

module.exports = {
  createAnswer,
  getAnswerByQuestionId,
  getAnswersByUserId,
  getAnswersByQuestionIdAndUserId,
  updateAnswer,
  deleteAnswer,
};
