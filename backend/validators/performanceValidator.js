const Joi = require('joi');

//create validate
const createPerformanceValidation = (data) => {
  const schema = Joi.object({
    interview_id: Joi.number().integer().required(),
    confidence_rating: Joi.number().integer().min(0).max(5).required(),
    technical_rating: Joi.number().integer().min(0).max(5).required(),
    behavioral_rating: Joi.number().integer().min(0).max(5).required(),
    overall_feeling: Joi.number().integer().min(0).max(5).required(),
    summary: Joi.string().required(),
    struggled_question_id: Joi.number().integer(),
    well_answered_question_id: Joi.number().integer()
  });

  return schema.validate(data);
};

//get validate
const performanceIdValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  });

  return schema.validate(data);
};


//update validate
const updatePerformanceValidation = (data) => {
  const schema = Joi.object({
    confidence_rating: Joi.number().integer().min(0).max(5),
    technical_rating: Joi.number().integer().min(0).max(5),
    behavioral_rating: Joi.number().integer().min(0).max(5),
    overall_feeling: Joi.number().integer().min(0).max(5),
    summary: Joi.string(),
    struggled_question_id: Joi.number().integer(),
    well_answered_question_id: Joi.number().integer()
  }).min(1); // Ensure that at least one field is being updated

  return schema.validate(data);
};

module.exports = {
  createPerformanceValidation,
  performanceIdValidation,
  updatePerformanceValidation
};
