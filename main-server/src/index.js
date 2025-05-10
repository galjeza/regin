"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var child_process_1 = require("child_process");
var cors_1 = require("cors");
var os_1 = require("os");
var app = (0, express_1.default)();
var port = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", function (_, res) {
    res.json({ status: "ok" });
});
app.post("/send", function (req, res) {
    var _a = req.body, to = _a.to, msg = _a.msg;
    if (!to || !msg) {
        return res.status(400).json({ error: "Missing 'to' or 'msg' in request body" });
    }
    var command = "termux-sms-send -n \"".concat(to, "\" \"").concat(msg, "\"");
    (0, child_process_1.exec)(command, function (error, stdout, stderr) {
        if (error) {
            console.error("SMS send error:", error.message);
            return res.status(500).json({ error: "Failed to send SMS" });
        }
        if (stderr) {
            console.error("SMS stderr:", stderr);
        }
        console.log("SMS sent:", stdout);
        res.json({ status: "sent", to: to, msg: msg });
    });
});
app.listen(port, function () {
    var interfaces = os_1.default.networkInterfaces();
    var localIp = "localhost";
    for (var _i = 0, _a = Object.keys(interfaces); _i < _a.length; _i++) {
        var name_1 = _a[_i];
        for (var _b = 0, _c = interfaces[name_1] || []; _b < _c.length; _b++) {
            var iface = _c[_b];
            if (iface.family === "IPv4" && !iface.internal) {
                localIp = iface.address;
            }
        }
    }
    console.log("SMS server running at: http://".concat(localIp, ":").concat(port));
});
