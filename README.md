# DIY self hosted SMS API

A distributed system for managing and load balancing SMS sending across multiple Android phones using Termux. The system consists of three main components:

1. Main Server - Manages phone registration and load balancing
2. SMS Server - Runs on each Android phone to send SMS messages
3. Dashboard - Web interface to monitor phone status and SMS statistics

## Architecture

```
        +------------------+
        |  UI Dashboard    |
        +------------------+
                 |
                 v
          +---------------+
          |  Main Server  |
          +---------------+
           ^     ^     ^
           |     |     |
   +-----------+-----------+-----------+
   |  Phone 1  |  Phone 2  |  Phone N  |
   +-----------+-----------+-----------+


```

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Android phone with Termux installed
- Termux:API package installed on Android phone

## Android Phone Setup

### 1. Install Termux and Required Packages

1. Install Termux from F-Droid:
   - Download and install [F-Droid](https://f-droid.org/)
   - Open F-Droid and search for "Termux"
   - Install Termux from the official repository

2. Install Termux:API:
   - Open F-Droid
   - Search for "Termux:API"
   - Install Termux:API

3. Open Termux and update packages:
```bash
pkg update && pkg upgrade
```

4. Install required packages:
```bash
pkg install git nodejs
```

### 2. Configure Termux Permissions

1. Open Android Settings
2. Go to Apps > Termux
3. Grant the following permissions:
   - Storage
   - SMS
   - Phone

### 3. Setup SMS Server on Phone

1. Clone the repository:
```bash
cd ~
git clone https://github.com/yourusername/regin.git
cd regin/sms-server
```

2. Install dependencies:
```bash
npm install
```

3. Create and configure environment file:
```bash
echo "PORT=8080
NODE_ENV=development
MAIN_SERVER_URL=http://<main-server-ip>:8080
PHONE_ID=phone-001" > .env
```

4. Test Termux:API SMS functionality:
```bash
termux-sms-send -n "+1234567890" "Test message"
```

### 4. Running SMS Server

1. Start the server:
```bash
npm run dev
```

2. Verify server is running:
```bash
curl http://localhost:8080/health
```

### 5. Troubleshooting Phone Setup

1. **Termux:API not working**
   - Verify Termux:API is installed from F-Droid
   - Check if permissions are granted in Android Settings
   - Try reinstalling Termux:API

2. **Node.js not found**
   - Run `pkg install nodejs` again
   - Verify installation with `node --version`

3. **SMS permissions not working**
   - Go to Android Settings > Apps > Termux
   - Clear app data and cache
   - Re-grant SMS permissions
   - Restart Termux

4. **Server not starting**
   - Check if port 8080 is available
   - Verify all dependencies are installed
   - Check the .env file configuration

## Installation

### 1. Main Server Setup

```bash
cd main-server
npm install
```

Create a `.env` file:
```env
PORT=8080
NODE_ENV=development
```

### 2. SMS Server Setup (on Android phone)

```bash
cd sms-server
npm install
```

Create a `.env` file:
```env
PORT=8080
NODE_ENV=development
MAIN_SERVER_URL=http://<main-server-ip>:8080
PHONE_ID=phone-001  # Optional, will auto-generate if not provided
```

### 3. Dashboard Setup

```bash
cd dashboard
npm install
```

## Running the System

### 1. Start Main Server

```bash
cd main-server
npm run dev  # For development
# or
npm run prod # For production
```

### 2. Start SMS Server (on each Android phone)

```bash
cd sms-server
npm run dev  # For development
# or
npm run prod # For production
```

### 3. Start Dashboard

```bash
cd dashboard
npm run dev
```

## Features

### Main Server
- Phone registration and health monitoring
- Multiple load balancing strategies:
  - Round-robin
  - Least recently used
  - Weighted (based on delivery success rate)
- Automatic health checks for registered phones
- Status tracking for each phone

### SMS Server
- SMS sending capability using Termux:API
- Automatic registration with main server
- Health check endpoint
- Error handling and logging

### Dashboard
- Real-time phone status monitoring
- Success/failure statistics
- Last seen timestamps
- Responsive design with Tailwind CSS

## API Endpoints

### Main Server

#### Register a Phone
```http
POST /register
Content-Type: application/json

{
  "phoneId": "phone-001",
  "ip": "192.168.1.42"
}
```

#### Get All Phones
```http
GET /phones
```

#### Send SMS
```http
POST /send
Content-Type: application/json

{
  "to": "+1234567890",
  "msg": "Hello, world!"
}
```

### SMS Server

#### Health Check
```http
GET /health
```

#### Send SMS
```http
POST /sms
Content-Type: application/json

{
  "to": "+1234567890",
  "msg": "Hello, world!"
}
```

## Load Balancing Strategies

1. **Round-robin** (default)
   - Distributes requests evenly across all available phones
   - Simple and effective for equal-capacity phones

2. **Least-recently-used**
   - Selects the phone that hasn't been used for the longest time
   - Good for ensuring all phones are utilized

3. **Weighted**
   - Selects phones based on their success rate
   - Prioritizes phones with better delivery success

## Development

### Building for Production

For each component:
```bash
npm run build
```

### Running Tests

For each component:
```bash
npm run test
```

### Linting

For each component:
```bash
npm run lint
```

## Troubleshooting

1. **Phone not registering**
   - Check if the main server is accessible from the phone
   - Verify the MAIN_SERVER_URL in the SMS server's .env file
   - Check network connectivity

2. **SMS not sending**
   - Verify Termux:API is installed and has SMS permissions
   - Check phone's SMS sending capability
   - Verify the phone number format

3. **Dashboard not showing phones**
   - Check if the main server is running
   - Verify the dashboard's API endpoint configuration
   - Check browser console for errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC 