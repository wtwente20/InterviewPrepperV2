const Joi = require('joi');

//create validate
const createCollectionQuestionValidation = (data) => {
  const schema = Joi.object({
    collection_id: Joi.number().integer().required(),
    question_id: Joi.number().integer().required()
  });

  return schema.validate(data);
};

//validate data for getting all questions in a collection
const getCollectionQuestionsValidation = (data) => {
  const schema = Joi.object({
    collection_id: Joi.number().integer().required()
  });

  return schema.validate(data);
};


//id validate
const collectionQuestionIdValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required()
  });

  return schema.validate(data);
};

//update validate
const updateCollectionQuestionValidation = (data) => {
  const schema = Joi.object({
    new_question_id: Joi.number().integer().required()
  });

  return schema.validate(data);
};


module.exports = {
  createCollectionQuestionValidation,
  collectionQuestionIdValidation,
  getCollectionQuestionsValidation,
  updateCollectionQuestionValidation
};