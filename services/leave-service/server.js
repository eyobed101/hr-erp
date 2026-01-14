import "dotenv/config";
import express from 'express';
import sequelize from './src/config/db.js';
import initializeDatabase from './src/config/init_db.js';

const app = express();

/// const leaveRoutes = require('./src/routes/leaveRoutes');
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "localhost";

app.use(express.json());
// app.use('/api/leave', leaveRoutes);

app.get('/', (req, res) => {
  console.log(req.socket.address)
  res.send({message: 'leave service is running'});
});

async function startServer() {
  try {
    await initializeDatabase();
    console.log('Database created/verified successfully');

    await sequelize.sync({ alter: true});
    console.log('Database synced successfully');

    app.listen(PORT, HOST, () => {
      console.log(`leave service running on port: ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
