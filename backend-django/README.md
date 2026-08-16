# SnapShop — Backend Django (راهنمای صفر تا صد)

> بک‌اند کامل پروژه SnapShop با **Django 5 + Django REST Framework**  
> سازگار با فرانت‌اند موجود — APIها همان قرارداد NestJS قبلی را حفظ کرده‌اند.

---

## فهرست

1. [این پروژه چیست؟](#۱-این-پروژه-چیست)
2. [ساختار پروژه](#۲-ساختار-پروژه)
3. [پیش‌نیازها](#۳-پیش‌نیازها)
4. [نصب و اجرا (گام‌به‌گام)](#۴-نصب-و-اجرا-گام‌به‌گام)
5. [پنل ادمین Django](#۵-پنل-ادمین-django)
6. [Swagger — مستندات API](#۶-swagger--مستندات-api)
7. [لیست کامل APIها](#۷-لیست-کامل-apiها)
8. [احراز هویت (Auth Flow)](#۸-احراز-هویت-auth-flow)
9. [اتصال فرانت‌اند به API (صفر تا صد)](#۹-اتصال-فرانت‌اند-به-api-صفر-تا-صد)
10. [نقش‌ها و دسترسی‌ها](#۱۰-نقش‌ها-و-دسترسی‌ها)
11. [Docker](#۱۱-docker)
12. [عیب‌یابی](#۱۲-عیب‌یابی)

---

## ۱. این پروژه چیست؟

**SnapShop** clone فروشگاه آنلاین شبیه Snapp Market است:

| بخش | تکنولوژی | وضعیت |
|-----|-----------|--------|
| Frontend | HTML + CSS + Vanilla JS | UI کامل، auth به API وصل |
| Backend | **Django + DRF** | کامل (Auth, Category, Brand, Good) |
| Admin | Django Admin | ✅ |
| Docs | Swagger UI | ✅ `/docs` |
| Cache OTP | Redis (یا LocMem در dev) | ✅ |

### چرا Django؟

- پنل ادمین آماده برای مدیریت محصولات
- ORM قدرتمند + migration
- Swagger با `drf-spectacular`
- توسعه سریع‌تر CRUD

---

## ۲. ساختار پروژه

```
supermarket-backend-main/
├── frontend/                    # UI (تغییر minimal)
│   └── src/SnappMarket/
│       ├── index.html
│       ├── login.html
│       └── assets/js/
│           ├── config.js        # baseURL → http://127.0.0.1:8000/api
│           └── modules/auth/    # register, OTP, profile
│
└── backend-django/              # ← بک‌اند جدید
    ├── manage.py
    ├── requirements.txt
    ├── .env.example
    ├── docker-compose.yaml
    ├── snapshop/                # settings, urls
    ├── accounts/                # User, Auth, JWT
    └── catalog/                 # Category, Brand, Good
```

---

## ۳. پیش‌نیازها

- Python 3.11+
- pip
- (اختیاری) Docker + Docker Compose
- (اختیاری) Redis — اگر نباشد OTP در حافظه محلی ذخیره می‌شود

---

## ۴. نصب و اجرا (گام‌به‌گام)

### گام ۱ — رفتن به پوشه بک‌اند

```bash
cd backend-django
```

### گام ۲ — ساخت virtual environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### گام ۳ — نصب dependencies

```bash
pip install -r requirements.txt
```

> اگر `mysqlclient` روی Windows خطا داد، در `.env` مقدار `DB_ENGINE=sqlite` بگذار (پیش‌فرض).

### گام ۴ — تنظیم environment

```bash
copy .env.example .env
```

فایل `.env` را باز کن و حداقل این‌ها را پر کن:

```env
DEBUG=True
SECRET_KEY=یک-رشته-تصادفی-طولانی
ACCESS_TOKEN_SECRET=access-secret-key
REFRESH_TOKEN_SECRET=refresh-secret-key
DB_ENGINE=sqlite
REDIS_URL=
```

### گام ۵ — migration و seed

```bash
python manage.py migrate
python manage.py seed_owner
```

**Owner پیش‌فرض:**
- شماره: `09111111111`
- رمز ادمین: `admin1234`

### گام ۶ — اجرای سرور

```bash
cd backend-django
.\venv\Scripts\Activate.ps1
python manage.py runserver 8000
```

✅ API: `http://127.0.0.1:8000/api`  
✅ Swagger: `http://127.0.0.1:8000/docs`  
✅ Admin: `http://127.0.0.1:8000/admin`

---

## ۵. پنل ادمین Django

1. برو به: `http://127.0.0.1:8000/admin`
2. Login:
   - **Username:** `09111111111`
   - **Password:** `admin1234`
3. از پنل می‌توانی:
   - کاربران را مدیریت کنی
   - دسته‌بندی / برند / محصول اضافه کنی
   - موجودی و قیمت را ویرایش کنی

---

## ۶. Swagger — مستندات API

بعد از اجرای سرور:

👉 **http://127.0.0.1:8000/docs**

در Swagger:
- همه endpointها با method و body
- تست مستقیم API
- برای endpointهای protected ابتدا `verify-by-phone` بزن تا cookie ست شود

---

## ۷. لیست کامل APIها

Base URL: `http://127.0.0.1:8000/api`

### Auth — `/api/auth/`

| Method | Path | Auth | توضیح |
|--------|------|------|-------|
| POST | `/auth/register-by-phone` | ❌ | ارسال OTP |
| POST | `/auth/verify-by-phone` | ❌ | تأیید OTP + cookie |
| POST | `/auth/refresh-token` | ❌ (cookie) | تمدید token |

**register-by-phone body:**
```json
{ "phone": "09123456789" }
```

**Response (DEBUG=True):**
```json
{ "message": "otp sent to your phone", "otp": "12345" }
```

**verify-by-phone body:**
```json
{ "phone": "09123456789", "otp": "12345" }
```

**Response + Cookies:**
```json
{ "success": true }
```
Cookies: `X-JWT-ACCESS`, `X-JWT-REFRESH`

---

### Users — `/api/users/`

| Method | Path | Auth | توضیح |
|--------|------|------|-------|
| GET | `/users/me` | ✅ cookie | اطلاعات کاربر |
| PUT | `/users/update-profile` | ✅ cookie | ویرایش پروفایل |

**update-profile body:**
```json
{
  "firstName": "علی",
  "lastName": "رضایی",
  "birthDate": "1995-05-20",
  "gender": "man"
}
```

---

### Category — `/api/category/`

| Method | Path | Auth | Role |
|--------|------|------|------|
| GET | `/category/` | ❌ | public |
| GET | `/category/{id}/` | ❌ | public |
| POST | `/category/` | ✅ | owner, admin |
| PUT | `/category/{id}/` | ✅ | owner, admin |
| DELETE | `/category/{id}/` | ✅ | owner, admin |

**Query params (list):**
- `page=1`
- `limit=20`
- `filter.title=$ilike:لبنیات`

---

### Brand — `/api/brand/`

| Method | Path | Auth |
|--------|------|------|
| GET | `/brand/` | ✅ |
| GET | `/brand/{id}/` | ✅ |
| POST | `/brand/` | ✅ |
| PUT | `/brand/{id}/` | ✅ |
| DELETE | `/brand/{id}/` | ✅ |

**create body:**
```json
{
  "name": "کاله",
  "description": "برند لبنیات",
  "categoryId": "uuid-of-category"
}
```

---

### Good (Product) — `/api/good/`

| Method | Path | Auth | Role (create) |
|--------|------|------|---------------|
| GET | `/good/` | ✅ | — |
| GET | `/good/{id}/` | ✅ | — |
| POST | `/good/` | ✅ | owner, admin |
| PUT/PATCH | `/good/{id}/` | ✅ | — |
| DELETE | `/good/{id}/` | ✅ | — |

**create body:**
```json
{
  "title": "شیر کم چرب 1 لیتری",
  "price": 45000,
  "discountPercent": 10,
  "stockQuantity": 100,
  "isAvailable": true,
  "categoryId": "uuid",
  "brandId": "uuid"
}
```

**Query params (list):**
- `search=شیر`
- `categoryId=uuid`
- `brandId=uuid`
- `isAvailable=true`

---

## ۸. احراز هویت (Auth Flow)

```
┌──────────┐    POST /register-by-phone     ┌──────────┐
│ Frontend │ ────────────────────────────►│  Django  │
│          │◄──────────────────────────────│          │
└──────────┘    { otp: "12345" } (dev)     └──────────┘
      │
      │  POST /verify-by-phone { phone, otp }
      ▼
┌──────────┐    Set-Cookie: X-JWT-ACCESS   ┌──────────┐
│ Frontend │◄──────────────────────────────│  Django  │
│          │    Set-Cookie: X-JWT-REFRESH  │          │
└──────────┘    { success: true }          └──────────┘
      │
      │  GET /users/me (credentials: include)
      ▼
   نمایش نام کاربر / redirect
```

- Token در **httpOnly cookie** ذخیره می‌شود (امن‌تر از localStorage)
- Access token: 1 ساعت
- Refresh token: 30 روز
- اگر 401 بگیرد → `fetchApi` خودکار `/auth/refresh-token` را صدا می‌زند

---

## ۹. اتصال فرانت‌اند به API (صفر تا صد)

> این بخش برای فرانت‌اند دولوپر نوشته شده — چطور UI موجود را به API وصل کند.

---

### ۹.۱ عکس محصولات از کجا می‌آید؟

#### وضعیت فعلی: **استاتیک — نه از API**

الان عکس‌ها داخل خود فرانت هستند:

```
frontend/src/SnappMarket/assets/img/
├── 1.webp, 2.webp, ... 73.webp
├── default.webp
└── ...
```

در HTML به‌صورت hardcode استفاده شده:

```html
<img class="banner-product__image" src="assets/img/25.webp" alt="محصول" />
```

| موضوع | وضعیت |
|-------|--------|
| عنوان، قیمت، تخفیف | داخل HTML نوشته شده — از API نمی‌آید |
| API محصول `/api/good/` | فیلد **image** ندارد |
| آپلود عکس | هنوز پیاده نشده |

#### راه‌حل‌های ممکن

| روش | توضیح |
|-----|-------|
| **فاز ۱ (سریع)** | عکس را با `slug` یا index محصول map کن — `{index}.webp` در assets |
| **فاز ۲ (درست)** | فیلد `image` به مدل Good اضافه شود + آپلود در Admin |
| **فاز ۳** | S3 / CDN برای production |

**تا وقتی image به API اضافه نشده:**

```javascript
const getProductImage = (product, index = 0) => {
  const imgNum = (index % 73) + 1;
  return `assets/img/${imgNum}.webp`;
};
```

---

### ۹.۲ چه چیزهایی به API وصل شده؟

| بخش | وضعیت | فایل |
|-----|--------|------|
| ثبت‌نام / OTP | ✅ وصل | `modules/auth/auth.js` |
| پروفایل کاربر | ✅ وصل | `modules/auth/auth.js` |
| navbar (نام کاربر) | ✅ وصل | `modules/auth/getcurrentuser.js` |
| لیست محصولات | ❌ static HTML | — |
| دسته‌بندی | ❌ static HTML | `category.js` خالی |
| سبد خرید | ❌ static HTML | — |
| جستجو | ❌ static HTML | — |

**Config API:**

```javascript
// frontend/src/SnappMarket/assets/js/config.js
export const baseURL = "http://127.0.0.1:8000/api";
```

---

### ۹.۳ اجرای همزمان Backend + Frontend

```powershell
# Terminal 1 — Backend
cd backend-django
.\venv\Scripts\Activate.ps1
python manage.py runserver 8000

# Terminal 2 — Frontend (Live Server در VS Code)
# پوشه: frontend/src/SnappMarket/
# آدرس: http://127.0.0.1:5500/index.html
```

---

### ۹.۴ قانون طلایی: Cookie-based Auth

برای **همه** requestهای protected:

```javascript
fetch(url, {
  credentials: "include",  // ← حتماً — JWT cookie فرستاده می‌شود
  headers: { "Content-Type": "application/json" },
});
```

تابع آماده در پروژه:

```javascript
import { fetchApi } from "./modules/utils/utils.js";
// خودکار refresh-token می‌زند اگر 401 بگیرد
```

---

### ۹.۵ جزئیات APIها برای فرانت

#### AUTH

**`POST /auth/register-by-phone`** — Public

```json
// Request
{ "phone": "09123456789" }

// Response 200
{ "message": "otp sent to your phone", "otp": "12345" }
// otp فقط در DEBUG=True — production پیامک می‌رود

// Response 429 — OTP قبلاً ارسال شده، ۲ دقیقه صبر کن
```

**`POST /auth/verify-by-phone`** — Public

```json
// Request
{ "phone": "09123456789", "otp": "12345" }

// Response 200 + Cookies: X-JWT-ACCESS, X-JWT-REFRESH
{ "success": true }
```

**`POST /auth/refresh-token`** — Public (نیاز به cookie refresh)

```json
{ "success": true }
```

---

#### USERS — نیاز به login

**`GET /users/me`**

```json
{
  "id": "uuid",
  "firstName": "زهرا",
  "lastName": "گلابی",
  "phone": "09123456789",
  "role": "user",
  "email": null,
  "gender": "woman",
  "birthDate": "1995-05-20",
  "createdAt": "2026-08-15T...",
  "updatedAt": "2026-08-15T..."
}
```

**`PUT /users/update-profile`**

```json
{
  "firstName": "زهرا",
  "lastName": "گلابی",
  "birthDate": "1995-05-20",
  "gender": "woman"
}
```

---

#### CATEGORY — Public (بدون login)

**`GET /category/?page=1&limit=20&filter.title=$ilike:لبنیات`**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "لبنیات",
      "description": "شیر، ماست، پنیر",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "meta": {
    "itemsPerPage": 20,
    "totalItems": 5,
    "currentPage": 1,
    "totalPages": 1
  }
}
```

---

#### GOOD (Product) — نیاز به login ⭐

**`GET /good/?page=1&limit=20&search=شیر&categoryId=uuid&isAvailable=true`**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "شیر کم چرب 1 لیتری",
      "slug": "shir-kom-charb-1-litri",
      "description": "شیر pasteurized",
      "weightVolume": "1L",
      "barcode": "1234567890",
      "price": 45000,
      "discountPercent": 10,
      "stockQuantity": 100,
      "isAvailable": true,
      "isFeatured": false,
      "isHealthy": false,
      "unit": "عدد",
      "brandId": "uuid",
      "categoryId": "uuid",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "meta": { "itemsPerPage": 20, "totalItems": 10, "currentPage": 1, "totalPages": 1 }
}
```

> **توجه:** فیلد `image` وجود ندارد — عکس از assets محلی map شود.

**`GET /good/{id}/`** — جزئیات یک محصول

**`POST /good/`** — owner/admin (ایجاد از Admin یا Swagger)

---

#### BRAND — نیاز به login

**`GET /brand/`** — لیست برندها

```json
{
  "id": "uuid",
  "name": "کاله",
  "description": "برند لبنیات",
  "categoryId": "uuid-of-category"
}
```

---

### ۹.۶ Flow کاربر (Auth — قبلاً وصل شده)

```
login.html
   │  POST /auth/register-by-phone
   ▼
passwordLogin.html
   │  POST /auth/verify-by-phone  → Cookie JWT
   ▼
register.html (اگر firstName/lastName نداشت)
   │  PUT /users/update-profile
   ▼
index.html
   │  GET /users/me
```

---

### ۹.۷ وارد کردن داده تست (Admin)

1. http://127.0.0.1:8000/admin
2. Login: `09111111111` / `admin1234`
3. Category اضافه کن (مثلاً «لبنیات»)
4. Brand اضافه کن (مثلاً «کاله»)
5. Good اضافه کن (چند محصول با قیمت)

---

### ۹.۸ کد نمونه — `products.js`

```javascript
// frontend/src/SnappMarket/assets/js/modules/products/products.js
import { baseURL } from "../../config.js";
import { fetchApi } from "../utils/utils.js";

export const getProducts = async (page = 1, limit = 20) => {
  const res = await fetchApi(`${baseURL}/good/?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
};

export const getProductsByCategory = async (categoryId) => {
  const res = await fetchApi(`${baseURL}/good/?categoryId=${categoryId}`);
  return res.json();
};

export const searchProducts = async (query) => {
  const res = await fetchApi(`${baseURL}/good/?search=${encodeURIComponent(query)}`);
  return res.json();
};

export const getProduct = async (id) => {
  const res = await fetchApi(`${baseURL}/good/${id}/`);
  return res.json();
};

export const getProductImage = (product, index = 0) => {
  const imgNum = (index % 73) + 1;
  return `assets/img/${imgNum}.webp`;
};

export const getFinalPrice = (product) => {
  if (!product.discountPercent) return product.price;
  return Math.round(product.price * (1 - product.discountPercent / 100));
};

export const formatPrice = (price) => price.toLocaleString("fa-IR") + " تومان";
```

---

### ۹.۹ کد نمونه — Render محصولات

```javascript
// frontend/src/SnappMarket/assets/js/modules/products/render.js
import { getProducts, getProductImage, getFinalPrice, formatPrice } from "./products.js";

const renderProductCard = (product, index) => {
  const finalPrice = getFinalPrice(product);
  const hasDiscount = product.discountPercent > 0;

  return `
    <div class="banner-product__info product-card__item" data-id="${product.id}">
      <div class="banner-product__image-wapper product-card__image">
        ${hasDiscount ? `<span class="banner-product__discount">${product.discountPercent}%</span>` : ""}
        <img class="banner-product__image"
             src="${getProductImage(product, index)}"
             alt="${product.title}" />
        <div class="banner-product__add-btn">
          <button class="add-to-cart-btn" data-id="${product.id}">+</button>
        </div>
      </div>
      <span class="banner-product__title-product">${product.title}</span>
      <span class="banner-product__price-current">${formatPrice(finalPrice)}</span>
      ${hasDiscount ? `<del class="banner-product__price-old">${formatPrice(product.price)}</del>` : ""}
    </div>
  `;
};

export const loadAndRenderProducts = async (containerSelector) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const { data: products } = await getProducts(1, 20);
  container.innerHTML = products.map(renderProductCard).join("");
};
```

**صدا زدن در homepage:**

```javascript
import { loadAndRenderProducts } from "./modules/products/render.js";

document.addEventListener("DOMContentLoaded", () => {
  loadAndRenderProducts(".product-card__wrapper");
});
```

---

### ۹.۱۰ کد نمونه — دسته‌بندی

```javascript
// frontend/src/SnappMarket/assets/js/modules/utils/category/category.js
import { baseURL } from "../../config.js";

export const getCategories = async () => {
  const res = await fetch(`${baseURL}/category/`); // public
  return res.json();
};

export const renderCategories = async (containerSelector) => {
  const { data: categories } = await getCategories();
  const container = document.querySelector(containerSelector);
  container.innerHTML = categories.map(cat => `
    <a href="CategoriesPage.html?category=${cat.id}" class="category-item">
      ${cat.title}
    </a>
  `).join("");
};
```

---

### ۹.۱۱ ساختار پیشنهادی JS

```
assets/js/
├── config.js                    ← baseURL
├── app.js                       ← UI events
└── modules/
    ├── auth/
    │   ├── auth.js              ✅ موجود
    │   └── getcurrentuser.js    ✅ موجود
    ├── utils/
    │   ├── utils.js             ✅ fetchApi + refresh
    │   └── category/category.js 🆕 پر شود
    └── products/
        ├── products.js          🆕 API calls
        └── render.js            🆕 DOM rendering
```

---

### ۹.۱۲ چک‌لیست اتصال فرانت

```
□ backend روی port 8000 اجرا شود
□ config.js → baseURL = http://127.0.0.1:8000/api
□ Auth flow تست شود (login → OTP → index)
□ از Admin چند Category + Good اضافه شود
□ products.js و render.js ساخته شود
□ عکس با mapping local وصل شود (API image ندارد)
□ CategoriesPage از GET /category/ استفاده کند
□ fetchApi + credentials:"include" در همه requestها
□ Swagger تست شود: http://127.0.0.1:8000/docs
```

---

### ۹.۱۳ اولویت کار فرانت

| اولویت | کار | API |
|--------|-----|-----|
| 1 | Auth | ✅ done |
| 2 | Dynamic products | `GET /good/` |
| 3 | Categories | `GET /category/` |
| 4 | Cart | localStorage (API ندارد) |
| 5 | Search | `GET /good/?search=` |

### نکته CORS

Backend `CORS_ALLOW_ALL_ORIGINS=True` و `credentials=True` دارد — فرانت از هر port محلی کار می‌کند.

---

## ۱۰. نقش‌ها و دسترسی‌ها

| Role | توضیح |
|------|-------|
| `owner` | دسترسی کامل + admin panel |
| `admin` | CRUD category/good |
| `user` | کاربر عادی |
| `seller` | (آینده) فروشنده |

---

## ۱۱. Docker

```bash
cd backend-django
copy .env.example .env
docker compose up -d
```

سرویس‌ها:
- API → `:8000`
- MySQL → `:3306`
- Redis → `:6379`

---

## ۱۲. عیب‌یابی

| مشکل | راه‌حل |
|------|--------|
| CORS error | backend را restart کن، origin را چک کن |
| 401 on /users/me | cookie ست نشده — دوباره verify-by-phone |
| OTP نمی‌آید | در DEBUG، OTP در response JSON است |
| Redis error | `REDIS_URL=` خالی بگذار (LocMem) |
| mysqlclient install fail | `DB_ENGINE=sqlite` |
| فرانت به API وصل نمی‌شود | port 8000 و `config.js` را چک کن |

---

## خلاصه دستورات

```bash
cd backend-django
python -m venv venv
.\venv\Scripts\Activate.ps1          # Windows
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py seed_owner
python manage.py runserver 8000
```

**URLs:**
- API: http://127.0.0.1:8000/api
- Swagger: http://127.0.0.1:8000/docs
- Admin: http://127.0.0.1:8000/admin

---

## مقایسه با نسخه قبلی (NestJS)

| Feature | NestJS (حذف‌شده) | Django (backend-django/) |
|---------|-------------------|--------------------------|
| Auth OTP | ✅ | ✅ |
| Category CRUD | ✅ | ✅ |
| Brand CRUD | ❌ stub | ✅ کامل |
| Good CRUD | ❌ stub | ✅ کامل |
| Admin Panel | ❌ | ✅ |
| Swagger | ✅ dev only | ✅ همیشه |
| stockQuantity | ❌ bug | ✅ |

> بک‌اند فعال پروژه: **`backend-django/`**
