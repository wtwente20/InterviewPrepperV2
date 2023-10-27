const UserReaction = require("../models/userReaction");
const Share = require("../models/share");
const Feedback = require("../models/feedback");

const logger = require("../config/logger");
const {
  createUserReactionValidation,
  idValidation,
} = require("../validators/userReactionValidator");

//create userReaction
const createUserReaction = async (req, res) => {
  try {
    const { reaction_id, reacted_item_id, reacted_item_type } = req.body;
    const user_id = req.user.id;

    //create validate
    const { error } = createUserReactionValidation(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    //fetch and log associated data
    if (reacted_item_type === "SHARE") {
      const share = await Share.findByPk(reacted_item_id);
      if (share) {
        console.log("Share found:", share);
      } else {
        console.log("Share not found");
      }
    } else if (reacted_item_type === "FEEDBACK") {
      const feedback = await Feedback.findByPk(reacted_item_id);
      if (feedback) {
        console.log("Feedback found:", feedback);
      } else {
        console.log("Feedback not found");
      }
    }

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
    logger.error("Error creating UserReaction: ", error);
    res
      .status(500)
      .send({ message: "Server error while creating UserReaction!" });
  }
};

//get by id
const getUserReactions = async (req, res) => {
  try {
    const { itemType, itemId } = req.params;
    const userId = req.user.id;

    // convert the itemType to uppercase to match the ENUM type in the database
    const reactedItemType = itemType.toUpperCase();

    const userReactions = await UserReaction.findAll({
      where: {
        user_id: userId,
        reacted_item_id: itemId,
        reacted_item_type: reactedItemType,
      },
    });

    if (userReactions && userReactions.length > 0) {
      return res.status(200).json(userReactions);
    } else {
      return res.status(404).send({ message: "Reactions not found" });
    }
  } catch (error) {
    logger.error("Error fetching UserReactions: ", error);
    res
      .status(500)
      .send({ message: "Server error while fetching UserReactions!" });
  }
};

//delete user reaction
const deleteUserReaction = async (req, res) => {
  try {
    const { reactionId } = req.params;
    const userId = req.user.id;

    const { error } = idValidation({ id: reactionId });
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const userReaction = await UserReaction.findByPk(reactionId);
    if (!userReaction) {
      return res.status(404).send({ message: "UserReaction not found" });
    }

    //check if the reaction belongs to the logged-in user
    if (userReaction.user_id !== userId) {
      return res
        .status(403)
        .send({ message: "Forbidden: You can only delete your own reactions" });
    }

    await userReaction.destroy();
    res.status(200).send({ message: "UserReaction deleted successfully" });
  } catch (error) {
    logger.error("Error deleting UserReaction: ", error);
    res
      .status(500)
      .send({ message: "Server error while deleting UserReaction!" });
  }
};

module.exports = {
  createUserReaction,
  getUserReactions,
  deleteUserReaction,
};
