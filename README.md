# 🛒 The Local Cart

A modern, full-stack e-commerce platform built for the Sri Lankan market. Shop smart, shop local!

![Homepage](./images/homepage-hero.png)

## ✨ Features

- 🛍️ **Product Catalog** - Browse products with filtering, sorting, and search
- 🛒 **Shopping Cart** - Add items, update quantities, guest & authenticated cart support
- 💳 **Checkout Flow** - Shipping, payment, and order confirmation
- 👤 **User Accounts** - Registration, login, profile management
- ❤️ **Wishlist** - Save favorite products
- 📦 **Order Tracking** - View order history and status
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Mobile-first approach

### Admin Features
- 📊 Dashboard with sales analytics
- 📦 Product management (CRUD)
- 🏷️ Category management
- 🔥 Deals & promotions
- 📋 Order management
- 👥 User management
- ⚙️ Store settings

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| ![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white) | UI Library |
| ![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white) | Build Tool |
| ![React Router](https://img.shields.io/badge/React_Router-6.21-CA4245?logo=reactrouter&logoColor=white) | Routing |
| ![Axios](https://img.shields.io/badge/Axios-1.6-5A29E4?logo=axios&logoColor=white) | HTTP Client |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white) | Animations |
| ![React Icons](https://img.shields.io/badge/React_Icons-5.0-E91E63?logo=react&logoColor=white) | Icon Library |

### Backend
| Technology | Purpose |
|------------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white) | Runtime |
| ![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express&logoColor=white) | Web Framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?logo=mongodb&logoColor=white) | Database |
| ![Mongoose](https://img.shields.io/badge/Mongoose-8.0-880000?logo=mongoose&logoColor=white) | ODM |
| ![JWT](https://img.shields.io/badge/JWT-9.0-000000?logo=jsonwebtokens&logoColor=white) | Authentication |
| ![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?logo=swagger&logoColor=black) | API Documentation |

## 📸 Screenshots

### Homepage
![Homepage](./images/homepage.png)

### Today's Deals
![Today's Deals](./images/Today's%20Deals.png)

### Featured Products
![Featured Products](./images/Featured%20Products.png)

### Mobile Responsive
![Mobile View](./images/homepageMobileResponsive.png)

## 📚 API Documentation

Interactive API documentation powered by **Swagger UI** is available at:

```
http://localhost:5000/api-docs
```

![Swagger Documentation](./images/swagger-docs.png)

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/auth` | Authentication (login, register, profile) |
| `/api/products` | Product CRUD, reviews, filtering |
| `/api/categories` | Category management |
| `/api/cart` | Shopping cart operations |
| `/api/orders` | Order management |
| `/api/users` | User management (Admin) |
| `/api/settings` | Store configuration |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/e-commerce.git
   cd e-commerce
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables**

   Create `.env` in the server folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/localcart
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

5. **Run the application**

   Start the server:
   ```bash
   cd server
   npm run dev
   ```

   Start the client (new terminal):
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs

## 📁 Project Structure

```
e-commerce/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth, Cart, Theme)
│   │   ├── pages/          # Page components
│   │   │   └── admin/      # Admin dashboard pages
│   │   ├── services/       # API service
│   │   └── utils/          # Utility functions
│   └── package.json
│
├── server/                 # Express Backend
│   ├── config/             # Database & Swagger config
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── utils/              # Seed data
│   └── server.js           # Entry point
│
└── images/                 # README screenshots
```

## 💰 Currency

The platform uses **Sri Lankan Rupees (LKR/Rs.)** for all transactions.

## 📄 License

This project is licensed under the ISC License.

---

<p align="center">
  Made with ❤️ for local businesses in Sri Lanka
</p>
