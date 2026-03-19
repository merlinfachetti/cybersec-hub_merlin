# CYBER PORTAL — UI/UX (Threat Universe + Handshake Login)
**Documento de decisão, refinamento e critério de sucesso (Desktop-first)**  
Data: 2026-02-25 (Europe/Berlin)

---

## 0) Recap do pedido
Você pediu uma UI/UX **criativa, disruptiva e “ciber-cinematográfica”** para um portal de cybersecurity, começando por uma tela principal (“Threat Universe”) e depois uma tela de login no mesmo estilo. O objetivo explícito foi **fidelidade alta ao mock aprovado**, com **design tokens**, e execução em **etapas (“dividir pra conquistar”)**.

## 1) Objetivo + próxima ação imediata
**Objetivo:** alinhar um “Single Source of Truth” (SSOT) para que a implementação fique **pixel-accurate** em **desktop** e não dependa de “memória visual” implícita.  
**Próxima ação imediata:** criar a pasta `/_refs/` com os arquivos de referência (mock e backgrounds) e aplicar a **Opção A** (BG por imagem + UI em HTML/CSS) como base de fidelidade.

## 2) Critério de sucesso
- **Desktop-first**: a experiência principal deve estar excelente em laptop/desktop.
- **Fidelidade ao mock**: ao comparar (overlay) o mock aprovado vs UI renderizada no browser, a divergência visual deve ser mínima (pixel-match prático).
- **Narrativa visual coerente com cyber**: glow, glass, badges “SEC-ish”, modo Red/Blue/Purple como semântica do domínio.
- **Responsividade não é foco**: em telas < 1024px, mostrar uma tela temática “Unsupported viewport” (nebulosa extinta / cometa) em vez de uma UI quebrada.
- **Interações**: pan/zoom/hovers no universo; “handshake” na autenticação; erros neutros (não vazar informação).
- **Manutenibilidade**: tokens centralizados; CSS organizado; JS modular por responsabilidade (render vs interação vs estado).

---

# 1) Produto e visão
## 1.1 O que é o produto
Um **portal central** (“CYBER PORTAL”) para uma trajetória e prática na área de cybersecurity, com uma interface que:
- não parece “dashboard corporativo batido”,
- transmite **atmosfera e postura de segurança**,
- organiza o conhecimento e atividades como um **universo de ameaças e aprendizado**.

## 1.2 Por que essa estética importa
A interface comunica o domínio (cyber) através de:
- fundo galáxia (nebulosa),
- glow cinematográfico (bloom suave),
- glassmorphism controlado (não “vidro de app genérico”),
- badges e placas com vibe “SEC / lab / signal”,
- modos semânticos **Red / Blue / Purple** (posturas reais do setor).

---

# 2) Conceitos de UI/UX aprovados
## 2.1 “Threat Universe” (tela principal)
### Objetivo
Representar o portal como um **mapa navegável** (universo) de:
- sinais (signals),
- labs,
- lessons,
- milestones (ex.: SEC+),
- clusters por postura (Red/Blue/Purple).

### Elementos de UI definidos
- **Topbar** com brand “CYBER PORTAL” + “signal > noise”
- **Resumo do dia** (study/lab/risk) como micro HUD
- **Search** para filtrar itens do universo
- **Stage central** com:
  - background galáxia,
  - rings/crosshair (HUD),
  - nodes/placas flutuantes,
  - “YOU ARE HERE” no centro (tag)
- **Mode bar** com 3 botões grandes:
  - ATTACK (Red Team)
  - DEFEND (Blue Team)
  - IMPROVE (Purple Team)
- **Bottom panel** contextual:
  - título + subtítulo,
  - descrição curta e executável,
  - 3 ações (ex.: Start Lab / Read Report / Add Notes),
  - meta tags (MITRE, Severity, Confidence)

### Interações definidas
- pan/drag do universo
- zoom (wheel)
- hover highlight
- click seleciona node e atualiza o painel inferior
- modo altera glow e semântica (ênfase e micro-textos)

---

## 2.2 “Handshake Login” (tela de autenticação)
### Objetivo
Transformar login em um **ritual curto de autenticação** (handshake), coerente com cyber e sem “form batido”.

### Elementos de UI definidos
- **Mini topbar** com brand + status (ENV/LAT)
- **Stage** com background galáxia + halo sutil
- **Auth card** (glass) com:
  - title “Identify”
  - subtitle sobre “secure channel”
  - campos:
    - Identifier (email/username)
    - Passphrase (com toggle show/hide)
  - checkbox: “Remember this device (only if trusted)”
  - link: “Forgot passphrase”
- **Botão primário** “Authenticate” com **morphing tricolor** (Red/Blue/Purple)
- Ações secundárias:
  - Use passkey
  - Use MFA code
- **Status strip** (mini-console) para o handshake:
  - initiating → negotiating → verifying → session established

### Decisão crucial (semântica do botão)
Problema detectado: botão azul fixo sugere “Blue Team”.  
Solução definida: botão **tricolor vivo** que:
- em *idle* mistura as 3 cores suavemente,
- no *hover* “trava” na cor do modo,
- no *submit* converge (efeito “agreement” — opcional para refino).

### UX de segurança (comportamento)
- erros **neutros** (“Could not verify credentials.”) para evitar leak (não dizer se o usuário existe)
- rate limiting / heurísticas podem ser adicionadas depois, mas a UI já comporta mudança de postura.

---

# 3) Decisões técnicas tomadas
## 3.1 Desktop-first (aprovado)
- Target principal: **laptop/desktop web**
- Sem responsividade agora.
- Em telas pequenas (ex.: `< 1024px`), exibir **tela temática** de “unsupported viewport”.

## 3.2 Problema observado: fidelidade vs mock
Foi identificado que o código entregue ficou “metade para baixo” em fidelidade comparado ao mock ilustrado.

### Diagnóstico técnico (acordado)
- Pixel-perfect exige **referência visual presente** na hora do ajuste.
- Sem um “alvo mensurável” (mock/overlay), o resultado tende a ser “parecido”, não “idêntico”.
- CSS gradients + Canvas 2D não reproduzem naturalmente o mesmo “bloom/grade/grain” de uma ilustração sem camadas adicionais.

## 3.3 Estratégia de rendering para fidelidade (aprovada)
### Opção A (primeiro passo — mais eficiente)
**BG como imagem + UI em HTML/CSS/JS**, com:
- `bg-galaxy.webp` (export do mock/arte final)
- `noise.png` (tile pequeno) como film grain
- vignette + color grading leve (CSS)
- elementos interativos (UI) por cima (HTML/CSS)

**Motivo:** máxima fidelidade com menor custo.

### Opção B (segunda etapa — comparar)
**WebGL (Three.js / PixiJS) com pós-processamento** (bloom/grain) + UI overlay.  
**Motivo:** cinema real, fundo procedural vivo, mais controle artístico — com custo de complexidade.

> Decisão: começar com A e depois experimentar B em “branch” para escolha estética final.

---

# 4) Design tokens e estilo
## 4.1 Tokens (base)
- Neutros: `--bg`, `--surface`, `--text`, `--muted`, `--border`
- Acentos: `--red`, `--blue`, `--purple`
- Radius: `--r-sm`, `--r-md`, `--r-lg`
- Motion: `--ease`, `--fast`, `--mid`, `--slow`
- Shadows: `--shadow-1`, `--shadow-2`

## 4.2 Tokens de “cinema”
- `--glass-bg`, `--glass-border`
- `--input-bg`, `--input-border`
- Camadas:
  - nebulosa (bg)
  - grain (noise)
  - vignette (escurecimento periférico)
  - bloom fake (pseudo-elements / blur)

## 4.3 Regra de ouro do “glow”
Glow deve ser:
- **suave**, não neon agressivo
- “luz no ar”, não “borda brilhando”
- com contraste controlado (não estourar branco)

---

# 5) Organização do projeto e SSOT (Single Source of Truth)
## 5.1 Por que isso foi necessário
Foi reconhecido que:
- a memória visual “implícita” não é confiável para pixel-match
- o chat tem limite de texto; portanto, precisamos de uma fonte de verdade **no repositório**

## 5.2 Estrutura recomendada
```
/_refs/
  login-mock.png            # mock aprovado (alvo)
  portal-mock.png           # mock do Threat Universe (alvo)
  bg-galaxy.webp            # background final (export)
  noise.png                 # grain tile (pequeno, repetível)
  unsupported-mobile.webp   # arte do bloqueio mobile/tablet

/SPEC_LOGIN.md              # 1 página, critérios e dimensões
/SPEC_PORTAL.md             # idem para a tela principal

/login/
  index.html
  styles.css
  app.js

/portal/
  index.html
  styles.css
  app.js
```

## 5.3 Processo de calibração (pixel-match)
1. Rodar a UI no viewport alvo (ex.: **1440×900**).
2. Usar o mock (`/_refs/login-mock.png`) como overlay (no dev) com opacity.
3. Ajustar spacing/typography/glow até bater.
4. Só depois refinar interações.

---

# 6) Tela de “Unsupported viewport” (decisão)
## Objetivo
Evitar experiência ruim em mobile/tablet, mantendo coerência estética.

## Requisitos
- Detecção: `max-width: 1024px` (ajustável)
- UI principal escondida
- Tela alternativa exibida com:
  - imagem temática (cometa/nebulosa extinta)
  - mensagem curta: “Desktop experience only (for now)”
  - instrução: “Use laptop/desktop”
  - opcional: QR code/link/CTA

---

# 7) Itens entregues até aqui (o que existe no código atual)
> Nota: o que foi entregue é uma base funcional e conceitual (MVP visual), mas não calibrada para pixel-perfect sem o SSOT.

## 7.1 Threat Universe (portal)
- HTML/CSS/JS com:
  - Topbar, stage, mode buttons, bottom panel
  - Canvas 2D com nodes, rings, pan/zoom, hover/click, atualização do painel

## 7.2 Handshake Login (login)
- HTML/CSS/JS com:
  - Auth card, campos, toggle senha
  - botão morphing tricolor (CSS)
  - status handshake (JS)
  - canvas starfield/vignette (JS)

---

# 8) Principais riscos e como mitigamos
## 8.1 Risco: “nunca fica igual ao mock”
Mitigação:
- aplicar SSOT + overlay calibration
- usar **BG por imagem** para fixar estética
- controlar fontes/spacing/radius por spec

## 8.2 Risco: performance com efeitos
Mitigação:
- preferir BG imagem (leve) + noise tile
- limitar blur pesado e sombras múltiplas
- usar animações lentas e poucas camadas

## 8.3 Risco: UX confusa por excesso de estética
Mitigação:
- manter textos curtos e objetivos
- hierarquia clara (um foco por vez)
- “cinema” sem atrapalhar leitura (contraste saudável)

---

# 9) Próximos passos (roadmap curto)
## Sprint A — Fidelidade (Opção A)
1. Criar `/_refs/` e colocar mocks e BG final.
2. Revisar `styles.css` para BG por imagem + noise + vignette/grading.
3. Implementar “unsupported viewport screen” (< 1024px).
4. Calibrar layout com overlay do mock (1440×900).

## Sprint B — Interações refinadas
1. Botão morphing convergindo no click (“agreement”).
2. Handshake com easing mais “cinema” e estados consistentes.
3. Polimento do HUD (microtextos e feedback).

## Sprint C — Experimento Opção B (WebGL)
1. Branch com PixiJS/Three.js para BG + bloom/grain real.
2. Comparar lado a lado com Opção A.
3. Escolher a estética final e manter a stack vencedora.

---

# 10) Critérios de aceite (checklist)
## Login
- [ ] Desktop (>= 1024px) renderiza perfeito e legível
- [ ] BG = imagem final + noise + vignette (sem “cara de placeholder”)
- [ ] Botão Authenticate tricolor em idle e trava no hover por modo
- [ ] Handshake mostra sequência curta e consistente
- [ ] Erro neutro sem leak (mensagem única)
- [ ] Mobile/tablet mostra tela temática de bloqueio

## Portal
- [ ] Universo visual fiel ao mock aprovado (overlay)
- [ ] Pan/zoom suave sem lag
- [ ] Mode bar comunica Red/Blue/Purple sem ambiguidades
- [ ] Painel inferior atualiza com seleção

---

## Apêndice A — Princípios que guiaram o design
- **Domínio primeiro**: cyber não é “azul com cadeado”; é postura, sinais e trade-offs.
- **Cinemático, mas funcional**: atmosfera sem sacrificar legibilidade.
- **Narrativa em micro-interações**: handshake, posture, severity.
- **Sem tribalismo**: UI não favorece um time; celebra o ciclo Red↔Blue↔Purple.
