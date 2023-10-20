const express = require("express");
const { authenticate } = require("../middlewares/auth");
const { createInterview, getInterviewsByUserId } = require("../controllers/interviewController");
const router = express.Router();

//create interview
router.post("/", authenticate, createInterview);

//get all user interviews
router.get("/", authenticate, getInterviewsByUserId);

//logging middleware
router.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});


module.exports = router;