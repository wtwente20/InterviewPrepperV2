const Message = require('../models/message');
const logger = require('../config/logger');
const { createMessageValidation, idValidation, updateMessageValidation } = require('../validators/messageValidator');

//create message
const createMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user.id;

    //validate
    const { error } = createMessageValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const message = await Message.create({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    });

    //create
    res.status(201).send(message);
  } catch (error) {
    logger.error('Error creating message: ', error);
    res.status(500).send({ message: 'Server error while creating message!' });
  }
};

//get all messages for user id
const getMessagesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validation
    const { error } = idValidation({ id: userId });
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Fetch messages
    const messages = await Message.findAll({
      where: { sender_id: userId },
      order: [['created_at', 'ASC']],
    });

    res.status(200).json(messages);
  } catch (error) {
    logger.error('Error fetching messages: ', error);
    res.status(500).send({ message: 'Server error while fetching messages!' });
  }
};


//get by conversation id
const getMessagesByConversationId = async (req, res) => {
  try {
    const { conversationId } = req.params;

    //id validate
    const { error } = idValidation({ id: conversationId });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const messages = await Message.findAll({
      where: { conversation_id: conversationId },
      order: [['created_at', 'ASC']],
    });

    //fetch messages
    res.status(200).json(messages);
  } catch (error) {
    logger.error('Error fetching messages: ', error);
    res.status(500).send({ message: 'Server error while fetching messages!' });
  }
};

//get message by message id
const getMessageById = async (req, res) => {
  try {
    const { messageId } = req.params;

    //id validate
    const { error } = idValidation({ id: messageId });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).send({ message: 'Message not found' });
    }

    //fetch message
    res.status(200).send(message);
  } catch (error) {
    logger.error('Error fetching message: ', error);
    res.status(500).send({ message: 'Server error while fetching message!' });
  }
};

//update message
const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    //id validate
    const { error: idError } = idValidation({ id: messageId });
    if (idError) return res.status(400).send({ message: idError.details[0].message });

    const { error: contentError } = updateMessageValidation({ content });
    if (contentError) return res.status(400).send({ message: contentError.details[0].message });

    //await message retrieval
    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).send({ message: 'Message not found' });
    }

    //check if the user is the sender
    if (message.sender_id !== userId) {
      return res.status(403).send({ message: 'You are not authorized to update this message' });
    }

    //await update
    message.content = content;
    await message.save();

    //update
    res.status(200).send(message);
  } catch (error) {
    logger.error('Error updating message: ', error);
    res.status(500).send({ message: 'Server error while updating message!' });
  }
};

//delete message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    //id validate
    const { error } = idValidation({ id: messageId });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //fetch message
    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).send({ message: 'Message not found' });
    }

    //check if the user is the sender
    if (message.sender_id !== userId) {
      return res.status(403).send({ message: 'You are not authorized to delete this message' });
    }

    //await
    await message.destroy();

    //delete
    res.status(200).send({ message: 'Message deleted successfully' });
  } catch (error) {
    logger.error('Error deleting message: ', error);
    res.status(500).send({ message: 'Server error while deleting message!' });
  }
};



module.exports = {
  createMessage,
  getMessagesByUserId,
  getMessagesByConversationId,
  getMessageById,
  updateMessage,
  deleteMessage
};