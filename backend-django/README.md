# SnapShop — راهنمای کامل Backend + API + Frontend

> Django 5 · Django REST Framework · Swagger · Admin Panel  
> سازگار با فرانت HTML/CSS/JS موجود در پوشه `frontend/`

---

## فهرست

| # | بخش |
|---|-----|
| 1 | [شروع سریع](#۱-شروع-سریع) |
| 2 | [کانفیگ Backend و Frontend](#۲-کانفیگ-backend-و-frontend) |
| 3 | [ساختار پروژه](#۳-ساختار-پروژه) |
| 4 | [Swagger — مستندات زنده API](#۴-swagger--مستندات-زنده-api) |
| 5 | [مرجع API](#۵-مرجع-api) |
| 6 | [Auth Flow](#۶-auth-flow) |
| 7 | [اتصال فرانت‌اند (صفر تا صد)](#۷-اتصال-فرانت‌اند-صفر-تا-صد) |
| 8 | [Admin Panel](#۸-admin-panel) |
| 9 | [Docker](#۹-docker) |
| 10 | [عیب‌یابی](#۱۰-عیب‌یابی) |

---

## ۱. شروع سریع

### Backend

```powershell
cd backend-django
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py seed_owner
python manage.py runserver 8000
```

**Owner پیش‌فرض:** `09111111111` / `admin1234`

### Frontend

1. پوشه `frontend/src/SnappMarket/` را با **Live Server** باز کن
2. آدرس: `http://127.0.0.1:5500/index.html`
3. Backend باید روی `http://127.0.0.1:8000` در حال اجرا باشد

### آدرس‌های مهم

| سرویس | URL |
|-------|-----|
| API Base | http://127.0.0.1:8000/api |
| Swagger | http://127.0.0.1:8000/docs |
| Admin | http://127.0.0.1:8000/admin |
| Schema JSON | http://127.0.0.1:8000/api/schema/ |

**ورود Admin:** `09111111111` / `admin1234`

---

## ۲. کانفیگ Backend و Frontend

### ۲.۱ Backend — فایل `.env`

```powershell
cd backend-django
copy .env.example .env
```

| متغیر | توضیح | مقدار پیشنهادی (dev) |
|-------|--------|----------------------|
| `DEBUG` | حالت توسعه | `True` |
| `SECRET_KEY` | کلید امنیتی Django | رشته تصادفی طولانی |
| `PORT` | پورت سرور | `8000` |
| `DB_ENGINE` | نوع دیتابیس | `sqlite` (ساده) یا `mysql` |
| `REDIS_URL` | کش OTP | خالی بگذار (LocMem) یا `redis://127.0.0.1:6379/0` |
| `ACCESS_TOKEN_SECRET` | کلید JWT access | رشته تصادفی |
| `REFRESH_TOKEN_SECRET` | کلید JWT refresh | رشته تصادفی |
| `OWNER_PHONE` | شماره owner | `09111111111` |

**نمونه `.env` برای شروع سریع:**

```env
DEBUG=True
SECRET_KEY=dev-secret-key-change-in-production
DB_ENGINE=sqlite
REDIS_URL=
ACCESS_TOKEN_SECRET=access-secret-dev
REFRESH_TOKEN_SECRET=refresh-secret-dev
OWNER_PHONE=09111111111
```

**MySQL (اختیاری):**

```env
DB_ENGINE=mysql
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=snapshop
MYSQL_USER=snapshop
MYSQL_PASSWORD=1234
```

---

### ۲.۲ Frontend — فایل `config.js`

مسیر: `frontend/src/SnappMarket/assets/js/config.js`

```javascript
export const baseURL = "http://127.0.0.1:8000/api";
```

| محیط | baseURL |
|------|---------|
| Local dev | `http://127.0.0.1:8000/api` |
| Production | `https://your-domain.com/api` |

> **مهم:** اگر port backend عوض شد، فقط همین یک فایل را تغییر بده.

---

### ۲.۳ قوانین اتصال Frontend به API

```javascript
// ✅ درست — cookie JWT فرستاده می‌شود
fetch(`${baseURL}/users/me`, {
  credentials: "include",
  headers: { "Content-Type": "application/json" },
});

// ✅ بهتر — از helper پروژه استفاده کن (auto refresh-token)
import { fetchApi } from "./modules/utils/utils.js";
const res = await fetchApi(`${baseURL}/users/me`);

// ❌ غلط — بدون credentials، 401 می‌گیری
fetch(`${baseURL}/users/me`);
```

---

## ۳. ساختار پروژه

```
supermarket-backend-main/
├── frontend/src/SnappMarket/
│   ├── index.html              # homepage (محصولات static)
│   ├── login.html              # ✅ به API وصل
│   ├── assets/js/
│   │   ├── config.js           # ← baseURL
│   │   └── modules/auth/       # ✅ auth modules
│
└── backend-django/
    ├── manage.py
    ├── .env.example
    ├── snapshop/settings.py
    ├── accounts/               # User + Auth + JWT
    └── catalog/                # Category + Brand + Good
```

---

## ۴. Swagger — مستندات زنده API

👉 **http://127.0.0.1:8000/docs**

| Tag | محتوا |
|-----|-------|
| Auth | register, verify, refresh-token |
| Users | me, update-profile |
| Category | CRUD دسته‌بندی |
| Brand | CRUD برند |
| Good | CRUD محصول |

**تست Auth در Swagger:**
1. `POST /auth/register-by-phone` → OTP در response (dev)
2. `POST /auth/verify-by-phone` → cookie ست می‌شود
3. بقیه endpointها را تست کن

---

## ۵. مرجع API

**Base URL:** `http://127.0.0.1:8000/api`

---

### ۵.۱ Auth

| Method | Path | Auth | توضیح |
|--------|------|------|-------|
| POST | `/auth/register-by-phone` | ❌ | ارسال OTP |
| POST | `/auth/verify-by-phone` | ❌ | تأیید OTP + cookie |
| POST | `/auth/refresh-token` | cookie | تمدید access token |

<details>
<summary><b>POST /auth/register-by-phone</b></summary>

```json
// Request
{ "phone": "09123456789" }

// Response 200
{ "message": "otp sent to your phone", "otp": "12345" }

// Response 429 — OTP قبلاً ارسال شده
{ "message": "Too many request", "statusCode": 429 }
```

</details>

<details>
<summary><b>POST /auth/verify-by-phone</b></summary>

```json
// Request
{ "phone": "09123456789", "otp": "12345" }

// Response 200 + Cookies
{ "success": true }
// Set-Cookie: X-JWT-ACCESS, X-JWT-REFRESH
```

</details>

---

### ۵.۲ Users

| Method | Path | Auth |
|--------|------|------|
| GET | `/users/me` | ✅ cookie |
| PUT | `/users/update-profile` | ✅ cookie |

<details>
<summary><b>GET /users/me — Response</b></summary>

```json
{
  "id": "uuid",
  "firstName": "زهرا",
  "lastName": "گلابی",
  "phone": "09123456789",
  "role": "user",
  "gender": "woman",
  "birthDate": "1995-05-20",
  "createdAt": "...",
  "updatedAt": "..."
}
```

</details>

<details>
<summary><b>PUT /users/update-profile — Request</b></summary>

```json
{
  "firstName": "زهرا",
  "lastName": "گلابی",
  "birthDate": "1995-05-20",
  "gender": "woman"
}
```

`gender`: `"man"` | `"woman"`

</details>

---

### ۵.۳ Category — دسته‌بندی ⭐

| Method | Path | Auth | Role |
|--------|------|------|------|
| GET | `/category/` | ❌ Public | — |
| GET | `/category/{id}/` | ❌ Public | — |
| POST | `/category/` | ✅ | owner, admin |
| PUT | `/category/{id}/` | ✅ | owner, admin |
| PATCH | `/category/{id}/` | ✅ | owner, admin |
| DELETE | `/category/{id}/` | ✅ | owner, admin |

<details>
<summary><b>GET /category/ — لیست (Public)</b></summary>

**Query params:**

| Param | مثال | توضیح |
|-------|------|-------|
| `page` | `1` | شماره صفحه |
| `limit` | `20` | تعداد در صفحه |
| `filter.title` | `$ilike:لبنیات` | جستجو در عنوان |

**Request:**
```
GET /api/category/?page=1&limit=20
GET /api/category/?filter.title=$ilike:لبنیات
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "a1b2c3d4-....",
      "title": "لبنیات",
      "description": "شیر، ماست، پنیر",
      "createdAt": "2026-08-15T10:00:00+03:30",
      "updatedAt": "2026-08-15T10:00:00+03:30"
    }
  ],
  "meta": {
    "itemsPerPage": 20,
    "totalItems": 1,
    "currentPage": 1,
    "totalPages": 1
  },
  "links": { "current": "http://127.0.0.1:8000/api/category/" }
}
```

**Frontend (بدون login):**
```javascript
import { baseURL } from "../../config.js";

const res = await fetch(`${baseURL}/category/`);
const { data: categories } = await res.json();
```

</details>

<details>
<summary><b>GET /category/{id}/ — جزئیات (Public)</b></summary>

**Request:**
```
GET /api/category/a1b2c3d4-e89b-12d3-a456-426614174000/
```

**Response 200:**
```json
{
  "id": "a1b2c3d4-e89b-12d3-a456-426614174000",
  "title": "لبنیات",
  "description": "شیر، ماست، پنیر",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Response 404:** دسته‌بندی پیدا نشد

</details>

<details>
<summary><b>POST /category/ — ایجاد (owner/admin)</b></summary>

**Request:**
```json
{
  "title": "لبنیات",
  "description": "شیر، ماست، پنیر"
}
```

**Response 201:** همان object دسته‌بندی

**Response 400:** title تکراری

</details>

<details>
<summary><b>PUT /category/{id}/ — ویرایش کامل (owner/admin)</b></summary>

**Request:**
```json
{
  "title": "لبنیات و بستنی",
  "description": "محصولات لبنی"
}
```

</details>

<details>
<summary><b>PATCH /category/{id}/ — ویرایش جزئی (owner/admin)</b></summary>

**Request:**
```json
{ "description": "توضیح جدید" }
```

</details>

<details>
<summary><b>DELETE /category/{id}/ — حذف (owner/admin)</b></summary>

**Response 204:** بدون body (soft delete)

</details>

---

### ۵.۴ Brand — برند

| Method | Path | Auth |
|--------|------|------|
| GET | `/brand/` | ✅ |
| GET | `/brand/{id}/` | ✅ |
| POST | `/brand/` | ✅ |
| PUT/PATCH | `/brand/{id}/` | ✅ |
| DELETE | `/brand/{id}/` | ✅ |

**POST body:**
```json
{
  "name": "کاله",
  "description": "برند لبنیات",
  "categoryId": "uuid-of-category"
}
```

---

### ۵.۵ Good — محصول

| Method | Path | Auth | Role (create) |
|--------|------|------|---------------|
| GET | `/good/` | ✅ | — |
| GET | `/good/{id}/` | ✅ | — |
| POST | `/good/` | ✅ | owner, admin |
| PUT/PATCH | `/good/{id}/` | ✅ | — |
| DELETE | `/good/{id}/` | ✅ | — |

**Query params (GET list):**

| Param | مثال |
|-------|------|
| `page` | `1` |
| `limit` | `20` |
| `search` | `شیر` |
| `categoryId` | `uuid` |
| `brandId` | `uuid` |
| `isAvailable` | `true` |

**Response نمونه:**
```json
{
  "data": [{
    "id": "uuid",
    "title": "شیر کم چرب 1 لیتری",
    "slug": "shir-kom-charb-1-litri",
    "price": 45000,
    "discountPercent": 10,
    "stockQuantity": 100,
    "isAvailable": true,
    "categoryId": "uuid",
    "brandId": "uuid"
  }],
  "meta": { "currentPage": 1, "totalItems": 10, "totalPages": 1 }
}
```

> **توجه:** فیلد `image` در API وجود ندارد — عکس از assets محلی map شود.

**POST body:**
```json
{
  "title": "شیر کم چرب 1 لیتری",
  "price": 45000,
  "discountPercent": 10,
  "stockQuantity": 100,
  "categoryId": "uuid",
  "brandId": "uuid"
}
```

---

## ۶. Auth Flow

```
login.html
  │ POST /auth/register-by-phone { phone }
  ▼
passwordLogin.html
  │ POST /auth/verify-by-phone { phone, otp }
  │ → Cookie: X-JWT-ACCESS + X-JWT-REFRESH
  ▼
register.html (اگر firstName/lastName نبود)
  │ PUT /users/update-profile
  ▼
index.html
  │ GET /users/me
```

| Token | Cookie | مدت |
|-------|--------|-----|
| Access | `X-JWT-ACCESS` | 30 دقیقه (cookie) / 1 ساعت (JWT) |
| Refresh | `X-JWT-REFRESH` | 30 روز |

---

## ۷. اتصال فرانت‌اند (صفر تا صد)

### ۷.۱ وضعیت فعلی

| بخش | API | وضعیت |
|-----|-----|--------|
| Login / OTP | Auth | ✅ وصل |
| پروفایل | Users | ✅ وصل |
| دسته‌بندی | Category | ❌ static HTML |
| محصولات | Good | ❌ static HTML |
| عکس محصول | — | ❌ static در `assets/img/` |
| سبد خرید | — | ❌ API ندارد |

---

### ۷.۲ عکس محصولات

**الان:** عکس‌ها static در `frontend/src/SnappMarket/assets/img/` (1.webp تا 73.webp)

```html
<!-- فعلی — hardcode در HTML -->
<img src="assets/img/25.webp" />
```

**راه‌حل موقت تا اضافه شدن image به API:**

```javascript
export const getProductImage = (product, index = 0) => {
  const imgNum = (index % 73) + 1;
  return `assets/img/${imgNum}.webp`;
};
```

---

### ۷.۳ اتصال دسته‌بندی — `category.js`

```javascript
// frontend/src/SnappMarket/assets/js/modules/utils/category/category.js
import { baseURL } from "../../config.js";

export const getCategories = async (page = 1, limit = 50) => {
  const res = await fetch(`${baseURL}/category/?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("خطا در دریافت دسته‌بندی‌ها");
  return res.json();
};

export const getCategory = async (id) => {
  const res = await fetch(`${baseURL}/category/${id}/`);
  return res.json();
};

export const renderCategories = async (selector) => {
  const { data } = await getCategories();
  document.querySelector(selector).innerHTML = data.map(cat => `
    <a href="CategoriesPage.html?category=${cat.id}" class="category-item">
      ${cat.title}
    </a>
  `).join("");
};
```

---

### ۷.۴ اتصال محصولات — `products.js`

```javascript
import { baseURL } from "../../config.js";
import { fetchApi } from "../utils/utils.js";

export const getProducts = async (page = 1, limit = 20) => {
  const res = await fetchApi(`${baseURL}/good/?page=${page}&limit=${limit}`);
  return res.json();
};

export const getProductsByCategory = async (categoryId) => {
  const res = await fetchApi(`${baseURL}/good/?categoryId=${categoryId}`);
  return res.json();
};

export const formatPrice = (price) => price.toLocaleString("fa-IR") + " تومان";

export const getFinalPrice = (p) =>
  p.discountPercent
    ? Math.round(p.price * (1 - p.discountPercent / 100))
    : p.price;
```

---

### ۷.۵ Render در homepage

```javascript
import { getProducts, getFinalPrice, formatPrice } from "./products.js";

export const loadProducts = async (selector) => {
  const { data } = await getProducts();
  document.querySelector(selector).innerHTML = data.map((p, i) => `
    <div class="product-card__item" data-id="${p.id}">
      <img src="assets/img/${(i % 73) + 1}.webp" alt="${p.title}" />
      <span>${p.title}</span>
      <span>${formatPrice(getFinalPrice(p))}</span>
    </div>
  `).join("");
};
```

---

### ۷.۶ چک‌لیست فرانت دولوپر

```
□ Backend روی :8000 اجرا شود
□ config.js → baseURL درست باشد
□ Auth flow تست شود
□ از Admin: Category + Good اضافه شود
□ GET /category/ بدون login کار کند
□ GET /good/ با login (cookie) کار کند
□ fetchApi + credentials:"include" استفاده شود
□ Swagger تست شود: /docs
```

---

## ۸. Admin Panel

1. http://127.0.0.1:8000/admin
2. Login: `09111111111` / `admin1234`
3. Category → Brand → Good را اضافه کن

---

## ۹. Docker

```powershell
cd backend-django
copy .env.example .env
docker compose up -d
```

| سرویس | Port |
|-------|------|
| API | 8000 |
| MySQL | 3306 |
| Redis | 6379 |

---

## ۱۰. عیب‌یابی

| مشکل | علت | راه‌حل |
|------|-----|--------|
| Swagger `/docs` خطا | باگ schema generation | ✅ fix شده — server را restart کن |
| `NoneType has no attribute method` | Swagger هنگام generate schema | ✅ fix شده در `CategoryViewSet` |
| CORS error | backend خاموش | `runserver 8000` |
| 401 Unauthorized | cookie نیست | login → verify-by-phone |
| OTP نمی‌آید | Redis نیست | `REDIS_URL=` خالی در `.env` |
| Category خالی | دیتا نیست | از Admin اضافه کن |
| Good نیاز به login | طراحی API | اول login، بعد fetch با cookie |
| عکس نمی‌آید | API image ندارد | mapping local از assets |
| mysqlclient error | Windows | `DB_ENGINE=sqlite` |

**تست schema:**
```powershell
python manage.py spectacular --file schema.yaml
# باید Errors: 0 باشد
```

---

## نقش‌ها

| Role | دسترسی |
|------|--------|
| `owner` | همه چیز + admin |
| `admin` | CRUD category/brand/good |
| `user` | کاربر عادی |

---

## خلاصه دستورات

```powershell
cd backend-django
.\venv\Scripts\Activate.ps1
python manage.py runserver 8000
```

| URL | |
|-----|--|
| API | http://127.0.0.1:8000/api |
| Swagger | http://127.0.0.1:8000/docs |
| Admin | http://127.0.0.1:8000/admin |
