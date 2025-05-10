import { sendSMS } from "../controllers/smsController";
import { Router } from "express";

const router = Router();

router.post('/send', sendSMS);

export default router;