const Joi = require('joi');

//create validate
const createMessageValidation = (data) => {
  const schema = Joi.object({
    conversationId: Joi.number().integer().required(),
    content: Joi.string().required(),
  });

  return schema.validate(data);
};

//id validate
const idValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  });

  return schema.validate(data);
};

//update validate
const updateMessageValidation = (data) => {
  const schema = Joi.object({
    content: Joi.string().min(1).required(),
  });

  return schema.validate(data);
};

module.exports = {
  createMessageValidation,
  idValidation,
  updateMessageValidation
};
