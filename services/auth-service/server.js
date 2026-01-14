const express = require('express');
const app = express();
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const sequelize = require('./src/config/db');
const initializeDatabase = require('./src/config/initDb');
require('dotenv').config();
const HOST = '127.0.0.1';


const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  res.send('Auth Service is running');
});

async function startServer() {
  try {
    await initializeDatabase();
    console.log('Database created/verified successfully');

    await sequelize.sync({ alter: false });
    console.log('Database synced successfully');

    app.listen(PORT, HOST, () => {
      console.log(`Auth Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
