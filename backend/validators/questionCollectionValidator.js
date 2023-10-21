const Joi = require('joi');

//create validate
const createQuestionCollectionValidation = (data) => {
  const schema = Joi.object({
    user_id: Joi.number().integer().required(),
    description: Joi.string().required()
  });

  return schema.validate(data);
};

//question collection id validate
const questionCollectionIdValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer(),
  });

  return schema.validate(data);
};

//update validate
const updateQuestionCollectionValidation = (data) => {
  const schema = Joi.object({
    description: Joi.string()
  }).min(1);

  return schema.validate(data);
};

module.exports = {
  createQuestionCollectionValidation,
  questionCollectionIdValidation,
  updateQuestionCollectionValidation
};
