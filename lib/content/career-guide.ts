export const CONTENT_LAST_REVIEWED = '2026-03-28';
export const CONTENT_REVIEW_MAX_AGE_DAYS = 120;

export type GuideLevel = 'ENTRY' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type CareerStage = 'TRANSITION' | 'ENTRY' | 'MID' | 'SENIOR';
export type CareerTeam = 'red' | 'blue' | 'purple' | 'hybrid';
export type GuideCategory =
  | 'DEFENSIVE_SECURITY'
  | 'OFFENSIVE_SECURITY'
  | 'GOVERNANCE_RISK'
  | 'CLOUD_SECURITY'
  | 'APPLICATION_SECURITY'
  | 'NETWORK_SECURITY'
  | 'INCIDENT_RESPONSE'
  | 'THREAT_INTELLIGENCE';

export interface GuideResource {
  id: string;
  title: string;
  provider: string;
  type: 'VIDEO' | 'COURSE' | 'LAB' | 'BOOK' | 'GUIDE';
  cert: string;
  level: GuideLevel;
  category: GuideCategory;
  cost: number;
  rating: number;
  hours: number;
  desc: string;
  bestFor: string;
  caution: string;
  url: string;
  tags: string[];
}

export interface GuideStepResource {
  name: string;
  type: string;
  url: string;
  free: boolean;
}

export interface CareerPathStep {
  order: number;
  name: string;
  acronym: string;
  slug?: string;
  provider: string;
  level: GuideLevel;
  color: string;
  hours: string;
  cost: string;
  duration: string;
  why: string;
  topics: string[];
  resources: GuideStepResource[];
  outcome: string;
  href?: string;
  linkLabel?: string;
}

export interface CareerPath {
  id: string;
  label: string;
  color: string;
  rgb: string;
  stage: CareerStage;
  stageLabel: string;
  audience: string;
  fromRole: string;
  toRole: string;
  team: CareerTeam;
  aliases: string[];
  desc: string;
  icon: string;
  goal: string;
  totalHours: string;
  totalCost: string;
  realityCheck: string;
  steps: CareerPathStep[];
}

export interface GuideCertification {
  slug: string;
  name: string;
  fullName: string;
  acronym: string;
  provider: string;
  providerSlug: string;
  level: GuideLevel;
  category: GuideCategory;
  description: string;
  bestFor: string;
  caution: string;
  marketSignal: string;
  studyHours: string;
  searchCost: string;
  examDuration: number;
  numberOfQuestions: number;
  passingScoreLabel: string;
  validityLabel: string;
  validityYears: number;
  requiresRenewal: boolean;
  officialUrl: string;
  recommendedExperience: string;
  costs: Array<{
    region: string;
    currency: string;
    examCost: number;
  }>;
  objectives: string[];
  topics: string[];
  resources: GuideStepResource[];
}

export const CAREER_STAGE_META: Record<
  CareerStage,
  { label: string; market: string; color: string; bg: string }
> = {
  TRANSITION: {
    label: 'Career Transition',
    market: 'Profissional experiente migrando para Cyber',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.12)',
  },
  ENTRY: {
    label: 'Entry-Level',
    market: 'Junior / primeira vaga na area',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
  },
  MID: {
    label: 'Mid-Level',
    market: 'Pleno / especializacao funcional',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.12)',
  },
  SENIOR: {
    label: 'Senior-Level',
    market: 'Senior / arquitetura / lideranca',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
  },
};

export const STUDY_RESOURCES: GuideResource[] = [
  {
    id: 'r-professor-messer-secplus',
    title: 'Professor Messer - Security+ SY0-701',
    provider: 'Professor Messer',
    type: 'VIDEO',
    cert: 'Security+',
    level: 'ENTRY',
    category: 'DEFENSIVE_SECURITY',
    cost: 0,
    rating: 4.9,
    hours: 14,
    desc: 'Cobertura gratuita, objetiva e muito alinhada ao blueprint do Security+. Excelente para montar base teorica sem pagar de entrada.',
    bestFor:
      'Quem quer base geral de cyber e vai fazer Security+ ou nivelar fundamentos rapidamente.',
    caution:
      'Nao substitui labs nem simulados; funciona melhor em conjunto com pratica e questoes.',
    url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/',
    tags: ['sec+', 'security+', 'free', 'video', 'fundamentos'],
  },
  {
    id: 'r-google-cyber',
    title: 'Google Cybersecurity Certificate',
    provider: 'Google / Coursera',
    type: 'COURSE',
    cert: 'Fundamentos',
    level: 'ENTRY',
    category: 'DEFENSIVE_SECURITY',
    cost: 49,
    rating: 4.6,
    hours: 150,
    desc: 'Programa estruturado para iniciantes absolutos com Linux, SQL, redes, conceitos de SOC e resposta a incidentes.',
    bestFor: 'Mudanca de carreira sem base previa em TI ou seguranca.',
    caution:
      'Bom para orientacao e disciplina, mas sozinho nao vira sinal tecnico tao forte quanto labs e certs profissionais.',
    url: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
    tags: ['google', 'coursera', 'beginner', 'soc', 'linux', 'sql'],
  },
  {
    id: 'r-thm-presecurity',
    title: 'TryHackMe - Pre Security',
    provider: 'TryHackMe',
    type: 'LAB',
    cert: 'Fundamentos',
    level: 'ENTRY',
    category: 'DEFENSIVE_SECURITY',
    cost: 0,
    rating: 4.8,
    hours: 40,
    desc: 'Trilha interativa cobrindo rede, web, Linux e fundamentos de seguranca com ritmo amigavel para iniciantes.',
    bestFor: 'Quem aprende melhor praticando em pequenos blocos.',
    caution:
      'Parte mais forte e profunda exige assinatura; use como porta de entrada, nao como unica fonte.',
    url: 'https://tryhackme.com/path/outline/presecurity',
    tags: ['tryhackme', 'free', 'labs', 'beginner', 'hands-on'],
  },
  {
    id: 'r-splunk-fundamentals',
    title: 'Splunk Fundamentals 1',
    provider: 'Splunk',
    type: 'COURSE',
    cert: 'SOC / SIEM',
    level: 'ENTRY',
    category: 'DEFENSIVE_SECURITY',
    cost: 0,
    rating: 4.7,
    hours: 20,
    desc: 'Treinamento oficial de Splunk para aprender busca, dashboards e leitura de logs com uma stack amplamente usada em SOC.',
    bestFor:
      'SOC analyst junior, blue team e devs migrando para observabilidade e deteccao.',
    caution:
      'Treina a ferramenta, mas nao substitui casos reais de triagem e resposta.',
    url: 'https://www.splunk.com/en_us/training/free-courses/splunk-fundamentals-1.html',
    tags: ['splunk', 'siem', 'soc', 'free', 'blue-team'],
  },
  {
    id: 'r-bots',
    title: 'Boss of the SOC',
    provider: 'Splunk',
    type: 'LAB',
    cert: 'SOC / Detection',
    level: 'INTERMEDIATE',
    category: 'DEFENSIVE_SECURITY',
    cost: 0,
    rating: 4.8,
    hours: 12,
    desc: 'CTF de blue team focado em investigacao e busca em logs. Excelente para transformar teoria de SIEM em pratica.',
    bestFor:
      'Quem ja entendeu o basico de Splunk e quer comecar a investigar artefatos reais.',
    caution:
      'Pode frustrar iniciantes absolutos sem noção de logs, eventos e fluxo de triagem.',
    url: 'https://bots.splunk.com/',
    tags: ['splunk', 'soc', 'ctf', 'blue-team', 'free'],
  },
  {
    id: 'r-thm-soc1',
    title: 'TryHackMe - SOC Level 1',
    provider: 'TryHackMe',
    type: 'LAB',
    cert: 'CySA+ / SOC',
    level: 'INTERMEDIATE',
    category: 'DEFENSIVE_SECURITY',
    cost: 14,
    rating: 4.7,
    hours: 60,
    desc: 'Trilha pratica de SOC com SIEM, triagem, hunting e resposta. Boa ponte entre Security+ e trabalho defensivo mais tecnico.',
    bestFor:
      'Quem quer sair do estudo conceitual e ganhar repertorio para SOC e blue team.',
    caution: 'Funciona melhor depois de base em rede, Windows e logs.',
    url: 'https://tryhackme.com/path/outline/soclevel1',
    tags: ['soc', 'blue-team', 'cysa+', 'tryhackme', 'labs'],
  },
  {
    id: 'r-portswigger-academy',
    title: 'PortSwigger Web Security Academy',
    provider: 'PortSwigger',
    type: 'LAB',
    cert: 'AppSec / Web',
    level: 'INTERMEDIATE',
    category: 'APPLICATION_SECURITY',
    cost: 0,
    rating: 4.9,
    hours: 80,
    desc: 'Uma das melhores plataformas gratuitas para aprender web exploitation, autenticacao, authorization flaws e logica de aplicacao.',
    bestFor:
      'Devs migrando para AppSec, pentesters web e engenheiros de seguranca focados em aplicacoes.',
    caution:
      'Parte do valor vem da insistencia; nao e trilha curta nem passiva.',
    url: 'https://portswigger.net/web-security',
    tags: ['portswigger', 'burp', 'appsec', 'web', 'free', 'labs'],
  },
  {
    id: 'r-owasp-wstg',
    title: 'OWASP Web Security Testing Guide',
    provider: 'OWASP',
    type: 'GUIDE',
    cert: 'AppSec / Web',
    level: 'INTERMEDIATE',
    category: 'APPLICATION_SECURITY',
    cost: 0,
    rating: 4.8,
    hours: 30,
    desc: 'Referencia metodologica para testes em aplicacoes web e para organizar checklists de avaliacao.',
    bestFor:
      'Quem ja pratica web security e quer estrutura de metodologia e cobertura.',
    caution:
      'Nao e o melhor ponto de entrada sozinho; rende mais depois de labs e casos praticos.',
    url: 'https://owasp.org/www-project-web-security-testing-guide/',
    tags: ['owasp', 'web', 'guide', 'appsec', 'free'],
  },
  {
    id: 'r-htb-starting-point',
    title: 'Hack The Box - Starting Point',
    provider: 'Hack The Box',
    type: 'LAB',
    cert: 'eJPT / PNPT',
    level: 'ENTRY',
    category: 'OFFENSIVE_SECURITY',
    cost: 0,
    rating: 4.7,
    hours: 20,
    desc: 'Sequencia guiada de maquinas introdutorias para enumeracao, exploracao basica e pensamento ofensivo.',
    bestFor:
      'Quem ja tem fundamentos minimos de Linux e rede e quer entrar em ofensiva sem pular direto para maquinas aleatorias.',
    caution:
      'Nao e ideal como primeira experiencia tecnica se a pessoa ainda nao sabe o basico de terminal, IP e servicos.',
    url: 'https://www.hackthebox.com/starting-point',
    tags: ['htb', 'hackthebox', 'pentest', 'free', 'labs'],
  },
  {
    id: 'r-tcm-peh',
    title: 'TCM Security - Practical Ethical Hacking',
    provider: 'TCM Security',
    type: 'COURSE',
    cert: 'PNPT / Pentest',
    level: 'INTERMEDIATE',
    category: 'OFFENSIVE_SECURITY',
    cost: 30,
    rating: 4.9,
    hours: 25,
    desc: 'Curso pratico e direto para ofensiva com bom equilibrio entre metodologia, AD, web e escrita de relatorio.',
    bestFor:
      'Transicao para pentest com foco em habilidade pratica, nao so memorizacao.',
    caution:
      'Nao substitui muita hora de lab; use como guia e depois repita tecnica em ambientes proprios.',
    url: 'https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course',
    tags: ['tcm', 'pnpt', 'pentest', 'active-directory', 'course'],
  },
  {
    id: 'r-ippsec',
    title: 'ippsec Walkthroughs',
    provider: 'ippsec',
    type: 'VIDEO',
    cert: 'OSCP / CPTS',
    level: 'ADVANCED',
    category: 'OFFENSIVE_SECURITY',
    cost: 0,
    rating: 4.9,
    hours: 200,
    desc: 'Walkthroughs detalhados de maquinas com foco em raciocinio, enumeração e encadeamento de pistas.',
    bestFor:
      'Quem ja esta estudando boxes e quer observar metodologia de quem tem boa disciplina ofensiva.',
    caution:
      'Consumo passivo demais pode virar ilusao de progresso; assista depois de tentar sozinho.',
    url: 'https://www.youtube.com/@ippsec',
    tags: ['ippsec', 'oscp', 'cpts', 'youtube', 'free'],
  },
  {
    id: 'r-destination-cissp',
    title: 'Destination Certification CISSP MindMaps',
    provider: 'Destination Certification',
    type: 'VIDEO',
    cert: 'CISSP',
    level: 'ADVANCED',
    category: 'GOVERNANCE_RISK',
    cost: 0,
    rating: 4.8,
    hours: 25,
    desc: 'Serie excelente para revisar dominios do CISSP com visao macro e conexoes entre conceitos.',
    bestFor:
      'Quem ja esta estudando CISSP e quer consolidar estrutura mental do exame.',
    caution:
      'Revisao nao substitui leitura profunda do conteudo oficial e pratica de questoes.',
    url: 'https://www.youtube.com/@DestinationCertification',
    tags: ['cissp', 'isc2', 'leadership', 'youtube', 'free'],
  },
  {
    id: 'r-aws-skill-builder',
    title: 'AWS Skill Builder - Security Learning Plan',
    provider: 'AWS',
    type: 'COURSE',
    cert: 'AWS Security Specialty',
    level: 'ADVANCED',
    category: 'CLOUD_SECURITY',
    cost: 0,
    rating: 4.6,
    hours: 30,
    desc: 'Rota oficial de aprendizagem para IAM, monitoramento, KMS, deteccao e seguranca em servicos AWS.',
    bestFor:
      'Engenheiros que ja trabalham com AWS e querem consolidar seguranca na stack.',
    caution:
      'Tem melhor retorno quando a pessoa ja conhece servicos core da AWS no dia a dia.',
    url: 'https://skillbuilder.aws/',
    tags: ['aws', 'cloud', 'security', 'iam', 'official'],
  },
];

export const CERTIFICATIONS: GuideCertification[] = [
  {
    slug: 'isc2-cc',
    name: 'CC',
    fullName: 'ISC2 Certified in Cybersecurity',
    acronym: 'CC',
    provider: '(ISC)2',
    providerSlug: 'isc2',
    level: 'ENTRY',
    category: 'DEFENSIVE_SECURITY',
    description:
      'Credencial de entrada com treinamento oficial gratuito e baixo atrito para comecar. Boa para quem esta trocando de area e quer uma primeira validacao formal sem entrar direto em um exame mais amplo.',
    bestFor:
      'Career changers e iniciantes que precisam de um primeiro selo confiavel e uma trilha curta de fundamentos.',
    caution:
      'Se voce ja tem boa base em TI, redes ou desenvolvimento, pode nao ser a melhor alocacao de tempo antes de Security+ ou estudos por funcao.',
    marketSignal:
      'Bom sinal inicial e de confianca, mas raramente e o diferencial principal em vagas tecnicas.',
    studyHours: '30-50h',
    searchCost: '$199',
    examDuration: 120,
    numberOfQuestions: 100,
    passingScoreLabel: '700/1000',
    validityLabel: '3 anos',
    validityYears: 3,
    requiresRenewal: true,
    officialUrl: 'https://www.isc2.org/certifications/cc',
    recommendedExperience:
      'Nenhuma experiencia formal exigida; ajuda ter vocabulario basico de TI.',
    costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 199 }],
    objectives: [
      'Cobrir principios de seguranca e risco',
      'Entender controles de acesso e protecao de ativos',
      'Introduzir operacoes de seguranca e resposta a incidentes',
    ],
    topics: [
      'Security Principles',
      'Business Continuity',
      'Access Controls',
      'Network Security',
      'Security Operations',
    ],
    resources: [
      {
        name: 'ISC2 CC Self-Paced Training',
        type: 'Treinamento oficial',
        url: 'https://www.isc2.org/certifications/cc',
        free: true,
      },
      {
        name: 'Thor Teaches CC Prep',
        type: 'Video complementar',
        url: 'https://www.youtube.com/@ThorTeaches',
        free: true,
      },
    ],
  },
  {
    slug: 'comptia-security-plus',
    name: 'Security+',
    fullName: 'CompTIA Security+ SY0-701',
    acronym: 'SEC+',
    provider: 'CompTIA',
    providerSlug: 'comptia',
    level: 'ENTRY',
    category: 'DEFENSIVE_SECURITY',
    description:
      'Baseline generalista muito respeitada para quem quer entrar em cybersecurity, especialmente SOC, consultoria, suporte avancado e ambientes regulados.',
    bestFor: 'Primeira certificacao profissional para base ampla em seguranca.',
    caution:
      'Nao e certificacao pratica; precisa ser combinada com labs, logs, cloud ou web para gerar skill operacional real.',
    marketSignal:
      'Forte sinal entry-level e muito util em vagas com filtro de RH, governo e times generalistas.',
    studyHours: '80-120h',
    searchCost: '$404',
    examDuration: 90,
    numberOfQuestions: 90,
    passingScoreLabel: '750/900',
    validityLabel: '3 anos',
    validityYears: 3,
    requiresRenewal: true,
    officialUrl: 'https://www.comptia.org/en-us/certifications/security/',
    recommendedExperience:
      'CompTIA recomenda base previa de TI; 1-2 anos ajudam bastante, mas nao sao obrigatorios.',
    costs: [
      { region: 'NORTH_AMERICA', currency: 'USD', examCost: 404 },
      { region: 'EUROPE', currency: 'EUR', examCost: 344 },
    ],
    objectives: [
      'Cobrir threats, architecture, implementation e operations',
      'Criar linguagem comum para controles, IAM, cryptography e incident response',
      'Servir de base para SOC, analyst, consulting e trilhas posteriores',
    ],
    topics: [
      'Threats, Attacks and Vulnerabilities',
      'Architecture and Design',
      'Implementation',
      'Operations and Incident Response',
      'Governance, Risk and Compliance',
    ],
    resources: [
      {
        name: 'Professor Messer SY0-701',
        type: 'Video gratuito',
        url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/',
        free: true,
      },
      {
        name: 'Jason Dion Practice Exams',
        type: 'Simulados',
        url: 'https://www.udemy.com/user/jasonrobertdion/',
        free: false,
      },
      {
        name: 'TryHackMe Pre Security',
        type: 'Labs de apoio',
        url: 'https://tryhackme.com/path/outline/presecurity',
        free: true,
      },
    ],
  },
  {
    slug: 'google-cybersecurity',
    name: 'Google Cyber',
    fullName: 'Google Cybersecurity Professional Certificate',
    acronym: 'GCC',
    provider: 'Google / Coursera',
    providerSlug: 'google',
    level: 'ENTRY',
    category: 'DEFENSIVE_SECURITY',
    description:
      'Programa guiado para quem esta vindo do zero e precisa de disciplina, contexto e vocabulario de SOC, Linux, SQL e incident response.',
    bestFor:
      'Mudanca de carreira sem bagagem tecnica forte e quem prefere trilha bem estruturada.',
    caution:
      'Melhor como fundacao do que como prova final de prontidao tecnica.',
    marketSignal:
      'Bom ponto de partida curricular, mas o peso maior continua vindo de labs, portfolio e certs reconhecidas por funcao.',
    studyHours: '120-180h',
    searchCost: '~$49/mes',
    examDuration: 0,
    numberOfQuestions: 0,
    passingScoreLabel: 'Modular',
    validityLabel: 'Sem expirar',
    validityYears: 0,
    requiresRenewal: false,
    officialUrl:
      'https://www.coursera.org/professional-certificates/google-cybersecurity',
    recommendedExperience: 'Nenhuma experiencia previa exigida.',
    costs: [{ region: 'GLOBAL', currency: 'USD', examCost: 49 }],
    objectives: [
      'Introduzir fundamentos de seguranca, redes, Linux e SQL',
      'Apresentar tarefas de SOC, triagem e resposta a incidentes',
      'Criar disciplina de estudo para iniciantes',
    ],
    topics: [
      'Security Foundations',
      'Linux and SQL',
      'Incident Response',
      'Network Security',
      'Threats and Detection',
    ],
    resources: [
      {
        name: 'Google Cybersecurity Certificate',
        type: 'Programa oficial',
        url: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
        free: false,
      },
      {
        name: 'TryHackMe Pre Security',
        type: 'Pratica complementar',
        url: 'https://tryhackme.com/path/outline/presecurity',
        free: true,
      },
    ],
  },
  {
    slug: 'ejpt',
    name: 'eJPT',
    fullName: 'eJPT - Junior Penetration Tester',
    acronym: 'eJPT',
    provider: 'INE Security',
    providerSlug: 'ine',
    level: 'ENTRY',
    category: 'OFFENSIVE_SECURITY',
    description:
      'Entrada pratica para ofensiva com foco em metodologia, enumeracao e exploração basica em laboratorio.',
    bestFor:
      'Quem quer seguir trilha ofensiva depois de aprender rede, Linux e fundamentos web.',
    caution:
      'Nao e a melhor primeira certificacao para quem ainda esta decidindo entre blue team, governance e security engineering.',
    marketSignal:
      'Bom sinal tecnico inicial para ofensiva; melhor visto quando acompanhado de labs e progressao posterior.',
    studyHours: '60-100h',
    searchCost: '~$200+',
    examDuration: 1440,
    numberOfQuestions: 0,
    passingScoreLabel: 'Exame pratico',
    validityLabel: 'Sem expirar',
    validityYears: 0,
    requiresRenewal: false,
    officialUrl: 'https://security.ine.com/certifications/ejpt-certification/',
    recommendedExperience: 'Base em Linux, redes, HTTP e linha de comando.',
    costs: [{ region: 'GLOBAL', currency: 'USD', examCost: 200 }],
    objectives: [
      'Executar reconhecimento, scanning e exploracao basica',
      'Entender fluxo de um pentest introdutorio',
      'Ganhar confianca com hands-on em ambiente controlado',
    ],
    topics: [
      'Networking Fundamentals',
      'Host Discovery',
      'Enumeration',
      'Web App Basics',
      'Exploitation Basics',
      'Reporting',
    ],
    resources: [
      {
        name: 'INE Official Learning Path',
        type: 'Oficial',
        url: 'https://security.ine.com/certifications/ejpt-certification/',
        free: false,
      },
      {
        name: 'Hack The Box Starting Point',
        type: 'Lab complementar',
        url: 'https://www.hackthebox.com/starting-point',
        free: true,
      },
      {
        name: 'TCM Practical Ethical Hacking',
        type: 'Curso complementar',
        url: 'https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course',
        free: false,
      },
    ],
  },
  {
    slug: 'comptia-cysa-plus',
    name: 'CySA+',
    fullName: 'CompTIA Cybersecurity Analyst+',
    acronym: 'CySA+',
    provider: 'CompTIA',
    providerSlug: 'comptia',
    level: 'INTERMEDIATE',
    category: 'DEFENSIVE_SECURITY',
    description:
      'Certificacao defensiva intermediaria focada em analise, vulnerabilidades, deteccao, triagem e resposta.',
    bestFor:
      'SOC analyst, defender, vulnerability analyst e times de blue team em crescimento.',
    caution:
      'Tem melhor retorno depois de alguma experiencia com logs, alertas, EDR ou SIEM.',
    marketSignal:
      'Boa progressao para blue team; menos generalista que Security+ e mais conectada ao trabalho defensivo do dia a dia.',
    studyHours: '80-120h',
    searchCost: '$425',
    examDuration: 165,
    numberOfQuestions: 85,
    passingScoreLabel: '750/900',
    validityLabel: '3 anos',
    validityYears: 3,
    requiresRenewal: true,
    officialUrl:
      'https://www.comptia.org/en-us/certifications/cybersecurity-analyst/',
    recommendedExperience:
      'Seguranca operacional ou SOC ajuda bastante; CompTIA recomenda experiencia previa.',
    costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 425 }],
    objectives: [
      'Aprofundar deteccao, threat hunting e vulnerabilidade',
      'Conectar teoria a fluxos de analise e resposta',
      'Fortalecer trilha defensiva apos a base generalista',
    ],
    topics: [
      'Security Operations',
      'Vulnerability Management',
      'Incident Response',
      'Threat Intelligence',
      'Reporting and Communication',
    ],
    resources: [
      {
        name: 'TryHackMe SOC Level 1',
        type: 'Labs',
        url: 'https://tryhackme.com/path/outline/soclevel1',
        free: false,
      },
      {
        name: 'Splunk Fundamentals 1',
        type: 'Ferramenta de apoio',
        url: 'https://www.splunk.com/en_us/training/free-courses/splunk-fundamentals-1.html',
        free: true,
      },
    ],
  },
  {
    slug: 'pnpt',
    name: 'PNPT',
    fullName: 'Practical Network Penetration Tester',
    acronym: 'PNPT',
    provider: 'TCM Security',
    providerSlug: 'tcm-security',
    level: 'INTERMEDIATE',
    category: 'OFFENSIVE_SECURITY',
    description:
      'Certificacao pratica com foco em metodologia ofensiva, relatorio e execucao realista em ambiente controlado.',
    bestFor:
      'Quem quer sair de labs junior e provar capacidade mais pratica em pentest.',
    caution:
      'Tem boa credibilidade tecnica, mas reconhecimento de mercado ainda e mais irregular que OSCP em filtros tradicionais de RH.',
    marketSignal:
      'Forte entre praticantes e hiring managers mais tecnicos; especialmente boa para portfolio de transicao.',
    studyHours: '100-160h',
    searchCost: '$499',
    examDuration: 7200,
    numberOfQuestions: 0,
    passingScoreLabel: 'Exame pratico + relatorio',
    validityLabel: 'Sem expirar',
    validityYears: 0,
    requiresRenewal: false,
    officialUrl: 'https://certifications.tcm-sec.com/pnpt/',
    recommendedExperience:
      'Base previa em redes, Linux, AD basico e labs ofensivos.',
    costs: [{ region: 'GLOBAL', currency: 'USD', examCost: 499 }],
    objectives: [
      'Executar um fluxo ofensivo mais completo e comunicavel',
      'Treinar enumeracao, AD, relatorio e raciocinio',
      'Conectar estudo tecnico com entrega profissional',
    ],
    topics: [
      'Practical Ethical Hacking',
      'Active Directory',
      'Web App Testing',
      'OSINT',
      'Report Writing',
    ],
    resources: [
      {
        name: 'TCM Practical Ethical Hacking',
        type: 'Curso base',
        url: 'https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course',
        free: false,
      },
      {
        name: 'Hack The Box Starting Point',
        type: 'Entrada em labs',
        url: 'https://www.hackthebox.com/starting-point',
        free: true,
      },
    ],
  },
  {
    slug: 'ceh-certified-ethical-hacker',
    name: 'CEH',
    fullName: 'Certified Ethical Hacker',
    acronym: 'CEH',
    provider: 'EC-Council',
    providerSlug: 'ec-council',
    level: 'INTERMEDIATE',
    category: 'OFFENSIVE_SECURITY',
    description:
      'Certificacao conhecida de ethical hacking com cobertura ampla e boa visibilidade em ambientes de compliance, treinamento corporativo e alguns contextos governamentais.',
    bestFor:
      'Quem precisa do reconhecimento de marca em ambientes regulados ou onde o CEH aparece explicitamente no job description.',
    caution:
      'Nao costuma ser a primeira recomendacao quando o objetivo principal e provar profundidade pratica em pentest.',
    marketSignal:
      'Sinal de marca forte em parte do mercado, mas menos convincente tecnicamente que certs hands-on para ofensiva.',
    studyHours: '100-160h',
    searchCost: '~$1,199+',
    examDuration: 240,
    numberOfQuestions: 125,
    passingScoreLabel: 'Escala variavel',
    validityLabel: '3 anos',
    validityYears: 3,
    requiresRenewal: true,
    officialUrl:
      'https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/',
    recommendedExperience:
      'Base em seguranca e alguma familiaridade com redes e web.',
    costs: [{ region: 'GLOBAL', currency: 'USD', examCost: 1199 }],
    objectives: [
      'Cobrir metodologia de ethical hacking de forma ampla',
      'Introduzir vocabulario e fases do ataque',
      'Atender contextos que pedem CEH por politica ou visibilidade',
    ],
    topics: [
      'Footprinting',
      'Scanning',
      'Enumeration',
      'Vulnerability Analysis',
      'System Hacking',
      'Web Attacks',
      'Malware and Sniffing',
    ],
    resources: [
      {
        name: 'EC-Council Official Courseware',
        type: 'Material oficial',
        url: 'https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/',
        free: false,
      },
      {
        name: 'OWASP WSTG',
        type: 'Leitura complementar',
        url: 'https://owasp.org/www-project-web-security-testing-guide/',
        free: true,
      },
    ],
  },
  {
    slug: 'gpen',
    name: 'GPEN',
    fullName: 'GIAC Penetration Tester',
    acronym: 'GPEN',
    provider: 'GIAC / SANS',
    providerSlug: 'giac',
    level: 'INTERMEDIATE',
    category: 'OFFENSIVE_SECURITY',
    description:
      'Excelente credencial enterprise para pentest, associada ao ecossistema SANS/GIAC e muito forte quando financiada pela empresa.',
    bestFor:
      'Consultoria, pentest enterprise e profissionais com patrocinio corporativo.',
    caution:
      'Autofinanciamento e a maior barreira; o valor costuma ser alto para estudo independente.',
    marketSignal:
      'Sinal tecnico e de marca muito forte, especialmente em ambientes enterprise e consultoria.',
    studyHours: '120-180h',
    searchCost: 'premium',
    examDuration: 180,
    numberOfQuestions: 115,
    passingScoreLabel: '73%+',
    validityLabel: '4 anos',
    validityYears: 4,
    requiresRenewal: true,
    officialUrl: 'https://www.giac.org/certification/penetration-tester-gpen',
    recommendedExperience:
      'Boa base em pentest, protocolos, sistemas e metodologia.',
    costs: [{ region: 'GLOBAL', currency: 'USD', examCost: 979 }],
    objectives: [
      'Validar metodologia de pentest em contexto enterprise',
      'Cobrir reconhecimento, exploitation e pos-exploracao',
      'Trabalhar em paralelo com material tecnico de alto nivel',
    ],
    topics: [
      'Reconnaissance',
      'Scanning',
      'Password Attacks',
      'Web App Exploitation',
      'Active Directory',
      'Post-Exploitation',
    ],
    resources: [
      {
        name: 'SANS SEC560',
        type: 'Treinamento oficial',
        url: 'https://www.sans.org/cyber-security-courses/enterprise-penetration-testing/',
        free: false,
      },
      {
        name: 'Hack The Box Pro Labs',
        type: 'Lab complementar',
        url: 'https://www.hackthebox.com/hacker/pro-labs',
        free: false,
      },
    ],
  },
  {
    slug: 'aws-security-specialty',
    name: 'AWS Security',
    fullName: 'AWS Certified Security - Specialty',
    acronym: 'AWS-SEC',
    provider: 'Amazon Web Services',
    providerSlug: 'aws',
    level: 'ADVANCED',
    category: 'CLOUD_SECURITY',
    description:
      'Credencial forte para cloud security em ambientes AWS, especialmente para IAM, logging, KMS, deteccao e desenho seguro.',
    bestFor:
      'Security engineer, cloud engineer e platform engineers que ja operam AWS de verdade.',
    caution:
      'Nao e uma certificacao avancada generica para toda carreira em seguranca; brilha quando a stack e AWS.',
    marketSignal:
      'Bom sinal funcional para times cloud-native e engenharia de seguranca focada em AWS.',
    studyHours: '100-160h',
    searchCost: '$300',
    examDuration: 170,
    numberOfQuestions: 65,
    passingScoreLabel: 'Escala AWS',
    validityLabel: '3 anos',
    validityYears: 3,
    requiresRenewal: true,
    officialUrl:
      'https://aws.amazon.com/certification/certified-security-specialty/',
    recommendedExperience:
      'Experiencia pratica com IAM, CloudTrail, GuardDuty, KMS, VPC e monitoramento AWS.',
    costs: [{ region: 'GLOBAL', currency: 'USD', examCost: 300 }],
    objectives: [
      'Consolidar seguranca em identidade, monitoramento e protecao de dados na AWS',
      'Ajudar a validar experiencia de cloud security para times de engenharia',
      'Conectar conhecimento de plataforma com controles defensivos',
    ],
    topics: [
      'Incident Response',
      'Logging and Monitoring',
      'Infrastructure Security',
      'Identity and Access Management',
      'Data Protection',
    ],
    resources: [
      {
        name: 'AWS Skill Builder',
        type: 'Oficial',
        url: 'https://skillbuilder.aws/',
        free: true,
      },
      {
        name: 'AWS Ramp-Up Guide',
        type: 'Guia',
        url: 'https://d1.awsstatic.com/training-and-certification/ramp-up_guides/Security_Ramp-Up_Guide.pdf',
        free: true,
      },
    ],
  },
  {
    slug: 'htb-cpts',
    name: 'CPTS',
    fullName: 'HTB Certified Penetration Testing Specialist',
    acronym: 'CPTS',
    provider: 'Hack The Box',
    providerSlug: 'hackthebox',
    level: 'ADVANCED',
    category: 'OFFENSIVE_SECURITY',
    description:
      'Exame pratico e profundo do ecossistema HTB, muito forte para desenvolvimento tecnico ofensivo e escrita de relatorio.',
    bestFor:
      'Quem quer maturidade tecnica alta em ofensiva e gosta do estilo HTB Academy.',
    caution:
      'Reconhecimento de mercado esta crescendo, mas ainda e mais nichado que OSCP fora de hiring managers tecnicos.',
    marketSignal:
      'Otimo sinal tecnico; ainda menos universal que OSCP em filtros tradicionais.',
    studyHours: '200-320h',
    searchCost: '~$490+',
    examDuration: 10080,
    numberOfQuestions: 0,
    passingScoreLabel: 'Exame pratico + relatorio',
    validityLabel: 'Sem expirar',
    validityYears: 0,
    requiresRenewal: false,
    officialUrl:
      'https://academy.hackthebox.com/preview/certifications/htb-certified-penetration-testing-specialist',
    recommendedExperience:
      'Boa experiencia com HTB Academy, enumeração, pivoting e web exploitation.',
    costs: [{ region: 'GLOBAL', currency: 'USD', examCost: 490 }],
    objectives: [
      'Fortalecer profundidade ofensiva real em laboratorio',
      'Treinar raciocinio, escrita e cadeia de exploracao',
      'Funcionar como ponte forte para vagas ofensivas tecnicas',
    ],
    topics: [
      'Enumeration',
      'Web Attacks',
      'Active Directory',
      'Pivoting',
      'Privilege Escalation',
      'Report Writing',
    ],
    resources: [
      {
        name: 'HTB Academy CPTS Path',
        type: 'Oficial',
        url: 'https://academy.hackthebox.com',
        free: false,
      },
      {
        name: 'ippsec Walkthroughs',
        type: 'Complementar',
        url: 'https://www.youtube.com/@ippsec',
        free: true,
      },
    ],
  },
  {
    slug: 'oscp',
    name: 'OSCP',
    fullName: 'OffSec Certified Professional (OSCP+)',
    acronym: 'OSCP',
    provider: 'OffSec',
    providerSlug: 'offsec',
    level: 'ADVANCED',
    category: 'OFFENSIVE_SECURITY',
    description:
      'Credencial hands-on muito reconhecida para trilhas de pentest e red team, com exame exigente e alto peso em hiring técnico.',
    bestFor:
      'Profissionais realmente comprometidos com ofensiva e com muitas horas de lab acumuladas.',
    caution:
      'Investimento alto de tempo e dinheiro; impacto e muito menor se a meta principal nao for pentest ou red team.',
    marketSignal:
      'Um dos sinais praticos mais fortes para ofensiva, especialmente em mercados internacionais.',
    studyHours: '250-400h',
    searchCost: 'bundle OffSec',
    examDuration: 1440,
    numberOfQuestions: 0,
    passingScoreLabel: 'Exame pratico + relatorio',
    validityLabel: 'Consulte politica atual',
    validityYears: 0,
    requiresRenewal: false,
    officialUrl:
      'https://help.offsec.com/hc/en-us/articles/12483872278932-PEN-200-FAQ',
    recommendedExperience:
      'Linux, redes, web basico, AD, scripting e muita rotina de lab.',
    costs: [{ region: 'GLOBAL', currency: 'USD', examCost: 1499 }],
    objectives: [
      'Validar capacidade hands-on de ofensiva sob pressao',
      'Consolidar metodologia de pentest com autonomia',
      'Abrir portas em trilhas ofensivas internacionais',
    ],
    topics: [
      'Enumeration',
      'Web App Exploitation',
      'Privilege Escalation',
      'Pivoting',
      'Active Directory',
      'Report Writing',
    ],
    resources: [
      {
        name: 'OffSec PEN-200',
        type: 'Oficial',
        url: 'https://help.offsec.com/hc/en-us/articles/12483872278932-PEN-200-FAQ',
        free: false,
      },
      {
        name: 'TJ Null Prep List',
        type: 'Curadoria',
        url: 'https://docs.google.com/spreadsheets/d/1dwSMIAPIam0PuRBkCiDI88pU3yzrqqHkDtBngUHNCw8',
        free: true,
      },
      {
        name: 'ippsec Walkthroughs',
        type: 'Complementar',
        url: 'https://www.youtube.com/@ippsec',
        free: true,
      },
    ],
  },
  {
    slug: 'cissp',
    name: 'CISSP',
    fullName: 'Certified Information Systems Security Professional',
    acronym: 'CISSP',
    provider: '(ISC)2',
    providerSlug: 'isc2',
    level: 'ADVANCED',
    category: 'GOVERNANCE_RISK',
    description:
      'Credencial sênior de amplitude para arquitetura, lideranca tecnica, consultoria e programas de seguranca.',
    bestFor:
      'Profissionais experientes indo para arquitetura, consultoria senior, liderança técnica e programas amplos de segurança.',
    caution:
      'Nao e alvo de iniciante. O valor cresce muito quando voce ja tem anos de experiencia para contextualizar os dominios.',
    marketSignal:
      'Fortissimo para senioridade, amplitude e confianca de lideranca, especialmente fora da trilha puramente ofensiva.',
    studyHours: '180-280h',
    searchCost: '$749',
    examDuration: 180,
    numberOfQuestions: 150,
    passingScoreLabel: '700/1000',
    validityLabel: '3 anos',
    validityYears: 3,
    requiresRenewal: true,
    officialUrl: 'https://www.isc2.org/certifications/cissp',
    recommendedExperience:
      'Cinco anos de experiencia remunerada em dois ou mais dominios, ou caminho de Associate of ISC2.',
    costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 749 }],
    objectives: [
      'Cobrir os oito dominios de forma ampla e integrada',
      'Validar maturidade para desenhar e liderar programas de seguranca',
      'Servir como credencial de senioridade para arquitetura e governanca',
    ],
    topics: [
      'Security and Risk Management',
      'Asset Security',
      'Security Architecture',
      'Network Security',
      'IAM',
      'Security Assessment',
      'Security Operations',
      'Software Security',
    ],
    resources: [
      {
        name: 'Destination Certification MindMaps',
        type: 'Revisao',
        url: 'https://www.youtube.com/@DestinationCertification',
        free: true,
      },
      {
        name: 'ISC2 Self-Study Resources',
        type: 'Oficial',
        url: 'https://www.isc2.org/Training/Self-Study-Resources',
        free: false,
      },
    ],
  },
  {
    slug: 'cism',
    name: 'CISM',
    fullName: 'Certified Information Security Manager',
    acronym: 'CISM',
    provider: 'ISACA',
    providerSlug: 'isaca',
    level: 'ADVANCED',
    category: 'GOVERNANCE_RISK',
    description:
      'Credencial de gestão e governança para quem lidera risco, programas de seguranca e operacao em interface forte com o negocio.',
    bestFor:
      'Gestores, leaders de programa, GRC e profissionais sênior que precisam conectar segurança com governança e negocio.',
    caution:
      'Nao substitui vivencia tecnica; agrega mais depois de experiencia operacional real.',
    marketSignal:
      'Muito respeitada para gestão, GRC e lideranca de programa; menos orientada a execução tecnica do dia a dia.',
    studyHours: '120-180h',
    searchCost: '$575+',
    examDuration: 240,
    numberOfQuestions: 150,
    passingScoreLabel: '450/800',
    validityLabel: '3 anos',
    validityYears: 3,
    requiresRenewal: true,
    officialUrl: 'https://www.isaca.org/credentialing/cism',
    recommendedExperience:
      'ISACA exige experiencia relevante em gestao de seguranca; excelente apos anos de pratica.',
    costs: [{ region: 'NORTH_AMERICA', currency: 'USD', examCost: 575 }],
    objectives: [
      'Conectar seguranca com governanca, risco e programas',
      'Preparar para lideranca de operacao e estrategia',
      'Fortalecer trilha sênior em GRC e management',
    ],
    topics: [
      'Information Security Governance',
      'Information Risk Management',
      'Security Program Development and Management',
      'Incident Management',
    ],
    resources: [
      {
        name: 'ISACA CISM Exam Resources',
        type: 'Oficial',
        url: 'https://www.isaca.org/credentialing/cism/cism-exam-resources',
        free: false,
      },
      {
        name: 'ISACA QAE Database',
        type: 'Questoes',
        url: 'https://www.isaca.org/credentialing/cism',
        free: false,
      },
    ],
  },
];

export const CERTIFICATION_MAP = Object.fromEntries(
  CERTIFICATIONS.map((cert) => [cert.slug, cert])
) as Record<string, GuideCertification>;

export const CAREER_PATHS: Record<string, CareerPath> = {
  'foundations-to-soc': {
    id: 'foundations-to-soc',
    label: 'Foundations ⇒ SOC',
    color: '#3b82f6',
    rgb: '59,130,246',
    stage: 'ENTRY',
    stageLabel: 'Entry-Level',
    audience: 'Iniciantes e career switchers sem base forte em seguranca',
    fromRole: 'Zero a pouca experiencia em Cyber',
    toRole: 'SOC Analyst Junior / Blue Team Junior',
    team: 'blue',
    aliases: ['foundations-to-soc', 'soc', 'blue', 'beginner', 'entry', 'junior'],
    desc: 'Entrada realista para quem quer trabalhar com monitoramento, triagem e defesa',
    icon: '🛡️',
    goal: 'Construir base, ganhar contexto operacional e chegar pronto para vagas junior de SOC/blue team',
    totalHours: '220-340h',
    totalCost: '$0-$850',
    realityCheck:
      'A trilha mais contratavel para iniciantes costuma ser defensiva. O diferencial real vem de logs, labs, triagem e comunicacao, nao so do exame.',
    steps: [
      {
        order: 1,
        name: 'Fundamentos guiados',
        acronym: 'BASE',
        provider: 'Google / TryHackMe',
        level: 'ENTRY',
        color: '#3b82f6',
        hours: '60-120h',
        cost: 'baixo',
        duration: '4-8 semanas',
        why: 'Quem esta começando do zero aprende mais rapido quando combina estrutura guiada com pratica leve em Linux, rede e web. Isso reduz a chance de decorar termos sem contexto.',
        topics: [
          'Linux basico',
          'Redes',
          'HTTP',
          'Fundamentos de seguranca',
          'Vocabulário de SOC',
        ],
        resources: [
          {
            name: 'Google Cybersecurity Certificate',
            type: 'Curso estruturado',
            url: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
            free: false,
          },
          {
            name: 'TryHackMe Pre Security',
            type: 'Labs introdutorios',
            url: 'https://tryhackme.com/path/outline/presecurity',
            free: true,
          },
        ],
        outcome: 'Base para Security+ e melhor entendimento de vagas junior',
        href: '/resources?search=beginner',
        linkLabel: 'Ver recursos',
      },
      {
        order: 2,
        name: 'CompTIA Security+',
        acronym: 'SEC+',
        slug: 'comptia-security-plus',
        provider: 'CompTIA',
        level: 'ENTRY',
        color: '#3b82f6',
        hours: '80-120h',
        cost: '$404',
        duration: '6-10 semanas',
        why: 'Security+ continua sendo um dos melhores pontos de entrada para criar base transversal e passar filtros de RH para vagas junior ou generalistas.',
        topics: [
          'Threats',
          'IAM',
          'Network Security',
          'IR',
          'Risk & Compliance',
        ],
        resources: [
          {
            name: 'Professor Messer SY0-701',
            type: 'Video gratuito',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/',
            free: true,
          },
          {
            name: 'Jason Dion Practice Exams',
            type: 'Simulados',
            url: 'https://www.udemy.com/user/jasonrobertdion/',
            free: false,
          },
        ],
        outcome:
          'Sinal forte de base para SOC, support security e analyst roles',
      },
      {
        order: 3,
        name: 'Pratica de SIEM',
        acronym: 'SIEM',
        provider: 'Splunk',
        level: 'ENTRY',
        color: '#3b82f6',
        hours: '30-50h',
        cost: 'gratis',
        duration: '2-4 semanas',
        why: 'O que mais aproxima estudo de trabalho real em SOC e saber consultar logs, montar hipoteses e interpretar eventos.',
        topics: [
          'SPL',
          'Search',
          'Dashboards',
          'Triagem',
          'Casos de investigacao',
        ],
        resources: [
          {
            name: 'Splunk Fundamentals 1',
            type: 'Treinamento oficial',
            url: 'https://www.splunk.com/en_us/training/free-courses/splunk-fundamentals-1.html',
            free: true,
          },
          {
            name: 'Boss of the SOC',
            type: 'Lab/CTF',
            url: 'https://bots.splunk.com/',
            free: true,
          },
        ],
        outcome: 'Portfolio prático mais convincente para vagas de SOC junior',
        href: '/resources?search=splunk',
        linkLabel: 'Ver recursos',
      },
      {
        order: 4,
        name: 'CompTIA CySA+',
        acronym: 'CySA+',
        slug: 'comptia-cysa-plus',
        provider: 'CompTIA',
        level: 'INTERMEDIATE',
        color: '#3b82f6',
        hours: '80-120h',
        cost: '$425',
        duration: '6-10 semanas',
        why: 'CySA+ faz sentido depois que a pessoa ja viu alerta, log, hunting ou vulnerabilidade. A certificacao encaixa bem quando voce quer subir de base generalista para defensiva.',
        topics: [
          'Threat hunting',
          'Vulnerability management',
          'IR',
          'Reporting',
          'Detection',
        ],
        resources: [
          {
            name: 'TryHackMe SOC Level 1',
            type: 'Labs',
            url: 'https://tryhackme.com/path/outline/soclevel1',
            free: false,
          },
          {
            name: 'Splunk Fundamentals 1',
            type: 'Ferramenta de apoio',
            url: 'https://www.splunk.com/en_us/training/free-courses/splunk-fundamentals-1.html',
            free: true,
          },
        ],
        outcome:
          'SOC analyst mais forte, blue team junior/pleno e roles de deteccao',
      },
    ],
  },
  'it-to-cyber-transition': {
    id: 'it-to-cyber-transition',
    label: 'IT ⇒ Cyber Transition',
    color: '#14b8a6',
    rgb: '20,184,166',
    stage: 'TRANSITION',
    stageLabel: 'Career Transition',
    audience: 'Profissionais experientes de infra, suporte, redes, cloud ou devops migrando para Cyber',
    fromRole: 'Profissional de TI experiente',
    toRole: 'CyberSec Analyst / Security Engineer de entrada',
    team: 'hybrid',
    aliases: ['it-to-cyber-transition', 'transition', 'career-switch', 'career-transition', 'switcher'],
    desc: 'Migracao orientada ao mercado para quem ja vem de outra area de TI e quer entrar em Cyber com menos retrabalho',
    icon: '🧭',
    goal: 'Aproveitar repertorio previo de TI para entrar em Cyber de forma mais rapida, realista e empregavel',
    totalHours: '180-300h',
    totalCost: '$0-$900',
    realityCheck:
      'Quem ja vem de TI nao precisa recomeçar do zero. O maior ganho costuma vir de traduzir experiencia anterior em linguagem de risco, deteccao, controle e evidencias praticas para vaga.',
    steps: [
      {
        order: 1,
        name: 'Mapear lacunas de Cyber',
        acronym: 'GAP',
        provider: 'Google / TryHackMe',
        level: 'ENTRY',
        color: '#14b8a6',
        hours: '30-60h',
        cost: 'baixo',
        duration: '2-4 semanas',
        why: 'Profissionais de TI ja trazem bagagem em rede, sistemas, cloud ou automacao. O primeiro passo e identificar o que falta em ameacas, IAM, IR e controles, sem voltar ao basico que voce ja domina.',
        topics: [
          'Threat landscape',
          'IAM',
          'Risk basics',
          'IR fundamentals',
          'Security vocabulary',
        ],
        resources: [
          {
            name: 'Google Cybersecurity Certificate',
            type: 'Estrutura guiada',
            url: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
            free: false,
          },
          {
            name: 'TryHackMe Pre Security',
            type: 'Labs introdutorios',
            url: 'https://tryhackme.com/path/outline/presecurity',
            free: true,
          },
        ],
        outcome: 'Visao clara do que falta aprender para conversar e operar em Cyber',
        href: '/resources?search=google',
        linkLabel: 'Ver fundamentos',
      },
      {
        order: 2,
        name: 'CompTIA Security+',
        acronym: 'SEC+',
        slug: 'comptia-security-plus',
        provider: 'CompTIA',
        level: 'ENTRY',
        color: '#14b8a6',
        hours: '70-110h',
        cost: '$404',
        duration: '5-9 semanas',
        why: 'Security+ costuma ser o melhor tradutor entre experiencia tecnica previa e expectativa de mercado para uma primeira vaga ou migracao formal para Cyber.',
        topics: [
          'Threats',
          'IAM',
          'Network Security',
          'IR',
          'Governance basics',
        ],
        resources: [
          {
            name: 'Professor Messer SY0-701',
            type: 'Video gratuito',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/',
            free: true,
          },
          {
            name: 'Jason Dion Practice Exams',
            type: 'Simulados',
            url: 'https://www.udemy.com/user/jasonrobertdion/',
            free: false,
          },
        ],
        outcome: 'Base reconhecida para migracao e entrevistas iniciais',
      },
      {
        order: 3,
        name: 'Escolher direcao operacional',
        acronym: 'TRACK',
        provider: 'Splunk / PortSwigger / AWS',
        level: 'INTERMEDIATE',
        color: '#14b8a6',
        hours: '40-90h',
        cost: 'variavel',
        duration: '4-8 semanas',
        why: 'A transicao fica mais convincente quando voce aponta para um papel real. Infra tende a conversar bem com blue/cloud; devops e dev tendem a acelerar em appsec e security engineering.',
        topics: [
          'SIEM',
          'AppSec',
          'Cloud security',
          'Threat modeling',
          'Detection basics',
        ],
        resources: [
          {
            name: 'Splunk Fundamentals 1',
            type: 'Blue team / SOC',
            url: 'https://www.splunk.com/en_us/training/free-courses/splunk-fundamentals-1.html',
            free: true,
          },
          {
            name: 'PortSwigger Web Security Academy',
            type: 'AppSec',
            url: 'https://portswigger.net/web-security',
            free: true,
          },
          {
            name: 'AWS Skill Builder',
            type: 'Cloud',
            url: 'https://skillbuilder.aws/',
            free: true,
          },
        ],
        outcome: 'Narrativa mais forte para a vaga que voce realmente quer disputar',
        href: '/resources',
        linkLabel: 'Explorar trilhas',
      },
      {
        order: 4,
        name: 'Validar por portfolio ou cert funcional',
        acronym: 'PROVE',
        provider: 'Splunk / CompTIA / AWS',
        level: 'INTERMEDIATE',
        color: '#14b8a6',
        hours: '40-80h',
        cost: 'variavel',
        duration: '4-8 semanas',
        why: 'Depois da base, vale provar aderencia ao caminho escolhido: CySA+ para blue team, AWS Security para cloud ou portfolio forte de AppSec para security engineering.',
        topics: [
          'Portfolio',
          'Case studies',
          'Detection',
          'Cloud controls',
          'Interview readiness',
        ],
        resources: [
          {
            name: 'TryHackMe SOC Level 1',
            type: 'Blue team',
            url: 'https://tryhackme.com/path/outline/soclevel1',
            free: false,
          },
          {
            name: 'AWS Ramp-Up Guide',
            type: 'Cloud guide',
            url: 'https://d1.awsstatic.com/training-and-certification/ramp-up_guides/Security_Ramp-Up_Guide.pdf',
            free: true,
          },
        ],
        outcome: 'Transicao com prova de aderencia ao mercado, nao so com teoria',
      },
    ],
  },
  'dev-to-security-engineer': {
    id: 'dev-to-security-engineer',
    label: 'Dev ⇒ Security Engineer',
    color: '#06b6d4',
    rgb: '6,182,212',
    stage: 'MID',
    stageLabel: 'Mid-Level',
    audience: 'Desenvolvedores, devops e platform engineers migrando para seguranca',
    fromRole: 'Dev / DevOps / Platform',
    toRole: 'Security Engineer / AppSec Engineer',
    team: 'hybrid',
    aliases: ['dev-to-security-engineer', 'dev-security', 'security-engineer', 'appsec', 'engineering'],
    desc: 'Transicao para AppSec, cloud security e engenharia de seguranca sem perder o background de desenvolvimento',
    icon: '🔀',
    goal: 'Usar base de software para migrar para seguranca com mais rapidez e mais aderencia a engenharia',
    totalHours: '240-380h',
    totalCost: '$0-$1,100',
    realityCheck:
      'Para devs, certificacao ajuda, mas o diferencial real costuma ser secure coding, cloud, threat modeling, revisao de vulnerabilidades e portfolio tecnico.',
    steps: [
      {
        order: 1,
        name: 'CompTIA Security+',
        acronym: 'SEC+',
        slug: 'comptia-security-plus',
        provider: 'CompTIA',
        level: 'ENTRY',
        color: '#06b6d4',
        hours: '60-90h',
        cost: '$404',
        duration: '4-8 semanas',
        why: 'Para devs, o ganho maior nao e aprender tecnologia de novo, e sim ganhar linguagem de risco, controle, IAM, arquitetura e operacoes para conversar com times de seguranca.',
        topics: [
          'Risk',
          'IAM',
          'Architecture',
          'Threats',
          'Security Operations',
        ],
        resources: [
          {
            name: 'Professor Messer SY0-701',
            type: 'Video gratuito',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/',
            free: true,
          },
          {
            name: 'Jason Dion Practice Exams',
            type: 'Simulados',
            url: 'https://www.udemy.com/user/jasonrobertdion/',
            free: false,
          },
        ],
        outcome:
          'Base comum para transicao e melhor leitura de vagas de security engineering',
      },
      {
        order: 2,
        name: 'AppSec hands-on',
        acronym: 'APPSEC',
        provider: 'PortSwigger / OWASP',
        level: 'INTERMEDIATE',
        color: '#06b6d4',
        hours: '80-140h',
        cost: 'gratis',
        duration: '6-12 semanas',
        why: 'Devs ganham vantagem real quando entendem autenticacao, autorizacao, business logic flaws, SSRF, deserializacao e secure design na pratica.',
        topics: [
          'Burp Suite',
          'Auth flaws',
          'Access control',
          'Injection',
          'Logic bugs',
        ],
        resources: [
          {
            name: 'PortSwigger Web Security Academy',
            type: 'Labs',
            url: 'https://portswigger.net/web-security',
            free: true,
          },
          {
            name: 'OWASP Web Security Testing Guide',
            type: 'Guia',
            url: 'https://owasp.org/www-project-web-security-testing-guide/',
            free: true,
          },
        ],
        outcome:
          'Portifolio e skill mais proximos de AppSec do que qualquer prova teorica sozinha',
        href: '/resources?search=web',
        linkLabel: 'Ver recursos',
      },
      {
        order: 3,
        name: 'AWS Security Specialty',
        acronym: 'AWS-SEC',
        slug: 'aws-security-specialty',
        provider: 'AWS',
        level: 'ADVANCED',
        color: '#06b6d4',
        hours: '100-160h',
        cost: '$300',
        duration: '6-10 semanas',
        why: 'Muitos caminhos de security engineering hoje passam por IAM, logging, encryption, guardrails e deteccao em cloud. Em stack AWS, essa credencial encaixa muito melhor que perseguir ofensiva por moda.',
        topics: [
          'IAM',
          'KMS',
          'CloudTrail',
          'GuardDuty',
          'Infrastructure security',
        ],
        resources: [
          {
            name: 'AWS Skill Builder',
            type: 'Oficial',
            url: 'https://skillbuilder.aws/',
            free: true,
          },
          {
            name: 'AWS Ramp-Up Guide',
            type: 'Guia',
            url: 'https://d1.awsstatic.com/training-and-certification/ramp-up_guides/Security_Ramp-Up_Guide.pdf',
            free: true,
          },
        ],
        outcome:
          'Cloud security engineer, platform security e security engineering em stack AWS',
      },
      {
        order: 4,
        name: 'Escolha de profundidade',
        acronym: 'TRACK',
        provider: 'HTB / TCM / OffSec',
        level: 'ADVANCED',
        color: '#06b6d4',
        hours: '80-180h',
        cost: 'variavel',
        duration: '8-16 semanas',
        why: 'Depois da base, o melhor proximo passo depende do papel desejado: mais web/appsec, mais cloud, ou mais ofensiva para pentest e security validation.',
        topics: [
          'Web exploitation',
          'AD',
          'Threat modeling',
          'Cloud hardening',
          'Validation',
        ],
        resources: [
          {
            name: 'TCM Practical Ethical Hacking',
            type: 'Ofensiva aplicada',
            url: 'https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course',
            free: false,
          },
          {
            name: 'HTB CPTS Path',
            type: 'Profundidade ofensiva',
            url: 'https://academy.hackthebox.com',
            free: false,
          },
        ],
        outcome: 'Trilha mais aderente ao papel real que voce quer assumir',
        href: '/resources',
        linkLabel: 'Explorar recursos',
      },
    ],
  },
  'pentest-red-team': {
    id: 'pentest-red-team',
    label: 'Pentest / Red Team',
    color: '#ef4444',
    rgb: '239,68,68',
    stage: 'MID',
    stageLabel: 'Mid-Level',
    audience: 'Quem quer ofensiva pratica e pretende construir profundidade tecnica',
    fromRole: 'Base tecnica pronta para ofensiva',
    toRole: 'Pentester Junior / Mid-Level / Red Team',
    team: 'red',
    aliases: ['pentest-red-team', 'pentest', 'red', 'offensive', 'intermediate'],
    desc: 'Trilha ofensiva pratica, sem pular etapas e sem depender de certificacao teorica como prova de habilidade',
    icon: '🎯',
    goal: 'Construir base ofensiva realista e chegar a uma credencial hands-on forte',
    totalHours: '260-460h',
    totalCost: '$200-$2,000+',
    realityCheck:
      'No mercado ofensivo, o que pesa mesmo e prova pratica: labs, writeups, report writing, autonomia de enumeracao e algumas certs hands-on bem escolhidas.',
    steps: [
      {
        order: 1,
        name: 'Base ofensiva',
        acronym: 'LABS',
        provider: 'TryHackMe / HTB',
        level: 'ENTRY',
        color: '#ef4444',
        hours: '60-100h',
        cost: 'baixo',
        duration: '4-8 semanas',
        why: 'Antes de qualquer certificacao ofensiva, voce precisa conseguir enumerar, entender servicos, testar web e operar Linux com autonomia.',
        topics: [
          'Linux',
          'Networking',
          'Enumeration',
          'Web basics',
          'Privilege escalation basics',
        ],
        resources: [
          {
            name: 'TryHackMe Pre Security',
            type: 'Fundacao',
            url: 'https://tryhackme.com/path/outline/presecurity',
            free: true,
          },
          {
            name: 'Hack The Box Starting Point',
            type: 'Labs guiados',
            url: 'https://www.hackthebox.com/starting-point',
            free: true,
          },
        ],
        outcome:
          'Preparacao para escolher a primeira cert ofensiva com menos atrito',
        href: '/resources?search=pentest',
        linkLabel: 'Ver recursos',
      },
      {
        order: 2,
        name: 'eJPT',
        acronym: 'eJPT',
        slug: 'ejpt',
        provider: 'INE Security',
        level: 'ENTRY',
        color: '#ef4444',
        hours: '60-100h',
        cost: '~$200+',
        duration: '4-8 semanas',
        why: 'eJPT continua sendo uma boa porta de entrada se o objetivo e validar ofensiva inicial com exame pratico em vez de multipla escolha.',
        topics: [
          'Host discovery',
          'Scanning',
          'Web basics',
          'Enumeration',
          'Reporting',
        ],
        resources: [
          {
            name: 'INE Official Path',
            type: 'Oficial',
            url: 'https://security.ine.com/certifications/ejpt-certification/',
            free: false,
          },
          {
            name: 'Hack The Box Starting Point',
            type: 'Labs',
            url: 'https://www.hackthebox.com/starting-point',
            free: true,
          },
        ],
        outcome:
          'Primeiro sinal tecnico ofensivo para quem esta saindo da base',
      },
      {
        order: 3,
        name: 'PNPT ou CPTS',
        acronym: 'MID',
        provider: 'TCM / HTB',
        level: 'INTERMEDIATE',
        color: '#ef4444',
        hours: '120-220h',
        cost: '$499+',
        duration: '8-14 semanas',
        why: 'Aqui voce escolhe entre uma trilha pratica com bastante foco em entrega profissional e AD (PNPT) ou profundidade tecnica com o ecossistema HTB (CPTS).',
        topics: [
          'Active Directory',
          'Web exploitation',
          'Report writing',
          'Pivoting',
          'Methodology',
        ],
        resources: [
          {
            name: 'TCM Practical Ethical Hacking',
            type: 'PNPT base',
            url: 'https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course',
            free: false,
          },
          {
            name: 'HTB Academy CPTS Path',
            type: 'CPTS base',
            url: 'https://academy.hackthebox.com',
            free: false,
          },
        ],
        outcome:
          'Capacidade ofensiva mais convincente para vagas junior/pleno de pentest',
        href: '/resources?search=pnpt',
        linkLabel: 'Comparar recursos',
      },
      {
        order: 4,
        name: 'OSCP',
        acronym: 'OSCP',
        slug: 'oscp',
        provider: 'OffSec',
        level: 'ADVANCED',
        color: '#ef4444',
        hours: '250-400h',
        cost: 'bundle OffSec',
        duration: '3-6 meses',
        why: 'OSCP faz sentido quando a pessoa ja esta decididamente na trilha ofensiva e com muita hora de lab. Antes disso, costuma ser um salto caro demais e improdutivo.',
        topics: [
          'Enumeration',
          'AD',
          'Privilege escalation',
          'Pivoting',
          'Reporting',
        ],
        resources: [
          {
            name: 'OffSec PEN-200',
            type: 'Oficial',
            url: 'https://help.offsec.com/hc/en-us/articles/12483872278932-PEN-200-FAQ',
            free: false,
          },
          {
            name: 'TJ Null Prep List',
            type: 'Curadoria',
            url: 'https://docs.google.com/spreadsheets/d/1dwSMIAPIam0PuRBkCiDI88pU3yzrqqHkDtBngUHNCw8',
            free: true,
          },
          {
            name: 'ippsec Walkthroughs',
            type: 'Video complementar',
            url: 'https://www.youtube.com/@ippsec',
            free: true,
          },
        ],
        outcome: 'Sinal ofensivo muito forte para pentest e red team',
      },
    ],
  },
  'architecture-leadership': {
    id: 'architecture-leadership',
    label: 'Architecture / Leadership',
    color: '#f59e0b',
    rgb: '245,158,11',
    stage: 'SENIOR',
    stageLabel: 'Senior-Level',
    audience: 'Profissionais com experiencia real que precisam sinalizar amplitude, decisao e lideranca',
    fromRole: 'Security Engineer / Lead / Consultant experiente',
    toRole: 'Security Architect / Security Manager / Leadership',
    team: 'purple',
    aliases: ['architecture-leadership', 'advanced', 'senior', 'leadership', 'architect', 'purple'],
    desc: 'Trilha para senioridade, arquitetura, governanca e lideranca',
    icon: '🏗️',
    goal: 'Traduzir experiencia pratica em credenciais de amplitude e decisao',
    totalHours: '220-360h',
    totalCost: '$575-$1,500',
    realityCheck:
      'Essas credenciais funcionam muito melhor como amplificadoras de experiencia real do que como atalhos. Sem vivencia, o retorno tende a ser baixo.',
    steps: [
      {
        order: 1,
        name: 'Security breadth',
        acronym: 'BREADTH',
        provider: 'Experiencia + revisao',
        level: 'INTERMEDIATE',
        color: '#f59e0b',
        hours: '40-60h',
        cost: 'variavel',
        duration: '3-4 semanas',
        why: 'Antes de buscar uma cert senior, vale consolidar lacunas de arquitetura, cloud, software security e operacao para nao estudar os dominios no vacuo.',
        topics: [
          'Architecture',
          'Risk',
          'IAM',
          'Operations',
          'Software security',
        ],
        resources: [
          {
            name: 'Destination Certification CISSP MindMaps',
            type: 'Revisao',
            url: 'https://www.youtube.com/@DestinationCertification',
            free: true,
          },
          {
            name: 'AWS Skill Builder',
            type: 'Cloud security complementar',
            url: 'https://skillbuilder.aws/',
            free: true,
          },
        ],
        outcome: 'Melhor prontidao para CISSP e arquitetura mais ampla',
        href: '/resources?search=cissp',
        linkLabel: 'Ver recursos',
      },
      {
        order: 2,
        name: 'CISSP',
        acronym: 'CISSP',
        slug: 'cissp',
        provider: '(ISC)2',
        level: 'ADVANCED',
        color: '#f59e0b',
        hours: '180-280h',
        cost: '$749',
        duration: '8-14 semanas',
        why: 'CISSP e excelente quando voce ja precisa sinalizar senioridade, amplitude e confianca para arquitetura, consultoria e gestao de programas.',
        topics: [
          'Risk',
          'Architecture',
          'IAM',
          'Operations',
          'Software security',
        ],
        resources: [
          {
            name: 'Destination Certification MindMaps',
            type: 'Revisao',
            url: 'https://www.youtube.com/@DestinationCertification',
            free: true,
          },
          {
            name: 'ISC2 Self-Study Resources',
            type: 'Oficial',
            url: 'https://www.isc2.org/Training/Self-Study-Resources',
            free: false,
          },
        ],
        outcome:
          'Arquitetura, consultoria senior, lead security engineer e programa de seguranca',
      },
      {
        order: 3,
        name: 'CISM',
        acronym: 'CISM',
        slug: 'cism',
        provider: 'ISACA',
        level: 'ADVANCED',
        color: '#f59e0b',
        hours: '120-180h',
        cost: '$575+',
        duration: '6-10 semanas',
        why: 'CISM complementa muito bem quem ja esta liderando risco, programa, operacao ou governanca e precisa linguagem ainda mais conectada ao negocio.',
        topics: [
          'Governance',
          'Risk management',
          'Security program',
          'Incident management',
        ],
        resources: [
          {
            name: 'ISACA CISM Exam Resources',
            type: 'Oficial',
            url: 'https://www.isaca.org/credentialing/cism/cism-exam-resources',
            free: false,
          },
          {
            name: 'ISACA QAE Database',
            type: 'Questoes',
            url: 'https://www.isaca.org/credentialing/cism',
            free: false,
          },
        ],
        outcome:
          'Management, GRC, program leadership e roles de confianca executiva',
      },
    ],
  },
};

export const CAREER_PATH_LIST = Object.values(CAREER_PATHS);

export function resolveCareerPath(input?: string | null) {
  if (!input) return null;

  const normalized = input.trim().toLowerCase();

  return (
    CAREER_PATH_LIST.find(
      (path) =>
        path.id === normalized ||
        path.label.toLowerCase() === normalized ||
        path.aliases.some((alias) => alias.toLowerCase() === normalized) ||
        path.toRole.toLowerCase() === normalized ||
        path.fromRole.toLowerCase() === normalized
    ) ?? null
  );
}

export function getCareerStageMeta(stage: CareerStage) {
  return CAREER_STAGE_META[stage];
}
