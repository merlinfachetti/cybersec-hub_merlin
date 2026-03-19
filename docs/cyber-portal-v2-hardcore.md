# CYBER PORTAL — V2 HARDCORE (Senior-Level Product Spec)

## 0. Visão Estratégica
Cyber Portal é uma plataforma de:
- Threat Intelligence (simulada)
- Cybersecurity Learning (hands-on)
- Behavioral UX (Red / Blue / Purple mindset)

Objetivo: servir como PORTFÓLIO REAL de transição para cybersecurity.

---

## 1. Arquitetura (Senior View)

Frontend + Backend unificado (Next.js)

Flow:

User → Login UI → Auth API → Session → Protected Dashboard → Data Layer (Prisma)

Camadas:

- Presentation (UI/UX cinematográfica)
- Application (handlers, services)
- Domain (threats, labs, users)
- Infrastructure (DB, auth, APIs)

---

## 2. Segurança (OWASP mindset)

Implementar:

- Rate limiting (login)
- Generic error messages (no user leak)
- Input validation (Zod)
- Secure session (httpOnly cookies)
- Password hashing (bcrypt)
- CSRF protection

---

## 3. Autenticação

Opções:

A) NextAuth (rápido)
B) JWT custom (mais controle)

Fluxo:

1. User envia credenciais
2. Backend valida
3. Cria session/token
4. Retorna cookie seguro
5. Middleware protege rotas

---

## 4. Dados (Prisma)

Modelos iniciais:

User:
- id
- email
- password
- role

Threat:
- id
- title
- severity
- type

Lab:
- id
- title
- difficulty

---

## 5. UX avançada

Login:
- Handshake visual
- Botão tricolor (estado semântico)

Portal:
- Universe navigation
- Context panel
- Mode switching (Red/Blue/Purple)

---

## 6. Diferencial de mercado

Este projeto demonstra:

- Engenharia fullstack
- Cybersecurity thinking
- UI diferenciada
- Arquitetura real

---

## 7. Roadmap Hardcore

Sprint 1:
- Migrar UI

Sprint 2:
- Auth real + segurança

Sprint 3:
- Prisma + dados

Sprint 4:
- UX refinada

Sprint 5:
- Deploy + observabilidade

---

## 8. Como vender isso

Pitch:

"I built a cybersecurity-focused platform combining threat visualization, secure authentication, and a domain-driven UI aligned with Red/Blue/Purple team concepts."

---

## 9. Critério de excelência

- UI premium
- Auth segura
- Arquitetura limpa
- Código legível
- Deploy funcional
