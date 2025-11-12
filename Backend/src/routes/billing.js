const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const { Billing, Payment, Patient, Appointment } = require('../models');
const { Op } = require('sequelize');

// @route   GET /api/billing
// @desc    Get all bills
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
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
        model: Payment,
        as: 'Payments'
      }
    ],
    order: [['BillingDate', 'DESC']]
  });

  successResponse(res, bills);
}));

// @route   GET /api/billing/:id
// @desc    Get single bill
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const bill = await Billing.findByPk(req.params.id, {
    include: [
      { model: Patient },
      { model: Appointment },
      { model: Payment, as: 'Payments' }
    ]
  });
  
  if (!bill) {
    return errorResponse(res, 'Bill not found', 404);
  }

  successResponse(res, bill);
}));

// @route   POST /api/billing
// @desc    Create new bill
// @access  Public
router.post('/', [
  body('patientId').notEmpty().withMessage('Patient ID is required'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number'),
  validate
], asyncHandler(async (req, res) => {
  const { 
    patientId, 
    appointmentId, 
    totalAmount, 
    discountAmount = 0, 
    taxAmount = 0,
    items = []
  } = req.body;

  const netAmount = totalAmount - discountAmount + taxAmount;

  const bill = await Billing.create({
    PatientID: patientId,
    AppointmentID: appointmentId,
    TotalAmount: totalAmount,
    DiscountAmount: discountAmount,
    TaxAmount: taxAmount,
    NetAmount: netAmount,
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
// @access  Public
router.put('/:id', asyncHandler(async (req, res) => {
  const bill = await Billing.findByPk(req.params.id);
  
  if (!bill) {
    return errorResponse(res, 'Bill not found', 404);
  }

  // Recalculate net amount if amounts are being updated
  if (req.body.totalAmount || req.body.discountAmount || req.body.taxAmount) {
    const totalAmount = req.body.totalAmount || bill.TotalAmount;
    const discountAmount = req.body.discountAmount !== undefined ? req.body.discountAmount : bill.DiscountAmount;
    const taxAmount = req.body.taxAmount !== undefined ? req.body.taxAmount : bill.TaxAmount;
    
    req.body.NetAmount = totalAmount - discountAmount + taxAmount;
  }

  await bill.update(req.body);
  
  const updatedBill = await Billing.findByPk(bill.BillingID, {
    include: [
      { model: Patient },
      { model: Appointment },
      { model: Payment, as: 'Payments' }
    ]
  });

  successResponse(res, updatedBill, 'Bill updated successfully');
}));

// @route   DELETE /api/billing/:id
// @desc    Delete bill
// @access  Public
router.delete('/:id', asyncHandler(async (req, res) => {
  const bill = await Billing.findByPk(req.params.id);
  
  if (!bill) {
    return errorResponse(res, 'Bill not found', 404);
  }

  await bill.destroy();
  successResponse(res, null, 'Bill deleted successfully');
}));

// @route   POST /api/billing/:id/payment
// @desc    Add payment to bill
// @access  Public
router.post('/:id/payment', [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  validate
], asyncHandler(async (req, res) => {
  const bill = await Billing.findByPk(req.params.id, {
    include: [{ model: Payment, as: 'Payments' }]
  });
  
  if (!bill) {
    return errorResponse(res, 'Bill not found', 404);
  }

  const { amount, paymentMethod, transactionID, notes } = req.body;

  // Create payment
  const payment = await Payment.create({
    BillingID: bill.BillingID,
    Amount: amount,
    PaymentMethod: paymentMethod,
    TransactionID: transactionID,
    Notes: notes
  });

  // Calculate total paid
  const totalPaid = bill.Payments.reduce((sum, p) => sum + parseFloat(p.Amount), 0) + parseFloat(amount);
  const netAmount = parseFloat(bill.NetAmount);

  // Update bill status
  let newStatus = 'Pending';
  if (totalPaid >= netAmount) {
    newStatus = 'Paid';
  } else if (totalPaid > 0) {
    newStatus = 'Partial';
  }

  await bill.update({ Status: newStatus });

  const updatedBill = await Billing.findByPk(bill.BillingID, {
    include: [
      { model: Patient },
      { model: Appointment },
      { model: Payment, as: 'Payments' }
    ]
  });

  successResponse(res, updatedBill, 'Payment added successfully', 201);
}));

module.exports = router;
