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
9. [اتصال فرانت‌اند به API](#۹-اتصال-فرانت‌اند-به-api)
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

## ۹. اتصال فرانت‌اند به API

### تنظیمات فعلی (تغییر minimal)

فایل `frontend/src/SnappMarket/assets/js/config.js`:

```javascript
export const baseURL = "http://127.0.0.1:8000/api";
```

### اجرای فرانت

فرانت HTML استاتیک است. با **Live Server** (VS Code) یا هر static server:

1. پوشه `frontend/src/SnappMarket/` را serve کن
2. مثلاً: `http://127.0.0.1:5500/SnappMarket/login.html`
3. مطمئن شو backend روی `8000` در حال اجراست

### فایل‌های JS متصل به API

| فایل | API |
|------|-----|
| `modules/auth/auth.js` | register, verify, update-profile |
| `modules/auth/getcurrentuser.js` | GET /users/me |
| `modules/utils/utils.js` | fetchApi + refresh-token |

### Flow کاربر در فرانت

1. `login.html` → شماره موبایل → `POST /auth/register-by-phone`
2. OTP در popup نمایش داده می‌شود (فقط dev)
3. `passwordLogin.html` → OTP → `POST /auth/verify-by-phone`
4. اگر firstName/lastName نداشت → `register.html`
5. `PUT /users/update-profile` → redirect به `index.html`

### نکته CORS

Backend `CORS_ALLOW_ALL_ORIGINS=True` و `credentials=True` دارد — فرانت از هر port محلی کار می‌کند.

### اتصال محصولات به API (مرحله بعد — اختیاری)

فرانت فعلاً محصولات static در HTML دارد. برای dynamic کردن:

```javascript
import { baseURL } from "../../config.js";
import { fetchApi } from "../utils/utils.js";

const loadProducts = async () => {
  const res = await fetchApi(`${baseURL}/good/?page=1&limit=20`);
  const json = await res.json();
  const products = json.data; // paginated
  // render در DOM
};
```

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
