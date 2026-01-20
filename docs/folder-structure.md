# Monorepo

cybersec-hub/
├── apps/
│   ├── web/                    # Next.js 15 (Frontend)
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── certifications/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── [id]/page.tsx
│   │   │   │   │   └── compare/page.tsx
│   │   │   │   ├── roadmap/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── market/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── resources/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── profile/
│   │   │   │       └── page.tsx
│   │   │   ├── api/
│   │   │   │   └── [...endpoints]/route.ts
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui
│   │   │   ├── certifications/
│   │   │   ├── roadmap/
│   │   │   └── charts/
│   │   ├── lib/
│   │   │   ├── prisma.ts
│   │   │   ├── api-client.ts
│   │   │   └── utils.ts
│   │   └── public/
│   │       └── images/
│   │
│   └── api/                     # Backend (Node.js/Fastify ou Python/FastAPI)
│       ├── src/
│       │   ├── modules/
│       │   │   ├── certifications/
│       │   │   │   ├── certification.controller.ts
│       │   │   │   ├── certification.service.ts
│       │   │   │   ├── certification.repository.ts
│       │   │   │   └── certification.dto.ts
│       │   │   ├── resources/
│       │   │   ├── market/
│       │   │   └── users/
│       │   ├── shared/
│       │   │   ├── database/
│       │   │   ├── middleware/
│       │   │   └── utils/
│       │   └── main.ts
│       └── prisma/
│           ├── schema.prisma
│           └── migrations/
│
├── packages/
│   ├── ui/                      # Design system compartilhado
│   ├── types/                   # TypeScript types compartilhados
│   └── config/                  # Configurações compartilhadas
│
├── tools/
│   └── scrapers/                # Scripts de web scraping
│       ├── comptia-scraper.ts
│       ├── offsec-scraper.ts
│       └── udemy-scraper.ts
│
└── docs/
    ├── api/                     # Documentação da API
    └── architecture/            # Diagramas e decisões arquiteturais
