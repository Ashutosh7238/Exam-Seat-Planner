const mongoose = require('mongoose')

// classroom schema - storing room info for the exam planner
const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 20
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  floorNo: {
    type: Number,
    required: true,
    min: 0   // 0 is ground floor
  },
  nearWashroom: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true, versionKey: false })

// compound index so sorting in allocation is fast
roomSchema.index({ floorNo: 1, capacity: -1 })

module.exports = mongoose.model('Classroom', roomSchema)
