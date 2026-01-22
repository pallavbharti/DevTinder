# DevTinder

A Tinder-like web application for developers to connect, collaborate, and network with each other.

## Features
- User authentication and profiles
- Swipe through developer profiles
- Match with other developers
- Real-time messaging/chat
- View developer portfolios and GitHub profiles
- Filter by skills, interests, and location

## Tech Stack
- **Frontend:**  React
- **Backend:** Node.js + Express.js
- **Database:** MongoDB

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/pallavbharti/DevTinder.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```

4. Start the server
   ```bash
   npm start
   ```

## Project Structure
```
src/
  app.js          - Main application entry point
  routes/         - API routes
  controllers/    - Business logic
  models/         - Database schemas
  config/         - Configuration files
```

## API Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /users` - Get developer profiles
- `POST /matches` - Create a match
- `GET /messages` - Fetch messages

## Contributing
Feel free to fork and submit pull requests.

## License
MIT