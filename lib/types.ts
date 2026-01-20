// Types compartilhados do projeto

export type CertificationLevel =
  keyof typeof import('./constants').CERTIFICATION_LEVELS;
export type CertificationCategory =
  keyof typeof import('./constants').CERTIFICATION_CATEGORIES;
export type Region = keyof typeof import('./constants').REGIONS;
export type DemandLevel = keyof typeof import('./constants').DEMAND_LEVELS;

// Type para certificação (será expandido quando tivermos o Prisma)
export interface Certification {
  id: string;
  slug: string;
  name: string;
  provider: string;
  level: CertificationLevel;
  category: CertificationCategory;
  description: string;
  officialUrl: string;
}

// Type para custo
export interface CertificationCost {
  region: Region;
  country?: string;
  currency: string;
  examCost: number;
  officialTraining?: number;
  renewalCost?: number;
}

// Type para reconhecimento de mercado
export interface MarketRecognition {
  region: Region;
  demandLevel: DemandLevel;
  jobPostingsCount?: number;
  averageSalaryImpact?: number;
  topCompanies: string[];
}

export interface CertificationDetail {
  id: string;
  slug: string;
  name: string;
  fullName: string | null;
  acronym: string | null;
  level: string;
  category: string;
  subCategory: string | null;
  description: string;
  objectives: string[];
  targetAudience: string | null;
  recommendedExperience: string | null;
  examFormat: string | null;
  examDuration: number | null;
  numberOfQuestions: number | null;
  passingScore: number | null;
  examLanguages: string[];
  validityYears: number | null;
  requiresRenewal: boolean;
  renewalRequirements: string | null;
  officialUrl: string;
  syllabusPdfUrl: string | null;
  provider: {
    id: string;
    name: string;
    slug: string;
    website: string;
    description: string | null;
    logo: string | null;
    country: string | null;
  };
  costs: Array<{
    id: string;
    region: string;
    country: string | null;
    currency: string;
    examCost: number;
    officialTraining: number | null;
    renewalCost: number | null;
    voucherAvailable: boolean;
    notes: string | null;
  }>;
  marketRecognition: Array<{
    id: string;
    region: string;
    country: string | null;
    demandLevel: string;
    jobPostingsCount: number | null;
    averageSalaryImpact: number | null;
    juniorSalaryRange: string | null;
    midSalaryRange: string | null;
    seniorSalaryRange: string | null;
    topCompanies: string[];
    governmentRequired: boolean;
  }>;
  skills: Array<{
    importance: string;
    skill: {
      id: string;
      name: string;
      slug: string;
      category: string | null;
      description: string | null;
    };
  }>;
  resources: Array<{
    id: string;
    title: string;
    type: string;
    provider: string;
    url: string;
    description: string | null;
    cost: number;
    currency: string;
    isFree: boolean;
    rating: number | null;
    reviewsCount: number | null;
    language: string;
    durationHours: number | null;
  }>;
  prerequisites: Array<{
    id: string;
    name: string;
    slug: string;
    level: string;
  }>;
  prerequisitesFor: Array<{
    id: string;
    name: string;
    slug: string;
    level: string;
  }>;
}

export interface RoadmapNode {
  id: string;
  certificationId: string;
  name: string;
  level: string;
  category: string;
  position?: { x: number; y: number };
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  type: 'prerequisite' | 'recommended';
}

export interface RoadmapData {
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
}

// Definições de roadmaps predefinidos
export interface PredefinedRoadmap {
  id: string;
  title: string;
  description: string;
  fromRole: string;
  toRole: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  certificationIds: string[];
}

// Nota: Estes IDs serão substituídos pelos IDs reais do seu banco
// Você precisará pegar os IDs corretos via Prisma Studio
export const PREDEFINED_ROADMAPS: PredefinedRoadmap[] = [
  {
    id: 'dev-to-security-engineer',
    title: 'Developer → Security Engineer',
    description:
      'Perfect for software developers transitioning into application security and secure coding. Focus on offensive and defensive skills.',
    fromRole: 'Software Developer',
    toRole: 'Security Engineer',
    duration: '12-18 months',
    difficulty: 'intermediate',
    certificationIds: [
      // Será preenchido dinamicamente baseado em slugs
    ],
  },
  {
    id: 'beginner-to-analyst',
    title: 'Beginner → Security Analyst',
    description:
      'Start from scratch and build a solid foundation in cybersecurity. Focus on defensive security and compliance.',
    fromRole: 'No experience',
    toRole: 'Security Analyst',
    duration: '6-12 months',
    difficulty: 'beginner',
    certificationIds: [],
  },
  {
    id: 'analyst-to-pentester',
    title: 'Security Analyst → Penetration Tester',
    description:
      'Advance from defensive to offensive security. Master penetration testing and ethical hacking.',
    fromRole: 'Security Analyst',
    toRole: 'Penetration Tester',
    duration: '12-24 months',
    difficulty: 'advanced',
    certificationIds: [],
  },
];

// Função para obter roadmap por slug de certificação
export function getRoadmapBySlugs(slugs: string[]) {
  // Esta função será usada para criar roadmaps dinamicamente
  return slugs;
}
