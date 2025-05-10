import express from "express";
import type { Request, Response, RequestHandler } from "express";
import { exec } from "child_process";

const app = express();
const port = process.env.PORT || 8080;

// GET /health → simple health check
app.get("/health", ((_req: Request, res: Response) => {
  res.send({ status: "ok" });
}) as RequestHandler);

// GET /send?to=+38640123456&msg=Hello → sends SMS
app.get("/send", ((req: Request, res: Response) => {
  const { to, msg } = req.query;

  if (!to || !msg) {
    return res.status(400).send({ error: "Missing 'to' or 'msg' query param" });
  }

  const command = `termux-sms-send -n "${to}" "${msg}"`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("SMS send error:", error.message);
      return res.status(500).send({ error: "Failed to send SMS" });
    }
    if (stderr) {
      console.error("SMS stderr:", stderr);
    }
    console.log("SMS sent:", stdout);
    res.send({ status: "sent", to, msg });
  });
}) as RequestHandler);

app.listen(port, () => {
  console.log(`SMS server running on port ${port}`);
});
