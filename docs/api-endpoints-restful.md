# Certificações
// GET /api/certifications
// Lista todas as certificações com filtros
Query Params:
  - level: entry|intermediate|advanced|expert
  - category: offensive|defensive|governance|cloud|...
  - region: north_america|south_america|europe|...
  - minCost: number
  - maxCost: number
  - provider: string (slug)
  - search: string (busca por nome)
  - orderBy: name|cost|demand (default: name)
  - order: asc|desc (default: asc)
  - page: number (default: 1)
  - limit: number (default: 20)

Response:
{
  "data": [
    {
      "id": "...",
      "name": "CompTIA Security+",
      "slug": "comptia-security-plus",
      "provider": {
        "name": "CompTIA",
        "logo": "..."
      },
      "level": "ENTRY",
      "category": "DEFENSIVE_SECURITY",
      "costs": [
        {
          "region": "EUROPE",
          "currency": "EUR",
          "examCost": 370
        }
      ],
      "marketRecognition": {
        "europe": {
          "demandLevel": "HIGH",
          "averageSalaryImpact": 15
        }
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

// GET /api/certifications/:id
// Detalhes completos de uma certificação
Response:
{
  "id": "...",
  "name": "CompTIA Security+",
  "description": "...",
  "prerequisites": [
    {
      "id": "...",
      "name": "CompTIA Network+",
      "level": "ENTRY"
    }
  ],
  "costs": [...],
  "marketRecognition": [...],
  "skills": [
    {
      "name": "Network Security",
      "importance": "CORE"
    }
  ],
  "resources": [
    {
      "title": "Professor Messer Security+ Course",
      "type": "COURSE_VIDEO",
      "cost": 0,
      "rating": 4.8,
      "url": "..."
    }
  ],
  "reviews": [...]
}

// GET /api/certifications/:id/prerequisites-tree
// Árvore de pré-requisitos (para visualização em grafo)
Response:
{
  "nodes": [
    {
      "id": "security-plus",
      "label": "Security+",
      "level": "ENTRY"
    },
    {
      "id": "network-plus",
      "label": "Network+",
      "level": "ENTRY"
    }
  ],
  "edges": [
    {
      "from": "network-plus",
      "to": "security-plus",
      "type": "recommended"
    }
  ]
}

// GET /api/certifications/compare
// Compara até 3 certificações lado a lado
Query Params:
  - ids: string[] (array de IDs)

Response:
{
  "certifications": [
    {
      "id": "...",
      "name": "Security+",
      "level": "ENTRY",
      "cost": {...},
      "duration": "2-3 months",
      "prerequisites": [],
      "pros": ["Globally recognized", "Affordable"],
      "cons": ["Basic level"]
    },
    // ... mais 2
  ]
}

# Mercado e Análise
// GET /api/market/demand
// Dados de demanda por região
Query Params:
  - certification: string (ID ou slug)
  - region: string (opcional)

Response:
{
  "certification": {
    "id": "...",
    "name": "Security+"
  },
  "demand": [
    {
      "region": "EUROPE",
      "demandLevel": "HIGH",
      "jobPostings": 1250,
      "topCountries": [
        {
          "country": "Germany",
          "jobPostings": 450,
          "avgSalary": "€65k"
        }
      ],
      "topCompanies": [
        "Siemens", "SAP", "Deutsche Telekom"
      ]
    }
  ]
}

// GET /api/market/salary-impact
// Impacto salarial por certificação
Response:
{
  "certification": "...",
  "regions": [
    {
      "region": "EUROPE",
      "impact": {
        "percentIncrease": 15,
        "junior": "€45k-55k",
        "mid": "€60k-75k",
        "senior": "€80k-100k"
      }
    }
  ]
}

# Recursos de Estudo
// GET /api/resources
// Lista recursos de estudo
Query Params:
  - certification: string (ID)
  - type: course|book|lab|practice_exam
  - isFree: boolean
  - minRating: number (1-5)

Response:
{
  "data": [
    {
      "id": "...",
      "title": "Professor Messer Security+",
      "type": "COURSE_VIDEO",
      "provider": "YouTube",
      "cost": 0,
      "rating": 4.8,
      "reviewsCount": 15000,
      "url": "..."
    }
  ]
}

# Usuário e Progresso
// POST /api/user/certifications
// Adiciona certificação ao perfil do usuário
Body:
{
  "certificationId": "...",
  "status": "studying"
}

// PATCH /api/user/certifications/:id
// Atualiza progresso
Body:
{
  "progressPercent": 45,
  "studyHours": 120,
  "notes": "..."
}

// GET /api/user/dashboard
// Dashboard personalizado
Response:
{
  "user": {...},
  "currentCertifications": [
    {
      "certification": {...},
      "status": "STUDYING",
      "progressPercent": 45,
      "estimatedCompletion": "2025-04-15"
    }
  ],
  "nextRecommended": [...],
  "stats": {
    "totalStudyHours": 250,
    "certificationsCompleted": 2,
    "inProgress": 1
  }
}
