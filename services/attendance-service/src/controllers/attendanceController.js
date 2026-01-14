const Attendance = require('../models/attendanceModel.js');

const markAttendance = async (req, res) => {
  try {
    const { employee_id, clock_date, shift_start } = req.body;

    // Check if attendance already exists
    const existing = await Attendance.findOne({
      where: { employee_id, clock_date }
    });

    if (existing) {
      return res.status(409).json({
        message: 'Attendance already marked for this date'
      });
    }
const shiftStartTime = new Date(shift_start).toTimeString().split(' ')[0];
    // Create attendance
    const attendance = await Attendance.create({
      employee_id,
      clock_date,
      clock_in: new Date(),
      shift_start:shiftStartTime,
      status: 'present'
    });

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



const clockOut = async (req, res) => {
  try {
    const { id } = req.params;
    const { clock_out_time } = req.body; 
    
    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    const clockOutDate = new Date(clock_out_time || new Date());
    attendance.clock_out = clockOutDate;

    if (attendance.shift_end) {
      const [hours, minutes, seconds] = attendance.shift_end.split(':').map(Number);
      const shiftEndDate = new Date(attendance.clock_date);
      shiftEndDate.setHours(hours, minutes, seconds);

      let overtime = (clockOutDate - shiftEndDate) / (1000 * 60 * 60); // difference in hours
      if (overtime < 0) overtime = 0;

      attendance.overtime_hours = parseFloat(overtime.toFixed(2));
    }

    await attendance.save();

    res.json({
      message: 'Clock out successful',
      attendance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;

    const records = await Attendance.findAll({
      where: { clock_date: date },
      order: [['clock_in', 'ASC']]
    });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getAttendanceByEmployee = async (req, res) => {
  try {
    const { employee_id } = req.params;

    const records = await Attendance.findAll({
      where: { employee_id },
      order: [['clock_date', 'DESC']]
    });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  markAttendance,
  clockOut,
  getAttendanceByDate,
  getAttendanceByEmployee
};

