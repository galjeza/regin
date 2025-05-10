
import { Request, Response, NextFunction } from 'express';
import { exec } from 'child_process';


export const sendSMS = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { to, msg } = req.body;

        if (!to || !msg) {
            res.status(400).json({ error: "Missing 'to' or 'msg'" });
        }

        const command = `termux-sms-send -n "${to}" "${msg}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error("SMS send error:", error.message);
                res.status(500).json({ error: "Failed to send SMS" });
            }
            if (stderr) {
                console.error("SMS stderr:", stderr);
            }
            console.log("SMS sent:", stdout);
            res.json({ status: "sent", to, msg });
        });

    } catch (error) {
        next(error);
    }
};



