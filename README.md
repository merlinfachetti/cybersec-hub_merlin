# 🔐 CyberSec Hub

> Your complete guide to cybersecurity certifications, career paths, and market insights

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192)

## 🎯 Visão Geral

CyberSec Hub é uma plataforma completa para profissionais que desejam fazer transição de carreira para cybersecurity. O projeto oferece:

- **Catálogo de Certificações**: 100+ certificações organizadas por nível e categoria
- **Roadmaps de Carreira**: Caminhos predefinidos baseados em sua experiência
- **Análise de Mercado**: Demanda, salários e empresas por região
- **Biblioteca de Recursos**: Cursos, livros, labs e materiais de estudo curados
- **Tracking de Progresso**: Acompanhe seu avanço em cada certificação
- **Comparação**: Compare até 3 certificações lado a lado com calculadora de ROI

## 🚀 Tech Stack

### Frontend

- **Next.js 15** - React framework com App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Componentes reutilizáveis
- **React Flow** - Visualização de grafos interativos
- **Recharts** - Gráficos e visualizações

### Backend

- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Relational database
- **Next.js API Routes** - Serverless API endpoints

### DevOps

- **Docker** - Containerização do PostgreSQL
- **ESLint + Prettier** - Code quality
- **TypeScript** - Type checking

## 📦 Estrutura do Projeto

```
cybersec-hub/
├── app/
│   ├── (auth)/                 # Páginas de autenticação
│   ├── (dashboard)/            # Páginas principais
│   │   ├── certifications/     # Listagem e detalhes
│   │   ├── roadmap/            # Visualização de roadmaps
│   │   ├── market/             # Análise de mercado
│   │   ├── resources/          # Biblioteca de recursos
│   │   └── profile/            # Perfil do usuário
│   └── api/                    # API endpoints
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── certifications/         # Componentes de certificações
│   ├── roadmap/                # Componentes de roadmap
│   ├── market/                 # Componentes de mercado
│   ├── resources/              # Componentes de recursos
│   └── profile/                # Componentes de perfil
├── lib/
│   ├── hooks/                  # Custom React hooks
│   ├── utils.ts                # Utility functions
│   ├── api-client.ts           # API client
│   ├── format.ts               # Formatação de dados
│   └── constants.ts            # Constantes
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data
└── public/                     # Static assets
```

## 🛠️ Setup e Instalação

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm ou yarn

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/cybersec-hub.git
cd cybersec-hub
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite `.env` com suas configurações:

```env
DATABASE_URL="postgresql://cybersec:cybersec123@localhost:5432/cybersec_hub"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Inicie o PostgreSQL:

```bash
docker-compose up -d
```

5. Execute as migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

6. Popule o banco com dados de exemplo:

```bash
npx prisma db seed
```

7. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📊 Database Schema

### Principais Tabelas

- **certifications**: Certificações de cybersecurity
- **providers**: Provedores de certificações (CompTIA, EC-Council, etc.)
- **certification_costs**: Custos por região
- **market_recognition**: Demanda e salários por região
- **skills**: Habilidades técnicas
- **resources**: Materiais de estudo

## 🎨 Features Principais

### 1. Catálogo de Certificações

- Listagem com filtros (nível, categoria, região)
- Busca por nome
- Paginação
- Cards com informações essenciais

### 2. Detalhes da Certificação

- Informações completas (exame, objetivos, validade)
- Custos por região
- Skills necessárias
- Recursos de estudo recomendados
- Análise de mercado
- Pré-requisitos e próximos passos

### 3. Roadmap Visual

- Grafo interativo com React Flow
- 3 roadmaps predefinidos:
  - Developer → Security Engineer
  - Beginner → Security Analyst
  - Security Analyst → Penetration Tester
- Highlight de certificações no path
- Zoom, pan, clique para navegar

### 4. Análise de Mercado

- Gráficos de demanda por região
- Impacto salarial
- Top empresas contratando
- Filtros por certificação e região

### 5. Biblioteca de Recursos

- 100+ recursos curados
- Filtros: tipo, custo, rating, idioma
- Ordenação por relevância
- Links diretos para materiais

### 6. Perfil e Tracking

- Dashboard personalizado
- Progresso por certificação
- Estatísticas de estudo
- Plano de estudos
- Recomendações personalizadas

### 7. Comparação

- Compare até 3 certificações
- Tabela comparativa
- Calculadora de ROI
- Análise custo-benefício

## 🧪 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # Linting
npm run lint:fix     # Fix linting issues
npm run format       # Format com Prettier
npm run type-check   # TypeScript check
npx prisma studio    # GUI do banco de dados
```

## 📈 Roadmap Futuro

- [ ] Autenticação real (NextAuth.js/Clerk)
- [ ] Sistema de reviews de usuários
- [ ] Integração com APIs de provedores
- [ ] Notificações de novos materiais
- [ ] Export de roadmap como imagem
- [ ] Modo escuro
- [ ] PWA support
- [ ] Internacionalização (i18n)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto é licenciado sob a MIT License.

## 👤 Autor

**Merlin**

- GitHub: [@merlin](https://github.com/merlinfachetti)
- LinkedIn: [Merlin](https://linkedin.com/in/merlin-fachetti)

**Quote**

- PERGUNTA:
  <i>Com essa aplicação eu consigo ser um profissional da área de cybersecurity?</i>

- RESPOSTA HONESTA:
  <i>NÃO DIRETAMENTE, mas ela é uma ferramenta ESSENCIAL no esse caminho.</i>

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Flow](https://reactflow.dev/)
- [Recharts](https://recharts.org/)

---

**Built with ❤️ by Merlin for cybersecurity professionals**
