import { execSync } from "child_process";
import { writeFileSync } from "fs";

const phoneNumber = "+38640142089";
const message = "Test message from TypeScript ADB bot";

// create the actual shell script
const script = `
#!/data/data/com.termux/files/usr/bin/bash
termux-sms-send -n "${phoneNumber}" "${message}"
`;

writeFileSync("temp-sms.sh", script);

// Push to Termux home
execSync("adb push temp-sms.sh /data/data/com.termux/files/home/temp-sms.sh");

// Set executable
execSync("adb shell chmod +x /data/data/com.termux/files/home/temp-sms.sh");

// Launch Termux and run it by simulating input
execSync("adb shell am start -n com.termux/.app.TermuxActivity");
execSync("adb shell input text 'sh%stemp-sms.sh'");
execSync("adb shell input keyevent 66");

console.log("✅ SMS should be sent!");
