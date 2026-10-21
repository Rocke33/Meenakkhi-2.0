# 🌸 Meenakkhi Sarees (মীনাক্ষী) — Premium Handloom E-Commerce

A full-stack, responsive luxury e-commerce web platform celebrating Bangladeshi handloom heritage. Built with modern web technologies, real-time inventory and cart synchronization, specialized university campus delivery routing, and native Bangladeshi mobile financial services (bKash, Nagad, and Cash on Delivery).

---

## 👨‍💻 Developer Information

- **Developer:** Md Rocke Ahamed
- **Institution:** Jahangirnagar University
- **Department:** Department of Computer Science and Engineering (CSE)

---

## ✨ Key Features

- **🏛️ Luxury Brand Experience:** Aarong-inspired aesthetic, royal maroon hero banners, bilingual typography (Bengali & English), and fluid responsive layouts across mobile, tablet, and desktop viewports.
- **⚡ Real-Time Cart Synchronization:** Powered by Supabase Realtime for instant badge count updates and multi-tab synchronization.
- **🎓 Smart Campus & Residential Delivery Routing:**
  - **University Campus Delivery:** Pre-configured residential halls with **Free Delivery (৳0)** for Jahangirnagar University (JU) and standard rates for other universities.
  - **Residential Delivery:** Dynamic division and zila cascading selection with automatic delivery charge calculation (৳80 inside Dhaka, ৳130 across Bangladesh).
- **💳 Local Bangladeshi Payment Integration:** Native support for **Cash on Delivery (COD)**, **bKash Personal**, and **Nagad Personal** with transaction ID (TrxID) verification.
- **📦 Admin Management Terminal:** Secure, key-protected merchant console for order tracking, delivery status updates, product publishing, category management, and printable dispatch statement vouchers.
- **🔍 Instant Saree Search & Filter:** Debounced search bar with live catalog suggestions and weave filtering (Katan Silk, Dhakai Jamdani, Rajshahi Silk, Muslin, Bridal Collection).
- **⭐ Customer Reviews & Rating System:** User review submissions and star rating metrics calculated dynamically per saree.
- **📱 Fully Responsive Mobile Navigation:** Fixed top navbar, bottom mobile navigation bar, and accessible slide-out boutique drawer.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** React Icons (`react-icons/fi`)
- **Build Tool:** Vite 8
- **Backend & Database:** Supabase (PostgreSQL, Supabase Auth, Storage, Realtime)
- **Routing:** React Router DOM v7

---

## 📁 Project Structure

```text
Menakkhi2.0/
├── public/                  # Static assets & brand media
│   ├── bkash.png            # bKash vector logo
│   ├── nagad.png            # Nagad vector logo
│   ├── logo.png             # Meenakkhi emblem
│   └── saree-campaign.png   # Campaign hero photography
├── src/
│   ├── assets/              # Local icons and SVGs
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx       # Fixed responsive top & mobile bottom navbar
│   │   ├── SearchBar.tsx    # Debounced live search component
│   │   ├── Hero.tsx         # Responsive desktop/mobile showcase
│   │   ├── ProductCard.tsx  # Luxury saree card with 4:5 aspect ratio
│   │   ├── ProductGrid.tsx  # Responsive catalog grid with skeletons
│   │   ├── CheckoutForm.tsx # Cascading location & payment checkout
│   │   └── Footer.tsx       # Boutique footer with payment partners
│   ├── context/
│   │   └── CartContext.tsx  # Real-time shopping cart state provider
│   ├── hooks/               # Custom React hooks (useCartActions, network)
│   ├── pages/               # Route pages
│   │   ├── Home.tsx         # Landing page with hero & featured lanes
│   │   ├── Products.tsx     # Full catalog with sort & filter
│   │   ├── ProductDetails.tsx # Multi-image gallery, reviews & details
│   │   ├── Cart.tsx         # Shopping cart & checkout modal wrapper
│   │   ├── Admin.tsx        # Protected merchant backoffice console
│   │   ├── Profile.tsx      # Customer account & purchase vouchers
│   │   ├── Orders.tsx       # Top-selling live trends
│   │   ├── Login.tsx        # Customer authentication
│   │   └── Register.tsx     # Member registration
│   ├── supabaseClient.ts    # Supabase SDK client configuration
│   ├── App.tsx              # Application root & route configuration
│   └── main.tsx             # Entry point
├── index.html
├── package.json
└── vite.config.ts