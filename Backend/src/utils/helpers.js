const crypto = require('crypto');

// Generate unique ID
exports.generateId = () => {
  return crypto.randomBytes(16).toString('hex');
};

// Pagination helper
exports.paginate = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return { limit: parseInt(limit), offset };
};

// Pagination metadata
exports.getPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    currentPage: parseInt(page),
    totalPages,
    totalItems: total,
    itemsPerPage: parseInt(limit),
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };
};

// Sanitize user data
exports.sanitizeUser = (user) => {
  const { Password, ...sanitized } = user.toJSON ? user.toJSON() : user;
  return sanitized;
};

// Calculate age from date of birth
exports.calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Format date
exports.formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  if (format === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
  if (format === 'DD-MM-YYYY') return `${day}-${month}-${year}`;
  return date;
};

// Generate invoice number
exports.generateInvoiceNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV${timestamp}${random}`;
};

// Generate patient number
exports.generatePatientNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `PAT${timestamp}${random}`;
};

// Validate email
exports.isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone
exports.isValidPhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

// Validate date
exports.isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

// Check if time slot is available
exports.isTimeSlotAvailable = (appointments, date, time) => {
  return !appointments.some(apt => 
    apt.AppointmentDate === date && 
    apt.AppointmentTime === time &&
    apt.Status !== 'Cancelled'
  );
};

// Format time to HH:MM:SS
exports.formatTime = (time) => {
  if (!time) return null;
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
};

// Calculate billing amounts
exports.calculateBilling = (items, discountPercent = 0, taxPercent = 0) => {
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (totalAmount * discountPercent) / 100;
  const taxableAmount = totalAmount - discountAmount;
  const taxAmount = (taxableAmount * taxPercent) / 100;
  const netAmount = taxableAmount + taxAmount;
  
  return {
    totalAmount: totalAmount.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    netAmount: netAmount.toFixed(2)
  };
};

// Success response
exports.successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Error response
exports.errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};

// Async handler wrapper
exports.asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};