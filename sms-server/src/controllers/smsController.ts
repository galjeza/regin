import { Request, Response, NextFunction } from 'express';
import { exec } from 'child_process';

export const sendSMS = (req: Request, res: Response, next: NextFunction) => {
    console.log('\n🔄 Starting SMS send process...');
    
    try {
        console.log('📝 Extracting request body...');
        const { to, msg } = req.body;
        console.log('📱 To:', to);
        console.log('💬 Message:', msg);

        if (!to || !msg) {
            console.log('❌ Validation failed: Missing required fields');
            res.status(400).json({ error: "Missing 'to' or 'msg'" });
            return;
        }

        console.log('🔧 Preparing termux-sms-send command...');
        const command = `termux-sms-send -n "${to}" "${msg}"`;
        console.log('📡 Executing command:', command);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ SMS send error:', error.message);
                console.error('Error details:', error);
                res.status(500).json({ error: "Failed to send SMS" });
                return;
            }
            
            if (stderr) {
                console.warn('⚠️ SMS stderr:', stderr);
            }
            
            console.log('✅ SMS sent successfully');
            console.log('📤 Command output:', stdout);
            res.json({ status: "sent", to, msg });
        });

    } catch (error) {
        console.error('💥 Unexpected error in sendSMS:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};



