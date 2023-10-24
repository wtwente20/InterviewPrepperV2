const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  createShare, getShares, getShare, updateShare, deleteShare
} = require("../controllers/shareController");
const router = express.Router();

// tested but needs more, such as connections for shared item and text for share text

//create
router.post("/", authenticate, createShare);

//read all
router.get('/', authenticate, getShares);

//read one
router.get('/:id', authenticate, getShare);

//update
router.put('/:id', authenticate, updateShare);

//delete
router.delete('/:id', authenticate, deleteShare);

// Logging middleware
router.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

module.exports = router;
