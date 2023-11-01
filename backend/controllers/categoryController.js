const logger = require('../config/logger');
const Category = require('../models/category');

//get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).send(categories);
  } catch (error) {
    logger.error("Error getting categories: ", error);
    return res.status(500).json({ message: error.message });
  }
};

//get one category
const getCategoryById = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.json(category);
  } catch (error) {
    logger.error("Error getting category by ID: ", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById
};
