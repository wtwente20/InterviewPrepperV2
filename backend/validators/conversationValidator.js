const Joi = require('joi');

//create validate
const createConversationValidation = (data) => {
  const schema = Joi.object({
    userIds: Joi.array().items(Joi.number().integer()).min(1).required(),
    initialMessage: Joi.string().optional() // If you're accepting initial messages
  }).unknown(); // This allows for additional properties that are not validated

  return schema.validate(data, { abortEarly: false }); // Provides detailed error messages
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
    id: Joi.number().integer().required()
  });

  return schema.validate(data);
};

module.exports = {
  createConversationValidation,
  conversationIdValidation,
  updateConversationValidation
};
