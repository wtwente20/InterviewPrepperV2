const express = require("express");
const { authenticate } = require("../middlewares/auth");
const { createInterview, getInterviewsByUserId, getInterwiewById, updateInterview, deleteInterview, getInterviewsWithoutPerformance } = require("../controllers/interviewController");
const router = express.Router();

//logging middleware
router.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

//create interview
router.post("/", authenticate, createInterview);

//get all user interviews
router.get("/", authenticate, getInterviewsByUserId);

router.get('/withoutPerformance', authenticate, getInterviewsWithoutPerformance);

//get by interview id
router.get("/:id", authenticate, getInterwiewById);

//update interview
router.put("/:id", authenticate, updateInterview);

//delete interview
router.delete("/:id", authenticate, deleteInterview);

module.exports = router;