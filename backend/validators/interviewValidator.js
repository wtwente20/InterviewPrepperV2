const Joi = require('joi');

//create validate
const createInterviewValidation = (data) => {
  const schema = Joi.object({
      interview_date: Joi.date().required(),
      interview_time: Joi.string().required().pattern(/^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/), // HH:mm format
      position_name: Joi.string().required(),
      company_name: Joi.string().required(),
      user_id: Joi.number().integer()
  });

  return schema.validate(data);
};

//get by user id validate
const interviewIdValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().greater(0)
  });

  return schema.validate(data);
};

//update validate
const updateInterviewValidation = (data) => {
  const schema = Joi.object({
    interview_date: Joi.date(),
    interview_time: Joi.string().pattern(/^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/),  // HH:MM format
    company_name: Joi.string().min(1),
    position_name: Joi.string().min(1),
    user_id: Joi.number().integer().greater(0)   // optional since it might be taken from authenticated user
  })
  .min(1)
  .options({ allowUnknown: true });

  return schema.validate(data, { allowUnknown: true });
};

module.exports = {
  createInterviewValidation,
  interviewIdValidation,
  updateInterviewValidation
};