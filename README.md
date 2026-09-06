<div align="center">
  <img src="./assets/novexa-logo.svg" alt="Novexa Logo" width="220" />

  # Novexa — Hyperlocal Multi-Vendor Marketplace

  <p><strong>A full-stack hyperlocal e-commerce ecosystem connecting Customers, Local Sellers, and Delivery Drivers.</strong></p>
</div>

---

## 🌟 Overview

**Novexa** is an on-demand hyperlocal marketplace platform that bridges the gap between nearby brick-and-mortar stores, local consumers, and delivery partners through dedicated role-based dashboards, automated geospatial radius matching, and secure token rotation.

- 🌐 **Live Application:** [novexa-indol.vercel.app](https://novexa-indol.vercel.app)
---

## 🎭 Role-Based Workflows

| Role | Core Capabilities |
| :--- | :--- |
| 🛍️ **Customer** | Discover nearest stores within radius, search products, manage guest/authenticated cart sync, save multiple addresses, and track orders. |
| 🏪 **Seller** | Dedicated store portal, real-time product catalog & inventory management, Cloudinary image uploads, and order dispatching. |
| 🚚 **Driver** | Dynamic delivery request queue, accept/reject matching orders, live status updates (`Out for Delivery` ➔ `Delivered`), and earnings overview. |

---

## ⚡ Key Technical Highlights

- **🔐 Dual Token Auth Architecture:** Short-lived access tokens with `HttpOnly` refresh token rotation (`/api/auth/rotate-token`) for high security & silent session recovery.
- **📍 Geospatial Discovery:** MongoDB `2dsphere` indexes with `$near` geospatial queries for accurate nearby store and driver matching.
- **🛒 Resilient Cart Sync:** Automatic seamless merging between guest local cart and cloud database cart upon customer sign-in.
- **🖼️ Asset Management:** Cloudinary API integration with automatic memory cleanup and image pipeline optimization.
- **🎨 Modern UI/UX:** Clean, responsive design crafted with React 19, TailwindCSS, Lucide icons, and Framer Motion micro-interactions.

---

## 🛠️ Tech Stack

```
├── Frontend  : React 19 • Vite • Redux Toolkit • Tailwind CSS • Axios • Lucide Icons
├── Backend   : Node.js • Express 5 • Mongoose • JWT • Multer • Bcrypt
├── Database  : MongoDB Atlas (with 2dsphere Geo Indexes)
└── Cloud/CDN : Cloudinary (Media Assets) • Vercel (Frontend) • Render (Backend)
```

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/dev-naresh608/novexa.git
cd novexa
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file inside `/backend`:
```env
PORT=5000
DATABASE_URI=your_mongodb_connection_string
JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret
JWT_ACCESS_TOKEN_EXPIRE=15m
JWT_REFRESH_TOKEN_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Run backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file inside `/frontend`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
Run frontend development server:
```bash
npm run dev
```

---

## 👨‍💻 Author

**Naresh**
- GitHub: [@dev-naresh608](https://github.com/dev-naresh608)
- LinkedIn: [in/naresh608](https://www.linkedin.com/in/naresh608)

---

<p align="center">
  ⭐ <em>If you like this project, please consider giving it a star on GitHub!</em>
</p>
