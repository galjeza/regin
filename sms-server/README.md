
# 📱 SMS Server Setup for Termux

This guide explains how to set up and run a lightweight TypeScript-based SMS microservice on an Android phone using Termux. This server exposes a simple HTTP API to send SMS messages using Termux's `termux-sms-send` command.

---

## ✅ Prerequisites

* An Android phone with Termux installed
* The companion Termux\:API app (from F-Droid)
* A SIM card with SMS capability
* GitHub repo containing the `sms-server` folder

---

## 🔧 Step-by-Step Installation

### 1. **Install Termux & Termux\:API**

* Install Termux from [F-Droid](https://f-droid.org/en/packages/com.termux/)
* Install Termux\:API from [F-Droid](https://f-droid.org/packages/com.termux.api/)

### 2. **Grant Permissions**

```bash
termux-setup-storage
```

Then manually go to Android settings and grant **SMS permission** to Termux.

---

### 3. **Install Required Packages**

```bash
pkg update
pkg install git nodejs -y
```

---

### 4. **Clone Your GitHub Repo**

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>/sms-server
```

---

### 5. **Install Dependencies**

```bash
npm install
```

---

### 6. **Run the Server**

```bash
npm run dev
```

You should see something like:

```
SMS server running at: http://192.168.1.42:8080
```

---

## 🧪 Test the Server from Your PC

### Example `curl` command:

```bash
curl -X POST http://<your-phone-ip>:8080/send \
  -H "Content-Type: application/json" \
  -d '{"to": "+38640123456", "msg": "Hello from Termux!"}'
```

---

## 📚 API Endpoints

### `GET /health`

* Returns `{ status: "ok" }`

### `POST /send`

* Request body:

```json
{
  "to": "+38640123456",
  "msg": "Your message here"
}
```

* Sends SMS using `termux-sms-send`

---

## ✅ Tips

* You can expose your phone’s IP via port forwarding or Ngrok if needed.
* Use PM2 in Termux if you want to daemonize the server.
* Add Termux\:Boot if you want the server to auto-start after reboot.

---

## 🔐 Security Considerations

* Do **not expose this server to the public Internet** without auth.
* Consider adding a bearer token or IP whitelist.

---

## 🛠 Future Improvements

* Delivery confirmation support
* Message queue + retry logic
* Rate limiting
* Web interface



For Termux, use something like:

    pm2 (process manager for Node.js)

    termux-wake-lock + termux-boot to auto-start on boot



    Da lahko telefon iu kjerkoli dela : 🛠️ Workarounds:
🔁 Reverse SSH Tunnel or VPN:

You can create a reverse tunnel to a publicly accessible server (like a VPS).

    On your phone (Termux):

    ssh -R 80:localhost:8080 user@your-vps.com

    Now http://your-vps.com would proxy to your phone server.

    This requires you to have access to a VPS or cloud server.

🌐 Use a tunneling service (easiest):

These expose local servers to the internet via a public URL:

    Ngrok: ngrok http 8080

    LocalTunnel

    Cloudflare Tunnel (free)

    Tailscale Funnel (with Tailscale VPN)