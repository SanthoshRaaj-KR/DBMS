const express = require('express');
const router = express.Router();
const Specialization = require('../models/Specialization');
const { protect, authorize } = require('../middleware/auth');

// Get all specializations
router.get('/', async (req, res) => {
  try {
    const specializations = await Specialization.findAll({
      order: [['SpecializationName', 'ASC']]
    });
    res.json(specializations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single specialization
router.get('/:id', async (req, res) => {
  try {
    const spec = await Specialization.findByPk(req.params.id);
    
    if (!spec) {
      return res.status(404).json({ message: 'Specialization not found' });
    }
    
    res.json(spec);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new specialization
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { SpecializationName } = req.body;
    
    if (!SpecializationName) {
      return res.status(400).json({ message: 'Specialization name is required' });
    }
    
    const spec = await Specialization.create({ SpecializationName });
    res.status(201).json(spec);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update specialization
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const spec = await Specialization.findByPk(req.params.id);
    
    if (!spec) {
      return res.status(404).json({ message: 'Specialization not found' });
    }
    
    await spec.update(req.body);
    res.json(spec);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete specialization
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const spec = await Specialization.findByPk(req.params.id);
    
    if (!spec) {
      return res.status(404).json({ message: 'Specialization not found' });
    }
    
    await spec.destroy();
    res.json({ message: 'Specialization deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
