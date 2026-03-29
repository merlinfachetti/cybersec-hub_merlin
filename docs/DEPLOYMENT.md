# 🚀 Deployment Guide

## Vercel (Recomendado)

### 1. Prepare o Projeto

```bash
# Certifique-se de que tudo está commitado
git add .
git commit -m "feat: ready for deployment"
git push origin main
```

### 2. Configure o Banco de Dados

Opções:

- **Supabase** (PostgreSQL grátis)
- **Railway** (PostgreSQL com plano gratuito)
- **Neon** (Serverless PostgreSQL)

#### Exemplo com Supabase:

1. Crie uma conta em https://supabase.com
2. Crie um novo projeto
3. Copie a Connection String
4. Configure no Vercel

### 3. Deploy no Vercel

1. Acesse https://vercel.com
2. Importe o repositório do GitHub
3. Configure as variáveis de ambiente:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="https://seu-dominio.vercel.app"
```

`NEXT_PUBLIC_APP_URL` deve apontar para o domínio canônico de produção. O layout usa esse valor para `metadataBase`, Open Graph e Twitter cards.

4. Configure Build Settings:
   - Framework: Next.js
   - Node.js Version: `22.x`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Deploy!

### 4. Execute Migrations

No Vercel Dashboard:

- Settings → Functions → Add Environment Variable
- Adicione: `PRISMA_MIGRATE_SKIP_SEED=true`

Execute migrations via CLI:

```bash
vercel env pull .env.local
npm run db:migrate
npm run db:seed
```

## Railway

### 1. Setup

```bash
npm install -g @railway/cli
railway login
```

### 2. Deploy

```bash
railway init
railway up
```

### 3. Add PostgreSQL

```bash
railway add
# Selecione PostgreSQL
```

### 4. Configure

Railway irá automaticamente:

- Configurar DATABASE_URL
- Executar build
- Deploy da aplicação

## Docker (Self-Hosted)

### 1. Create Dockerfile

```dockerfile
FROM node:22-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

### 2. Build and Run

```bash
docker build -t cybersec-hub .
docker run -p 3000:3000 -e DATABASE_URL="..." cybersec-hub
```

## Checklist Pré-Deploy

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Build local funcionando (`npm run build`)
- [ ] Migrations aplicadas
- [ ] Seed executado (se necessário)
- [ ] Type checking sem erros (`npm run type-check`)
- [ ] Linting sem erros (`npm run lint`)
- [ ] Testes passando (se houver)

## Troubleshooting

### Build Falha no Vercel

```bash
# Limpe o cache
vercel --force

# Verifique os logs
vercel logs
```

### Prisma Client não gerado

Adicione ao `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Database Connection Issues

Verifique:

1. DATABASE_URL está correta
2. IP whitelisting (Supabase/Railway)
3. SSL mode: `?sslmode=require`
