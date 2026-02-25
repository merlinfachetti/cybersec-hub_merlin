// Constantes do projeto

export const APP_NAME = 'CyberSec Hub';
export const APP_DESCRIPTION =
  'Your complete guide to cybersecurity certifications, career paths, and market insights';

// Níveis de certificação
export const CERTIFICATION_LEVELS = {
  ENTRY: 'Entry',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
} as const;

// Categorias
export const CERTIFICATION_CATEGORIES = {
  OFFENSIVE_SECURITY: 'Offensive Security',
  DEFENSIVE_SECURITY: 'Defensive Security',
  GOVERNANCE_RISK: 'Governance & Risk',
  CLOUD_SECURITY: 'Cloud Security',
  APPLICATION_SECURITY: 'Application Security',
  NETWORK_SECURITY: 'Network Security',
  FORENSICS: 'Forensics',
  INCIDENT_RESPONSE: 'Incident Response',
  SECURITY_ENGINEERING: 'Security Engineering',
  THREAT_INTELLIGENCE: 'Threat Intelligence',
} as const;

// Regiões
export const REGIONS = {
  NORTH_AMERICA: 'North America',
  SOUTH_AMERICA: 'South America',
  EUROPE: 'Europe',
  ASIA: 'Asia',
  OCEANIA: 'Oceania',
  AFRICA: 'Africa',
  MIDDLE_EAST: 'Middle East',
} as const;

// Níveis de demanda
export const DEMAND_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
} as const;

// Rotas
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/',
  CERTIFICATIONS: '/certifications',
  CERTIFICATION_DETAIL: (id: string) => `/certifications/${id}`,
  CERTIFICATION_COMPARE: '/certifications/compare',
  ROADMAP: '/roadmap',
  MARKET: '/market',
  RESOURCES: '/resources',
  PROFILE: '/profile',
} as const;
