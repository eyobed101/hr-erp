const express = require('express');
const app = express();
const employeeRoutes = require('./src/routes/employeeRoutes');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/employee', employeeRoutes);

app.get('/', (req, res) => {
  res.send('employee-service is running');
});

app.listen(PORT, () => {
  console.log(`employee-service running on port ${PORT}`);
});
