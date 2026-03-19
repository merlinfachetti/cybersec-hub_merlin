## Conceito da tela: “Threat Universe” (Sinal em vez de menu)

### Metáfora central

A UI é um radar/constelação: eventos, aprendizados e trilhas viram “corpos” com massa (impacto), órbita (recência) e cor (domínio).
Você não “clica em páginas”, você entra em modos operacionais: Red / Blue / Purple.

### O que fica disruptivo aqui

- Navegação por postura (ataque / defesa / síntese) em vez de “Cursos / Artigos / Ferramentas”.
- Um painel vivo que mistura: estudo (certificações), prática (labs), e realidade (incidentes/sinais) — mas sem virar bagunça, porque a metáfora organiza.
- O usuário sente que está em um SOC/War Room pessoal, só que com UX bonita, calma e útil.

### Wireframe (texto) — 1 tela

Imagine um layout mobile-first, mas que escala bem pro desktop:

```yaml
┌──────────────────────────────────────────────────────┐
│→ TOP BAR                                             │
│ [☰]   CYBER PORTAL                    [Search ⌕] [●] │
│                    "signal > noise"                  │
├──────────────────────────────────────────────────────┤
│→ HERO / STATUS STRIP                                 │
│ Today: 2h Study • 1 Lab • Risk: Low                  │
│ Streak: ██████████░░░ | Next milestone: Security+    │
│                                                      │
├──────────────────────────────────────────────────────┤
│→ THREAT UNIVERSE (interactive canvas)                │
│ ••• ○ (event) ✦ (lesson)                             │
│ ◎ (lab) ◌◌◌ (feed cluster)                           │
│                                                      │
│ Center: "You are here"                               │
│ Orbit rings: Now / This week / Backlog               │
│                                                      │
├──────────────────────────────────────────────────────┤
│→ MODE SWITCH (3 vertentes)                           │
│ [ RED: Attack ] [ BLUE: Defend ] [ PURPLE: Improve ] │
│ (changes the meaning of everything above)            │
│                                                      │
├──────────────────────────────────────────────────────┤
│→ CONTEXT PANEL (bottom sheet)                        │
│ Selected: "Phishing kit analysis"                    │
│ • Why it matters (2 lines)                           │
│ • Do next: [Start Lab] [Read] [Add notes]            │
│ • Evidence: MITRE tags • links • score               │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Como cada modo muda a experiência (sem trocar de “site”)

### 🔴 Red Team (Attack / adversarial thinking)

- O “Universe” enfatiza: vetores de ataque, TTPs, exploração, recon, payload chain (em nível educativo, sem virar manual malicioso).
- Ações primárias: Simular, Analisar superfície, Modelar ameaça, CTF/Lab.
- Linguagem: “Hipótese do atacante”, “Caminho provável”, “Fraqueza explorável”.

### 🔵 Blue Team (Defend / detection & response)

- O “Universe” vira um painel de sinais: alertas, logs, anomalias, detecções, hardening.
- Ações primárias: Criar detecção, Validar alerta, Checklist hardening, Runbook.
- Linguagem: “Cobertura”, “Sinal confiável”, “Tempo de resposta”.

### 🟣 Purple Team (Improve / feedback loop)

- Aqui fica o ouro: a UI vira um motor de melhoria contínua.
- O “Universe” conecta Red → Blue por “linhas de causalidade”:
- - ataque simulado → evidência coletada → regra de detecção → lacuna → correção.
- Ações primárias: Registrar aprendizado, Gerar regra, Criar tarefa, Repetir exercício.
  Esse modo é o que faz o portal parecer “de gente séria”, só que com design criativo.

## Componentes-chave (pra UX ficar forte)

### Threat Universe Canvas
- Interação: pinch-zoom, arrastar, toque em entidade.
- “Entidades”: Labs, Lessons, Signals, Milestones.
- Cada entidade tem: impact score, effort, confidence (3 números simples).

### Bottom Sheet contextual
- Nada de abrir páginas novas à toa.
- Sempre: o que é, por que importa, próxima ação.

### Search que entende intenção
- Busca não só por texto, mas por filtro rápido:
- “Quero algo de 20 min”, “quero algo hands-on”, “quero algo do meu nível”.

### Status strip minimalista
- Um resumo do dia/semana sem ansiedade:
- - tempo estudado, 1 próximo passo, risco geral (autoavaliação), streak.

### Design Tokens (base) — prontos pra você plugar

A ideia aqui é fugir do clichê “neon hacker”, mas ainda ter energia. Paleta: carvão + gelo + acentos espectrais (um acento por modo).
- [VER ARQUIVO SEPARADO]
