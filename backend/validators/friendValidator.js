const Joi = require('joi');

//validation for the action (accepting a friend request, removing a friend, and blocking a user)
const actionValidation = (data) => {
  const schema = Joi.object({
    user_id: Joi.number().integer().required(),
    friend_id: Joi.number().integer().required(),
  });

  return schema.validate(data);
};

//validation for sending a friend request
const sendFriendRequestValidation = (data) => {
  const schema = Joi.object({
    user_id: Joi.number().integer().required(),
    friend_id: Joi.number().integer().required(),
  });

  return schema.validate(data);
};

//validation for the friend id parameter
const friendIdValidation = (data) => {
  const schema = Joi.object({
    friend_id: Joi.number().integer().required(),
  });

  return schema.validate(data);
};

module.exports = {
  actionValidation,
  sendFriendRequestValidation,
  friendIdValidation,
};