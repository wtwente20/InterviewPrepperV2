const Question = require('../../models/question');
const { validateQuestion } = require('../../validators/questionValidator');


//Create new question
const createQuestion = async (req, res) => {
  try {
    const { error } = validateQuestion(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const questionData = {
      question_text: req.body.question_text,
      user_id: req.userId,  // Assuming you've decoded the JWT token and set it to req.userId
      category_id: req.body.category_id
    };

    const newQuestion = await Question.create(questionData);
    res.status(201).send(newQuestion);
  } catch (error) {
    return res.status(500).send({ message: "Server Error!" });
  }
};

//Get all questions, minus defaults
const getAllQuestions = async (req, res) => {
  try {
      const questions = await Question.findAll({ where: { is_default: false } });
      res.status(200).json(questions);
  } catch (error) {
      logger.error("Error fetching all questions: ", error);
      res.status(500).send({ message: "Server error fetching all questions." });
  }
};

//Fetch by user id, minus defaults
const getQuestionsByUserId = async (req, res) => {
  try {
      const userId = req.params.userId; // assuming you'll pass userId as a route parameter
      const questions = await Question.findAll({ where: { user_id: userId, is_default: false } });
      if (questions.length === 0) {
          return res.status(404).send({ message: "No questions found for this user." });
      }
      res.status(200).json(questions);
  } catch (error) {
      logger.error(`Error fetching questions for user ${userId}: `, error);
      res.status(500).send({ message: "Server error fetching questions for user." });
  }
};

//Fetch by question id, minus defaults
const getQuestionById = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findOne({ where: { id: questionId, is_default: false } });

    if (!question) {
      return res.status(404).send({ message: 'Question not found.' });
    }

    res.status(200).send(question);
  } catch (error) {
    logger.error('Error retrieving question by ID: ', error);
    res.status(500).send({ message: 'Server error while fetching question.' });
  }
};

//fetch all default questions
const getAllDefaultQuestions = async (req, res) => {
  try {
    const defaultQuestions = await Question.findAll({ where: { is_default: true } });
    res.status(200).json(defaultQuestions);
  } catch (error) {
    logger.error("Error fetching all default questions: ", error);
    res.status(500).send({ message: "Server error fetching all default questions." });
  }
};

//get default question by id
const getDefaultQuestionById = async (req, res) => {
  try {
    const questionId = req.params.id;
    const defaultQuestion = await Question.findOne({ where: { id: questionId, is_default: true } });

    if (!defaultQuestion) {
      return res.status(404).send({ message: 'Default question not found.' });
    }

    res.status(200).send(defaultQuestion);
  } catch (error) {
    logger.error('Error retrieving default question by ID: ', error);
    res.status(500).send({ message: 'Server error while fetching default question.' });
  }
};


//Update a question by id
const updateQuestion = async (req, res) => {
  try {
      const questionId = req.params.id;
      const updatedQuestionData = req.body;

      // Find the question by its ID
      const question = await Question.findByPk(questionId);
      if (!question) {
          return res.status(404).send({ message: 'Question not found.' });
      }

      // Update the question
      await question.update(updatedQuestionData);

      // Send the updated question as the response
      res.status(200).send(question);
  } catch (error) {
      logger.error('Error updating question:', error);
      res.status(500).send({ message: 'Failed to update question.' });
  }
};

// Delete a question
const deleteQuestion = async (req, res) => {
  try {
      const questionId = req.params.id;

      // Find the question by its ID
      const question = await Question.findByPk(questionId);
      if (!question) {
          return res.status(404).send({ message: 'Question not found.' });
      }

      // Delete the question
      await question.destroy();

      // Send a successful response
      res.status(200).send({ message: 'Question deleted successfully.' });
  } catch (error) {
      logger.error('Error deleting question:', error);
      res.status(500).send({ message: 'Failed to delete question.' });
  }
};



module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionsByUserId,
  getQuestionById,
  updateQuestion,
  deleteQuestion
};