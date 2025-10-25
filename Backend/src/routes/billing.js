
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const { asyncHandler, successResponse, errorResponse, calculateBilling } = require('../utils/helpers');
const { Billing, Payment, Patient, Appointment } = require('../models');
const { Op } = require('sequelize');

// @route   GET /api/billing
// @desc    Get all bills
// @access  Private (admin, staff)
router.get('/', protect, authorize('admin', 'staff'), asyncHandler(async (req, res) => {
  const { status, patientId } = req.query;
  let where = {};
  
  if (status) where.Status = status;
  if (patientId) where.PatientID = patientId;

  const bills = await Billing.findAll({
    where,
    include: [
      { 
        model: Patient,
        attributes: ['PatientID', 'PatientNumber', 'FirstName', 'LastName']
      },
      {
        model: Appointment,
        attributes: ['AppointmentID', 'AppointmentDate']
      },
      {
        model: Payment
      }
    ],
    order: [['BillingDate', 'DESC']]
  });

  successResponse(res, bills);
}));

// @route   GET /api/billing/:id
// @desc    Get single bill
// @access  Private
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const bill = await Billing.findByPk(req.params.id, {
    include: [
      { model: Patient },
      { model: Appointment },
      { model: Payment }
    ]
  });
  
  if (!bill) {
    return errorResponse(res, 'Bill not found', 404);
  }

  // Check authorization
  if (req.user.Role === 'patient' && req.user.RefID !== bill.PatientID) {
    return errorResponse(res, 'Not authorized', 403);
  }

  successResponse(res, bill);
}));

// @route   GET /api/billing/patient/:patientId
// @desc    Get patient's billing history
// @access  Private
router.get('/patient/:patientId', protect, asyncHandler(async (req, res) => {
  // Check authorization
  if (req.user.Role === 'patient' && req.user.RefID != req.params.patientId) {
    return errorResponse(res, 'Not authorized', 403);
  }

  const bills = await Billing.findAll({
    where: { PatientID: req.params.patientId },
    include: [
      { model: Appointment },
      { model: Payment }
    ],
    order: [['BillingDate', 'DESC']]
  });

  successResponse(res, bills);
}));

// @route   POST /api/billing
// @desc    Create new bill
// @access  Private (admin, staff)
router.post('/', protect, authorize('admin', 'staff'), [
  body('patientId').notEmpty().withMessage('Patient ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one billing item is required'),
  validate
], asyncHandler(async (req, res) => {
  const { patientId, appointmentId, items, discountPercent = 0, taxPercent = 0 } = req.body;
  
  // Calculate billing amounts
  const amounts = calculateBilling(items, discountPercent, taxPercent);

  const bill = await Billing.create({
    PatientID: patientId,
    AppointmentID: appointmentId,
    TotalAmount: amounts.totalAmount,
    DiscountAmount: amounts.discountAmount,
    TaxAmount: amounts.taxAmount,
    NetAmount: amounts.netAmount,
    Items: items,
    Status: 'Pending'
  });

  const billWithDetails = await Billing.findByPk(bill.BillingID, {
    include: [
      { model: Patient },
      { model: Appointment }
    ]
  });

  successResponse(res, billWithDetails, 'Bill created successfully', 201);
}));

// @route   PUT /api/billing/:id
// @desc    Update bill
// @access  Private (admin, staff)
router.put('/:id', protect, authorize('admin', 'staff'), asyncHandler(async (req, res) => {
  const bill = await Billing.findByPk(req.params.id);
  
  if (!bill) {
    return errorResponse(res, 'Bill not found', 404);
  }

  // Recalculate if items changed
  if (req.body.items) {
    const discountPercent = req.body.discountPercent || (bill.DiscountAmount / bill.TotalAmount) * 100;
    const taxPercent = req.body.taxPercent || (bill.TaxAmount / (bill.TotalAmount - bill.DiscountAmount)) * 100;
    const amounts = calculateBilling(req.body.items, discountPercent, taxPercent);
    
    req.body.TotalAmount = amounts.totalAmount;
    req.body.DiscountAmount = amounts.discountAmount;
    req.body.TaxAmount = amounts.taxAmount;
    req.body.NetAmount = amounts.netAmount;
  }

  await bill.update(req.body);
  
  const updatedBill = await Billing.findByPk(bill.BillingID, {
    include: [
      { model: Patient },
      { model: Appointment },
      { model: Payment }
    ]
  });

  successResponse(res, updatedBill, 'Bill updated successfully');
}));

// @route   POST /api/billing/:id/payment
// @desc    Record payment for a bill
// @access  Private (admin, staff)
router.post('/:id/payment', protect, authorize('admin', 'staff'), [
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount is required'),
  body('paymentMethod').isIn(['Cash', 'Card', 'UPI', 'Insurance']).withMessage('Invalid payment method'),
  validate
], asyncHandler(async (req, res) => {
  const bill = await Billing.findByPk(req.params.id);
  
  if (!bill) {
    return errorResponse(res, 'Bill not found', 404);
  }

  const { amount, paymentMethod, transactionId, notes } = req.body;

  // Create payment record
  const payment = await Payment.create({
    BillingID: bill.BillingID,
    Amount: amount,
    PaymentMethod: paymentMethod,
    TransactionID: transactionId,
    Notes: notes
  });

  // Calculate total payments
  const totalPayments = await Payment.sum('Amount', {
    where: { BillingID: bill.BillingID }
  });

  // Update bill status
  let status = 'Pending';
  if (totalPayments >= parseFloat(bill.NetAmount)) {
    status = 'Paid';
  } else if (totalPayments > 0) {
    status = 'Partial';
  }

  await bill.update({ Status: status });

  const updatedBill = await Billing.findByPk(bill.BillingID, {
    include: [
      { model: Patient },
      { model: Payment }
    ]
  });

  successResponse(res, {
    payment,
    bill: updatedBill
  }, 'Payment recorded successfully', 201);
}));

module.exports = router;

