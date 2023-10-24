const Conversation = require('./conversation');
const User = require('./user');
const Share = require('./share');
const Feedback = require('./feedback');
const PrivacySetting = require('./privacySetting');
const ConversationUser = require('./conversationUser');
const Friend = require('./friend');

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

//associations for privacySettings
User.hasOne(PrivacySetting, { foreignKey: 'user_id', as: 'privacySetting' });
PrivacySetting.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

//associations for friends
Friend.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Friend.belongsTo(User, { foreignKey: 'friend_id', as: 'friendUser' });

User.hasMany(Friend, { foreignKey: 'user_id', as: 'friendship' });
User.hasMany(Friend, { foreignKey: 'friend_id', as: 'userFriendship' });
