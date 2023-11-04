const Conversation = require("./conversation");
const User = require("./user");
const Share = require("./share");
const Feedback = require("./feedback");
const PrivacySetting = require("./privacySetting");
const ConversationUser = require("./conversationUser");
const Friend = require("./friend");
const Question = require("./question");
const Answer = require("./answer");
const Message = require("./message");

// User <--> Conversation (Many-to-Many)
Conversation.belongsToMany(User, {
  through: ConversationUser,
  foreignKey: "conversation_id",
  otherKey: "user_id",
  as: "users"
});
User.belongsToMany(Conversation, {
  through: ConversationUser,
  foreignKey: "user_id",
  otherKey: "conversation_id",
  as: "conversations"
});

// ConversationUser --> User (Many-to-One)
ConversationUser.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

// User --> Share (One-to-Many)
User.hasMany(Share, {
  foreignKey: "user_id",
  as: "shares",
  onDelete: "CASCADE",
});
Share.belongsTo(User, { foreignKey: "user_id", as: "user" });

// User --> Feedback (One-to-Many)
User.hasMany(Feedback, {
  foreignKey: "user_id",
  as: "feedbacks",
  onDelete: "CASCADE",
});
Share.hasMany(Feedback, {
  foreignKey: "share_id",
  as: "feedbacks",
  onDelete: "CASCADE",
});
Feedback.belongsTo(User, { foreignKey: "user_id", as: "user" });
Feedback.belongsTo(Share, { foreignKey: "share_id", as: "share" });

// User <--> PrivacySetting (One-to-One)
User.hasOne(PrivacySetting, {
  foreignKey: "user_id",
  as: "privacySetting",
  onDelete: "CASCADE",
});
PrivacySetting.belongsTo(User, { foreignKey: "user_id", as: "user" });

// User <--> Friend (Self-referencing Many-to-Many)
Friend.belongsTo(User, { foreignKey: "user_id", as: "user" });
Friend.belongsTo(User, { foreignKey: "friend_id", as: "friendUser" });
User.hasMany(Friend, {
  foreignKey: "user_id",
  as: "friendship",
  onDelete: "CASCADE",
});
User.hasMany(Friend, {
  foreignKey: "friend_id",
  as: "userFriendship",
  onDelete: "CASCADE",
});

// Question --> Answer (One-to-Many)
Question.hasMany(Answer, { foreignKey: "question_id", onDelete: "CASCADE" });
Answer.belongsTo(Question, { foreignKey: "question_id", onDelete: "CASCADE" });

// Conversation --> Message (One-to-Many)
Conversation.hasMany(Message, { foreignKey: 'conversation_id', as: "messages" });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });

// User --> Message (One-to-Many, for sent messages)
User.hasMany(Message, {
  foreignKey: "sender_id",
  as: "sentMessages",
  onDelete: "CASCADE",
});
Message.belongsTo(User, {
  foreignKey: "sender_id",
  as: "sender",
  onDelete: "CASCADE",
});

// User --> Conversation (One-to-Many, for created conversations)
User.hasMany(Conversation, {
  foreignKey: "created_by",
  as: "createdConversations",
  onDelete: "CASCADE",
});
Conversation.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
  onDelete: "CASCADE",
});

