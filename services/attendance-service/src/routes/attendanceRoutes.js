const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController.js');

// Mark Attendance (Clock In)
router.post('/clockin', attendanceController.markAttendance);

// Clock Out
router.put('/clockout/:id', attendanceController.clockOut);

// Get Attendance by Date
// Example: GET /api/attendance/date?date=2026-01-14
router.get('/date', attendanceController.getAttendanceByDate);
router.get('/today', attendanceController.getTodayAttendance);
router.get('/', attendanceController.getAttendance)
// Get Attendance by Employee
// Example: GET /api/attendance/employee/1
router.get('/employee/:employee_id', attendanceController.getAttendanceByEmployee);

module.exports = router;
