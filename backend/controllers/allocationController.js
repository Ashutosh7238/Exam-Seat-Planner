const Classroom = require('../models/Classroom');

// ─────────────────────────────────────────────────────────
// Greedy Allocation Algorithm
//
// AllocateExam(totalStudents):
//   1. Fetch all classrooms sorted by floorNo ASC, capacity DESC
//   2. If total capacity < totalStudents → "Not enough seats available"
//   3. Iterate sorted rooms, greedily fill until remaining = 0
//   4. Return the minimum list of allocated rooms
//
// Time Complexity : O(n log n) — due to sort
// Space Complexity: O(n) — allocated rooms list
// ─────────────────────────────────────────────────────────

// ─────────────────────────────────────────
// @desc    Allocate classrooms for an exam
// @route   POST /api/allocation/allocate
// @access  Public
// ─────────────────────────────────────────
const allocateExam = async (req, res, next) => {
  try {
    const totalStudents = Number(req.body.totalStudents);

    // Fetch classrooms — sorted: lower floor first, larger capacity first (within same floor)
    const classrooms = await Classroom.find().sort({ floorNo: 1, capacity: -1 });

    if (classrooms.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No classrooms have been added yet. Please add classrooms first.',
      });
    }

    // ── Check total available capacity ──
    const totalCapacity = classrooms.reduce((sum, c) => sum + c.capacity, 0);

    if (totalCapacity < totalStudents) {
      return res.status(200).json({
        success: true,
        sufficient: false,
        message: 'Not enough seats available',
        totalStudents,
        totalCapacity,
        shortfall: totalStudents - totalCapacity,
      });
    }

    // ── Greedy Allocation ──
    let remaining = totalStudents;
    const allocatedRooms = [];

    for (const room of classrooms) {
      if (remaining <= 0) break;

      const studentsAllocated = Math.min(remaining, room.capacity);

      allocatedRooms.push({
        roomId: room.roomId,
        capacity: room.capacity,
        floorNo: room.floorNo,
        nearWashroom: room.nearWashroom,
        studentsAllocated,
        utilizationPercent: Math.round((studentsAllocated / room.capacity) * 100),
      });

      remaining -= studentsAllocated;
    }

    res.status(200).json({
      success: true,
      sufficient: true,
      message: `Successfully allocated ${totalStudents} students across ${allocatedRooms.length} classroom(s)`,
      totalStudents,
      totalRoomsUsed: allocatedRooms.length,
      totalRoomsAvailable: classrooms.length,
      allocatedRooms,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { allocateExam };
