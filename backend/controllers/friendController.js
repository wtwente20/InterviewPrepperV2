const { Op } = require('sequelize');
const Friend = require('../models/friend');
const User = require('../models/user'); // Assuming you have a User model
const { actionValidation, sendFriendRequestValidation, friendIdValidation } = require('../validators/friendValidator');
const logger = require('../config/logger');

//send a friend request
const sendFriendRequest = async (req, res) => {
  try {
    const { friend_id } = req.body;
    const user_id = req.user.id;

    //validate request
    const { error } = sendFriendRequestValidation({ user_id, friend_id });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //check if users exist
    const user = await User.findByPk(user_id);
    const friend = await User.findByPk(friend_id);
    if (!user || !friend) return res.status(404).send({ message: 'User not found' });

    //check if a friend request already exists
    const existingRequest = await Friend.findOne({ where: { user_id, friend_id } });
    if (existingRequest) return res.status(409).send({ message: 'Friend request already sent' });

    //send friend request
    const friendRequest = await Friend.create({ user_id, friend_id, action_user_id: user_id });
    return res.status(201).json(friendRequest);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//accept a friend request
const acceptFriendRequest = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { friend_id } = req.params;

    //validate action
    const { error } = actionValidation({ user_id, friend_id });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //find the friend request
    const friendRequest = await Friend.findOne({ where: { user_id: friend_id, friend_id: user_id, friendship_status: 'PENDING' } });
    if (!friendRequest) return res.status(404).send({ message: 'Friend request not found' });

    //accept the friend request
    await friendRequest.update({ friendship_status: 'ACCEPTED', action_user_id: user_id });
    
    //create reciprocal friend entry
    await Friend.create({ user_id, friend_id, friendship_status: 'ACCEPTED', action_user_id: user_id });
    
    return res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//remove a friend
const removeFriend = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { friend_id } = req.params;

    //validate action
    const { error } = actionValidation({ user_id, friend_id });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //find the friendships
    const friendships = await Friend.findAll({
      where: {
        [Op.or]: [
          { user_id, friend_id },
          { user_id: friend_id, friend_id: user_id }
        ],
        friendship_status: 'ACCEPTED'
      }
    });

    if (friendships.length === 0) return res.status(404).send({ message: 'Friendship not found' });

    //remove the friends
    await Promise.all(friendships.map(friendship => friendship.destroy()));
    return res.status(200).json({ message: 'Friend removed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


//block a user
const blockUser = async (req, res) => {
  try {
    const user_id = req.user.id; // Assuming user's id is attached to the request object
    const { friend_id } = req.params;

    //validate action
    const { error } = actionValidation({ user_id, friend_id });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //check if already blocked
    const existingBlock = await Friend.findOne({ where: { user_id, friend_id } });
    if (existingBlock && ['BLOCKED_BY_USER', 'BLOCKED_BOTH'].includes(existingBlock.block_status)) {
      return res.status(409).send({ message: 'User already blocked' });
    }

    //block the user
    if (existingBlock) {
      const newBlockStatus = existingBlock.block_status === 'BLOCKED_BY_FRIEND' ? 'BLOCKED_BOTH' : 'BLOCKED_BY_USER';
      await existingBlock.update({ block_status: newBlockStatus, action_user_id: user_id });
    } else {
      await Friend.create({ user_id, friend_id, block_status: 'BLOCKED_BY_USER', action_user_id: user_id });
    }

    return res.status(200).json({ message: 'User blocked' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//list friends
const listFriends = async (req, res) => {
  try {
    const user_id = req.user.id;

    const friends = await Friend.findAll({
      where: { user_id, friendship_status: 'ACCEPTED' },
      include: [
        { model: User, as: 'friendUser' },
      ]
    });

    return res.json(friends);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// get friend details
const getFriendDetails = async (req, res) => {
  try {
    const { friend_id } = req.params;

    //validate friend id
    const { error } = friendIdValidation({ friend_id });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //find friend details
    const friend = await Friend.findByPk(friend_id);
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }
    
    return res.json(friend);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  blockUser,
  listFriends,
  getFriendDetails
};
