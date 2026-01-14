const express = require('express');
const app = express();
const attendanceRoutes = require('./src/routes/attendanceRoutes');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => {
  res.send('attendance-service is running');
});

app.listen(PORT, () => {
  console.log(`attendance-service running on port ${PORT}`);
});
