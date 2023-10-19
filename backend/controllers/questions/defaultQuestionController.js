const DefaultQuestion = require("../../models/defaultQuestion");


// Fetch all default questions
const getAllDefaultQuestions = async (req, res) => {
  try {
    const defaultQuestions = await DefaultQuestion.findAll();
    res.status(200).send(defaultQuestions);
  } catch (error) {
    logger.error("Error fetching default questions: ", error);
    res.status(500).send({ message: "Server error while fetching default questions!" });
  }
};

module.exports = {
  getAllDefaultQuestions
};