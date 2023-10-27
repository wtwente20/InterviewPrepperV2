const Joi = require("joi");

const createUserReactionValidation = (data) => {
  const schema = Joi.object({
    reaction_id: Joi.number().integer().required(),
    reacted_item_id: Joi.number().integer().required(),
    reacted_item_type: Joi.string().valid("SHARE", "FEEDBACK").required(),
  });
  return schema.validate(data);
};

const idValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  });
  return schema.validate(data);
};

module.exports = {
  createUserReactionValidation,
  idValidation,
};
