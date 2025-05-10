import { sendSMS } from "../controllers/smsController";
import { Router, Request, Response, NextFunction } from "express";

const router = Router();

// Logging middleware
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    console.log('\n📥 Incoming SMS Request:');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
};

router.use(requestLogger);
router.post('/', sendSMS);

export default router;