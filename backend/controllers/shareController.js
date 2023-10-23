const logger = require('../config/logger');
const Share = require('../models/share');
const { createShareValidation, updateShareValidation, shareIdValidation } = require('../validators/shareValidator');

//create
const createShare = async (req, res) => {
  try {
    const user_id = req.user.id;

    const shareData = {
      ...req.body,
      user_id
    };

    //validate
    const { error } = createShareValidation(shareData);
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const share = await Share.create(shareData);

    //create
    return res.status(201).json(share);
  } catch (error) {
    logger.error('Error creating shares: ', error);
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
    logger.error('Error getting shares: ', error);
    return res.status(500).json({ message: error.message });
  }
};

//get one
const getShare = async (req, res) => {
  try {
    const { id } = req.params;

    //id validate
    const { error } = shareIdValidation({ id: parseInt(id) });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const share = await Share.findByPk(req.params.id);
    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }

    //get
    return res.json(share);
  } catch (error) {
    logger.error('Error getting share: ', error);
    return res.status(500).json({ message: error.message });
  }
};

//update
const updateShare = async (req, res) => {
  try {
    //validate
    const { error } = updateShareValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const share = await Share.findByPk(req.params.id);
    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }
    await share.update(req.body);
    
    //update
    return res.json(share);
  } catch (error) {
    logger.error('Error updating shares: ', error);
    return res.status(500).json({ message: error.message });
  }
};

//delete
const deleteShare = async (req, res) => {
  try {
    const { id } = req.params;

    //id validate
    const { error } = shareIdValidation({ id: parseInt(id) });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const share = await Share.findByPk(req.params.id);
    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }
    await share.destroy();

    //delete
    res.status(200).send({ message: 'Share deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createShare,
  getShares,
  getShare,
  updateShare,
  deleteShare
};
