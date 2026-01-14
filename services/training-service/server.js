const express = require('express');
const app = express();
const trainingRoutes = require('./src/routes/trainingRoutes');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/training', trainingRoutes);

app.get('/', (req, res) => {
  res.send('training-service is running');
});

app.listen(PORT, () => {
  console.log(`training-service running on port ${PORT}`);
});
