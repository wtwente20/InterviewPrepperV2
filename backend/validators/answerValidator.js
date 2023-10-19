const Joi = require('joi');

const createDefaultAnswerValidation = (data) => {
    const schema = Joi.object({
        answer_text: Joi.string().required(),
        default_question_id: Joi.number().integer().required(),
    });
    return schema.validate(data);
};

module.exports = { createDefaultAnswerValidation };