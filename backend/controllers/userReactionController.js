const UserReaction = require('../models/userReaction');
const logger = require('../config/logger');
const { createUserReactionValidation, idValidation } = require('../validators/userReactionValidator');


//create userReaction
const createUserReaction = async (req, res) => {
  try {
    const { reaction_id, reacted_item_id, reacted_item_type } = req.body;
    const user_id = req.user.id;

    //create validate
    const { error } = createUserReactionValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const userReaction = await UserReaction.create({
      reaction_id,
      user_id,
      reacted_item_id,
      reacted_item_type,
    });

    // create
    res.status(201).json(userReaction);
  } catch (error) {
    logger.error('Error creating UserReaction: ', error);
    res.status(500).send({ message: 'Server error while creating UserReaction!' });
  }
};

//get by id
const getUserReactionsByItemId = async (req, res) => {
  try {
    const { itemId, itemType } = req.params;
    
    const userReactions = await UserReaction.findAll({
      where: { reacted_item_id: itemId, reacted_item_type: itemType },
    });

    res.status(200).json(userReactions);
  } catch (error) {
    logger.error('Error fetching UserReactions: ', error);
    res.status(500).send({ message: 'Server error while fetching UserReactions!' });
  }
};

//delete user reaction
const deleteUserReaction = async (req, res) => {
  try {
    const { userReactionId } = req.params;

    const { error } = idValidation({ id: userReactionId });
    if (error) return res.status(400).send({ message: error.details[0].message });

    const userReaction = await UserReaction.findByPk(userReactionId);
    if (!userReaction) {
      return res.status(404).send({ message: 'UserReaction not found' });
    }

    await userReaction.destroy();
    res.status(200).send({ message: 'UserReaction deleted successfully' });
  } catch (error) {
    logger.error('Error deleting UserReaction: ', error);
    res.status(500).send({ message: 'Server error while deleting UserReaction!' });
  }
};

module.exports = {
  createUserReaction,
  getUserReactionsByItemId,
  deleteUserReaction
};
