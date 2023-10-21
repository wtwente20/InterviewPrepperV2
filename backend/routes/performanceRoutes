const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  createPerformance, getPerformances, getPerformance, updatePerformance, deletePerformance
} = require("../controllers/performanceController");
const router = express.Router();

//create
router.post("/", authenticate, createPerformance);

// read all
router.get('/', authenticate, getPerformances);

//read one
router.get('/:id', authenticate, getPerformance);

//update
router.put('/:id', authenticate, updatePerformance);

//delete
router.delete('/:id', authenticate, deletePerformance);

//logging middleware
router.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

module.exports = router;