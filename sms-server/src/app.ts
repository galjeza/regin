import express, { Router } from 'express';
import cors from "cors";
const app = express();

import smsRoutes from './routes/smsRoutes';
import healthRoutes from './routes/healthRoutes';

app.use(cors());
app.use(express.json());

app.use('/sms', smsRoutes);
app.use('/health', healthRoutes);

export default app;
