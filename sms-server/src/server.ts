import app from './app';
import config from './config/config';
import os, { networkInterfaces } from 'os';
import axios from 'axios';
import { logger } from './logger';

const mainServerUrl = process.env.MAIN_SERVER_URL || 'http://192.168.1.12:8080';
const phoneId = process.env.PHONE_ID || 'phone-' + Math.random().toString(36).substring(7);

function getLocalIp(): string {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  throw new Error('No local IP address found');
}

async function registerWithMainServer() {
  try {
    const localIp = getLocalIp();
    logger.info('Registering with main server', { phoneId, localIp });
    
    await axios.post(`${mainServerUrl}/register`, {
      phoneId,
      ip: localIp
    });
    
    logger.info('Successfully registered with main server');
  } catch (error) {
    logger.error('Failed to register with main server', { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    setTimeout(registerWithMainServer, 5000);
  }
}



// Start server and register with main server
app.listen(config.port, () => {
  const localIp = getLocalIp();
  logger.info(`SMS server running on port ${config. port} and local IP: ${localIp}`);
  registerWithMainServer();
}); 

