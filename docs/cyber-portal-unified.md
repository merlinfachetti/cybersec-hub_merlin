# CYBER PORTAL — Unified Product (Portal + Backend)
Version: v1.0 (Desktop-first)

## 0) Recap
Unificar duas apps:
- Vite (UI cinematográfica: Login + Threat Universe)
- Next.js (backend, Prisma, APIs)

## 1) Objetivo
Criar **um único produto fullstack** com:
- Login real (auth)
- Portal protegido
- UI premium
- Base de dados (Prisma)

## 2) Arquitetura Final
Frontend + Backend em Next.js

Next.js (App Router)
- UI (migrada do Vite)
- Auth (NextAuth/JWT)
- API Routes
- Prisma (DB)

## 3) Decisões-chave
- Desktop-first (>=1024px)
- Mobile bloqueado (tela temática)
- BG por imagem + noise (fidelidade)
- Contract-first API

## 4) Integração (passo a passo)
4.1 Migrar UI
- Copiar Vite /src → /app ou /components no Next

4.2 Autenticação
- Substituir mock
- Implementar NextAuth ou JWT

4.3 API
- POST /auth/login
- GET /user
- GET /threats

4.4 Proteção
- Middleware para rotas privadas

## 5) UX
Login:
- Handshake animation
- Botão tricolor

Portal:
- Threat Universe
- Painel contextual

## 6) Critério de Sucesso
- Login funcional
- Portal protegido
- UI fiel ao mock

## 7) Roadmap
Sprint 1: Migração UI
Sprint 2: Auth
Sprint 3: API
Sprint 4: UX polish

## 8) Valor de Portfólio
- Fullstack moderno
- Cybersecurity mindset
- UI avançada
