const express = require('express');
const app = express();
const leaveRoutes = require('./src/routes/leaveRoutes');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/leave', leaveRoutes);

app.get('/', (req, res) => {
  res.send('leave-service is running');
});

app.listen(PORT, () => {
  console.log(`leave-service running on port ${PORT}`);
});
