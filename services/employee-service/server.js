// server.js
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import sequelize from './src/config/db.js'; // <-- adjust path to src/config

const PORT = process.env.PORT || 5002;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Employee DB connected');

    await sequelize.sync();
    app.listen(PORT, () =>
      console.log(`Employee Service running on port ${PORT}`)
    );
  } catch (err) {
    console.error('Unable to start server:', err);
  }
})();
