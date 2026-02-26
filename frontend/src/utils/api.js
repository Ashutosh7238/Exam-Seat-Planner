import axios from 'axios';

// Axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Classroom API ──

/**
 * Add a new classroom
 * @param {Object} data - { roomId, capacity, floorNo, nearWashroom }
 */
export const addClassroom = (data) => axiosInstance.post('/classrooms', data);

/**
 * Fetch all classrooms
 */
export const getAllClassrooms = () => axiosInstance.get('/classrooms');

/**
 * Delete a classroom by MongoDB _id
 * @param {string} id
 */
export const deleteClassroom = (id) => axiosInstance.delete(`/classrooms/${id}`);

// ── Allocation API ──

/**
 * AllocateExam(totalStudents)
 * @param {number} totalStudents
 */
export const allocateExam = (totalStudents) =>
  axiosInstance.post('/allocation/allocate', { totalStudents });

export default axiosInstance;
