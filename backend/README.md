# Express MongoDB Backend

A clean, simple, and Railway-friendly backend for your frontend.

## Features
- Node.js & Express server
- MongoDB connection with Mongoose
- Image upload using Multer (local storage)
- User registration and retrieval APIs
- CORS enabled
- Static file serving for images

## Getting Started

### 1. Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas URI

### 2. Setup
1. Open terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Update `.env` file with your MongoDB URI:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

### 3. Run the server
```bash
npm start
```

## API Endpoints

- **POST `/api/upload`**: Register a user with an image.
  - Body (form-data):
    - `name`: string
    - `email`: string
    - `image`: file
- **GET `/api/users`**: Get all users.
- **GET `/api/users/:id`**: Get a single user.

## Deployment
This project is ready for **Railway**. Simply connect your GitHub repo and Railway will automatically detect the `package.json` and run `npm start`.
