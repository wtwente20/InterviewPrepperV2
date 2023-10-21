const logger = require('../config/logger');
const QuestionCollection = require('../models/questionCollection');
const { createQuestionCollectionValidation, questionCollectionIdValidation, updateQuestionCollectionValidation } = require('../validators/questionCollectionValidator');

//create question collection
const createQuestionCollection = async (req, res) => {
  try {
    //extract user id from req.user
    const user_id = req.user.id;

    //add user id to request body
    const data = { ...req.body, user_id };

    //validate
    const { error } = createQuestionCollectionValidation(data);
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const questionCollection = await QuestionCollection.create(data);

    //create
    return res.status(201).json(questionCollection);
  } catch (error) {
    logger.error("Error creating question collection: ", error);
    return res.status(500).json({ message: error.message });
  }
};

//get all question collections
const getQuestionCollections = async (req, res) => {
  try {
    const questionCollections = await QuestionCollection.findAll();
    return res.json(questionCollections);
  } catch (error) {
    logger.error("Error getting question collections: ", error);
    return res.status(500).json({ message: error.message });
  }
};

//get one question collection
const getQuestionCollection = async (req, res) => {
  try {
    const { id } = req.params;

    //validate
    const { error } = questionCollectionIdValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const questionCollection = await QuestionCollection.findByPk(id);
    if (!questionCollection) {
      return res.status(404).json({ message: 'Question Collection not found' });
    }

    //get
    return res.json(questionCollection);
  } catch (error) {
    logger.error("Error getting question collection: ", error);
    return res.status(500).json({ message: error.message });
  }
};

//update question collection
const updateQuestionCollection = async (req, res) => {
  try {
    const { id } = req.params;

    //validate ID
    const { error: idError } = questionCollectionIdValidation({ id: parseInt(id) });
    if (idError) return res.status(400).send({ message: idError.details[0].message });

    //await
    const questionCollection = await QuestionCollection.findByPk(id);
    if (!questionCollection) {
      return res.status(404).json({ message: 'Question Collection not found' });
    }

    //validate body
    const { error: bodyError } = updateQuestionCollectionValidation(req.body);
    if (bodyError) return res.status(400).send({ message: bodyError.details[0].message });

    //update
    await questionCollection.update(req.body);
    return res.json(questionCollection);
  } catch (error) {
    logger.error("Error updating question collection: ", error);
    return res.status(500).json({ message: error.message });
  }
};


//delete question collection
const deleteQuestionCollection = async (req, res) => {
  try {
    const { id } = req.params;

    //validate
    const { error } = questionCollectionIdValidation({ id: parseInt(id) });
    if (error) return res.status(400).send({ message: error.details[0].message });

    // check if exists
    const questionCollection = await QuestionCollection.findByPk(id);
    if (!questionCollection) {
      return res.status(404).json({ message: 'Question Collection not found' });
    }

    //delete
    await questionCollection.destroy();
    
    //all good status
    res.json({ message: "Interview deleted successfully." });
  } catch (error) {
    logger.error("Error deleting question collection: ", error);
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createQuestionCollection,
  getQuestionCollections,
  getQuestionCollection,
  updateQuestionCollection,
  deleteQuestionCollection
};
