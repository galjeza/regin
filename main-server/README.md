# Main Server for SMS Load Balancing

This server manages multiple SMS-sending phones and implements load balancing strategies for SMS delivery.

## Features

- Phone registration and health monitoring
- Multiple load balancing strategies:
  - Round-robin
  - Least recently used
  - Weighted (based on delivery success rate)
- Automatic health checks for registered phones
- Status tracking for each phone

## API Endpoints

### Register a Phone
```http
POST /register
Content-Type: application/json

{
  "phoneId": "phone-001",
  "ip": "192.168.1.42"
}
```

### Get All Phones
```http
GET /phones
```

### Send SMS
```http
POST /send?strategy=round-robin
Content-Type: application/json

{
  "to": "+1234567890",
  "msg": "Hello, world!"
}
```

Load balancing strategies:
- `round-robin` (default)
- `least-recently-used`
- `weighted`

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on port 3000 by default. You can change this by setting the `PORT` environment variable.

## Phone Requirements

Each phone server should:
1. Run on port 8080
2. Implement a `/health` endpoint for health checks
3. Implement a `/sms` endpoint that accepts POST requests with `to` and `msg` fields 