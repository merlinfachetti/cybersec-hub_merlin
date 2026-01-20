// Certificação
Certification {
  id: string
  name: string (ex: "CEH - Certified Ethical Hacker")
  provider: string (ex: "EC-Council")
  level: enum (entry, intermediate, advanced, expert)
  category: enum (offensive, defensive, governance, forensics, cloud)
  description: string
  prerequisites: Certification[] (relação)
  skills: Skill[]
  estimatedStudyHours: number
  validityYears: number
  renewalRequired: boolean
  cost: CostByRegion[]
  recognitionByMarket: MarketRecognition[]
  officialUrl: string
  studyResources: Resource[]
}

// Custo por Região
CostByRegion {
  region: enum (brazil, europe, usa, asia)
  currency: string
  examCost: number
  trainingCost?: number
  renewalCost?: number
  lastUpdated: Date
}

// Reconhecimento de Mercado
MarketRecognition {
  region: enum
  demandLevel: enum (low, medium, high, critical)
  averageSalaryImpact: number
  topCompaniesRequiring: string[]
}

// Recurso de Estudo
Resource {
  title: string
  type: enum (course, book, lab, video, practice_exam)
  provider: string
  cost: number
  quality: number (1-5, baseado em reviews)
  url: string
  language: string[]
}

// Skill (Habilidade Técnica)
Skill {
  name: string (ex: "Network Security", "Python for Security")
  category: enum
  certifications: Certification[]
}
```

---

## 4. Funcionalidades Principais (MVP)

### Fase 1: Catálogo e Navegação
- [ ] Listagem de certificações com filtros (nível, categoria, custo, região)
- [ ] Página de detalhes de cada certificação
- [ ] Comparação lado a lado (até 3 certificações)
- [ ] Busca por nome/provider

### Fase 2: Caminhos de Carreira
- [ ] **Árvore de progressão interativa** (ex: CompTIA A+ → Network+ → Security+ → CEH)
- [ ] Sugestão de "próxima certificação" baseada no perfil
- [ ] Visualização de pré-requisitos e dependências

### Fase 3: Análise de Mercado
- [ ] Mapa interativo (continentes/países)
- [ ] Heatmap de demanda por certificação por região
- [ ] Comparação de salários médios por mercado

### Fase 4: Recursos de Estudo
- [ ] Lista de cursos/labs/materiais para cada certificação
- [ ] Avaliação de custo-benefício (melhor preço, melhor qualidade)
- [ ] Links diretos para provedores

### Fase 5: Personalização
- [ ] Perfil do usuário (experiência atual, objetivo, orçamento, timeline)
- [ ] Plano de estudos gerado automaticamente
- [ ] Tracking de progresso (quais certificações já possui, quais está estudando)

---

## 5. Caminho Natural de Certificações (Roadmap Técnico)

### 5.1 Para Seu Perfil (Dev Full-Stack → Cybersecurity com Python/JS)

#### **Nível Entry (Começar aqui)**
1. **CompTIA Security+** (SY0-701)
   - **Por quê**: Fundação de segurança, reconhecida globalmente, pre-req para muitas outras
   - **Foco**: CIA Triad, criptografia, network security, governance
   - **Custo**: ~$370 USD (exame)
   - **Tempo**: 2-3 meses estudando (você com background dev, menos)

2. **CompTIA Network+** (N10-009) [Opcional, mas recomendado]
   - **Por quê**: Se você não tem forte base em redes (TCP/IP, subnetting, routing)
   - **Pode pular se**: Já trabalhou com infraestrutura/cloud

#### **Nível Intermediate (Depois de Security+)**
3. **CEH - Certified Ethical Hacker** (v12)
   - **Por quê**: Introdução a pentesting, ferramentas (Metasploit, Nmap, Burp Suite), metodologia
   - **Foco**: Hacking ético, scanning, enumeration, exploitation
   - **Custo**: ~$1,199 USD (exame) ou ~$850 (com training)
   - **Tempo**: 3-4 meses

4. **GIAC Security Essentials (GSEC)** [Alternativa ao CEH]
   - **Por quê**: Mais técnico que CEH, focado em defesa
   - **Reconhecimento**: Forte nos EUA, especialmente governo

#### **Nível Advanced (Para Blue Team / Security Engineering)**
5. **OSCP - Offensive Security Certified Professional**
   - **Por quê**: Certificação hands-on, prova real de capacidade técnica, **muito valorizada**
   - **Foco**: Pentesting prático, exploitation, privilege escalation, post-exploitation
   - **Custo**: ~$1,649 USD (inclui lab de 90 dias)
   - **Tempo**: 6-12 meses (é difícil, exame de 24h de hacking real)
   - **Nota**: Exige Security+ ou CEH como base

6. **GIAC Web Application Penetration Tester (GWAPT)** [Se focar em web]
   - **Por quê**: Seu background full-stack brilha aqui (OWASP Top 10, XSS, SQLi, CSRF)

#### **Nível Expert (Times especializados Python/JS)**
7. **OSWE - Offensive Security Web Expert**
   - **Por quê**: Análise de código-fonte, exploração avançada de aplicações web
   - **Foco**: Code review, custom exploit development
   - **Exige**: OSCP + experiência em dev

8. **GIAC Python Coder (GPYC)** [Para automação de segurança]
   - **Por quê**: Foca em Python para security automation, análise de malware, scripts

9. **SANS SEC542 (Web App Penetration Testing)** ou **SEC660 (Advanced Penetration Testing)**
   - **Por quê**: Cursos SANS são caros (~$8k-10k), mas extremamente respeitados

---

### 5.2 Distinção por Mercado

| Certificação | Brasil | Europa | EUA | Ásia |
|-------------|--------|--------|-----|------|
| **CompTIA Security+** | ⭐⭐⭐ (reconhecida) | ⭐⭐⭐⭐ (muito valorizada) | ⭐⭐⭐⭐⭐ (obrigatória em muitos casos) | ⭐⭐⭐⭐ |
| **CEH** | ⭐⭐⭐⭐ (popular) | ⭐⭐⭐ (preferem OSCP) | ⭐⭐⭐ (reconhecida, mas OSCP > CEH) | ⭐⭐⭐⭐⭐ (muito valorizada) |
| **OSCP** | ⭐⭐⭐⭐⭐ (topo) | ⭐⭐⭐⭐⭐ (gold standard) | ⭐⭐⭐⭐⭐ (gold standard) | ⭐⭐⭐⭐ |
| **CISSP** | ⭐⭐⭐ (gestão) | ⭐⭐⭐⭐ (C-level) | ⭐⭐⭐⭐⭐ (management) | ⭐⭐⭐⭐ |
| **SANS/GIAC** | ⭐⭐ (pouco conhecido) | ⭐⭐⭐⭐ (forte) | ⭐⭐⭐⭐⭐ (topo, especialmente governo) | ⭐⭐⭐ |

**Insights**:
- **Brasil**: CEH tem muito peso, OSCP está crescendo, Security+ é bem vista
- **Europa (onde você está)**: OSCP é muito valorizado, SANS/GIAC também, CEH menos
- **EUA**: Security+ é baseline (especialmente para governo/DoD), OSCP/SANS são topo
- **Ásia**: CEH é muito popular, especialmente Índia/Singapura

---

## 6. Plano de Ação Imediato

### 6.1 Próximos 30 Dias (Validação e Setup)
1. **Semana 1-2**: Pesquisa e validação
   - [ ] Levantar todas as certificações relevantes (liste 20-30)
   - [ ] Pesquisar custos atuais (sites oficiais)
   - [ ] Criar planilha inicial no Google Sheets com dados estruturados

2. **Semana 3-4**: Protótipo do Portal
   - [ ] Setup do projeto (Next.js 15 + Prisma + PostgreSQL)
   - [ ] Criar schema do banco de dados
   - [ ] Implementar CRUD de certificações (admin panel básico)
   - [ ] Tela inicial com listagem e filtros

### 6.2 Próximos 90 Dias (MVP + Estudo para Security+)
- **Desenvolvimento do Portal** (2-3h/semana)
  - [ ] Implementar árvore de progressão (React Flow)
  - [ ] Adicionar recursos de estudo para cada certificação
  - [ ] Integrar mapa interativo (D3.js ou Mapbox)

- **Estudo para Security+** (10-15h/semana)
  - [ ] Curso: Professor Messer (YouTube, gratuito) ou Udemy (Jason Dion)
  - [ ] Livro: CompTIA Security+ Study Guide (Sybex)
  - [ ] Labs: TryHackMe (plataforma prática, gamificada)
  - [ ] Practice exams: ExamCompass (gratuito) + Dion Training

---

## 7. Wireframes e Mockups (Estrutura Visual)

### 7.1 Tela Principal - Dashboard
```
┌──────────────────────────────────────────────────────────┐
│  [Logo] Cybersecurity Certification Hub        [Profile] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Seu Caminho: Dev Full-Stack → Security Engineer         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━         │
│  [Security+] → [CEH] → [OSCP] → [OSWE]                   │
│  (Em andamento)                                          │
│                                                          │
│  Filtros:  [Nível ▼] [Categoria ▼] [Região ▼] [Custo ▼]  │
│                                                          │
│  ┌─────────────┬─────────────┬─────────────┐             │
│  │ Security+   │     CEH     │    OSCP     │             │
│  │ CompTIA     │  EC-Council │ Off. Sec    │             │
│  │ Entry       │ Intermediate│  Advanced   │             │
│  │ $370        │   $1,199    │   $1,649    │             │
│  │ [Detalhes]  │ [Detalhes]  │ [Detalhes]  │             │
│  └─────────────┴─────────────┴─────────────┘             │
│                                                          │
│  Mapa de Demanda por Região   [Ver Mapa Interativo →]    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 7.2 Tela de Detalhes de Certificação
```
┌──────────────────────────────────────────────────────────┐
│  ← Voltar     CompTIA Security+ (SY0-701)                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  📋 Visão Geral                                           │
│  Certificação de nível entry focada em fundamentos de    │
│  segurança. Reconhecida globalmente, é pré-requisito para│
│  muitas posições em cybersecurity.                       │
│                                                          │
│  ⚙️ Detalhes Técnicos                                     │
│  • Nível: Entry                                          │
│  • Pré-requisitos: Nenhum (recomendado: Network+)        │
│  • Validade: 3 anos (CE required)                        │
│  • Duração do exame: 90 minutos                          │
│  • Questões: 90 (múltipla escolha + performance-based)   │
│                                                          │
│  💰 Custos por Região                                     │
│  • Brasil: R$ 1,850 (exame) | R$ 3,500 (com treinamento) │
│  • Europa: €370 (exame) | €1,200 (com treinamento)       │
│  • EUA: $370 (exame) | $1,500 (com treinamento)          │
│                                                          │
│  📚 Melhores Recursos                                     │
│  1. Professor Messer (YouTube) - Gratuito ⭐⭐⭐⭐⭐       │
│  2. Jason Dion (Udemy) - $15-30 ⭐⭐⭐⭐⭐                 │
│  3. CompTIA Official Study Guide - $60 ⭐⭐⭐⭐            │
│                                                           │
│  🗺️ Reconhecimento de Mercado                             │
│  [Gráfico de barras: Brasil 70% | Europa 90% | EUA 95%]  │
│                                                          │
│  🔗 Próximos Passos Recomendados                          │
│  → Network+ (se precisar de base em redes)               │
│  → CEH (para penetration testing)                        │
│  → CySA+ (para análise de segurança)                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 7.3 Árvore de Progressão (Grafo Interativo)
```
                    ┌──────────────┐
                    │  Network+    │ (opcional)
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  Security+   │ ← VOCÊ ESTÁ AQUI
                    └──────┬───────┘
                           │
           ┌───────────────┼──────────────┐
           │               │              │
     ┌─────▼─────┐  ┌──────▼──────┐ ┌─────▼─────┐
     │    CEH    │  │    CySA+    │ │   SSCP    │
     └─────┬─────┘  └──────┬──────┘ └─────┬─────┘
           │               │              │
     ┌─────▼─────┐  ┌──────▼──────┐ ┌─────▼─────┐
     │   OSCP    │  │    GCIH     │ │   CISSP   │
     └─────┬─────┘  └─────────────┘ └───────────┘
           │
     ┌─────▼─────┐
     │   OSWE    │ (Python/JS focus)
     └───────────┘
```

### 7.4 Mapa Interativo de Mercado
```
┌─────────────────────────────────────────────────────────┐
│  Demanda por Certificação: Security+                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│         [Mapa-múndi com heatmap]                        │
│                                                         │
│  América do Norte: 🔥🔥🔥🔥🔥 (Alta demanda)              │
│  Europa: 🔥🔥🔥🔥 (Alta demanda)                          │
│  América do Sul: 🔥🔥🔥 (Média demanda)                  │
│  Ásia: 🔥🔥🔥🔥 (Alta demanda)                            │
│                                                         │
│  Top Empresas (Europa):                                 │
│  • Siemens, SAP, Deutsche Telekom, Ericsson             │
│                                                         │
│  Salário Médio Impactado:                               │
│  • Júnior: €45k-55k                                     │
│  • Pleno: €60k-75k                                      │
│  • Sênior: €80k-100k+                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
