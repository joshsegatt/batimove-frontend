# Batimove — frontend

Client and ops UI for [batimove.ch](https://www.batimove.ch), a Swiss moving platform.

React + Vite app for quotes, contact, and business-lead capture. Talks to a separate API (local proxy on `:8000` in development).

## Scope

- Multi-step moving quote
- Contact and B2B lead forms
- Dark / light themes
- Production site: [batimove.ch](https://www.batimove.ch)

## Stack

React 19 · Vite 6 · TypeScript · Tailwind · Framer Motion · React Router 7

## Local

```bash
npm install
npm run dev
```

API target:

- Dev — Vite proxy → `http://localhost:8000/api`
- Prod — set `VITE_API_URL` or the base URL in `services/api.ts`

```bash
# .env.local
VITE_API_URL=https://your-api.example/api
```

```bash
npm run build    # output: dist/
```

## License

Built for Batimove. Product source — not a template to republish.
