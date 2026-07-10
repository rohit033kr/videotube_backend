# 🎥 VideoTube Backend API

A complete YouTube-inspired backend built with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**. This project provides authentication, video management, playlists, subscriptions, likes, comments, tweets, dashboard analytics, and more.

---

## 🚀 Features

### Authentication
- User Registration
- User Login
- User Logout
- Refresh Access Token
- Change Password
- Get Current User
- Update Account Details
- Update Avatar
- Update Cover Image

### Videos
- Upload Video
- Get All Videos
- Get Video by ID
- Update Video
- Delete Video
- Toggle Publish Status

### Playlists
- Create Playlist
- Update Playlist
- Delete Playlist
- Get Playlist
- Get User Playlists
- Add Video to Playlist
- Remove Video from Playlist

### Comments
- Add Comment
- Update Comment
- Delete Comment
- Get Video Comments

### Likes
- Like/Unlike Video
- Like/Unlike Comment
- Like/Unlike Tweet
- Get Liked Videos

### Tweets
- Create Tweet
- Update Tweet
- Delete Tweet
- Get User Tweets

### Subscriptions
- Subscribe / Unsubscribe Channel
- Get Subscribers
- Get Subscribed Channels

### Dashboard
- Channel Statistics
- Channel Videos

### Health Check
- API Health Check Endpoint

---

# 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Multer
- Cloudinary
- Cookie Parser
- CORS
- dotenv

---

# 📁 Project Structure

```
src
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── db/
├── app.js
└── index.js
```

---

# Database Models

- User
- Video
- Playlist
- Comment
- Like
- Tweet
- Subscription

---

# Installation

Clone the repository

```bash
git clone https://github.com/your-username/videotube-backend.git
```

Go into the project

```bash
cd videotube-backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file.

Run the server

```bash
npm run dev
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env
PORT=8000

MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLOUDINARY_API_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CORS_ORIGIN=http://localhost:5173
```

---

# API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/v1/users/register |
| POST | /api/v1/users/login |
| POST | /api/v1/users/logout |
| POST | /api/v1/users/refresh-token |
| POST | /api/v1/users/change-password |
| GET | /api/v1/users/current-user |
| PATCH | /api/v1/users/update-account |
| PATCH | /api/v1/users/avatar |
| PATCH | /api/v1/users/cover-image |

---

## Videos

| Method | Endpoint |
|---------|----------|
| GET | /api/v1/videos |
| POST | /api/v1/videos |
| GET | /api/v1/videos/:videoId |
| PATCH | /api/v1/videos/:videoId |
| DELETE | /api/v1/videos/:videoId |
| PATCH | /api/v1/videos/toggle/publish/:videoId |

---

## Playlists

| Method | Endpoint |
|---------|----------|
| POST | /api/v1/playlists |
| GET | /api/v1/playlists/:playlistId |
| PATCH | /api/v1/playlists/:playlistId |
| DELETE | /api/v1/playlists/:playlistId |
| GET | /api/v1/playlists/user/:userId |
| PATCH | /api/v1/playlists/:playlistId/videos/:videoId |
| DELETE | /api/v1/playlists/:playlistId/videos/:videoId |

---

## Comments

| Method | Endpoint |
|---------|----------|
| GET | /api/v1/comments/:videoId |
| POST | /api/v1/comments/:videoId |
| PATCH | /api/v1/comments/c/:commentId |
| DELETE | /api/v1/comments/c/:commentId |

---

## Likes

| Method | Endpoint |
|---------|----------|
| POST | /api/v1/likes/toggle/video/:videoId |
| POST | /api/v1/likes/toggle/comment/:commentId |
| POST | /api/v1/likes/toggle/tweet/:tweetId |
| GET | /api/v1/likes/videos |

---

## Tweets

| Method | Endpoint |
|---------|----------|
| POST | /api/v1/tweets |
| GET | /api/v1/tweets/user/:userId |
| PATCH | /api/v1/tweets/:tweetId |
| DELETE | /api/v1/tweets/:tweetId |

---

## Subscriptions

| Method | Endpoint |
|---------|----------|
| POST | /api/v1/subscriptions/c/:channelId |
| GET | /api/v1/subscriptions/u/:subscriberId |
| GET | /api/v1/subscriptions/c/:channelId |

---

## Dashboard

| Method | Endpoint |
|---------|----------|
| GET | /api/v1/dashboard/stats |
| GET | /api/v1/dashboard/videos |

---

## Health Check

| Method | Endpoint |
|---------|----------|
| GET | /api/v1/healthcheck |

---

# Authentication

Protected routes require a JWT Access Token.

```
Authorization: Bearer <access_token>
```

or via HTTP-only Cookies.

---

# File Uploads

This project uses:

- Multer
- Cloudinary

Uploaded files:

- Avatar
- Cover Image
- Video
- Thumbnail

---

# Pagination

Some endpoints support pagination.

Example:

```
GET /api/v1/videos?page=1&limit=10
```

---

# Error Handling

Centralized error handling using:

- ApiError
- ApiResponse
- asyncHandler

---

# Future Improvements

- Search Videos
- Notifications
- Watch History
- Video Recommendations
- Real-time Chat
- Live Streaming
- Admin Dashboard

---

# Author

**Rohit Kumar**

B.Tech CSE (Full stack web developer)

Interested in:
- Backend Development
- AI
- Cyber Security
- Full Stack Development


