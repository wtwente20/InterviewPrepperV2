const Joi = require('joi');

//create validate
const createConversationValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    userIds: Joi.array().items(Joi.number()).required()
  });

  return schema.validate(data);
};

//id validate
const conversationIdValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required()
  });

  return schema.validate(data);
};

//update validate
const updateConversationValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
    title: Joi.string().min(3).required()
  });

  return schema.validate(data);
};

module.exports = {
  createConversationValidation,
  conversationIdValidation,
  updateConversationValidation
};
