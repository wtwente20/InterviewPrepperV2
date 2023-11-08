const Interview = require("../models/interview");
const logger = require("../config/logger");
const {
  createInterviewValidation,
  interviewIdValidation,
  updateInterviewValidation,
} = require("../validators/interviewValidator");

//create interview
const createInterview = async (req, res) => {
  try {
    const { interview_date, interview_time, position_name, company_name } =
      req.body;
    const user_id = req.user.id;

    //create interview validation
    const { error } = createInterviewValidation(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // await creation
    const interview = await Interview.create({
      interview_date,
      interview_time,
      position_name,
      company_name,
      user_id,
    });

    //all good status 201
    res.status(201).send(interview);
  } catch (error) {
    logger.error("Error creating interview in controller: ", error);
    res.status(500).send({
      message: "Server error while creating interview in controller!",
    });
  }
};

// Get all interviews for a user
const getInterviewsByUserId = async (req, res) => {
  try {
    //await get
    const interviews = await Interview.findAll({
      where: { user_id: req.user.id },
    });

    //all good status 200
    res.status(200).json(interviews);
  } catch (error) {
    logger.error("Error getting interviews in controller: ", error);
    res.status(400).json({ message: error.message });
  }
};

// get interview by id
const getInterwiewById = async (req, res) => {
  try {
    //get validate
    const { error } = interviewIdValidation(req.body);
    if (error) {
    return res.status(400).json({ message: error.details[0].message });
    }

    //await get
    const interview = await Interview.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    //all good status 200
    res.status(200).json(interview);
  } catch (error) {
    logger.error("Error getting interview in controller: ", error);
    res.status(400).json({ message: error.message });
  }
};

//update interview
const updateInterview = async (req, res) => {
  try {

    //log the request body
    logger.info("Updating interview with body: ", req.body);

    //update validator
    const { error } = updateInterviewValidation(req.body);
    if (error) {
      logger.error("Validation error: ", error.details[0].message);
      return res.status(400).json({ message: error.details[0].message });
    }

  

    // await update
    const interview = await Interview.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    await interview.update(req.body);

    // all good status 200
    res.status(200).json(interview);
  } catch (error) {
    logger.error("Error updating interview in controller: ", error);
    res.status(400).json({ message: error.message });
  }
};

//delete interview
const deleteInterview = async (req, res) => {
  try {
    // await delete
    const interview = await Interview.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    await interview.destroy();

    //all good status
    res.json({ message: "Interview deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createInterview,
  getInterviewsByUserId,
  getInterwiewById,
  updateInterview,
  deleteInterview
};
