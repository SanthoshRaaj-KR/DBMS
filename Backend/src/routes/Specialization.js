const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const { Specialization, Doctor } = require('../models');

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
  const specialization = await Specialization.findByPk(req.params.id, {
    include: [{ model: Doctor }]
  });
  
  if (!specialization) {
    return errorResponse(res, 'Specialization not found', 404);
  }

  successResponse(res, specialization);
}));

// @route   POST /api/specializations
// @desc    Create new specialization
// @access  Public
router.post('/', [
  body('SpecializationName').notEmpty().withMessage('Specialization name is required'),
  validate
], asyncHandler(async (req, res) => {
  const specialization = await Specialization.create(req.body);
  successResponse(res, specialization, 'Specialization created successfully', 201);
}));

// @route   PUT /api/specializations/:id
// @desc    Update specialization
// @access  Public
router.put('/:id', asyncHandler(async (req, res) => {
  const specialization = await Specialization.findByPk(req.params.id);
  
  if (!specialization) {
    return errorResponse(res, 'Specialization not found', 404);
  }

  await specialization.update(req.body);
  successResponse(res, specialization, 'Specialization updated successfully');
}));

// @route   DELETE /api/specializations/:id
// @desc    Delete specialization
// @access  Public
router.delete('/:id', asyncHandler(async (req, res) => {
  const specialization = await Specialization.findByPk(req.params.id);
  
  if (!specialization) {
    return errorResponse(res, 'Specialization not found', 404);
  }

  await specialization.destroy();
  successResponse(res, null, 'Specialization deleted successfully');
}));

module.exports = router;
