# CYBERSEC HUB

> Plataforma de aprendizado e prática em Cybersecurity  
> **signal > noise** — foco no que importa, sem ruído.

[![Deploy](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)](https://cyberseclab.aldenmerlin.com)
[![Stack](https://img.shields.io/badge/stack-Next.js_16_·_Prisma_7_·_PostgreSQL-blue)](#stack)

---

## O problema que este projeto resolve

A área de cybersecurity tem um problema sério de fragmentação do conhecimento. Quem está aprendendo ou transitando para a área precisa lidar com:

- **Certificações espalhadas** (CompTIA, OSCP, CEH, AWS Security...) sem um mapa claro de progressão
- **Trilhas conflitantes** — Red Team vs Blue Team vs Purple Team, cada uma com seu vocabulário próprio
- **Conteúdo genérico** que não conecta teoria com prática real
- **Falta de contexto operacional** — saber o que é uma técnica de ataque, mas não saber como detectar ou responder a ela
- **Portais corporativos** com visual antiquado que não comunicam a postura e a seriedade do domínio

O CyberSec Hub é a resposta: uma plataforma que organiza o aprendizado em cybersecurity através de uma metáfora visual coerente (o universo de ameaças), unifica as trilhas Red/Blue/Purple sem tribalismo, e entrega uma interface que comunica a atmosfera e a seriedade do domínio.

---

## O que é o CyberSec Hub

Uma plataforma fullstack de **aprendizado em cybersecurity** com foco em prática e progressão real. Pensada como portfólio pessoal de transição de carreira, mas construída com arquitetura e UX de produto.

### Módulos principais

| Módulo | Descrição |
|--------|-----------|
| **Threat Universe** | Dashboard principal — mapa interativo (canvas 2D) com nós representando labs, lessons, sinais e milestones por postura. Pan, zoom, hover com flare e sonar. |
| **Handshake Login** | Autenticação como ritual — botão tricolor vivo (Red/Blue/Purple), animação de handshake, sem leak de informação nos erros. |
| **Certificações** | Catálogo mapeado por área com filtros, comparativo e trilha de progressão. |
| **Roadmap** | Trilha personalizada por time com checkpoints e próximos passos. |
| **Cyber Times** | Guia sobre Red/Blue/Purple — o que fazem, o que não fazem, skills e certs por postura. |
| **Recursos** | Biblioteca de ferramentas, artigos e referências curadas por domínio. |
| **Mercado** | Dados de vagas, faixas salariais e tendências do setor. |
| **Perfil** | Progresso pessoal, bio e o modal YOU'RE HERE com narrativa do usuário. |

---

## Diferenciais de design

### Interface cinemática
Rejeita o visual "dashboard corporativo batido". Estética inspirada em War Rooms reais:
- Fundo galáxia com nebulosa, grain e vignette
- Glassmorphism controlado, não genérico
- Glow suave ("luz no ar", não neon agressivo)
- Modos Red/Blue/Purple que alteram cor, linguagem e foco do conteúdo

### Threat Universe (canvas 2D)
O universo navegável onde cada elemento tem massa (impacto), órbita (recência) e cor (domínio). Você não navega por menus — você navega por posturas.

- Pulsação desincronizada por nó (frequência própria de cada astro)
- Lens flare horizontal com spikes saindo para fora
- Sonar rings expandindo nos nós ativos
- Centro interativo: YOU'RE · ● · HERE em layout vertical com hover laranja

### YOU'RE HERE modal
Clicar no centro da galáxia (ou no nome do autor no footer) abre um modal narrativo — não uma bio técnica, mas uma história em texto vivo com pulse animation por linha.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16.1.4 (App Router) |
| UI | React 19.2.3 + Tailwind CSS 4 + shadcn/ui |
| Auth | JWT via `jose` 6 + bcryptjs 3 (httpOnly cookies) |
| ORM | Prisma 7.2.0 |
| Banco | PostgreSQL (Neon serverless) |
| Validação | Zod 4 |
| Linguagem | TypeScript 5 |
| Deploy | Vercel (região fra1 — Frankfurt) |
| Canvas | Canvas 2D nativo (sem Three.js/WebGL) |

---

## Arquitetura

```
app/
├── (auth)/           # Login + Registro — sem nav, sem footer
│   └── auth/
│       ├── login/    # Handshake Login
│       └── register/ # Cadastro 4 etapas
├── (portal)/         # Threat Universe — sempre dark, isolado
│   └── threat-universe/
├── (hub)/            # Portal principal — MainNav + SiteFooter
│   ├── home/
│   ├── teams/
│   ├── profile/
│   └── docs/api
└── (careers)/
    ├── certifications/
    ├── roadmap/
    ├── resources/
    └── market/

components/
├── main-nav.tsx       # Header com nav, logo, search, theme toggle
├── site-footer.tsx    # Footer com role-gating (Docs só para ADMIN/DEV)
├── merlin-modal.tsx   # YOU'RE HERE — modal narrativo com pulse animation
└── signal-lost.tsx    # Mobile gate (viewport < 1024px)

lib/
├── auth.ts            # JWT: create, verify, session cookie
├── prisma.ts          # Singleton Prisma client
└── use-inactivity.ts  # Logout automático 30min + localStorage persistence
```

Route Groups isolam layouts radicalmente diferentes:
- `(auth)` — canvas animado, sempre dark, sem header
- `(portal)` — fullscreen canvas, cp-dark-zone imune ao light mode
- `(hub)` / `(careers)` — MainNav + SiteFooter, light/dark mode

---

## Segurança (OWASP mindset)

| Controle | Implementação |
|----------|--------------|
| Senhas | bcrypt rounds=12 |
| Sessões | JWT httpOnly + SameSite=Strict, TTL 8h (7d com "remember device") |
| Erros neutros | Sem user enumeration — mensagem genérica para credenciais inválidas |
| Validação | Zod em todos os endpoints de entrada |
| Middleware | Edge middleware valida JWT em cada request protegido |
| Inatividade | Logout automático após 30min com `localStorage` persistence |

---

## Roles

| Role | Acesso |
|------|--------|
| `STUDENT` | Portal completo |
| `ANALYST` | Portal completo |
| `ADMIN` | Tudo + Docs (DEV) |
| `DEV` | Tudo + Docs (DEV) |

---

## Setup local

```bash
# 1. Instalar
git clone https://github.com/merlinfachetti/cybersec-lab.git
cd cybersec-lab
npm install

# 2. Env vars
cp .env.example .env.local
# Preencher DATABASE_URL e JWT_SECRET

# 3. Banco
npx prisma migrate deploy
npx prisma db seed

# 4. Rodar
npm run dev
# http://localhost:3000 → /auth/login → /home
```

---

## API

| Endpoint | Método | Auth | Descrição |
|----------|--------|------|-----------|
| `/api/auth/login` | POST | Público | Autenticação · retorna cookie JWT |
| `/api/auth/register` | POST | Público | Cadastro de novo usuário |
| `/api/auth/signout` | GET | Auth | Logout · deleta sessão + cookie |
| `/api/auth/me` | GET | Auth | Sessão atual (usuário + role) |
| `/api/auth/validate` | GET | Auth | Valida JWT no banco |
| `/api/auth/update-password` | POST | Auth | Atualiza senha |

---

## Deploy (Vercel + Neon)

```bash
# 1. Banco no Neon (https://neon.tech)
# 2. Env vars na Vercel: DATABASE_URL + JWT_SECRET
vercel --prod
DATABASE_URL="..." npx prisma migrate deploy
```

```json
// vercel.json
{ "framework": "nextjs", "regions": ["fra1"] }
```

---

## Desktop-first

Experiência projetada para laptop/desktop (≥ 1024px). Em telas menores, um Signal Gate substitui a UI — sem experiência quebrada, sem responsividade forçada.

---

## Roadmap

- [ ] Study status com dados reais do perfil
- [ ] Integração da trilha roadmap.sh (cybersecurity path)
- [ ] Labs interativos com sandbox
- [ ] Testes de integração (Vitest + Supertest)
- [ ] WebGL/Three.js como opção B para background

---

## Autor

**Alden Merlin** — Engenheiro de software em transição para cybersecurity.  
Portfólio construído com intenção: cada decisão técnica e de produto documenta a mentalidade de quem entende os dois lados — o de quem constrói sistemas e o de quem precisa protegê-los.

> *"Segurança não é um estado. É uma guerra constante."*

---

*signal > noise*
