# CYBER PORTAL

> Threat Intelligence & Cybersecurity Learning Platform  
> Stack: Next.js 16 · Prisma 7 · PostgreSQL · JWT · TypeScript

---

## Setup rápido (local)

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
```
Edite `.env.local` com sua DATABASE_URL e JWT_SECRET.

### 3. Migrations + Seed
```bash
npx prisma migrate dev --name init
npx prisma db seed
```
Credenciais padrão: `merlin@cyberportal.dev` / `CyberPortal@2025!`

### 4. Rodar
```bash
npm run dev
# Acesse: http://localhost:3000/auth/login
```

---

## Rotas

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/auth/login` | Público | Handshake Login |
| `/portal` | Auth | Threat Universe |
| `/api/auth/login` | Público | POST — autenticação |
| `/api/auth/logout` | Auth | POST — encerra sessão |
| `/api/auth/me` | Auth | GET — sessão atual |

---

## Deploy (Vercel + Neon)

1. Crie banco no [Neon](https://neon.tech)
2. Configure env vars na Vercel: `DATABASE_URL` + `JWT_SECRET`
3. `vercel --prod`
4. `DATABASE_URL="..." npx prisma migrate deploy && npx prisma db seed`

---

## Segurança (OWASP)

- Bcrypt rounds=12
- JWT httpOnly cookie, SameSite=Strict
- Rate limiting login (5 req / 15 min / IP)
- Erros neutros, sem user enumeration
- Timing attack mitigation
- Zod validation
- Edge middleware para rotas protegidas
