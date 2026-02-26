const Classroom = require('../models/Classroom')

// add a new room
const addClassroom = async (req, res, next) => {
  try {
    const { roomId, capacity, floorNo, nearWashroom } = req.body

    const newRoom = await Classroom.create({
      roomId: roomId.trim(),
      capacity: Number(capacity),
      floorNo: Number(floorNo),
      nearWashroom: Boolean(nearWashroom)
    })

    res.status(201).json({
      success: true,
      message: `Room "${newRoom.roomId}" saved`,
      data: newRoom
    })
  } catch (err) {
    next(err)
  }
}

// get all classrooms sorted by floor then capacity
const getAllClassrooms = async (req, res, next) => {
  try {
    const rooms = await Classroom.find().sort({ floorNo: 1, capacity: -1 })
    const totalSeats = rooms.reduce((acc, r) => acc + r.capacity, 0)

    res.json({
      success: true,
      count: rooms.length,
      totalCapacity: totalSeats,
      data: rooms
    })
  } catch (err) {
    next(err)
  }
}

const getClassroomById = async (req, res, next) => {
  try {
    const room = await Classroom.findById(req.params.id)
    if (!room) {
      res.status(404)
      throw new Error('Room not found')
    }
    res.json({ success: true, data: room })
  } catch (err) {
    next(err)
  }
}

const deleteClassroom = async (req, res, next) => {
  try {
    const deleted = await Classroom.findByIdAndDelete(req.params.id)
    if (!deleted) {
      res.status(404)
      throw new Error('Room not found')
    }
    res.json({ success: true, message: `"${deleted.roomId}" removed`, data: {} })
  } catch (err) {
    next(err)
  }
}

module.exports = { addClassroom, getAllClassrooms, getClassroomById, deleteClassroom }
