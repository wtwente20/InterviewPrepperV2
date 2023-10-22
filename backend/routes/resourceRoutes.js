const express = require('express');
const { getResources, getResourceById } = require('../controllers/resourceController');
const router = express.Router();

//get all resources
router.get('/', getResources);

//get resource by ID
router.get('/:id', getResourceById);

module.exports = router;
