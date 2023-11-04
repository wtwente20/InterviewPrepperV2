const Conversation = require("../models/conversation");
const User = require("../models/user");
const logger = require("../config/logger");
const {
  createConversationValidation,
  conversationIdValidation,
  updateConversationValidation,
} = require("../validators/conversationValidator");
const Message = require("../models/message");
const { Op } = require("sequelize");
const sequelize = require("../config/database");

//create new conversation
const createConversation = async (req, res) => {
  const transaction = await sequelize.transaction(); // Start a new database transaction

  try {
    const { userIds, initialMessage } = req.body;
    const createdBy = req.user.id;

    // Validation
    const { error } = createConversationValidation(req.body);
    if (error) {
      await transaction.rollback(); // Rollback the transaction on validation error
      return res.status(400).send({ message: error.details[0].message });
    }

    // Create the conversation within the transaction
    const conversation = await Conversation.create(
      {
        created_by: createdBy,
      },
      { transaction }
    );

    // Add users to conversation, including the creator
    const uniqueUserIds = Array.from(new Set([...userIds, createdBy]));
    await conversation.addUsers(uniqueUserIds, { transaction });

    // Create the initial message if provided
    if (initialMessage) {
      const message = await Message.create(
        {
          conversationId: conversation.id,
          body: initialMessage,
          userId: createdBy,
        },
        { transaction }
      );
      // Optionally, add the message to the conversation object if you want to return it
      conversation.dataValues.messages = [message];
    }

    await transaction.commit(); // Commit the transaction only after all operations succeed

    // Return the created conversation
    res.status(201).send(conversation);
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction if any error occurs
    logger.error("Error creating conversation: ", error);
    res
      .status(500)
      .send({ message: "Server error while creating conversation!" });
  }
};

//get all conversations for a specific user
const getConversationsByUserId = async (req, res) => {
  try {
    const currentUserId = req.user.id; // This is where currentUserId is defined

    const { limit, offset } = getPaginationParams(req);

    const conversationsWithCounts = await fetchConversations(
      currentUserId,
      limit,
      offset
    );
    logConversations(currentUserId, conversationsWithCounts.conversations);

    const response = formatResponse(
      currentUserId,
      conversationsWithCounts,
      limit,
      offset
    ); // Pass currentUserId to formatResponse

    res.status(200).json(response);
  } catch (error) {
    handleConversationError(error, res);
  }
};

const getPaginationParams = (req) => ({
  limit: parseInt(req.query.limit) || 20,
  offset: parseInt(req.query.offset) || 0,
});

const fetchConversations = async (userId, limit, offset) => {
  const conversations = await Conversation.findAll({
    attributes: [
      "id",
      "created_by",
      "created_at",
      "updated_at",
      "sender_name",
      "last_message_content",
      "unread_count",
    ],
    include: [
      {
        model: User,
        as: "users",
        attributes: ["id", "username"],
        through: {
          attributes: ["last_read_at"],
          where: {
            user_id: userId,
          },
        },
        required: true,
      },
      {
        model: Message,
        as: "messages",
        attributes: ["content", "sender_id", "read"],
        order: [["created_at", "DESC"]],
        limit: 1,
      },
    ],
    order: [["updated_at", "DESC"]],
    limit: limit,
    offset: offset,
  });

  conversations.forEach((convo) => {
    if (convo.messages && convo.messages.length > 0) {
      const lastMessage = convo.messages[0];
      convo.dataValues.last_message_content = lastMessage.content;
      convo.dataValues.unread_count = convo.users.reduce(
        (count, participant) => {
          if (
            participant.ConversationUser.last_read_at < lastMessage.createdAt &&
            participant.id !== userId
          ) {
            return count + 1;
          }
          return count;
        },
        0
      );
    } else {
      convo.dataValues.last_message_content = null;
      convo.dataValues.unread_count = 0;
    }
  });

  const totalConversations = await Conversation.count({
    include: [
      {
        model: User,
        as: "users",
        where: { id: userId },
      },
    ],
  });

  return { conversations, totalConversations };
};

const logConversations = (userId, conversations) => {
  logger.info(
    `Fetched ${conversations.length} conversations for user ID ${userId}`,
    {
      userId: userId,
      conversations: conversations.map((convo) => ({
        id: convo.id,
        lastMessage: convo.dataValues.last_message_content,
        unreadCount: convo.dataValues.unread_count,
      })),
    }
  );
};

const formatResponse = (
  currentUserId,
  { conversations, totalConversations, limit, offset }
) => {
  return {
    totalConversations,
    limit,
    offset,
    conversations: conversations.map((convo) =>
      formatConversation(convo, currentUserId)
    ),
  };
};

const formatConversation = (convo, userId) => {
  const unreadCount = calculateUnreadCount(convo, userId); // use the passed userId here

  return {
    id: convo.id,
    lastMessage: convo.messages.length > 0 ? convo.messages[0].content : null,
    unreadCount: unreadCount,
    // ... add any other conversation details you want to include
  };
};

const calculateUnreadCount = (convo, userId) => {
  // Check if convo.messages is not undefined and has at least one message
  if (convo.messages && convo.messages.length > 0) {
    return convo.users.reduce((count, participant) => {
      if (
        participant.ConversationUser.last_read_at <
          convo.messages[0].createdAt &&
        participant.id !== userId
      ) {
        return count + 1;
      }
      return count;
    }, 0);
  }
  return 0; // If no messages, return unread count as 0
};

const handleConversationError = (error, res) => {
  logger.error("Error fetching conversations: ", error);
  res
    .status(500)
    .send({ message: "Server error while fetching conversations!" });
};

//get conversation by id
const getConversationById = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const conversation = await Conversation.findByPk(conversationId, {
      attributes: ["id", "created_at", "updated_at"],
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "username"],
        },
      ],
    });

    if (!conversation) {
      return res.status(404).send({ message: "Conversation not found" });
    }

    res.status(200).send(conversation);
  } catch (error) {
    logger.error("Error fetching conversation: ", error);
    res
      .status(500)
      .send({ message: "Server error while fetching conversation!" });
  }
};

const updateConversation = async (req, res) => {
  try {
    const conversationId = req.params.id;

    //id validate
    const { error: idValidationError } = conversationIdValidation({
      id: conversationId,
    });
    if (idValidationError)
      return res
        .status(400)
        .send({ message: idValidationError.details[0].message });

    //update validate
    const { error: updateValidationError } = updateConversationValidation({
      id: conversationId,
    });
    if (updateValidationError)
      return res
        .status(400)
        .send({ message: updateValidationError.details[0].message });

    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).send({ message: "Conversation not found" });
    }

    const updates = req.body;
    Object.assign(conversation, updates);

    await conversation.save();

    res.status(200).send(conversation);
  } catch (error) {
    logger.error("Error updating conversation: ", error);
    res
      .status(500)
      .send({ message: "Server error while updating conversation!" });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const conversationId = req.params.id;

    // id validate
    const { error: idValidationError } = conversationIdValidation({
      id: conversationId,
    });
    if (idValidationError)
      return res
        .status(400)
        .send({ message: idValidationError.details[0].message });

    const conversation = await Conversation.findByPk(conversationId);

    if (!conversation) {
      return res.status(404).send({ message: "Conversation not found" });
    }

    await conversation.destroy();
    res.send({ message: "Conversation deleted successfully." });
  } catch (error) {
    logger.error("Error deleting conversation: ", error);
    res
      .status(500)
      .send({ message: "Server error while deleting conversation!" });
  }
};

module.exports = {
  createConversation,
  getConversationsByUserId,
  getConversationById,
  updateConversation,
  deleteConversation,
};
