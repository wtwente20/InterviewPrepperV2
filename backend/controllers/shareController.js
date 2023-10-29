const logger = require("../config/logger");
const Share = require("../models/share");
const Question = require("../models/question");
const Answer = require("../models/answer");
const QuestionCollection = require("../models/questionCollection");
const Interview = require("../models/interview");
const Performance = require("../models/performance");
const UserResource = require("../models/userResource");
const {
  createShareValidation,
  updateShareValidation,
  shareIdValidation,
} = require("../validators/shareValidator");

//create
const createShare = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { share_type, shared_item_id } = req.body;

    const shareData = {
      ...req.body,
      user_id,
    };

    // Validate shared item existence
    let itemExists = false;
    switch (share_type) {
      case "question":
        itemExists = (await Question.findByPk(shared_item_id)) !== null;
        break;
      case "answer":
        itemExists = (await Answer.findByPk(shared_item_id)) !== null;
        break;
      case "question_collection":
        itemExists =
          (await QuestionCollection.findByPk(shared_item_id)) !== null;
        break;
      case "interview":
        itemExists = (await Interview.findByPk(shared_item_id)) !== null;
        break;
      case "performance":
        itemExists = (await Performance.findByPk(shared_item_id)) !== null;
        break;
      case "user_resource":
        itemExists = (await UserResource.findByPk(shared_item_id)) !== null;
        break;
      default:
        return res.status(400).send({ message: "Invalid share type" });
    }

    if (!itemExists) {
      return res.status(400).send({ message: "Shared item does not exist" });
    }

    //validate
    const { error } = createShareValidation(shareData);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // log question text for test
    // if (share_type === 'question') {
    //   const question = await Question.findByPk(shared_item_id);
    //   if (question) {
    //     console.log('Question Text:', question.question_text);
    //   } else {
    //     console.log('Question not found');
    //   }
    // }

    //await
    const share = await Share.create(shareData);

    //create
    return res.status(201).json(share);
  } catch (error) {
    logger.error("Error creating shares: ", error);
    return res.status(500).json({ message: error.message });
  }
};

//get all
const getShares = async (req, res) => {
  try {
    //await
    const shares = await Share.findAll();

    //get
    return res.json(shares);
  } catch (error) {
    logger.error("Error getting shares: ", error);
    return res.status(500).json({ message: error.message });
  }
};

//get one
const getShare = async (req, res) => {
  try {
    const { id } = req.params;

    //id validate
    const { error } = shareIdValidation({ id: parseInt(id) });
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    //await
    const share = await Share.findByPk(req.params.id);
    if (!share) {
      return res.status(404).json({ message: "Share not found" });
    }

    // logic to handle the different share types and their ids
    let associatedData = null;
    switch (share.share_type) {
      case "question":
        associatedData = await Question.findByPk(share.shared_item_id);
        break;
      case "answer":
        associatedData = await Answer.findByPk(share.shared_item_id);
        break;
      case "question_collection":
        associatedData = await QuestionCollection.findByPk(
          share.shared_item_id
        );
        break;
      case "interview":
        associatedData = await Interview.findByPk(share.shared_item_id);
        break;
      case "performance_review":
        associatedData = await Performance.findByPk(share.shared_item_id);
        break;
      case "user_resource":
        associatedData = await UserResource.findByPk(share.shared_item_id);
        break;
      default:
        return res.status(400).json({ message: "Invalid share type" });
    }

    if (!associatedData) {
      return res.status(404).json({ message: "Associated item not found" });
    }

    // get
    return res.json({ ...share.dataValues, associatedData });
  } catch (error) {
    logger.error("Error getting share: ", error);
    return res.status(500).json({ message: error.message });
  }
};

//update
const updateShare = async (req, res) => {
  try {
    //validate
    const { error } = updateShareValidation(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    //await
    const share = await Share.findByPk(req.params.id);
    if (!share) {
      return res.status(404).json({ message: "Share not found" });
    }
    await share.update(req.body);

    //update
    return res.json(share);
  } catch (error) {
    logger.error("Error updating shares: ", error);
    return res.status(500).json({ message: error.message });
  }
};

//delete
const deleteShare = async (req, res) => {
  try {
    const { id } = req.params;

    //id validate
    const { error } = shareIdValidation({ id: parseInt(id) });
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    //await
    const share = await Share.findByPk(req.params.id);
    if (!share) {
      return res.status(404).json({ message: "Share not found" });
    }
    await share.destroy();

    //delete
    res.status(200).send({ message: "Share deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createShare,
  getShares,
  getShare,
  updateShare,
  deleteShare,
};
