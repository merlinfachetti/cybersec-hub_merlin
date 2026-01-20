// Types compartilhados do projeto

export type CertificationLevel = keyof typeof import('./constants').CERTIFICATION_LEVELS;
export type CertificationCategory = keyof typeof import('./constants').CERTIFICATION_CATEGORIES;
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