import {
  CAREER_PATH_LIST,
  CERTIFICATION_MAP,
  CERTIFICATIONS,
  STUDY_RESOURCES,
  type GuideCertification,
  type GuideResource,
} from '@/lib/content/career-guide';

type ProviderMeta = {
  name: string;
  slug: string;
  website: string;
  description: string;
  country: string;
};

export const EDITORIAL_PROVIDERS: Record<string, ProviderMeta> = {
  comptia: {
    name: 'CompTIA',
    slug: 'comptia',
    website: 'https://www.comptia.org',
    description: 'Vendor-neutral certifications focused on practical IT and cybersecurity baselines.',
    country: 'US',
  },
  isc2: {
    name: '(ISC)2',
    slug: 'isc2',
    website: 'https://www.isc2.org',
    description: 'Global cybersecurity professional association with broad-recognition certifications.',
    country: 'US',
  },
  google: {
    name: 'Google / Coursera',
    slug: 'google',
    website: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
    description: 'Structured beginner learning program for cybersecurity foundations.',
    country: 'US',
  },
  ine: {
    name: 'INE Security',
    slug: 'ine',
    website: 'https://security.ine.com/certifications/ejpt-certification/',
    description: 'Hands-on cybersecurity learning and certification platform.',
    country: 'US',
  },
  'tcm-security': {
    name: 'TCM Security',
    slug: 'tcm-security',
    website: 'https://certifications.tcm-sec.com/pnpt/',
    description: 'Practical offensive-security training with emphasis on reporting and realism.',
    country: 'US',
  },
  'ec-council': {
    name: 'EC-Council',
    slug: 'ec-council',
    website: 'https://www.eccouncil.org',
    description: 'Cybersecurity certification provider with strong brand recognition in some regulated markets.',
    country: 'US',
  },
  giac: {
    name: 'GIAC / SANS',
    slug: 'giac',
    website: 'https://www.giac.org',
    description: 'Enterprise-oriented cybersecurity certifications and training.',
    country: 'US',
  },
  aws: {
    name: 'Amazon Web Services',
    slug: 'aws',
    website: 'https://aws.amazon.com/certification/certified-security-specialty/',
    description: 'Cloud certification ecosystem centered on AWS platform skills.',
    country: 'US',
  },
  hackthebox: {
    name: 'Hack The Box',
    slug: 'hackthebox',
    website: 'https://academy.hackthebox.com',
    description: 'Hands-on labs and certifications with strong technical depth.',
    country: 'UK',
  },
  offsec: {
    name: 'OffSec',
    slug: 'offsec',
    website: 'https://help.offsec.com/hc/en-us/articles/12483872278932-PEN-200-FAQ',
    description: 'Provider of practical offensive-security training and certifications.',
    country: 'US',
  },
};

function getProvider(providerSlug: string, fallbackName: string): ProviderMeta {
  return (
    EDITORIAL_PROVIDERS[providerSlug] ?? {
      name: fallbackName,
      slug: providerSlug,
      website: '',
      description: '',
      country: 'US',
    }
  );
}

function normalizeResourceType(type: GuideResource['type']): string {
  switch (type) {
    case 'VIDEO':
      return 'COURSE_VIDEO';
    case 'COURSE':
      return 'COURSE_INTERACTIVE';
    case 'LAB':
      return 'LAB_ENVIRONMENT';
    case 'BOOK':
      return 'BOOK';
    case 'GUIDE':
      return 'STUDY_GUIDE';
    default:
      return 'STUDY_GUIDE';
  }
}

function findCertificationForResource(resource: GuideResource): GuideCertification | null {
  const query = resource.cert.toLowerCase();

  return (
    CERTIFICATIONS.find((cert) => {
      return (
        cert.name.toLowerCase() === query ||
        cert.acronym.toLowerCase() === query ||
        query.includes(cert.acronym.toLowerCase()) ||
        query.includes(cert.name.toLowerCase())
      );
    }) ?? null
  );
}

export function getEditorialCertificationsList() {
  return CERTIFICATIONS.map((cert) => {
    const provider = getProvider(cert.providerSlug, cert.provider);

    return {
      id: `editorial-${cert.slug}`,
      slug: cert.slug,
      name: cert.name,
      fullName: cert.fullName,
      acronym: cert.acronym,
      level: cert.level,
      category: cert.category,
      description: cert.description,
      examDuration: cert.examDuration,
      numberOfQuestions: cert.numberOfQuestions,
      passingScore: null,
      validityYears: cert.validityYears || null,
      requiresRenewal: cert.requiresRenewal,
      provider: {
        name: provider.name,
        slug: provider.slug,
        website: provider.website,
        logo: null,
      },
      costs: cert.costs.map((cost, index) => ({
        id: `editorial-cost-${cert.slug}-${index}`,
        region: cost.region,
        currency: cost.currency,
        examCost: cost.examCost,
      })),
      _count: {
        resources: cert.resources.length,
        skills: 0,
        prerequisites: 0,
      },
      editorial: {
        bestFor: cert.bestFor,
        caution: cert.caution,
        marketSignal: cert.marketSignal,
      },
    };
  });
}

export function getEditorialCertificationDetail(identifier: string) {
  const normalized = identifier.replace(/^editorial-/, '');
  const cert =
    CERTIFICATION_MAP[normalized] ??
    CERTIFICATIONS.find(
      (item) =>
        item.slug === normalized ||
        item.acronym.toLowerCase() === normalized.toLowerCase()
    );

  if (!cert) return null;

  const provider = getProvider(cert.providerSlug, cert.provider);

  return {
    id: `editorial-${cert.slug}`,
    slug: cert.slug,
    name: cert.name,
    fullName: cert.fullName,
    acronym: cert.acronym,
    level: cert.level,
    category: cert.category,
    subCategory: null,
    description: cert.description,
    objectives: cert.objectives,
    targetAudience: cert.bestFor,
    recommendedExperience: cert.recommendedExperience,
    examFormat:
      cert.numberOfQuestions > 0 ? 'Knowledge exam' : 'Practical exam',
    examDuration: cert.examDuration,
    numberOfQuestions: cert.numberOfQuestions,
    passingScore: null,
    examLanguages: ['English'],
    validityYears: cert.validityYears || null,
    requiresRenewal: cert.requiresRenewal,
    renewalRequirements: cert.requiresRenewal
      ? 'Check the provider policy for continuing education or renewal.'
      : null,
    officialUrl: cert.officialUrl,
    syllabusPdfUrl: null,
    provider: {
      id: `editorial-provider-${provider.slug}`,
      name: provider.name,
      slug: provider.slug,
      website: provider.website,
      description: provider.description,
      logo: null,
      country: provider.country,
    },
    costs: cert.costs.map((cost, index) => ({
      id: `editorial-cost-${cert.slug}-${index}`,
      region: cost.region,
      country: null,
      currency: cost.currency,
      examCost: cost.examCost,
      officialTraining: null,
      renewalCost: null,
      voucherAvailable: false,
      notes: null,
    })),
    marketRecognition: [],
    skills: [],
    resources: cert.resources.map((resource, index) => ({
      id: `editorial-resource-${cert.slug}-${index}`,
      title: resource.name,
      type: resource.free ? 'STUDY_GUIDE' : 'COURSE_INTERACTIVE',
      provider: resource.type,
      url: resource.url,
      description: `${resource.type}${resource.free ? ' · free' : ' · paid'}`,
      cost: resource.free ? 0 : 0,
      currency: 'USD',
      isFree: resource.free,
      rating: null,
      reviewsCount: null,
      language: 'en',
      durationHours: null,
    })),
    prerequisites: [],
    prerequisitesFor: [],
    editorial: {
      bestFor: cert.bestFor,
      caution: cert.caution,
      marketSignal: cert.marketSignal,
    },
  };
}

export function getEditorialResources() {
  return STUDY_RESOURCES.map((resource) => {
    const cert = findCertificationForResource(resource);

    return {
      id: `editorial-${resource.id}`,
      title: resource.title,
      type: normalizeResourceType(resource.type),
      provider: resource.provider,
      url: resource.url,
      description: `${resource.desc} Best for: ${resource.bestFor}`,
      cost: resource.cost,
      currency: 'USD',
      isFree: resource.cost === 0,
      rating: resource.rating,
      reviewsCount: 0,
      language: 'en',
      durationHours: resource.hours,
      lastUpdated: null,
      certificationId: cert ? `editorial-${cert.slug}` : null,
      certification: cert
        ? {
            id: `editorial-${cert.slug}`,
            name: cert.name,
            slug: cert.slug,
            level: cert.level,
          }
        : null,
      editorial: {
        bestFor: resource.bestFor,
        caution: resource.caution,
      },
    };
  });
}

export function getEditorialRoadmaps() {
  return CAREER_PATH_LIST.map((path) => ({
    id: path.id,
    title: path.label,
    description: path.goal,
    fromRole: path.desc,
    toRole: path.label,
    duration: path.totalHours,
    difficulty:
      path.steps.some((step) => step.level === 'ADVANCED')
        ? 'advanced'
        : path.steps.some((step) => step.level === 'INTERMEDIATE')
          ? 'intermediate'
          : 'beginner',
  }));
}

export function getEditorialRoadmapGraph(id: string) {
  const path = CAREER_PATH_LIST.find((item) => item.id === id);
  if (!path) return null;

  const stepsWithCert = path.steps.filter((step) => step.slug);

  const nodes = stepsWithCert.map((step) => ({
    id: `editorial-${step.slug}`,
    certificationId: `editorial-${step.slug}`,
    name: step.name,
    level: step.level,
    category: CERTIFICATION_MAP[step.slug!]?.category ?? 'DEFENSIVE_SECURITY',
    highlighted: true,
  }));

  const edges = nodes.slice(0, -1).map((node, index) => ({
    id: `${node.id}-${nodes[index + 1].id}`,
    source: node.id,
    target: nodes[index + 1].id,
    type: 'recommended' as const,
  }));

  return {
    nodes,
    edges,
    roadmapInfo: {
      id: path.id,
      title: path.label,
      description: path.goal,
      fromRole: path.desc,
      toRole: path.label,
      duration: path.totalHours,
      difficulty:
        path.steps.some((step) => step.level === 'ADVANCED')
          ? 'advanced'
          : path.steps.some((step) => step.level === 'INTERMEDIATE')
            ? 'intermediate'
            : 'beginner',
    },
  };
}
