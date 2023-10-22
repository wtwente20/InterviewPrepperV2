const Conversation = require('./conversation');
const User = require('./user');
const ConversationUser = require('./conversationUser');

//define associations with an alias
Conversation.belongsToMany(User, { through: ConversationUser, foreignKey: 'conversation_id', otherKey: 'user_id', as: 'users' });
User.belongsToMany(Conversation, { through: ConversationUser, foreignKey: 'user_id', otherKey: 'conversation_id', as: 'conversations' });


//define reverse association from ConversationUser to User
ConversationUser.belongsTo(User, { foreignKey: 'user_id' });

