# 🛍️ SnapShop

> UI complete · JavaScript in progress · Django backend ready

---

## 🌐 Live Demo

👉 [https://supermarket-backend-sigma.vercel.app/](https://supermarket-backend-sigma.vercel.app/)

---

## 📊 Project Status

| Layer | Status |
|-------|--------|
| 🎨 UI/UX | ✅ Complete |
| ⚡ JavaScript | 🔄 In development |
| 🗄️ Backend | ✅ Django API ready |

---

## 📖 About

This is my **first real frontend project** — a complete, mobile-first clone of Snap Food Store.  
Built over 6 months of learning, failing, and figuring things out.  

**I didn't stop at the design. I'm taking it all the way.**

---

## ✅ Features

### Frontend
- [x] Full homepage with product grid and categories
- [x] Shopping cart and product detail pages
- [x] Fully responsive (mobile, tablet, desktop)
- [x] Dark/Light mode toggle
- [x] Persian RTL design
- [ ] Cart logic (add, remove, update) — *in progress*
- [ ] LocalStorage persistence — *in progress*
- [ ] Live search and filtering — *in progress*

### Backend (Django REST API)
- [x] JWT authentication via HTTP-only cookies
- [x] OTP phone verification
- [x] Category, Brand, Product CRUD
- [x] User profile management
- [x] Swagger API documentation
- [x] Admin panel

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5 · CSS3 · Vanilla JavaScript |
| Backend | Django · Django REST Framework |
| Auth | JWT · HTTP-only cookies |
| Database | SQLite / MySQL |
| Tools | SweetAlert2 · LocalStorage · dotenv |

---

## 🚀 Quick Start

### Backend Setup

```bash
cd backend-django
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py seed_owner
python manage.py runserver 8000
