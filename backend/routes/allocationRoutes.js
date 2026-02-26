const express = require('express');
const router = express.Router();

const { allocateExam } = require('../controllers/allocationController');
const { allocationValidationRules, validate } = require('../middleware/validate');

// POST /api/allocation/allocate — AllocateExam(totalStudents)
router.post('/allocate', allocationValidationRules, validate, allocateExam);

module.exports = router;
