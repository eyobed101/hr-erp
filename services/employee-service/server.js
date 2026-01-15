
import app from './app.js';
import dotenv from 'dotenv';
import { sequelize } from './src/models/index.js';

dotenv.config();

const PORT = process.env.PORT || 3002;
const HOST = '0.0.0.0';

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');

        await sequelize.sync({ alter: true });
        console.log('Database synced.');

        app.listen(PORT, HOST, () => {
            console.log(`Employee Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        process.exit(1);
    }
}

startServer();
