const Joi = require('joi');

const createUserResourceValidation = (data) => {
  const schema = Joi.object({
    resource_name: Joi.string().required(),
    resource_link: Joi.string().required(),
    resource_type: Joi.string().required(),
    description: Joi.string().allow('').optional(),
  });
  return schema.validate(data);
};

const updateUserResourceValidation = (data) => {
  const schema = Joi.object({
    resource_name: Joi.string().optional(),
    resource_link: Joi.string().optional(),
    resource_type: Joi.string().optional(),
    description: Joi.string().allow('').optional(),
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
  createUserResourceValidation,
  updateUserResourceValidation,
  idValidation,
};
