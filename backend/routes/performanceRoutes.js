const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  createPerformance, getPerformances, getPerformance, updatePerformance, deletePerformance, getPerformanceByInterviewId
} = require("../controllers/performanceController");

const router = express.Router();

//logging middleware
router.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

//create
router.post("/", authenticate, createPerformance);

// read all
router.get('/', authenticate, getPerformances);

//get by interview id
router.get('/byInterviewId/:interview_id', authenticate, getPerformanceByInterviewId);

//read one
router.get('/:id', authenticate, getPerformance);

//update
router.put('/:id', authenticate, updatePerformance);

//delete
router.delete('/:id', authenticate, deletePerformance);

module.exports = router;