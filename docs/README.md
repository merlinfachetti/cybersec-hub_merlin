# CYBERSEC HUB — Documentação

## Índice

### Produto & Visão
- [Fundações e Conceitos](./foundantions.md)
- [UI/UX Decisions v1](./cyber-portal-uiux-decisions-v1.md)
- [Conceito: Threat Universe](./concepts_threat-universe.md)
- [Conceito: Handshake Login](./concepts_handshake-login.md)
- [Produto Unificado](./cyber-portal-unified.md)
- [V2 Hardcore Spec](./cyber-portal-v2-hardcore.md)

### Arquitetura Técnica
- [Arquitetura Detalhada](./detailed-technical-architecture.md)
- [Estrutura de Pastas](./folder-structure.md)
- [Design Tokens](./design-tokens.css)

### API
- [Endpoints REST](./api-endpoints-restful.md)

### Deploy & Operações
- [Deployment Guide](./DEPLOYMENT.md)
- [Instalação de Dependências](./install-key-dependencies.md)
- [Estratégia de Entrega](./delivery-strategy.md)

### Dados
- [Seed Inicial de Dados](./Initial-data-mockup_seed.md)

### Análise
- [Escopo e Tempo](./scope-and-time-analysis.md)
- [Checklist de Validação](./validation-checklist.md)
- [Features Futuras](./advanced-features_future-phases.md)

---

## Rotas da Aplicação

```
/                     → redirect → /home
/home                 → Hub central (pós-login)
/auth/login           → Autenticação
/threat-universe      → Portal galático (Threat Universe)
/certifications       → Certificações de cybersecurity
/certifications/:id   → Detalhe da certificação
/roadmap              → Career roadmap
/resources            → Recursos de estudo
/market               → Mercado e salários
/profile              → Perfil do usuário
/docs/*               → Documentação (esta pasta)
```

## Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui + inline styles (portal)
- **Auth**: JWT (jose) + httpOnly cookies
- **DB**: PostgreSQL (Neon) + Prisma 7.x
- **Deploy**: Vercel (fra1 region)

## Times

| Time | Cor | Foco |
|------|-----|------|
| 🔴 Red Team | `#e53e3e` | Offensive security, pen testing, exploits |
| 🔵 Blue Team | `#3b82f6` | Defensive security, detection, response |
| 🟣 Purple Team | `#8b5cf6` | Integration, continuous improvement, feedback loop |
