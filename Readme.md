# 🛒 Intercorp – Product-Based E-Commerce Website (Frontend)

**Intercorp** is a modern **product-based e-commerce web application** that includes both a **customer-facing shopping experience** and a **feature-rich admin dashboard**.

The project is built entirely on the **frontend** using **React, Vite, and JSON-based data**, focusing on **real-world user experience, admin workflows, and business-oriented UI design**.

🌐 **Live Demo:**  
https://clinquant-cannoli-0a9473.netlify.app/

---

## ✨ Features Overview

### 👤 Customer Side
- Product browsing and shopping flow
- Add to cart & Buy Now functionality
- Sign-in required for checkout
- Conditional authentication:
  - Redirects to Sign In if user is not logged in
  - Skips Sign In if user is already authenticated
- Account dropdown shows:
  - Logged-in user name
  - My Orders
  - Profile Settings
  - Sign Out
- Invoice visibility after order placement

---

### 🧑‍💼 Admin Dashboard
- Overview cards:
  - Total Revenue
  - Total Orders
  - Active Customers
  - Total Products
- Interactive dashboard cards:
  - Clicking cards navigates to related pages
- Orders & status visualization:
  - Orders per day chart
  - Order status breakdown (Pending / Processing / Delivered)
- Sales Conversion Funnel:
  - Product Viewed → Added to Cart → Checkout Started → Order Placed
  - Conversion percentages and drop-offs
- Inventory Health section:
  - Current stock levels
  - Expiry date tracking
  - Low stock indicators
  - Slow-moving product tags
  - Near-expiry alerts
- Alerts & Notifications:
  - Low stock warnings
  - Expiring soon products
  - Pending orders alerts on admin login
- Activity panel:
  - New order placed
  - Order status changes
- Collapsible sidebar with hamburger menu for better usability

---

## 🧱 Tech Stack
- **React**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Chart.js / Recharts**
- **JSON files for mock data**
- **Netlify (Deployment)**

---

## 📁 Project Structure
Intercorp/
├── public/
│ └── data/
│ ├── products.json
│ ├── orders.json
│ ├── customers.json
│ ├── inventory.json
│ └── invoices.json
├── src/
│ ├── components/
│ ├── pages/
│ ├── layouts/
│ ├── routes/
│ └── utils/
├── index.html
├── package.json
└── vite.config.ts


---

## ▶️ Run the Project Locally

```bash
npm install
npm run dev

The application will run at: http://localhost:5173

---
🌍 Deployment
Deployed on Netlify
Static frontend hosting
Fully supports JSON-based data
No backend or database required

---

🎯 Project Goal
This project was developed to:
Simulate a real-world e-commerce product
Demonstrate admin decision-making dashboards
Focus on clean UI, UX clarity, and scalability
Deliver a client-ready frontend application

---
👩‍💻 Author
Garima
Full-Stack Developer

Focused on building user-friendly, business-aware web applications using modern frontend technologies.
