const Conversation = require("../models/conversation");
const User = require('../models/user');
const logger = require("../config/logger");
const { createConversationValidation, conversationIdValidation, updateConversationValidation } = require("../validators/conversationValidator");

//create new conversation
const createConversation = async (req, res) => {
  try {
    const { title, userIds } = req.body;
    const createdBy = req.user.id;

    //validation
    const { error } = createConversationValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const conversation = await Conversation.create({
      title,
      created_by: createdBy,
    });

    //add users to conversation, including the creator
    const uniqueUserIds = Array.from(new Set([...userIds, createdBy]));
    await conversation.addUsers(uniqueUserIds);

    //create
    res.status(201).send(conversation);
  } catch (error) {
    logger.error("Error creating conversation: ", error);
    res.status(500).send({ message: "Server error while creating conversation!" });
  }
};

//get all conversations for a specific user
const getConversationsByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    //fetch conversations
    const conversations = await Conversation.findAll({
      include: [{
        model: User,
        attributes: ['username'], // only include the username field
        through: { attributes: [] }, // exclude all fields from the join table
        where: { id: userId } // filter to only include conversations for the specific user
      }]
    });
    

    res.status(200).json(conversations);
  } catch (error) {
    logger.error("Error fetching conversations: ", error);
    res.status(500).send({ message: "Server error while fetching conversations!" });
  }
};

//get conversation by id
const getConversationById = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const conversation = await Conversation.findByPk(conversationId, {
      include: [{
        model: User,
        attributes: ['username'], // only include the username field
        through: { attributes: [] } // exclude all fields from the join table
      }]
    });

    if (!conversation) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    res.status(200).send(conversation);
  } catch (error) {
    logger.error("Error fetching conversation: ", error);
    res.status(500).send({ message: "Server error while fetching conversation!" });
  }
};

const updateConversation = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { title } = req.body;

    //id validate
    const { error: idValidationError } = conversationIdValidation({ id: conversationId });
    if (idValidationError) return res.status(400).send({ message: idValidationError.details[0].message });

    //update validate
    const { error: updateValidationError } = updateConversationValidation({ id: conversationId, title });
    if (updateValidationError) return res.status(400).send({ message: updateValidationError.details[0].message });

    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    conversation.title = title;
    await conversation.save();

    res.status(200).send(conversation);
  } catch (error) {
    logger.error("Error updating conversation: ", error);
    res.status(500).send({ message: "Server error while updating conversation!" });
  }
};


const deleteConversation = async (req, res) => {
  try {
    const conversationId = req.params.id;

    // id validate
    const { error: idValidationError } = conversationIdValidation({ id: conversationId });
    if (idValidationError) return res.status(400).send({ message: idValidationError.details[0].message });

    const conversation = await Conversation.findByPk(conversationId);
    
    if (!conversation) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    await conversation.destroy();
    res.send({ message: "Conversation deleted successfully." });
  } catch (error) {
    logger.error("Error deleting conversation: ", error);
    res.status(500).send({ message: "Server error while deleting conversation!" });
  }
};


module.exports = {
  createConversation,
  getConversationsByUserId,
  getConversationById,
  updateConversation,
  deleteConversation
};
