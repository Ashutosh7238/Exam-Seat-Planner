const express = require('express');
const router = express.Router();

const {
  addClassroom,
  getAllClassrooms,
  getClassroomById,
  deleteClassroom,
} = require('../controllers/classroomController');

const { classroomValidationRules, validate } = require('../middleware/validate');

// GET  /api/classrooms        — View all classrooms
// POST /api/classrooms        — Add a classroom
router.route('/').get(getAllClassrooms).post(classroomValidationRules, validate, addClassroom);

// GET    /api/classrooms/:id  — Get single classroom
// DELETE /api/classrooms/:id  — Delete classroom
router.route('/:id').get(getClassroomById).delete(deleteClassroom);

module.exports = router;
