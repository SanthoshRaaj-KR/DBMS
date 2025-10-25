module.exports = {
  ROLES: {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    STAFF: 'staff',
    PATIENT: 'patient'
  },
  
  APPOINTMENT_STATUS: {
    SCHEDULED: 'Scheduled',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    NO_SHOW: 'No Show'
  },
  
  PAYMENT_STATUS: {
    PENDING: 'Pending',
    PARTIAL: 'Partial',
    PAID: 'Paid',
    CANCELLED: 'Cancelled'
  },
  
  PAYMENT_METHOD: {
    CASH: 'Cash',
    CARD: 'Card',
    UPI: 'UPI',
    INSURANCE: 'Insurance'
  },
  
  PRESCRIPTION_STATUS: {
    ACTIVE: 'Active',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
  }
};
