const Joi = require('joi');

//id validate
const idValidation = data => {
  const schema = Joi.object({
    id: Joi.number().integer().required().messages({
      'number.base': `"id" should be a type of 'number'`,
      'number.integer': `"id" should be an integer`,
      'any.required': `"id" is a required field`
    })
  });

  return schema.validate(data);
};

module.exports = {
  idValidation
};
