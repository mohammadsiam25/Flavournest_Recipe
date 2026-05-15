# 🍳 FlavourNest

> **একটি full-stack food recipe sharing platform** — রেসিপি আবিষ্কার করুন, শেয়ার করুন এবং মুহূর্তের সাথে মিলিয়ে রান্না করুন।

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?style=flat-square&logo=vite)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Hosting-3448C5?style=flat-square)

---

## 📋 সূচিপত্র

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Setup Instructions](#-setup-instructions)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [Design System](#-design-system)

---

## ✨ Features

### 🔐 Authentication

- JWT-based secure login ও signup
- Password hashing with bcrypt
- Persistent session via localStorage
- Protected routes — login ছাড়া recipe add/edit করা যাবে না

### 🍽️ Recipe Management

- **Add Recipe** — title, ingredients, instructions, cooking time, cover image সহ রেসিপি শেয়ার করুন
- **Edit Recipe** — নিজের রেসিপি যেকোনো সময় আপডেট করুন
- **Delete Recipe** — নিজের রেসিপি মুছে ফেলুন
- **Recipe Detail Page** — সম্পূর্ণ উপকরণ, নির্দেশনা, creator info সহ বিস্তারিত দেখুন
- **Cover Image Upload** — Cloudinary-তে image host করা হয়

### 🔍 Browse & Filter

- **Category Filter** — Breakfast, Lunch, Dinner, Snacks, Desserts, Drinks, Vegetarian, Vegan, Seafood, Fast Food, Soup, Salad — ১২টি ক্যাটাগরি
- **Search** — recipe title দিয়ে real-time search
- **All Recipes** — homepage-এ সব রেসিপি grid layout-এ

### 🎯 Mood Picker

- **আবহাওয়া অনুযায়ী** (Hot ☀️ / Cold ❄️ / Rainy 🌧️ / Any)
- **দিনের সময় অনুযায়ী** (Morning / Afternoon / Evening / Night)
- **ক্যাটাগরি** সিলেক্ট করে perfect recipe সাজেস্ট করে
- Match না পেলে random recipe সাজেস্ট করে

### ⭐ Rating System

- ১–৫ star interactive rating
- Average rating ও total rating count
- নিজের rating আপডেট করা যায়
- Recipe card-এ average rating দেখায়

### 💬 Comment System

- Login করা user রেসিপিতে comment করতে পারবেন
- নিজের comment delete করা যাবে
- Time-ago format (2h ago, 3d ago)
- Real-time comment count
- Ctrl+Enter দিয়ে দ্রুত post করুন

### ❤️ Favourites

- যেকোনো recipe heart দিয়ে favourite করুন
- localStorage-এ সংরক্ষিত থাকে
- Favourites page-এ সব saved রেসিপি একসাথে

### 🎨 UI/UX

- Warm, food-inspired color palette (clay, parchment, sage)
- Playfair Display + DM Sans typography
- Skeleton loading, smooth animations
- Fully responsive (mobile, tablet, desktop)
- Sticky navbar with profile dropdown
- Hamburger menu for mobile

---

## 🛠️ Tech Stack

| Layer              | Technology                             |
| ------------------ | -------------------------------------- |
| **Frontend**       | React 18, Vite 4                       |
| **Styling**        | Plain CSS with CSS Variables           |
| **Backend**        | Node.js, Express.js                    |
| **Database**       | MongoDB Atlas (Mongoose ODM)           |
| **Authentication** | JWT (jsonwebtoken), bcrypt             |
| **Image Hosting**  | Cloudinary (multer-storage-cloudinary) |
| **File Upload**    | Multer                                 |
| **Dev Tools**      | Nodemon, Vite HMR                      |

---

## 📁 Project Structure

```
Flavournest_Recipe/
│
├── flavournest-backend/
│   ├── config/
│   │   └── connectionDb.js          # MongoDB connection
│   ├── controller/
│   │   ├── recipe.js                # Recipe CRUD + rating logic
│   │   ├── comment.js               # Comment CRUD logic
│   │   └── user.js                  # Auth (signup/login/getUser)
│   ├── middleware/
│   │   └── auth.js                  # JWT verification middleware
│   ├── models/
│   │   ├── recipe.js                # Recipe schema (ratings virtual সহ)
│   │   ├── comment.js               # Comment schema
│   │   └── user.js                  # User schema
│   ├── routes/
│   │   ├── recipe.js                # /api/recipes routes + comment routes
│   │   └── user.js                  # /signUp, /login, /user routes
│   ├── .env.example
│   ├── package.json
│   └── server.js                    # Express app entry point
│
└── flavournest-frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── AuthModal.jsx         # Login/Signup modal
    │   │   ├── CommentSection.jsx    # Comment list + input
    │   │   ├── Footer.jsx
    │   │   ├── Navbar.jsx            # Sticky nav with profile dropdown
    │   │   ├── RecipeCard.jsx        # Recipe grid card
    │   │   └── StarRating.jsx        # Interactive star rating
    │   ├── context/
    │   │   └── AuthContext.jsx       # Global auth state (user, token)
    │   ├── pages/
    │   │   ├── AddRecipePage.jsx     # Add / Edit recipe form
    │   │   ├── FavouritesPage.jsx    # Saved recipes
    │   │   ├── HomePage.jsx          # Landing + all recipes
    │   │   ├── MoodPickerPage.jsx    # Mood-based recipe finder
    │   │   ├── MyRecipePage.jsx      # User-এর নিজস্ব recipes
    │   │   └── RecipeDetailPage.jsx  # Full recipe view + rating + comments
    │   ├── api.js                    # Base API URL config
    │   ├── App.jsx                   # Root component + routing logic
    │   ├── index.css                 # Global CSS variables & resets
    │   ├── keepAlive.js              # Backend ping (cold start prevent)
    │   └── main.jsx                  # React entry point
    ├── index.html
    ├── package.json
    └── vite.config.js               # Vite + dev proxy config
```

---

## 🌐 API Reference

### Auth Routes

| Method | Endpoint    | Body                  | Auth | Description             |
| ------ | ----------- | --------------------- | ---- | ----------------------- |
| `POST` | `/signUp`   | `{ email, password }` | ❌   | নতুন account তৈরি       |
| `POST` | `/login`    | `{ email, password }` | ❌   | Login করুন, token পাবেন |
| `GET`  | `/user/:id` | —                     | ❌   | User info দেখুন         |

### Recipe Routes

| Method   | Endpoint                 | Query / Body                    | Auth | Description              |
| -------- | ------------------------ | ------------------------------- | ---- | ------------------------ |
| `GET`    | `/api/recipes`           | `?category=&weather=&mealTime=` | ❌   | সব রেসিপি (filter সহ)    |
| `GET`    | `/api/recipes/:id`       | —                               | ❌   | একটি রেসিপির details     |
| `GET`    | `/api/recipes/mood-pick` | `?category=&weather=&mealTime=` | ❌   | Mood-based random recipe |
| `POST`   | `/api/recipes`           | FormData                        | ✅   | নতুন রেসিপি add করুন     |
| `PUT`    | `/api/recipes/:id`       | FormData                        | ✅   | রেসিপি edit করুন         |
| `DELETE` | `/api/recipes/:id`       | —                               | ✅   | রেসিপি delete করুন       |
| `POST`   | `/api/recipes/:id/rate`  | `{ rating: 1-5 }`               | ✅   | রেসিপিতে rating দিন      |
| `DELETE` | `/api/recipes/:id/rate`  | —                               | ✅   | নিজের rating সরান        |

**FormData fields:** `title`, `ingredients`, `instructions`, `time`, `category`, `weather`, `mealTime`, `file` (image)

### Comment Routes

| Method   | Endpoint                               | Body       | Auth | Description               |
| -------- | -------------------------------------- | ---------- | ---- | ------------------------- |
| `GET`    | `/api/recipes/:id/comments`            | —          | ❌   | রেসিপির সব comment        |
| `POST`   | `/api/recipes/:id/comments`            | `{ text }` | ✅   | নতুন comment করুন         |
| `DELETE` | `/api/recipes/:id/comments/:commentId` | —          | ✅   | নিজের comment delete করুন |

> **Auth Header:** `Authorization: Bearer <your_jwt_token>`

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js >= 16
- MongoDB Atlas account
- Cloudinary account

---

### 1. Repository Clone করুন

```bash
git clone https://github.com/your-username/flavournest.git
cd flavournest
```

---

### 2. Backend Setup

```bash
cd flavournest-backend
npm install
```

`.env.example` দেখে `.env` ফাইল তৈরি করুন:

```env
PORT=3000
CONNECTION_STRING=mongodb+srv://<user>:<password>@cluster.mongodb.net/flavournest
SECRET_KEY=your_super_secret_jwt_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Server চালু করুন:

```bash
npm run dev
# ✅ Server running on http://localhost:3000
# ✅ MongoDB connected...
```

---

### 3. Frontend Setup

```bash
cd ../flavournest-frontend
npm install
```

Production deploy-এর জন্য `.env` ফাইল তৈরি করুন:

```env
VITE_API_URL=https://your-backend-url.com
```

> **Local development-এ** `VITE_API_URL` দরকার নেই। `vite.config.js` এর proxy config সব API request `localhost:3000` এ পাঠিয়ে দেয়।

Dev server চালু করুন:

```bash
npm run dev
# ✅ Frontend running on http://localhost:5173
```

---

### 4. Production Build

```bash
cd flavournest-frontend
npm run build
# dist/ ফোল্ডারে static files তৈরি হবে
```

---

## 🔑 Environment Variables

### Backend (`.env`)

| Variable                | Required | Description                  |
| ----------------------- | :------: | ---------------------------- |
| `PORT`                  |    ❌    | Server port (default: 3000)  |
| `CONNECTION_STRING`     |    ✅    | MongoDB Atlas connection URI |
| `SECRET_KEY`            |    ✅    | JWT signing secret key       |
| `CLOUDINARY_CLOUD_NAME` |    ✅    | Cloudinary cloud name        |
| `CLOUDINARY_API_KEY`    |    ✅    | Cloudinary API key           |
| `CLOUDINARY_API_SECRET` |    ✅    | Cloudinary API secret        |

### Frontend (`.env`)

| Variable       | Required | Description                                     |
| -------------- | :------: | ----------------------------------------------- |
| `VITE_API_URL` |    ❌    | Backend base URL (production deploy-এ set করুন) |

---

## 📊 Database Schema

### Recipe

```js
{
  title:        String,      // required
  ingredients:  [String],    // required — comma-separated হলে auto-split
  instructions: String,      // required
  time:         String,      // e.g. "30 min"
  category:     String,      // enum: Breakfast | Lunch | Dinner | Snacks |
                             //       Desserts | Drinks | Vegetarian | Vegan |
                             //       Seafood | Fast Food | Soup | Salad
  weather:      String,      // enum: Hot | Cold | Rainy | Any
  mealTime:     String,      // enum: Morning | Afternoon | Evening | Night | Any
  coverImage:   String,      // Cloudinary URL
  createdBy:    ObjectId,    // ref: User
  ratings: [{
    userId:     ObjectId,
    rating:     Number       // min: 1, max: 5
  }],
  // Virtuals (toJSON-এ include হয়):
  averageRating: Number,
  totalRatings:  Number,
  timestamps: true
}
```

### Comment

```js
{
  recipeId:  ObjectId,  // ref: Recipes — required
  userId:    ObjectId,  // ref: User — required
  userEmail: String,    // required
  text:      String,    // required, maxlength: 1000
  timestamps: true
}
```

### User

```js
{
  email:    String,  // unique, required
  password: String,  // bcrypt hashed — required
  timestamps: true
}
```

---

## 🎨 Design System

### Color Palette

| CSS Variable   | Value     | Usage                               |
| -------------- | --------- | ----------------------------------- |
| `--clay`       | `#c4622d` | Primary CTA, accents, active states |
| `--clay-light` | `#e8855a` | Hover states, gradient ends         |
| `--clay-dark`  | `#a04d1f` | Pressed states                      |
| `--cream`      | `#faf6f0` | Page background                     |
| `--warm-white` | `#fffdf9` | Card backgrounds                    |
| `--charcoal`   | `#2c2c2c` | Primary text                        |
| `--stone`      | `#8b8178` | Secondary/muted text                |
| `--parchment`  | `#f2ebe0` | Subtle fills, tab backgrounds       |
| `--sage`       | `#7a9e7e` | Success states, chef badge          |
| `--gold`       | `#d4a853` | Accent highlight                    |

### Typography

| Variable         | Font             | Usage                                      |
| ---------------- | ---------------- | ------------------------------------------ |
| `--font-display` | Playfair Display | Page titles, recipe names, section headers |
| `--font-body`    | DM Sans          | Body text, buttons, labels, inputs         |

---

## 🚀 Live Demo

|                | URL         |
| -------------- | ----------- |
| 🌐 Frontend    | Coming soon |
| ⚙️ Backend API | Coming soon |

---

## 👥 Team

Built with ❤️ by **Team Codex** — 2026

---

## 📄 License

This project is for educational purposes. All rights reserved © 2026 Team Codex.
