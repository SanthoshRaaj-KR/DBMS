const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const { Specialization } = require('../models');

// @route   GET /api/specializations
// @desc    Get all specializations
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const specializations = await Specialization.findAll({
    order: [['SpecializationName', 'ASC']]
  });
  successResponse(res, specializations);
}));

// @route   GET /api/specializations/:id
// @desc    Get single specialization
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const specialization = await Specialization.findByPk(req.params.id);
  
  if (!specialization) {
    return errorResponse(res, 'Specialization not found', 404);
  }

  successResponse(res, specialization);
}));

// @route   POST /api/specializations
// @desc    Create new specialization
// @access  Private (admin only)
router.post('/', protect, authorize('admin'), [
  body('specializationName').notEmpty().withMessage('Specialization name is required'),
  validate
], asyncHandler(async (req, res) => {
  const specialization = await Specialization.create({
    SpecializationName: req.body.specializationName,
    Description: req.body.description
  });
  successResponse(res, specialization, 'Specialization created successfully', 201);
}));

// @route   PUT /api/specializations/:id
// @desc    Update specialization
// @access  Private (admin only)
router.put('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const specialization = await Specialization.findByPk(req.params.id);
  
  if (!specialization) {
    return errorResponse(res, 'Specialization not found', 404);
  }

  await specialization.update({
    SpecializationName: req.body.specializationName,
    Description: req.body.description
  });
  
  successResponse(res, specialization, 'Specialization updated successfully');
}));

// @route   DELETE /api/specializations/:id
// @desc    Delete specialization
// @access  Private (admin only)
router.delete('/:id', protect, authorize('admin'), asyncHandler(async (req, res) => {
  const specialization = await Specialization.findByPk(req.params.id);
  
  if (!specialization) {
    return errorResponse(res, 'Specialization not found', 404);
  }

  await specialization.destroy();
  successResponse(res, null, 'Specialization deleted successfully');
}));

module.exports = router;