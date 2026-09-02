# Sai Santosh Traders 🛒 • Hyderabad Hyperlocal Quick Commerce

[![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.14-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A fast, modern, and hyperlocal grocery delivery application crafted specifically for **Hyderabad, Telangana**. Built with React 19, TypeScript, and Tailwind CSS, the platform delivers fresh staples and packaged goods in 15–20 minutes from local dark stores, paired with a real-time synchronized Admin Operations Hub.

---

## 🚀 Key Highlights & Architecture

The application is structured into a streamlined **two-page user flow** with an **isolated Admin Portal**:

1. **Page 1: Brand Landing & Customer Login** — Introduction to Sai Santosh Traders, core staple highlights, Hyderabad coverage points, and customer authentication.
2. **Page 2: Grocery Shopping Storefront** — Full quick-commerce catalog unlocked upon login with live cart, coupons, address management, and instant order tracking.
3. **Admin Operations Hub** — An isolated management portal for store owners to monitor live Hyderabad orders, update inventory stock/pricing, manage customers, and simulate incoming delivery orders in real time.

---

## ✨ Features

### 🛍️ Customer Experience
- **Hyperlocal Hyderabad Delivery**: Select and save addresses across key Hyderabad localities (*Himayatnagar, Banjara Hills, Jubilee Hills, Madhapur, Gachibowli, Begumpet, Ameerpet, Kukatpally, Secunderabad, Dilsukhnagar*).
- **Extensive Catalog (60+ SKUs)**:
  - 🥛 **Dairy & Eggs**: Fresh toned/full cream milk, curd, paneer, butter, ghee, and organic eggs.
  - 🌾 **Rice & Flour**: Premium Sona Masoori, Basmati, Chakki Atta, Maida, Rava, and Poha.
  - 🍲 **Dal & Pulses**: Unpolished Toor Dal, Moong Dal, Chana Dal, Urad Dal, and Kabuli Chana.
  - 🛢️ **Oils & Ghee**: Pure Cow Ghee, Sunflower Oil, Groundnut Oil, and Mustard Oil.
  - 🥨 **Snacks & Namkeen**: Hyderabad spicy mixtures, Murukku, chips, roasted makhanas, and cashews.
  - 🍪 **Biscuits & Cookies**: Osmania biscuits, Marie, digestive biscuits, and chocolate cookies.
- **Dynamic Cart & Checkout**:
  - Auto-calculated discounts, packaging fees, tip selection, and free delivery thresholds (₹299+).
  - Promo code integration (`HYDQUICK25`, `FIRSTSAVE50`).
  - Multiple payment options: UPI (PhonePe, Google Pay, Paytm), Cards, Net Banking, and Cash on Delivery.
- **Live Order Tracking**: Interactive step-by-step progress (*Order Placed ➔ Confirmed ➔ Packing ➔ Out for Delivery ➔ Delivered*) with dark store details and live delivery rider information.
- **Search & Filter**: Keyword search, category-based quick filters, and interactive Voice Search simulation.
- **Wishlist & Notification Center**: Save favorite staples for fast repeat purchases with notifications for discounts and order dispatches.

### 📊 Admin Operations Hub
- **10 KPI Live Metrics**: Real-time counters for Total Orders, Today's Orders, Status Breakdown (Pending, Packing, Out for Delivery, Delivered, Cancelled), Total Revenue, and Registered Customers.
- **Live Orders Table**: Search orders by customer name, mobile number, order ID, or Hyderabad locality.
- **1-Click Status Advancement**: Advance order statuses (*e.g., PACKING ➔ OUT FOR DELIVERY ➔ DELIVERED*) with automatic real-time event bus synchronization to customer tracking screens.
- **Live Inventory Manager**: Real-time stock stepper counters, quick price/MRP modification, and in-stock / low-stock / out-of-stock badge filtering.
- **Customer CRM**: Complete customer directory displaying lifetime spend, order frequencies, and address books.
- **Hyderabad Dark Store Hub**: Monitor dark store nodes across Hyderabad micro-markets.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/) & [Google Material Symbols](https://fonts.google.com/icons)
- **Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Animations**: [Motion](https://motion.dev/)

---

## 📦 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/sai-santosh-traders.git
   cd sai-santosh-traders
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 🔑 Demo Access Credentials

The application provides quick demo credentials right inside the login cards:

### Customer Login
- **Mobile Number**: `9845012345`
- **Password**: `password123` (or click *"Use Demo Account"*)

### Admin Portal
- **Username / Email**: `admin@saisantosh.com`
- **Password**: `admin123` (or click *"Use Admin Demo"*)

---

## 📂 Project Structure

```text
├── index.html                   # Entry HTML with branding & Material Symbols
├── metadata.json                # Project metadata
├── package.json                 # Scripts and dependencies
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Primary view router, state engine & event bus
│   ├── index.css                # Global Tailwind CSS imports
│   ├── types.ts                 # TypeScript types (Products, Orders, Customers, Addresses)
│   ├── data/
│   │   └── products.ts          # Catalog items, Hyderabad localities, coupons & initial state
│   ├── utils/
│   │   └── realtime.ts          # Event bus for customer ↔ admin state synchronization
│   └── components/
│       ├── Header.tsx           # Customer header with address selector & speed pill
│       ├── BottomNav.tsx        # Mobile tab bar navigation
│       ├── LandingPage.tsx      # Page 1: Brand presentation & customer authentication
│       ├── ProductCard.tsx      # Reusable grocery item card with stock controls
│       ├── ProductDetailModal.tsx # Full product detail view with similar items
│       ├── AddressModal.tsx     # Hyderabad delivery address manager
│       ├── CheckoutModal.tsx    # Payment and checkout drawer
│       ├── OrderTrackingModal.tsx # Real-time delivery timeline and rider details
│       ├── NotificationsModal.tsx # In-app notification drawer
│       ├── VoiceSearchModal.tsx # Interactive voice query simulation
│       ├── Toast.tsx            # Floating micro-interaction notifications
│       ├── screens/
│       │   ├── HomeScreen.tsx       # Storefront banners, categories & deals
│       │   ├── CategoriesScreen.tsx # Category browser with SKU listings
│       │   ├── SearchScreen.tsx     # Instant catalog search and suggestions
│       │   ├── CartScreen.tsx       # Bill breakdown, tips & coupon application
│       │   └── ProfileScreen.tsx    # Order history, wishlist & support helpdesk
│       └── admin/
│           ├── AdminLogin.tsx       # Dedicated admin authentication screen
│           └── AdminDashboard.tsx   # 10 KPI summary, orders, inventory & CRM
```

---

## 📄 License

This project is licensed under the [Apache-2.0 License](LICENSE).
