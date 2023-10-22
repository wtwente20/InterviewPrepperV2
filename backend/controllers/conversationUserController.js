const Conversation = require('../models/conversation');
const ConversationUser = require('../models/conversationUser');
const User = require('../models/user');
const logger = require('../config/logger');
const { addUsersToConversationValidation, removeUserFromConversationValidation, updateLastReadAtValidation } = require('../validators/conversationUserValidator');

const addUsersToConversation = async (req, res) => {
  try {
    const { conversationId, userIds } = req.body;
    //userIds expects an array

    //validate
    const { error } = addUsersToConversationValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    //add users to the conversation
    const records = userIds.map(userId => ({
      conversation_id: conversationId,
      user_id: userId,
      last_read_at: null,
    }));
    await ConversationUser.bulkCreate(records);

    res.status(200).send({ message: 'Users added to conversation successfully' });
  } catch (error) {
    logger.error('Error adding users to conversation: ', error);
    res.status(500).send({ message: 'Server error while adding users to conversation!' });
  }
};

const getUsersInConversation = async (req, res) => {
  try {
    const conversationId = req.params.id;

    if (!conversationId) {
      return res.status(400).send({ message: 'Conversation ID is required' });
    }

    const conversation = await Conversation.findByPk(conversationId, {
      include: [
        { model: User, as: 'users', attributes: ['id', 'username', 'email'] },
      ],
    });

    if (!conversation) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    const users = conversation.users;
    res.status(200).send(users);
  } catch (error) {
    console.error('Error fetching users in conversation:', error);
    res.status(500).send({ message: 'Server error while fetching users in conversation' });
  }
};

const updateLastReadAt = async (req, res) => {
  try {
    const { conversationId, userId } = req.params;
    const { lastReadAt } = req.body;

    //validate
    const { error } = updateLastReadAtValidation({ ...req.params, ...req.body });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //update the last read time
    await ConversationUser.update({ last_read_at: lastReadAt }, {
      where: {
        conversation_id: conversationId,
        user_id: userId,
      },
    });

    res.status(200).send({ message: 'Last read time updated successfully' });
  } catch (error) {
    logger.error('Error updating last read time: ', error);
    res.status(500).send({ message: 'Server error while updating last read time!' });
  }
};

const removeUserFromConversation = async (req, res) => {
  try {
    const { conversationId, userId } = req.params;

    //validate
    const { error } = removeUserFromConversationValidation(req.params);
    if (error) return res.status(400).send({ message: error.details[0].message });

    //remove the user from the conversation
    await ConversationUser.destroy({
      where: {
        conversation_id: conversationId,
        user_id: userId,
      },
    });

    res.status(200).send({ message: 'User removed from conversation successfully' });
  } catch (error) {
    logger.error('Error removing user from conversation: ', error);
    res.status(500).send({ message: 'Server error while removing user from conversation!' });
  }
};


module.exports = {
  addUsersToConversation,
  getUsersInConversation,
  updateLastReadAt,
  removeUserFromConversation
};
