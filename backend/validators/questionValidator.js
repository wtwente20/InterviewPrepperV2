const Joi = require('joi');

const validateQuestion = (data) => {
  const schema = Joi.object({
    question_text: Joi.string().required(),
    user_id: Joi.number().integer().optional(),
    category_id: Joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = {
  validateQuestion
};
