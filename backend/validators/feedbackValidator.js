const Joi = require('joi');

//create validate
const createFeedbackValidation = (data) => {
  const schema = Joi.object({
    share_id: Joi.number().integer().required(),
    feedback_content: Joi.string().required(),
    suggested_answer_id: Joi.number().integer().allow(null)
  });

  return schema.validate(data);
};

//id validate
const feedbackIdValidation = (data) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  });

  return schema.validate(data);
};

//update validate
const updateFeedbackValidation = (data) => {
  const schema = Joi.object({
    feedback_content: Joi.string().optional(),
    suggested_answer_id: Joi.number().integer().allow(null).optional()
  }).min(1);

  return schema.validate(data);
};

module.exports = {
  createFeedbackValidation,
  feedbackIdValidation,
  updateFeedbackValidation
};