const UserResource = require('../models/userResource');
const logger = require('../config/logger');
const { createUserResourceValidation, updateUserResourceValidation, idValidation } = require('../validators/userResourceValidator');

//create user resource
const createUserResource = async (req, res) => {
  try {
    const { resource_name, resource_link, resource_type, description } = req.body;
    const user_id = req.user.id;

    // create validate
    const { error } = createUserResourceValidation({ resource_name, resource_link, resource_type, description });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const userResource = await UserResource.create({ user_id, resource_name, resource_link, resource_type, description });

    //create
    res.status(201).send(userResource);
  } catch (error) {
    logger.error('Error creating UserResource: ', error);
    res.status(500).send({ message: 'Server error while creating UserResource!' });
  }
};

// get user resources by user id
const getUserResourcesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    //id validate
    const { error } = idValidation({ id: userId });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const userResources = await UserResource.findAll({
      where: { user_id: userId },
    });

    //get
    res.status(200).json(userResources);
  } catch (error) {
    logger.error('Error fetching UserResources: ', error);
    res.status(500).send({ message: 'Server error while fetching UserResources!' });
  }
};

//get user resource by id
const getUserResourceById = async (req, res) => {
  try {
    const { userResourceId } = req.params;

    //id validate
    const { error } = idValidation({ id: userResourceId });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const userResource = await UserResource.findByPk(userResourceId);
    if (!userResource) {
      logger.error(`UserResource not found for ID: ${userResourceId}`);
      return res.status(404).send({ message: 'UserResource not found' });
    }

    //get
    res.status(200).send(userResource);
  } catch (error) {
    logger.error('Error fetching UserResource: ', error);
    res.status(500).send({ message: 'Server error while fetching UserResource!' });
  }
};

//update user resource
const updateUserResource = async (req, res) => {
  try {
    const { userResourceId } = req.params;
    const { resource_name, resource_link, resource_type, description } = req.body;

    //id validate
    const { error: idError } = idValidation({ id: userResourceId });
    if (idError) return res.status(400).send({ message: idError.details[0].message });

    //update validate
    const { error: dataError } = updateUserResourceValidation({ resource_name, resource_link, resource_type, description });
    if (dataError) return res.status(400).send({ message: dataError.details[0].message });

    //retrieve user resource
    const userResource = await UserResource.findByPk(userResourceId);
    if (!userResource) {
      return res.status(404).send({ message: 'UserResource not found' });
    }

    //update
    userResource.resource_name = resource_name;
    userResource.resource_link = resource_link;
    userResource.resource_type = resource_type;
    userResource.description = description;
    await userResource.save();

    // Respond with updated user resource
    res.status(200).send(userResource);
  } catch (error) {
    logger.error('Error updating UserResource: ', error);
    res.status(500).send({ message: 'Server error while updating UserResource!' });
  }
};

//delete user resource
const deleteUserResource = async (req, res) => {
  try {
    const { userResourceId } = req.params;

    // id validate
    const { error } = idValidation({ id: userResourceId });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const userResource = await UserResource.findByPk(userResourceId);
    if (!userResource) {
      return res.status(404).send({ message: 'UserResource not found' });
    }

    //delete
    await userResource.destroy();
    res.status(200).send({ message: 'UserResource deleted successfully' });
  } catch (error) {
    logger.error('Error deleting UserResource: ', error);
    res.status(500).send({ message: 'Server error while deleting UserResource!' });
  }
};

module.exports = {
  createUserResource,
  getUserResourcesByUserId,
  getUserResourceById,
  updateUserResource,
  deleteUserResource
}