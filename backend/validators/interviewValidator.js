const Joi = require('joi');

//create validate
const createInterviewValidation = (data) => {
  const schema = Joi.object({
      interview_date: Joi.date().required(),
      interview_time: Joi.string().required().pattern(/^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/), // HH:mm format
      position_name: Joi.string().required(),
      company_name: Joi.string().required(),
      user_id: Joi.number().integer().required()
  });

  return schema.validate(data);
};

//get by user id validate
const interviewIdValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().greater(0).required()
  });

  return schema.validate(data);
};

module.exports = {
  createInterviewValidation,
};