const Reaction = require('../models/reaction');
const logger = require('../config/logger');
const { idValidation } = require('../validators/reactionValidator');

const getAllReactions = async (req, res) => {
  try {
    const reactions = await Reaction.findAll();
    res.status(200).json(reactions);
  } catch (error) {
    logger.error('Error fetching reactions: ', error);
    res.status(500).send({ message: 'Server error while fetching reactions!' });
  }
};

const getReactionById = async (req, res) => {
  try {
    const { reactionId } = req.params;
    
    const { error } = idValidation({ id: reactionId });
    if (error) return res.status(400).send({ message: error.details[0].message });

    const reaction = await Reaction.findByPk(reactionId);
    if (!reaction) {
      return res.status(404).send({ message: 'Reaction not found' });
    }

    res.status(200).json(reaction);
  } catch (error) {
    logger.error('Error fetching reaction: ', error);
    res.status(500).send({ message: 'Server error while fetching reaction!' });
  }
};

module.exports = {
  getAllReactions,
  getReactionById,
};
