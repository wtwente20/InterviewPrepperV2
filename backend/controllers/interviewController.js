const Interview = require("../models/interview");
const logger = require("../config/logger");
const { createInterviewValidation } = require("../validators/interviewValidator");

//create interview
const createInterview = async (req, res) => {
  try {
    const { interview_date, interview_time, position_name, company_name } = req.body;
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
      user_id
    });

    //all good status
    res.status(201).send(interview);
  } catch (error) {
    logger.error("Error creating interview in controller: ", error)
    res.status(500).send({ message: "Server error while creating interview in controller!"})
  }
};

// Get all interviews for a user
const getInterviewsByUserId = async (req, res) => {
  try {
    const interviews = await Interview.findAll({ where: { user_id: req.user.id } });
    res.status(200).json(interviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createInterview,
  getInterviewsByUserId,

};