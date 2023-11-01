const express = require("express");
const {
  authenticate,
  checkAnswerOwnerOrAdmin
} = require("../middlewares/auth");
const {
  createAnswer,
  deleteAnswer,
  updateAnswer,
  getAnswersByUserId,
  getAnswerByQuestionId,
} = require("../controllers/answerController");
const router = express.Router();

//post a new answer
router.post("/", authenticate, createAnswer);

//get a specific answer by question id
router.get("/question/:id", getAnswerByQuestionId);

//get all answers by user id
router.get("/user/:userId", getAnswersByUserId);

//update an answer
router.put("/:id", authenticate, checkAnswerOwnerOrAdmin, updateAnswer);

//delete an answer
router.delete("/:id", authenticate, checkAnswerOwnerOrAdmin, deleteAnswer);

//logging middleware
router.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});


module.exports = router;
