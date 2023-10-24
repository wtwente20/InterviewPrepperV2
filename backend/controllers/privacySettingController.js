const PrivacySetting = require('../models/privacySetting');
const logger = require('../config/logger');

//get users privacy settings
const getPrivacySettings = async (req, res) => {
  try {
    const user_id = req.user.id;
    logger.info("User ID: ", user_id);
    const privacySettings = await PrivacySetting.findOne({ where: { user_id } });

    if (!privacySettings) {
      return res.status(404).json({ message: 'Privacy settings not found' });
    }

    return res.status(200).json(privacySettings);
  } catch (error) {
    logger.error('Error fetching privacy settings: ', error);
    return res.status(500).json({ message: error.message });
  }
};

//update user's privacy settings
const updatePrivacySettings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const settingsData = req.body;

    const settings = await PrivacySetting.findOne({ where: { user_id } });
    if (!settings) {
      return res.status(404).json({ message: 'Privacy settings not found.' });
    }

    await settings.update(settingsData);
    res.json(settings);
  } catch (error) {
    logger.error('Error updating privacy settings: ', error);
    res.status(500).json({ message: 'Server error while updating privacy settings.' });
  }
};

module.exports = {
  getPrivacySettings,
  updatePrivacySettings
};
