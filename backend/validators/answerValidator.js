const Joi = require('joi');

//create validator
const createAnswerValidation = (data) => {
  const schema = Joi.object({
      answer_text: Joi.string().required(),
      default_question_id: Joi.number().integer(),
      question_id: Joi.number().integer(),
      user_id: Joi.number().integer()
  })
  .or('default_question_id', 'question_id')
  .without('default_question_id', 'question_id');

  return schema.validate(data);
};

//update validator
const updateAnswerValidation = (data) => {
  const schema = Joi.object({
      answer_text: Joi.string().min(1).max(500).required().messages({
          'string.base': `"answer_text" should be a type of 'text'`,
          'string.empty': `"answer_text" cannot be an empty field`,
          'string.min': `"answer_text" should have a minimum length of {#limit}`,
          'string.max': `"answer_text" should have a maximum length of {#limit}`,
          'any.required': `"answer_text" is a required field`
      })
  });

  return schema.validate(data);
};

module.exports = { createAnswerValidation, updateAnswerValidation};