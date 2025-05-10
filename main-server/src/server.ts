import app from './app';
import config from './config/config';
import os from 'os';

app.listen(config.port, () => {
  const interfaces = os.networkInterfaces();
  let localIp = "localhost";

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        localIp = iface.address;
      }
    }
  }

  console.log(`SMS server running at: http://${localIp}:${config.port}`);
});