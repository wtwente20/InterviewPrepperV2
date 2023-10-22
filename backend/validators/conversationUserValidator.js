const Joi = require('joi');

//add user validate
const addUsersToConversationValidation = (data) => {
  const schema = Joi.object({
    conversationId: Joi.number().integer().required(),
    userIds: Joi.array().items(Joi.number().integer()).min(1).required(),
  });

  return schema.validate(data);
};

//remove user validate
const removeUserFromConversationValidation = (data) => {
  const schema = Joi.object({
    conversationId: Joi.number().integer().required(),
    userId: Joi.number().integer().required(),
  });

  return schema.validate(data);
};

//update last read validate
const updateLastReadAtValidation = (data) => {
  const schema = Joi.object({
    conversationId: Joi.number().integer().required(),
    userId: Joi.number().integer().required(),
    lastReadAt: Joi.date().required(),
  });

  return schema.validate(data);
};

module.exports = {
  addUsersToConversationValidation,
  removeUserFromConversationValidation,
  updateLastReadAtValidation,
};
