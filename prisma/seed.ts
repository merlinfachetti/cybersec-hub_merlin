import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * Prisma 7: PrismaClient precisa ser construído com options válidas.
 * Como você está usando Postgres direto, usamos driver adapter (adapter-pg).
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {
  console.log('🌱 Starting seed...');

  // Limpar dados existentes (cuidado em produção!)
  await prisma.resource.deleteMany();
  await prisma.certificationSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.marketRecognition.deleteMany();
  await prisma.certificationCost.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.provider.deleteMany();

  console.log('🗑️  Cleared existing data');

  // ==================== PROVIDERS ====================

  const comptia = await prisma.provider.create({
    data: {
      name: 'CompTIA',
      slug: 'comptia',
      website: 'https://www.comptia.org',
      description: 'The Computing Technology Industry Association',
      country: 'US',
    },
  });

  const ecCouncil = await prisma.provider.create({
    data: {
      name: 'EC-Council',
      slug: 'ec-council',
      website: 'https://www.eccouncil.org',
      description: 'International Council of E-Commerce Consultants',
      country: 'US',
    },
  });

  const offensiveSecurity = await prisma.provider.create({
    data: {
      name: 'Offensive Security',
      slug: 'offensive-security',
      website: 'https://www.offsec.com',
      description: 'Provider of hands-on penetration testing certifications',
      country: 'US',
    },
  });

  const isc2 = await prisma.provider.create({
    data: {
      name: 'ISC²',
      slug: 'isc2',
      website: 'https://www.isc2.org',
      description:
        'International Information System Security Certification Consortium',
      country: 'US',
    },
  });

  console.log('✅ Created providers');

  // ==================== SKILLS ====================

  const networkSecurity = await prisma.skill.create({
    data: {
      name: 'Network Security',
      slug: 'network-security',
      category: 'Technical',
      description:
        'Understanding of network protocols, firewalls, VPNs, and network defense',
    },
  });

  const cryptography = await prisma.skill.create({
    data: {
      name: 'Cryptography',
      slug: 'cryptography',
      category: 'Technical',
      description: 'Encryption, hashing, digital signatures, and PKI',
    },
  });

  const incidentResponse = await prisma.skill.create({
    data: {
      name: 'Incident Response',
      slug: 'incident-response',
      category: 'Technical',
      description: 'Handling security incidents, forensics, and recovery',
    },
  });

  const pentesting = await prisma.skill.create({
    data: {
      name: 'Penetration Testing',
      slug: 'penetration-testing',
      category: 'Technical',
      description:
        'Offensive security techniques, exploitation, and vulnerability assessment',
    },
  });

  const pythonSecurity = await prisma.skill.create({
    data: {
      name: 'Python for Security',
      slug: 'python-security',
      category: 'Technical',
      description:
        'Using Python for security automation, scripting, and tool development',
    },
  });

  const linuxSecurity = await prisma.skill.create({
    data: {
      name: 'Linux Security',
      slug: 'linux-security',
      category: 'Technical',
      description:
        'Linux system hardening, privilege escalation, and security tools',
    },
  });

  console.log('✅ Created skills');

  // ==================== CERTIFICATIONS ====================

  // 1. CompTIA Security+
  const securityPlus = await prisma.certification.create({
    data: {
      name: 'Security+',
      slug: 'comptia-security-plus',
      fullName: 'CompTIA Security+ (SY0-701)',
      acronym: 'Sec+',
      providerId: comptia.id,
      level: 'ENTRY',
      category: 'DEFENSIVE_SECURITY',
      description:
        'CompTIA Security+ is a global certification that validates the baseline skills necessary to perform core security functions and pursue an IT security career.',
      objectives: [
        'Assess the security posture of an enterprise environment',
        'Recommend and implement appropriate security solutions',
        'Monitor and secure hybrid environments',
        'Operate with an awareness of applicable laws and policies',
        'Identify, analyze, and respond to security events and incidents',
      ],
      targetAudience:
        'IT professionals with 2 years of hands-on experience working in a security/systems administrator job role',
      recommendedExperience: 'Network+ or equivalent knowledge',
      examFormat: '90 multiple choice and performance-based questions',
      examDuration: 90,
      numberOfQuestions: 90,
      passingScore: 750,
      examLanguages: ['en', 'ja', 'pt', 'de', 'es'],
      validityYears: 3,
      requiresRenewal: true,
      renewalRequirements: 'Earn 50 CEUs over 3 years',
      officialUrl: 'https://www.comptia.org/certifications/security',
      costs: {
        create: [
          {
            region: 'NORTH_AMERICA',
            country: 'US',
            currency: 'USD',
            examCost: 370,
            officialTraining: 1500,
            renewalCost: 50,
          },
          {
            region: 'EUROPE',
            country: 'DE',
            currency: 'EUR',
            examCost: 370,
            officialTraining: 1200,
            renewalCost: 50,
          },
          {
            region: 'SOUTH_AMERICA',
            country: 'BR',
            currency: 'BRL',
            examCost: 1850,
            officialTraining: 3500,
            renewalCost: 250,
          },
        ],
      },
      marketRecognition: {
        create: [
          {
            region: 'NORTH_AMERICA',
            country: 'US',
            demandLevel: 'CRITICAL',
            jobPostingsCount: 45000,
            averageSalaryImpact: 12,
            juniorSalaryRange: '$55k-70k',
            midSalaryRange: '$75k-95k',
            seniorSalaryRange: '$100k-130k',
            topCompanies: ['Microsoft', 'Amazon', 'Google', 'Lockheed Martin'],
            governmentRequired: true,
          },
          {
            region: 'EUROPE',
            country: 'DE',
            demandLevel: 'HIGH',
            jobPostingsCount: 3500,
            averageSalaryImpact: 15,
            juniorSalaryRange: '€45k-55k',
            midSalaryRange: '€60k-75k',
            seniorSalaryRange: '€80k-100k',
            topCompanies: ['Siemens', 'SAP', 'Deutsche Telekom', 'Bosch'],
          },
          {
            region: 'SOUTH_AMERICA',
            country: 'BR',
            demandLevel: 'MEDIUM',
            jobPostingsCount: 1200,
            averageSalaryImpact: 10,
            juniorSalaryRange: 'R$60k-80k',
            midSalaryRange: 'R$90k-120k',
            seniorSalaryRange: 'R$130k-180k',
            topCompanies: ['Itaú', 'Banco do Brasil', 'Petrobras', 'Vale'],
          },
        ],
      },
      skills: {
        create: [
          { skillId: networkSecurity.id, importance: 'CORE' },
          { skillId: cryptography.id, importance: 'CORE' },
          { skillId: incidentResponse.id, importance: 'ADVANCED' },
        ],
      },
      resources: {
        create: [
          {
            title: 'Professor Messer Security+ Course',
            type: 'COURSE_VIDEO',
            provider: 'YouTube',
            url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/',
            description:
              'Complete free video course covering all SY0-701 objectives',
            cost: 0,
            isFree: true,
            rating: 4.8,
            reviewsCount: 15000,
            language: 'en',
            durationHours: 40,
          },
          {
            title: 'Jason Dion Security+ Practice Exams',
            type: 'PRACTICE_EXAM',
            provider: 'Udemy',
            url: 'https://www.udemy.com/course/comptia-security-plus-practice-exams/',
            cost: 19.99,
            currency: 'USD',
            rating: 4.7,
            reviewsCount: 25000,
            language: 'en',
          },
          {
            title: 'TryHackMe Security+ Learning Path',
            type: 'LAB_ENVIRONMENT',
            provider: 'TryHackMe',
            url: 'https://tryhackme.com/path/outline/securityplus',
            cost: 0,
            isFree: true,
            rating: 4.6,
            language: 'en',
            durationHours: 60,
          },
        ],
      },
    },
  });

  console.log('✅ Created Security+');

  // 2. CEH (Certified Ethical Hacker)
  const ceh = await prisma.certification.create({
    data: {
      name: 'CEH',
      slug: 'ceh-certified-ethical-hacker',
      fullName: 'Certified Ethical Hacker (CEH v12)',
      acronym: 'CEH',
      providerId: ecCouncil.id,
      level: 'INTERMEDIATE',
      category: 'OFFENSIVE_SECURITY',
      description:
        'CEH is a comprehensive ethical hacking and penetration testing certification that validates skills in identifying and exploiting vulnerabilities.',
      objectives: [
        'Understand ethical hacking methodologies',
        'Perform vulnerability assessment and penetration testing',
        'Master scanning networks and enumeration',
        'Learn system hacking and exploitation techniques',
        'Understand web application and wireless security',
      ],
      targetAudience:
        'Security professionals, penetration testers, network administrators',
      recommendedExperience: 'Security+ or 2 years in IT security',
      examFormat: '125 multiple choice questions',
      examDuration: 240,
      numberOfQuestions: 125,
      passingScore: 70,
      examLanguages: ['en', 'ja', 'zh', 'ko', 'es'],
      validityYears: 3,
      requiresRenewal: true,
      renewalRequirements: 'Earn 120 ECE credits over 3 years',
      officialUrl:
        'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/',
      prerequisites: {
        connect: { id: securityPlus.id },
      },
      costs: {
        create: [
          {
            region: 'NORTH_AMERICA',
            country: 'US',
            currency: 'USD',
            examCost: 1199,
            officialTraining: 850,
          },
          {
            region: 'EUROPE',
            currency: 'EUR',
            examCost: 1100,
            officialTraining: 800,
          },
          {
            region: 'SOUTH_AMERICA',
            country: 'BR',
            currency: 'BRL',
            examCost: 6000,
            officialTraining: 4200,
          },
        ],
      },
      marketRecognition: {
        create: [
          {
            region: 'NORTH_AMERICA',
            demandLevel: 'HIGH',
            jobPostingsCount: 12000,
            averageSalaryImpact: 18,
            juniorSalaryRange: '$70k-85k',
            midSalaryRange: '$90k-115k',
            seniorSalaryRange: '$120k-150k',
            topCompanies: ['Deloitte', 'Accenture', 'IBM', 'Cisco'],
          },
          {
            region: 'ASIA',
            demandLevel: 'CRITICAL',
            jobPostingsCount: 25000,
            averageSalaryImpact: 22,
            topCompanies: ['Tata', 'Wipro', 'Infosys', 'HCL'],
          },
        ],
      },
      skills: {
        create: [
          { skillId: pentesting.id, importance: 'CORE' },
          { skillId: networkSecurity.id, importance: 'ADVANCED' },
          { skillId: pythonSecurity.id, importance: 'INTERMEDIATE' },
        ],
      },
      resources: {
        create: [
          {
            title: 'CEH v12 Complete Course',
            type: 'COURSE_VIDEO',
            provider: 'Udemy',
            url: 'https://www.udemy.com/course/certified-ethical-hacker-ceh/',
            cost: 89.99,
            currency: 'USD',
            rating: 4.5,
            reviewsCount: 8000,
            language: 'en',
            durationHours: 120,
          },
          {
            title: 'HackTheBox Academy',
            type: 'LAB_ENVIRONMENT',
            provider: 'HackTheBox',
            url: 'https://academy.hackthebox.com/',
            cost: 0,
            isFree: true,
            rating: 4.9,
            language: 'en',
          },
        ],
      },
    },
  });

  console.log('✅ Created CEH');

  // 3. OSCP (Offensive Security Certified Professional)
  const oscp = await prisma.certification.create({
    data: {
      name: 'OSCP',
      slug: 'oscp-offensive-security-certified-professional',
      fullName: 'Offensive Security Certified Professional',
      acronym: 'OSCP',
      providerId: offensiveSecurity.id,
      level: 'ADVANCED',
      category: 'OFFENSIVE_SECURITY',
      description:
        'OSCP is a hands-on penetration testing certification requiring 24 hours of practical hacking in a real-world environment. Highly respected in the industry.',
      objectives: [
        'Perform information gathering and enumeration',
        'Exploit vulnerabilities in Windows and Linux',
        'Demonstrate privilege escalation techniques',
        'Pivot through networks',
        'Write professional penetration testing reports',
      ],
      targetAudience:
        'Penetration testers, security consultants, red team members',
      recommendedExperience:
        'Strong Linux/Windows knowledge, scripting (Python/Bash), networking',
      examFormat: '24-hour hands-on exam + 24-hour report submission',
      examDuration: 1440, // 24 hours
      examLanguages: ['en'],
      validityYears: 0, // Lifetime certification
      requiresRenewal: false,
      officialUrl: 'https://www.offsec.com/courses/pen-200/',
      prerequisites: {
        connect: { id: ceh.id },
      },
      costs: {
        create: [
          {
            region: 'NORTH_AMERICA',
            currency: 'USD',
            examCost: 1649,
            officialTraining: 1649, // Includes 90 days lab
          },
          {
            region: 'EUROPE',
            currency: 'USD',
            examCost: 1649,
            officialTraining: 1649,
          },
          {
            region: 'SOUTH_AMERICA',
            currency: 'USD',
            examCost: 1649,
            officialTraining: 1649,
          },
        ],
      },
      marketRecognition: {
        create: [
          {
            region: 'NORTH_AMERICA',
            demandLevel: 'CRITICAL',
            jobPostingsCount: 8000,
            averageSalaryImpact: 30,
            juniorSalaryRange: '$90k-110k',
            midSalaryRange: '$120k-150k',
            seniorSalaryRange: '$160k-200k+',
            topCompanies: ['Google', 'Meta', 'Netflix', 'Mandiant'],
          },
          {
            region: 'EUROPE',
            demandLevel: 'CRITICAL',
            jobPostingsCount: 4500,
            averageSalaryImpact: 35,
            juniorSalaryRange: '€70k-90k',
            midSalaryRange: '€100k-130k',
            seniorSalaryRange: '€140k-180k',
            topCompanies: ['KPMG', 'PwC', 'EY', 'Deloitte'],
          },
        ],
      },
      skills: {
        create: [
          { skillId: pentesting.id, importance: 'CORE' },
          { skillId: linuxSecurity.id, importance: 'CORE' },
          { skillId: pythonSecurity.id, importance: 'ADVANCED' },
          { skillId: networkSecurity.id, importance: 'ADVANCED' },
        ],
      },
      resources: {
        create: [
          {
            title: 'PWK (Penetration Testing with Kali Linux)',
            type: 'COURSE_INTERACTIVE',
            provider: 'Offensive Security',
            url: 'https://www.offsec.com/courses/pen-200/',
            cost: 1649,
            currency: 'USD',
            rating: 4.9,
            reviewsCount: 12000,
            language: 'en',
            durationHours: 300,
          },
          {
            title: 'TJ Null OSCP Practice List',
            type: 'LAB_ENVIRONMENT',
            provider: 'HackTheBox',
            url: 'https://docs.google.com/spreadsheets/d/1dwSMIAPIam0PuRBkCiDI88pU3yzrqqHkDtBngUHNCw8',
            cost: 0,
            isFree: true,
            rating: 4.8,
            language: 'en',
          },
        ],
      },
    },
  });

  console.log('✅ Created OSCP');

  // 4. CISSP (para comparação - nível expert)
  const cissp = await prisma.certification.create({
    data: {
      name: 'CISSP',
      slug: 'cissp-certified-information-systems-security-professional',
      fullName: 'Certified Information Systems Security Professional',
      acronym: 'CISSP',
      providerId: isc2.id,
      level: 'EXPERT',
      category: 'GOVERNANCE_RISK',
      description:
        'CISSP is an advanced-level certification for security leaders and architects. Requires 5 years of experience and focuses on security management.',
      objectives: [
        'Security and Risk Management',
        'Asset Security',
        'Security Architecture and Engineering',
        'Communication and Network Security',
        'Identity and Access Management',
        'Security Assessment and Testing',
        'Security Operations',
        'Software Development Security',
      ],
      targetAudience:
        'Security managers, CISOs, security architects, consultants',
      recommendedExperience:
        '5 years of paid work experience in 2+ CISSP domains',
      examFormat: '100-150 adaptive questions',
      examDuration: 180,
      numberOfQuestions: 150,
      passingScore: 700,
      examLanguages: ['en', 'ja', 'zh', 'ko', 'de', 'es', 'fr', 'pt'],
      validityYears: 3,
      requiresRenewal: true,
      renewalRequirements: 'Earn 120 CPE credits over 3 years',
      officialUrl: 'https://www.isc2.org/certifications/cissp',
      costs: {
        create: [
          {
            region: 'NORTH_AMERICA',
            currency: 'USD',
            examCost: 749,
            renewalCost: 125,
          },
          {
            region: 'EUROPE',
            currency: 'EUR',
            examCost: 699,
            renewalCost: 125,
          },
        ],
      },
      marketRecognition: {
        create: [
          {
            region: 'NORTH_AMERICA',
            demandLevel: 'CRITICAL',
            jobPostingsCount: 35000,
            averageSalaryImpact: 25,
            juniorSalaryRange: 'N/A',
            midSalaryRange: '$120k-140k',
            seniorSalaryRange: '$150k-200k+',
            topCompanies: ['IBM', 'Microsoft', 'Cisco', 'Lockheed Martin'],
            governmentRequired: true,
          },
        ],
      },
      skills: {
        create: [
          { skillId: networkSecurity.id, importance: 'ADVANCED' },
          { skillId: cryptography.id, importance: 'ADVANCED' },
          { skillId: incidentResponse.id, importance: 'CORE' },
        ],
      },
    },
  });

  console.log('✅ Created CISSP');

  console.log('🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
