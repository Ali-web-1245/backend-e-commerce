# E-Commerce Backend (Express + MongoDB Atlas + Mongoose)

React frontend ka REST API backend. Har response ka format consistent hai:

```json
{ "success": true|false, "data": ..., "message": "..." }
```

## Setup

```bash
npm install

# 1. .env example copy karein aur real values daalein
cp .env.example .env

# 2. .env me MONGO_URI apni MongoDB Atlas connection string dalayen:
#    mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority

# 3. Seed data daalein (frontend ke static products + default admin account):
npm run seed

# 4. Server chalayen:
npm run dev      # development (node --watch)
npm start        # production
```

## Images approach (placeholder hosting)

Seed data me har product ka `image` Cloudinary-style URL hota hai. Abhi **picsum.photos seeded URLs** use ho rahe hain (deterministic placeholder images, turant render hote hain):

`https://picsum.photos/seed/<naam>/600/750`

Jab Cloudinary account setup ho, to images upload kar ke har product ka `image` (aur `gallery`) URL admin API se ya seed data me replace kar dein.

## Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | List + filters: `category`, `minPrice`, `maxPrice`, `sort` (`newest`, `price-asc`, `price-desc`, `rating`, `most-popular`), `q`, `exclude`, `page`, `limit` |
| GET | `/api/products/:id` | Public | Single product |
| POST | `/api/products` | Admin (JWT) | Product create |
| PUT | `/api/products/:id` | Admin (JWT) | Product update |
| DELETE | `/api/products/:id` | Admin (JWT) | Product delete |
| POST | `/api/orders` | Public | Place order (total server-side recompute hota hai) |
| GET | `/api/orders` | Admin (JWT) | All orders |
| POST | `/api/auth/register` | Public | User register → returns `{ user, token }` |
| POST | `/api/auth/login` | Public | User login → returns `{ user, token }` |
| POST | `/api/admin/login` | Public | Admin login → returns `{ admin, token }` (role: `admin`) |

Admin-protected routes `Authorization: Bearer <token>` header chahte hain.

## CORS

`.env` me `ALLOWED_ORIGINS` comma-separated list hai — customer frontend aur admin dashboard dono ke Vercel URLs yahan add karein. Development me `http://localhost:5173` (Vite default) already listed hai.

## Default Admin (seed)

- email: `ADMIN_EMAIL` (.env) — default `admin@example.com`
- password: `ADMIN_PASSWORD` (.env) — default `Admin@12345`
