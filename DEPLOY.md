# 🚀 Deploy Frontend no Railway

## Passo a Passo

### 1. Criar Repositório no GitHub

```bash
# Criar novo repositório em: https://github.com/new
# Nome: batimove-frontend
```

### 2. Conectar ao GitHub

```bash
cd C:\Users\josh\Desktop\batimove-saas
git remote add origin https://github.com/joshsegatt/batimove-frontend.git
git branch -M main
git push -u origin main
```

### 3. Deploy no Railway

1. Acesse: https://railway.app/
2. **New Project** → **Deploy from GitHub repo**
3. Selecione: `batimove-frontend`
4. Railway vai detectar Vite automaticamente
5. **Deploy!**

### 4. Configurar Variáveis (Opcional)

Se precisar de variáveis de ambiente:
- `VITE_API_URL` = `https://web-production-4353a.up.railway.app/api`

Mas já está configurado no código para usar Railway em produção!

---

## ✅ Pronto!

Sua URL será algo como:
`https://batimove-frontend-production.up.railway.app`

## 🧪 Testar

Depois do deploy:
1. Acesse a URL do Railway
2. Teste o formulário de Quote
3. Verifique no console do navegador se as chamadas API estão funcionando

---

**Backend**: https://web-production-4353a.up.railway.app
**Frontend**: (URL que o Railway vai gerar)
