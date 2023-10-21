const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  createQuestionCollection,
  getQuestionCollections,
  getQuestionCollection,
  updateQuestionCollection,
  deleteQuestionCollection,
} = require("../controllers/questionCollectionController");
const router = express.Router();

//create question collection
router.post("/", authenticate, createQuestionCollection);

//get all question collections
router.get("/", authenticate, getQuestionCollections);

//get a single question collection by id
router.get("/:id", authenticate, getQuestionCollection);

//update a question collection by id
router.put("/:id", authenticate, updateQuestionCollection);

//delete a question collection by id
router.delete("/:id", authenticate, deleteQuestionCollection);

module.exports = router;
