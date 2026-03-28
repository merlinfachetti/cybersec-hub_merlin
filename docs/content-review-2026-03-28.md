# Content Review - 2026-03-28

## Objetivo

Revisar a narrativa principal da plataforma para que:

- recursos de estudo reflitam melhor quando cada material realmente ajuda;
- roadmaps sejam orientados por papel real de carreira, nao so por empilhar certs;
- certificacoes tragam contexto de mercado, fit e limitacoes;
- busca e paginas principais contem a mesma historia editorial.

## Principais mudancas

### 1. Curadoria centralizada

Foi criado `lib/content/career-guide.ts` como fonte unica para:

- certificacoes editoriais;
- recursos curados;
- trilhas de carreira.

Isso reduz duplicacao e evita divergencia entre catalogo, detalhe, roadmap, recursos e busca global.

### 2. Roadmaps mais realistas

Os caminhos deixaram de ser apenas "beginner / intermediate / advanced" e passaram a refletir destinos mais reais:

- Foundations -> SOC
- Dev -> Security Engineer
- Pentest / Red Team
- Architecture / Leadership

Tambem foram incluidos passos que nao sao prova, quando isso melhora a aderencia do roadmap a carreira real:

- pratica de SIEM;
- hands-on de AppSec;
- milestones de especializacao.

### 3. Posicionamento menos absoluto das certs

Alguns exemplos de ajuste:

- `Security+` continua forte como base generalista, mas nao foi tratado como obrigatorio para toda carreira.
- `eJPT` ficou como boa porta de entrada ofensiva, e nao como proximo passo natural para qualquer iniciante.
- `CEH` passou a ser descrita como credencial com reconhecimento de marca/ambientes regulados, sem vender profundidade pratica que ela nao prova tao bem.
- `PNPT` ficou como trilha hands-on boa e respeitada tecnicamente, mas sem exagerar que vence `CEH` em todo contexto de mercado.
- `OSCP` continua forte para ofensiva, mas sem ser apresentada como resposta universal para todas as carreiras em seguranca.
- `CISSP` e `CISM` foram puxadas para senioridade, arquitetura, governanca e lideranca.
- `AWS Security Specialty` passou a aparecer como cert de cloud security em stack AWS, e nao como "avancada generica" para qualquer pessoa.

### 4. Recursos com contexto de uso

Cada recurso ganhou dois sinais editoriais:

- `Melhor para`
- `Cuidado`

Isso ajuda a evitar erros comuns, como:

- usar `OWASP WSTG` como primeiro material de AppSec;
- assistir `ippsec` demais e praticar de menos;
- comprar curso caro antes de consolidar fundamentos;
- confundir curso popular com recurso ideal para o papel desejado.

## Fontes de verificacao usadas nesta revisao

As descricoes foram calibradas com base em documentacao oficial e pratica comum de mercado. Alguns pontos verificados em 2026-03-28:

- ISC2 CC: examo de entrada e treinamento oficial gratuito.
- CompTIA Security+: detalhes do SY0-701 e precificacao atual nas lojas oficiais.
- CompTIA CySA+: pagina oficial e marketplace atual.
- GIAC GPEN: pagina oficial com formato e passing score atualizado.
- OffSec PEN-200 / OSCP+: FAQ oficial sobre bundles e acesso.
- ISACA CISM: pagina oficial da credencial.
- Google Cybersecurity Certificate: pagina oficial da especializacao no Coursera.
- HTB / TCM / PortSwigger / Splunk / OWASP / AWS: materiais oficiais e trilhas publicas.

## Resultado esperado no produto

Quando o usuario navegar por catalogo, detalhe, busca, roadmap e recursos, a experiencia deve ficar:

- menos marketing e mais orientacao de carreira;
- menos "essa cert e a melhor" e mais "essa cert faz sentido neste contexto";
- menos duplicacao de texto e mais consistencia entre superficies.
