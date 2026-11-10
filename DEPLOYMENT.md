# Deployment guide

Three parts are hosted separately:

| Part | Service (free options) | Notes |
|---|---|---|
| Database | MySQL-compatible, e.g. TiDB Cloud Starter | gives you a connection URL, user and password |
| Backend | Render (Docker) | free instances sleep after ~15 min idle |
| Frontend | Vercel or Netlify | needs `VITE_API_URL` = the backend address |

## Backend environment variables
| Name | Value |
|---|---|
| `DB_URL` | `jdbc:mysql://HOST:PORT/DATABASE?sslMode=VERIFY_IDENTITY` (from your database provider) |
| `DB_USERNAME` | database user |
| `DB_PASSWORD` | database password |
| `JWT_SECRET` | any random text, at least 32 characters |
| `CLINIC_CORS_ALLOWED_ORIGINS` | your frontend address, e.g. `https://smita-dental.vercel.app` |

## Frontend environment variable (set before building)
| Name | Value |
|---|---|
| `VITE_API_URL` | your backend address, e.g. `https://smita-dental-api.onrender.com` (no trailing slash) |
