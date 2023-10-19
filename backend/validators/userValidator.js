const Joi = require('joi');

// register validator
const validateRegister = (data) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    status: Joi.string().valid('Mentor', 'Learner').required()
  });

  return schema.validate(data);
};

// Login validator
const validateLogin = (data) => {
  const schema = Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().required()
  });

  return schema.validate(data);
};

// Change password validator
const validateChangePassword = (data) => {
  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
  });

  return schema.validate(data);
};

// Update user details validator
const validateUpdateDetails = (data) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(50),
    city: Joi.string().max(50),
    state_province: Joi.string().max(50),
    country: Joi.string().max(50),
    profile_picture: Joi.string().uri(),
    current_occupation: Joi.string().max(100),
    goal_occupation: Joi.string().max(100),
    //Set to a uri so they are linked to Google docs
    resume: Joi.string().uri()
  });

  return schema.validate(data);
};




module.exports = {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateUpdateDetails
}