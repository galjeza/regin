import express, { Router } from 'express';
import cors from "cors";
const app = express();

import healthRoutes from './routes/healthRoutes';

app.use(cors());
app.use(express.json());

app.use('/health', healthRoutes);

export default app;
