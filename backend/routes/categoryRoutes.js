const express = require('express');
const { getCategories, getCategoryById } = require('../controllers/categoryController');
const router = express.Router();

//get all categories
router.get('/', getCategories);

//get category by id
router.get('/:id', getCategoryById);

module.exports = router;
