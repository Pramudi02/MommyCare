# MommyCare Backend

Node.js + Express + MongoDB backend with Socket.io and AI proxy to FastAPI.

## Quick Start

1. Install dependencies

```bash
cd backend
npm install
```

2. Configure environment

Copy `env.example` to `.env` and edit values:

```bash
cp env.example .env
```

3. Run in development

```bash
npm run dev
```

- API: `http://localhost:5000`
- Health: `http://localhost:5000/health`

## Tech
- Express, Mongoose
- JWT Auth
- Socket.io for real-time messaging
- FastAPI AI proxy at `AI_SERVICE_URL`

## Scripts
- `npm run dev` - start with nodemon
- `npm start` - start without nodemon
