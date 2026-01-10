# Batimove SaaS - Frontend

Frontend React/Vite para a plataforma Batimove.

## 🚀 Deploy Rápido

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar dev server
npm run dev

# Build para produção
npm run build
```

## 🔗 Backend API

O frontend se conecta ao backend em:
- **Local**: `http://localhost:8000/api` (via proxy Vite)
- **Produção**: Configure em `services/api.ts`

## 📦 Stack

- React 19
- Vite 6
- TypeScript
- Tailwind CSS (via classes inline)
- Framer Motion
- React Router v7
- Lucide Icons

## 🎨 Features

- Multi-step quote form
- Contact form
- Business leads capture
- Responsive design
- Dark/Light themes
- Smooth animations

## ⚙️ Configuração

### Atualizar URL do Backend

Edite `services/api.ts`:

```typescript
const API_BASE = import.meta.env.PROD 
  ? 'https://seu-backend.vercel.app/api'  // URL do backend deployado
  : '/api';  // Proxy local
```

## 📝 Variáveis de Ambiente

Crie `.env.local`:

```bash
VITE_API_URL=https://seu-backend.vercel.app/api
```

## 🚢 Deploy na Vercel

1. Push para GitHub
2. Conecte na Vercel
3. Configure build:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy!

---

**Desenvolvido para Batimove** 🚚
