const express = require('express');
const app = express();
const authRoutes = require('./src/routes/authRoutes');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Auth Service is running');
});

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
