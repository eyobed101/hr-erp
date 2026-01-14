const express = require('express');
const app = express();
const recruitmentRoutes = require('./src/routes/recruitmentRoutes');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/recruitment', recruitmentRoutes);

app.get('/', (req, res) => {
  res.send('recruitment-service is running');
});

app.listen(PORT, () => {
  console.log(`recruitment-service running on port ${PORT}`);
});
