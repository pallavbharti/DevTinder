# DevTinder Backend

DevTinder is a Tinder-inspired networking platform for developers.

Users can create profiles, discover other developers, send connection requests, manage connections, and communicate through real-time chat.

This repository contains the backend API and real-time communication server for DevTinder.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication
- Cookies
- CORS
- bcrypt

## Features

### Authentication
- User Signup
- User Login
- User Logout
- JWT-based authentication
- Authentication using cookies
- Protected API routes using `userAuth` middleware

### User Profile
- View logged-in user profile
- Edit profile information
- Validate profile data

### Developer Feed
- Fetch developer profiles
- Exclude already processed users
- Send connection requests
- Ignore profiles

### Connection Requests
- Send interested/ignored requests
- Accept connection requests
- Reject connection requests
- View received requests
- View accepted connections

### Real-Time Chat
- Real-time communication using Socket.IO
- One-to-one private chat rooms
- SHA-256 based room IDs
- Store messages in MongoDB
- Retrieve previous chat history
- Populate sender information
- Store timestamps for messages

## Project Structure

```text
src/
├── app.js
│
├── config/
│   └── database.js
│
├── middlewares/
│   └── auth.js
│
├── models/
│   ├── user.js
│   ├── connectionRequest.js
│   └── chat.js
│
├── routes/
│   ├── auth.js
│   ├── profile.js
│   ├── request.js
│   ├── user.js
│   └── chat.js
│
└── utils/
    ├── validation.js
    └── socket.js