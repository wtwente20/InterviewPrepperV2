const Joi = require('joi');

//create validate
const createUserCategoryValidation = (data) => {
  const schema = Joi.object({
    category_id: Joi.number().integer().required(),
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

// update validate
const updateUserCategoryValidation = (data) => {
  const schema = Joi.object({
    category_id: Joi.number().integer().required(),
  });

  return schema.validate(data);
};

module.exports = {
  createUserCategoryValidation,
  idValidation,
  updateUserCategoryValidation
};
