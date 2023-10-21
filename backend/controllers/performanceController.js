const Performance = require('../models/performance');
const { performanceIdValidation, createPerformanceValidation, updatePerformanceValidation } = require('../validators/performanceValidator');

//create performance
const createPerformance = async (req, res) => {
  try {
    //validate
    const { error } = createPerformanceValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

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
    const performances = await Performance.findAll();
    return res.json(performances);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//get one performance
const getPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    //validate
    const { error } = performanceIdValidation({ id: parseInt(id) });
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const performance = await Performance.findByPk(req.params.id);
    if (!performance) {
      return res.status(404).json({ message: 'Performance not found' });
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
    const { error } = updatePerformanceValidation(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    //await
    const performance = await Performance.findByPk(req.params.id);
    if (!performance) {
      return res.status(404).json({ message: 'Performance not found' });
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
    if (error) return res.status(400).send({ message: error.details[0].message });
    
    // await
    const performance = await Performance.findByPk(id);
    if (!performance) {
      return res.status(404).json({ message: 'Performance not found' });
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
  updatePerformance,
  deletePerformance
};
