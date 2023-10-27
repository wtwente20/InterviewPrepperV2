const Joi = require('joi');

//create validate
const createShareValidation = (data) => {
  const schema = Joi.object({
    user_id: Joi.number().integer(),
    share_type: Joi.string().required(),
    shared_item_id: Joi.number().integer().required(),
    share_content: Joi.string().allow(''),
    visibility: Joi.string().valid('PUBLIC', 'FRIENDS', 'PRIVATE').required(),
  });
  return schema.validate(data);
};

//get validate
const shareIdValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  });

  return schema.validate(data);
};

//update validate
const updateShareValidation = (data) => {
  const schema = Joi.object({
    share_type: Joi.string(),
    shared_item_id: Joi.number().integer(),
    visibility: Joi.string().valid('PUBLIC', 'FRIENDS', 'PRIVATE'),
  }).min(1);
  return schema.validate(data);
};

module.exports = {
  createShareValidation,
  shareIdValidation,
  updateShareValidation
};
