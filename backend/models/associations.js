const Conversation = require('./conversation');
const User = require('./user');
const Share = require('./share');
const Feedback = require('./feedback');
const ConversationUser = require('./conversationUser');

//define associations with an alias
Conversation.belongsToMany(User, { through: ConversationUser, foreignKey: 'conversation_id', otherKey: 'user_id', as: 'users' });
User.belongsToMany(Conversation, { through: ConversationUser, foreignKey: 'user_id', otherKey: 'conversation_id', as: 'conversations' });


//define reverse association from ConversationUser to User
ConversationUser.belongsTo(User, { foreignKey: 'user_id' });

//associations for shares
User.hasMany(Share, { foreignKey: 'user_id', as: 'shares' });
Share.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

//associations for feedbacks
User.hasMany(Feedback, { foreignKey: 'user_id', as: 'feedbacks' });
Share.hasMany(Feedback, { foreignKey: 'share_id', as: 'feedbacks' });
Feedback.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Feedback.belongsTo(Share, { foreignKey: 'share_id', as: 'share' });