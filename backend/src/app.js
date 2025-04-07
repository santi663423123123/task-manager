import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './db.js';
import taskRoutes from './routes/taskRoutes.js';
import priorityRoutes from './routes/priorityRoutes.js';
import stateRoutes from './routes/stateRoutes.js';
import './models/index.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);
app.use('/api/states', stateRoutes);
app.use('/api/priorities', priorityRoutes);

export default app;
