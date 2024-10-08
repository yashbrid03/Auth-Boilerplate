# Auth Boilerplate

## Table of Contents
1. [Introduction](#introduction)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Backend](#backend)
   - [Routes](#routes)
   - [Middleware](#middleware)
   - [ENV](#.env)
5. [Frontend](#frontend)
   - [Components](#components)
   - [Redux](#redux)
   - [API Utility](#api-utility)
6. [Setup and Installation](#setup-and-installation)

## Introduction

This Auth Boilerplate is a comprehensive authentication system built using the MERN stack (MongoDB, Express, React, Node.js). It provides a solid foundation for implementing user authentication in web applications, including features like user registration, email verification, login, password reset, and role-based access control.

## Tech Stack

- MongoDB: Database
- Express: Backend framework
- React: Frontend library
- Node.js: Runtime environment
- Tailwind CSS: Utility-first CSS framework
- Nodemailer: Email sending
- JWT: JSON Web Tokens for authentication

## Features

- User registration with email verification
- User login with JWT authentication
- Password reset functionality
- Role-based access control
- Protected routes
- Refresh token mechanism
- Profile Page
- Responsive UI using Tailwind CSS

## Backend

### Routes

The backend provides the following API routes:

1. `POST /api/auth/register`: Register a new user
2. `POST /api/auth/login`: Authenticate a user and return tokens
3. `POST /api/auth/refresh-token`: Refresh the access token using a refresh token
4. `GET /api/auth/verify-email/:token`: Verify a user's email address
5. `POST /api/auth/resend-verification`: Resend the verification email
6. `POST /api/auth/logout`: Log out a user (invalidate tokens)
7. `POST /api/auth/email-reset-pass`: Initiate the password reset process
8. `POST /api/auth/save-new-password/:token`: Save a new password after reset
9. `GET /api/auth/checkauth`: Check if a user is authenticated
10. `GET /api/getUserDetails`: Get details of user (requires authentication)
11. `GET /api/updateUserDetails`: Update details of user (requires authentication)
12. `GET /api/removeUser/:id`: Delete the User (requires authentication)

### Middleware

The backend implements the following middleware:

- `authenticateToken`: Verifies the JWT access token
- `refreshAuthenticateToken`: Handles token refresh
- `authorizeRole`: Checks if a user has the required role for accessing a route

### .env
Sample .env file
- MONGODB_URI=
- JWT_SECRET=
- JWT_REFRESH_SECRET=
- EMAIL_HOST=
- EMAIL_PORT=
- EMAIL_USER=
- EMAIL_PASS=
- FRONTEND_URL=http://localhost:5173
- PORT=5000

## Frontend

### Components

1. `Login`: Handles user login and generate refresh token and access token. (include validation such as user is verified or not, if user is already logged in or not)
2. `Register`: Manages user registration and send verification link on email
3. `Verify`: Handles email verification (if link is expired you can resend verification mail and contains validation for already verififed user)
4. `ForgetPass`: Manages password reset process ( reset link sent on email can only be used once. contains proper validation when wrong token is passed or token is expired)
5. `Dashboard`: A protected route example
6. `PrivateRoute`: A wrapper for protected routes
7. `Profile`: Profile page to view, update and delete User (User must be logged in i.e. eg. Protected route)

### Redux

The project uses Redux for state management:

- `authSlice.js`: Manages authentication state and actions
  - `login`: Async thunk for user login
  - `checkAuth`: Async thunk to verify authentication status
  - `logout`: Async thunk for user logout
  - `setUser`: Action to update user state

### API Utility

The `api.js` file sets up an Axios instance with:

- Base URL configuration
- Interceptors for handling token refresh
- Automatic handling of 401 errors (unauthorized)


## Setup and Installation

- Clone this repo `git clone https://github.com/yashbrid03/Auth-Boilerplate.git`
- navigate to the cloned repository `cd Auth-Boilerplate`
- now navigate to both folder i.e. Client and Server (in different terminals)
- run `npm i` in both terminals
- start server using `npm start` and client by `npm run dev`

