const UserCategory = require('../models/userCategory');
const logger = require('../config/logger');
const { createUserCategoryValidation, idValidation, updateUserCategoryValidation } = require('../validators/userCategoryValidator');

//create user category
const createUserCategory = async (req, res) => {
  try {
    const { category_id } = req.body;
    const user_id = req.user.id;

    //validate
    const { error } = createUserCategoryValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const userCategory = await UserCategory.create({
      user_id: user_id,
      category_id: category_id,
    });

    //create
    res.status(201).send(userCategory);
  } catch (error) {
    logger.error('Error creating UserCategory: ', error);
    res.status(500).send({ message: 'Server error while creating UserCategory!' });
  }
};

//get all user categories by user id
const getUserCategoriesByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    // id validate
    const { error } = idValidation({ id: user_id });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const userCategories = await UserCategory.findAll({
      where: { user_id: user_id },
    });

    //get
    res.status(200).json(userCategories);
  } catch (error) {
    logger.error('Error fetching UserCategories: ', error);
    res.status(500).send({ message: 'Server error while fetching UserCategories!' });
  }
};

// get single user category
const getUserCategoryById = async (req, res) => {
  try {
    const { userCategoryId } = req.params;

    //id validate
    const { error } = idValidation({ id: userCategoryId });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await user-category relationship
    const userCategory = await UserCategory.findByPk(userCategoryId);
    if (!userCategory) {
      logger.error(`User-Category relationship not found for ID: ${userCategoryId}`);
      return res.status(404).send({ message: 'User-Category relationship not found' });
    }

    //get
    res.status(200).send(userCategory);
  } catch (error) {
    logger.error('Error fetching User-Category relationship: ', error);
    res.status(500).send({ message: 'Server error while fetching User-Category relationship!' });
  }
};


// update user category
const updateUserCategory = async (req, res) => {
  try {
    const { userCategoryId } = req.params;
    const { category_id } = req.body;

    //id validate
    const { error: idError } = idValidation({ id: userCategoryId });
    if (idError) return res.status(400).send({ message: idError.details[0].message });

    //update validate
    const { error: dataError } = updateUserCategoryValidation({ category_id });
    if (dataError) return res.status(400).send({ message: dataError.details[0].message });

    //await
    const userCategory = await UserCategory.findByPk(userCategoryId);
    if (!userCategory) {
      return res.status(404).send({ message: 'UserCategory not found' });
    }

    //update
    await userCategory.update({ category_id });

    res.status(200).send(userCategory);
  } catch (error) {
    logger.error('Error updating UserCategory: ', error);
    res.status(500).send({ message: 'Server error while updating UserCategory!' });
  }
};

//delete user category
const deleteUserCategory = async (req, res) => {
  try {
    const { userCategoryId } = req.params;

    //d validate
    const { error } = idValidation({ id: userCategoryId });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const userCategory = await UserCategory.findByPk(userCategoryId);
    if (!userCategory) {
      return res.status(404).send({ message: 'UserCategory not found' });
    }

    //delete
    await userCategory.destroy();
    res.status(200).send({ message: 'UserCategory deleted successfully' });
  } catch (error) {
    logger.error('Error deleting UserCategory: ', error);
    res.status(500).send({ message: 'Server error while deleting UserCategory!' });
  }
};
module.exports = {
  createUserCategory,
  getUserCategoriesByUserId,
  getUserCategoryById,
  updateUserCategory,
  deleteUserCategory
};