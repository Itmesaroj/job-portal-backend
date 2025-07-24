# 🧑‍💼 Job Portal Backend

This is the backend of the **Job Portal** web application that powers the functionalities for both **employers** and **job seekers**. It is built using **Node.js**, **Express.js**, and **MongoDB**, and supports features like **authentication**, **job management**, **application submission**, and **profile updates**.

🔗 **Frontend URL**: [https://jobmyportal.netlify.app](https://jobmyportal.netlify.app)

---

## 🚀 Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB ORM
- **Cloudinary** – Image & file uploads (CV, profile pic, etc.)
- **JWT** – Authentication using JSON Web Tokens
- **CORS & Cookies** – Cross-Origin & secure auth handling
- **Render** – Backend deployment
- **Netlify Cron** – Automated newsletter via `node-cron`

---

## 📦 Features

- ✅ User Registration & Login (Job Seeker / Employer)
- 🔐 JWT Token-based authentication with HTTP-only cookies
- 🧑‍💼 Post, Update & Delete Job Listings
- 📄 Submit Job Applications with Resume Upload
- 📨 Newsletter system via cron job
- 🗃️ Fetch employer-specific jobs & job seeker applications
- 🛡️ Middleware for authorization & validation
- ⚙️ Secure configuration with `.env`

---

## 📁 API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/user/register` | Register a new user |
| `POST` | `/user/login` | Login as employer or job seeker |
| `GET`  | `/user/getuser` | Get logged-in user details |
| `PUT`  | `/user/update/profile` | Update profile info |
| `PUT`  | `/user/update/password` | Change password |
| `POST` | `/job/post` | Post a new job (Employer only) |
| `GET`  | `/job/getall` | Fetch all jobs |
| `GET`  | `/job/getmyjobs` | Employer’s jobs |
| `GET`  | `/job/get/:id` | Get single job |
| `DELETE` | `/job/delete/:id` | Delete a job |
| `POST` | `/application/postApplication/:jobId` | Submit job application |
| `GET`  | `/application/jobSeeker/getallAppliction` | Applications by job seeker |
| `GET`  | `/application/employer/getallAppliction` | Applications received for employer |
| `DELETE` | `/application/delete/:id` | Delete an application |

---

## ⚙️ Environment Variables

Create a `.env` file in the root with the following:

```env
PORT=5000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
