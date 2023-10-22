const logger = require('../config/logger');
const Resource = require('../models/resource');

//get all
const getResources = async (req, res) => {
  try {
    const resources = await Resource.findAll();
    return res.json(resources);
  } catch (error) {
    logger.error("Error getting resources: ", error);
    return res.status(500).json({ message: error.message });
  }
};

//get one
const getResourceById = async (req, res) => {
  try {
    const resourceId = parseInt(req.params.id, 10);
    const resource = await Resource.findByPk(resourceId);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    return res.json(resource);
  } catch (error) {
    logger.error("Error getting resource by ID: ", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResources,
  getResourceById
};
