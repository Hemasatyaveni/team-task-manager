# Team Task Manager

Full stack Team Task Manager built with React, Vite, Tailwind CSS, Node.js, Express.js, MongoDB Atlas, JWT authentication, and role-based access.

## Features

- Signup, login, logout with JWT authentication
- Password hashing with bcrypt
- Admin and member roles
- Project and task CRUD flows
- Responsive dashboard with analytics cards and progress bars
- Protected routes and global error handling
- Railway-compatible deployment

## Project Structure

- `server/` - backend API
- `client/` - frontend application

## Backend Setup

1. `cd server`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Set `MONGO_URI`, `JWT_SECRET`, `PORT`, and `CLIENT_URL`
5. Run `npm run dev`
6. (Optional) Run `npm run seed` to create demo admin/member accounts

## Frontend Setup

1. `cd client`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Set `VITE_API_BASE_URL=http://localhost:5000/api`
5. Run `npm run dev`

## Available Scripts

### Backend
- `npm run dev` - start server with nodemon
- `npm start` - start production server

### Frontend
- `npm run dev` - start Vite dev server
- `npm run build` - create production build
- `npm run preview` - preview production build

## Production Deployment

1. Build the frontend: `cd client && npm run build`
2. Start or deploy the server: `cd server && npm start`
3. Make sure the backend can serve the built frontend when `NODE_ENV=production`

## Railway Deployment

1. Create a Railway project for the backend.
2. Connect the repository and set the root path to `server/`.
3. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
4. In Railway, add a separate service for the frontend or build the client in the backend build pipeline.
5. For frontend static hosting, deploy `client/dist` or use a platform that supports Vite builds.

## Environment Variables

### `server/.env.example`
- `MONGO_URI`
- `JWT_SECRET`
- `PORT`
- `CLIENT_URL`

### `client/.env.example`
- `VITE_API_BASE_URL`

## Notes

- The backend uses `express-validator` for request validation.
- The frontend stores JWT tokens in `localStorage` and sends them in the Authorization header.
- The application supports admin-only project/task creation and member task status updates.
