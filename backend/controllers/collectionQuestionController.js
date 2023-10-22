const logger = require('../config/logger');
const CollectionQuestion = require('../models/collectionQuestion');
const { createCollectionQuestionValidation, collectionQuestionIdValidation, updateCollectionQuestionValidation, getCollectionQuestionsValidation } = require('../validators/collectionQuestionValidator');

//create question collection
const createCollectionQuestion = async (req, res) => {
  try {
    //validate
    const { error } = createCollectionQuestionValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const collectionQuestion = await CollectionQuestion.create(req.body);
    //create
    return res.status(201).json(collectionQuestion);
  } catch (error) {
    logger.error("Error creating collection question: ", error);
    return res.status(500).json({ message: error.message });
  }
};

//get a specific collection question
const getCollectionQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    //validate
    const { error } = collectionQuestionIdValidation({ id });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const collectionQuestion = await CollectionQuestion.findByPk(id);

    if (!collectionQuestion) {
      return res.status(404).json({ message: 'CollectionQuestion not found' });
    }

    return res.json(collectionQuestion);
  } catch (error) {
    logger.error("Error getting collection question: ", error);
    return res.status(500).json({ message: error.message });
  }
};


//get all questions in a collection
const getCollectionQuestions = async (req, res) => {
  try {
    const collection_id = parseInt(req.params.collection_id, 10);

    //validate
    const { error } = getCollectionQuestionsValidation({ collection_id });
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Log this to verify the validation result
    logger.info("Validation Result:", error);

    //await
    const collectionQuestions = await CollectionQuestion.findAll({
      where: { collection_id }
    });

    // Log this to verify the query result
    logger.info("DB Query Result:", collectionQuestions);

    //get all
    return res.json(collectionQuestions);
  } catch (error) {
    logger.error("Error getting collection questions: ", error);
    return res.status(500).json({ message: error.message });
  }
};




//update collection question
const updateCollectionQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_question_id } = req.body;

    //validate id
    const { error: paramsError } = collectionQuestionIdValidation({ id });
    if (paramsError) return res.status(400).send({ message: paramsError.details[0].message });

    //validate body
    const { error: bodyError } = updateCollectionQuestionValidation(req.body);
    if (bodyError) return res.status(400).send({ message: bodyError.details[0].message });

    const collectionQuestion = await CollectionQuestion.findByPk(id);

    if (!collectionQuestion) {
      return res.status(404).json({ message: 'CollectionQuestion not found' });
    }

    await collectionQuestion.update({ question_id: new_question_id });
    return res.json(collectionQuestion);
  } catch (error) {
    logger.error("Error updating collection question: ", error);
    return res.status(500).json({ message: error.message });
  }
};


//delete collection question
const deleteCollectionQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    //validate
    const { error } = collectionQuestionIdValidation({ id });
    if (error) return res.status(400).send({ message: error.details[0].message });

    const collectionQuestion = await CollectionQuestion.findByPk(id);

    if (!collectionQuestion) {
      return res.status(404).json({ message: 'CollectionQuestion not found' });
    }

    await collectionQuestion.destroy();
    res.json({ message: "collection question deleted successfully." });
  } catch (error) {
    logger.error("Error deleting collection questions: ", error);
    return res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createCollectionQuestion,
  getCollectionQuestion,
  getCollectionQuestions,
  updateCollectionQuestion,
  deleteCollectionQuestion
};