const { body, validationResult } = require('express-validator');

// Validation rules for adding a classroom
const classroomValidationRules = [
  body('roomId')
    .trim()
    .notEmpty()
    .withMessage('Room ID is required')
    .isLength({ max: 20 })
    .withMessage('Room ID must be 20 characters or less'),

  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),

  body('floorNo')
    .notEmpty()
    .withMessage('Floor number is required')
    .isInt({ min: 0 })
    .withMessage('Floor number must be 0 or greater'),

  body('nearWashroom')
    .isBoolean()
    .withMessage('nearWashroom must be true or false'),
];

// Validation rules for allocation
const allocationValidationRules = [
  body('totalStudents')
    .notEmpty()
    .withMessage('totalStudents is required')
    .isInt({ min: 1 })
    .withMessage('totalStudents must be a positive integer'),
];

// Middleware to run after validation rules
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors
        .array()
        .map((e) => e.msg)
        .join(', '),
      errors: errors.array(),
    });
  }
  next();
};

module.exports = { classroomValidationRules, allocationValidationRules, validate };
