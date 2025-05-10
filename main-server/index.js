"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var phoneNumber = "0038640142089";
var message = "Test message from ADB bot";
var command = "adb shell am start -a android.intent.action.SENDTO -d sms:".concat(phoneNumber, " --es sms_body \"").concat(message, "\" --ez exit_on_sent true");
console.log("Running command:", command);
(0, child_process_1.exec)(command, function (error, stdout, stderr) {
    if (error) {
        console.error("Exec error:", error.message);
        return;
    }
    if (stderr) {
        console.error("Stderr:", stderr);
    }
    console.log("Stdout:", stdout);
});
