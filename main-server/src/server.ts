import express, { Request, Response, Router, NextFunction } from 'express';
import cors from 'cors';
import axios, { AxiosError } from 'axios';
import { PhoneManager } from './PhoneManager';
import { RegisterRequest, SendSmsRequest, LoadBalancingStrategy } from './types';
import { networkInterfaces } from 'os';

const app = express();
const router = Router();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  console.log('Request Body:', req.body);
  console.log('Request Headers:', req.headers);
  next();
});

const phoneManager = new PhoneManager();

router.post('/register', (req: Request, res: Response) => {
  const { phoneId, ip } = req.body as RegisterRequest;
  console.log(`Registering phone ${phoneId} with IP ${ip}`);
  
  
  if (!phoneId || !ip) {
    res.status(400).json({ error: 'phoneId and ip are required' });
    return;
  }

  phoneManager.registerPhone(phoneId, ip);
  res.json({ message: 'Phone registered successfully' });
});

// Get all phones
router.get('/phones', (req: Request, res: Response) => {
  res.json(phoneManager.getPhones());
});

// Send SMS through a selected phone
router.post('/send', async (req: Request, res: Response, next: NextFunction) => {
  const { to, msg } = req.body as SendSmsRequest;
  const strategy =  'round-robin';

  if (!to || !msg) {
   res.status(400).json({ error: 'to and msg are required' });
   return;
  }

  const selectedPhone = phoneManager.selectPhone(strategy);
  
  if (!selectedPhone) {
    res.status(503).json({ error: 'No available phones' });
    return;
  }

  try {
    const response = await axios.post(`http://${selectedPhone.ip}:8080/sms`, {
      to,
      msg
    });

    if (response.data.status === 'sent') {
      phoneManager.recordSuccess(selectedPhone.phoneId);
    } else {
      phoneManager.recordFailure(selectedPhone.phoneId);
    }
    res.json(response.data);
  } catch (error) {
    phoneManager.recordFailure(selectedPhone.phoneId);
    const axiosError = error as AxiosError;
    res.status(500).json({ 
      error: 'Failed to send SMS',
      details: axiosError.response?.data || axiosError.message
    });
  }
});

app.use('/', router);


function getLocalIp(): string {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  throw new Error('No local IP address found');
}

app.listen(port, () => {
  console.log(`Main server running on ${port} and local IP: ${getLocalIp()}`);
});
