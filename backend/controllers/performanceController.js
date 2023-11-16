const Answer = require("../models/answer");
const Interview = require("../models/interview");
const Performance = require("../models/performance");
const Question = require("../models/question");
const {
  performanceIdValidation,
  createPerformanceValidation,
  updatePerformanceValidation,
} = require("../validators/performanceValidator");

//create performance
const createPerformance = async (req, res) => {
  try {
    //validate
    // const { error } = createPerformanceValidation(req.body);
    // if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const performance = await Performance.create(req.body);
    return res.status(201).json(performance);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get all performances
const getPerformances = async (req, res) => {
  try {
    const userId = req.user.id;
    const performances = await Performance.findAll({
      include: [
        {
          model: Interview,
          as: "interview",
          where: { user_id: userId },
          required: true,
        },
        {
          model: Question,
          as: "struggledQuestion",
          attributes: ["question_text"],
        },
        {
          model: Answer,
          as: "struggledAnswer",
          attributes: ["answer_text"],
        },
        {
          model: Question,
          as: "wellAnsweredQuestion",
          attributes: ["question_text"],
        },
        {
          model: Answer,
          as: "wellAnsweredAnswer",
          attributes: ["answer_text"],
        },
      ],
    });
    return res.json(performances);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching performances." });
  }
};

//get one performance
const getPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    //validate
    const { error } = performanceIdValidation({ id: parseInt(id) });
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // Fetch the performance along with the associated interview and questions
    const performance = await Performance.findByPk(id, {
      include: [
        {
          model: Interview,
          as: "interview",
          where: { user_id: userId },
          required: true,
        },
        {
          model: Question,
          as: "struggledQuestion",
          attributes: ["question_text"],
        },
        {
          model: Answer,
          as: "struggledAnswer",
          attributes: ["answer_text"],
        },
        {
          model: Question,
          as: "wellAnsweredQuestion",
          attributes: ["question_text"],
        },
        {
          model: Answer,
          as: "wellAnsweredAnswer",
          attributes: ["answer_text"],
        },
      ],
    });

    if (!performance) {
      return res.status(404).json({ message: "Performance not found" });
    }

    return res.json(performance);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get performance by interview_id
const getPerformanceByInterviewId = async (req, res) => {
  try {
    const { interview_id } = req.params;
    const performance = await Performance.findOne({ where: { interview_id } });

    if (!performance) {
      return res
        .status(404)
        .json({ message: "Performance not found for the given interview" });
    }

    return res.json(performance);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//update performance
const updatePerformance = async (req, res) => {
  try {
    //validate
    // const { error } = updatePerformanceValidation(req.body);
    // if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const performance = await Performance.findByPk(req.params.id);
    if (!performance) {
      return res.status(404).json({ message: "Performance not found" });
    }
    await performance.update(req.body);
    return res.json(performance);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// delete performance
const deletePerformance = async (req, res) => {
  try {
    const { id } = req.params;

    //validate
    const { error } = performanceIdValidation({ id: parseInt(id) });
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // await
    const performance = await Performance.findByPk(id);
    if (!performance) {
      return res.status(404).json({ message: "Performance not found" });
    }
    //delete
    await performance.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPerformance,
  getPerformances,
  getPerformance,
  getPerformanceByInterviewId,
  updatePerformance,
  deletePerformance,
};
