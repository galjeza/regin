# SMS Load Balancing System

A distributed system for managing and load balancing SMS sending across multiple Android phones using Termux. The system consists of three main components:

1. Main Server - Manages phone registration and load balancing
2. SMS Server - Runs on each Android phone to send SMS messages
3. Dashboard - Web interface to monitor phone status and SMS statistics

## System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Dashboard │     │ Main Server │     │ SMS Server  │
│   (Web UI)  │◄────┤ (Load      │◄────┤ (Android    │
└─────────────┘     │  Balancer)  │     │  Phone)     │
                    └─────────────┘     └─────────────┘
```

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Android phone with Termux installed
- Termux:API package installed on Android phone

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