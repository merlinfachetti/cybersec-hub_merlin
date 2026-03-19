import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// One-time admin endpoint to seed certifications data
export async function POST() {
  try {
    const existing = await (prisma as any).certification.count();
    if (existing > 0) {
      return NextResponse.json({ message: `Already seeded: ${existing} certifications` });
    }

    const providers = [
      { id: 'prov_comptia',    name: 'CompTIA',             slug: 'comptia',            website: 'https://www.comptia.org',               description: 'Leading vendor-neutral IT certifications', country: 'US' },
      { id: 'prov_ec_council', name: 'EC-Council',          slug: 'ec-council',         website: 'https://www.eccouncil.org',             description: 'World largest cybersecurity certification body', country: 'US' },
      { id: 'prov_isc2',       name: '(ISC)2',              slug: 'isc2',               website: 'https://www.isc2.org',                  description: 'Leading cybersecurity professional organization', country: 'US' },
      { id: 'prov_offensive',  name: 'Offensive Security',  slug: 'offensive-security', website: 'https://www.offensive-security.com',    description: 'Hands-on offensive security training', country: 'US' },
      { id: 'prov_sans',       name: 'SANS Institute',      slug: 'sans',               website: 'https://www.sans.org',                  description: 'Premier cybersecurity training organization', country: 'US' },
      { id: 'prov_isaca',      name: 'ISACA',               slug: 'isaca',              website: 'https://www.isaca.org',                 description: 'IT governance and security association', country: 'US' },
    ];

    for (const p of providers) {
      await (prisma as any).provider.upsert({ where: { slug: p.slug }, update: {}, create: { ...p, lastUpdated: new Date() } });
    }

    const certs = [
      { id: 'cert_sec_plus', slug: 'comptia-security-plus', name: 'Security+', fullName: 'CompTIA Security+ SY0-701', acronym: 'SEC+', providerId: 'prov_comptia', level: 'ENTRY', category: 'DEFENSIVE_SECURITY', description: 'Baseline cybersecurity certification covering threats, attacks, network security, cryptography and identity management.', objectives: ['Threats & Vulnerabilities', 'Architecture & Design', 'Implementation', 'Operations & IR', 'Governance & Risk'], targetAudience: 'IT professionals transitioning to cybersecurity', recommendedExperience: '2+ years IT experience', examFormat: 'Multiple choice + performance-based', examDuration: 90, numberOfQuestions: 90, passingScore: 750, officialUrl: 'https://www.comptia.org/certifications/security', validityYears: 3, requiresRenewal: true },
      { id: 'cert_ceh', slug: 'ceh-certified-ethical-hacker', name: 'CEH', fullName: 'Certified Ethical Hacker v12', acronym: 'CEH', providerId: 'prov_ec_council', level: 'INTERMEDIATE', category: 'OFFENSIVE_SECURITY', description: 'Master ethical hacking methodology. Learn to think like an attacker to defend systems.', objectives: ['Footprinting', 'Scanning Networks', 'System Hacking', 'Social Engineering', 'Web App Attacks', 'SQL Injection', 'Malware Analysis'], targetAudience: 'Security officers, auditors, pen testers', recommendedExperience: '2+ years security experience', examFormat: 'Multiple choice', examDuration: 240, numberOfQuestions: 125, passingScore: 700, officialUrl: 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/', validityYears: 3, requiresRenewal: true },
      { id: 'cert_cissp', slug: 'cissp', name: 'CISSP', fullName: 'Certified Information Systems Security Professional', acronym: 'CISSP', providerId: 'prov_isc2', level: 'ADVANCED', category: 'GOVERNANCE_RISK', description: 'Gold standard in cybersecurity. Covers all domains from risk management to software security.', objectives: ['Security & Risk Management', 'Asset Security', 'Security Architecture', 'Network Security', 'IAM', 'Security Assessment', 'Security Operations', 'Software Security'], targetAudience: 'Senior security practitioners, CISOs', recommendedExperience: '5+ years in 2+ security domains', examFormat: 'CAT adaptive test', examDuration: 360, numberOfQuestions: 125, passingScore: 700, officialUrl: 'https://www.isc2.org/Certifications/CISSP', validityYears: 3, requiresRenewal: true },
      { id: 'cert_oscp', slug: 'oscp', name: 'OSCP', fullName: 'Offensive Security Certified Professional', acronym: 'OSCP', providerId: 'prov_offensive', level: 'ADVANCED', category: 'OFFENSIVE_SECURITY', description: '24-hour practical penetration testing exam. The most respected hands-on offensive security cert.', objectives: ['Information Gathering', 'Buffer Overflows', 'Web App Attacks', 'Active Directory', 'Privilege Escalation', 'Post-Exploitation'], targetAudience: 'Penetration testers, red team professionals', recommendedExperience: 'Linux, networking, basic scripting', examFormat: 'Practical exam (24h hack + 24h report)', examDuration: 1440, numberOfQuestions: 0, passingScore: 70, officialUrl: 'https://www.offensive-security.com/pwk-oscp/', validityYears: 0, requiresRenewal: false },
      { id: 'cert_cysa', slug: 'comptia-cysa-plus', name: 'CySA+', fullName: 'CompTIA Cybersecurity Analyst+', acronym: 'CySA+', providerId: 'prov_comptia', level: 'INTERMEDIATE', category: 'DEFENSIVE_SECURITY', description: 'Behavioral analytics to fight threats. Covers threat intel, vulnerability management and IR.', objectives: ['Security Operations', 'Vulnerability Management', 'Incident Response', 'Threat Intelligence', 'Reporting'], targetAudience: 'Threat analysts, SOC analysts', recommendedExperience: '3-4 years security experience', examFormat: 'Multiple choice + performance-based', examDuration: 165, numberOfQuestions: 85, passingScore: 750, officialUrl: 'https://www.comptia.org/certifications/cybersecurity-analyst', validityYears: 3, requiresRenewal: true },
      { id: 'cert_ejpt', slug: 'ejpt', name: 'eJPT', fullName: 'eLearnSecurity Junior Penetration Tester', acronym: 'eJPT', providerId: 'prov_offensive', level: 'ENTRY', category: 'OFFENSIVE_SECURITY', description: 'Entry-level practical penetration testing certification. Best starting point for red team career.', objectives: ['Pen Testing Processes', 'Networking', 'Web App Security', 'System Attacks', 'Host Discovery'], targetAudience: 'Beginners in penetration testing', recommendedExperience: 'Basic networking and Linux', examFormat: 'Practical lab exam', examDuration: 1440, numberOfQuestions: 0, passingScore: 70, officialUrl: 'https://elearnsecurity.com/product/ejpt-certification/', validityYears: 0, requiresRenewal: false },
      { id: 'cert_cism', slug: 'cism', name: 'CISM', fullName: 'Certified Information Security Manager', acronym: 'CISM', providerId: 'prov_isaca', level: 'ADVANCED', category: 'GOVERNANCE_RISK', description: 'Management-focused: governance, risk management and incident response for senior security managers.', objectives: ['IS Governance', 'Risk Management', 'Security Program Development', 'Incident Management'], targetAudience: 'IS managers, risk managers, IT directors', recommendedExperience: '5+ years IS, 3+ in management', examFormat: 'Multiple choice', examDuration: 240, numberOfQuestions: 150, passingScore: 450, officialUrl: 'https://www.isaca.org/credentialing/cism', validityYears: 3, requiresRenewal: true },
    ];

    for (const cert of certs) {
      await (prisma as any).certification.upsert({ where: { slug: cert.slug }, update: {}, create: { ...cert, lastUpdated: new Date() } });
    }

    const costs = [
      { id: 'cost_sec_us',  certificationId: 'cert_sec_plus', region: 'NORTH_AMERICA', currency: 'USD', examCost: 392,  voucherAvailable: true },
      { id: 'cost_sec_eu',  certificationId: 'cert_sec_plus', region: 'EUROPE',        currency: 'EUR', examCost: 392,  voucherAvailable: true },
      { id: 'cost_ceh_us',  certificationId: 'cert_ceh',      region: 'NORTH_AMERICA', currency: 'USD', examCost: 1199, voucherAvailable: false },
      { id: 'cost_cis_us',  certificationId: 'cert_cissp',    region: 'NORTH_AMERICA', currency: 'USD', examCost: 749,  voucherAvailable: false },
      { id: 'cost_osc_us',  certificationId: 'cert_oscp',     region: 'NORTH_AMERICA', currency: 'USD', examCost: 1499, voucherAvailable: false },
      { id: 'cost_cya_us',  certificationId: 'cert_cysa',     region: 'NORTH_AMERICA', currency: 'USD', examCost: 392,  voucherAvailable: true },
      { id: 'cost_ejp_us',  certificationId: 'cert_ejpt',     region: 'NORTH_AMERICA', currency: 'USD', examCost: 200,  voucherAvailable: false },
      { id: 'cost_cis2_us', certificationId: 'cert_cism',     region: 'NORTH_AMERICA', currency: 'USD', examCost: 575,  voucherAvailable: false },
    ];

    for (const cost of costs) {
      await (prisma as any).certificationCost.upsert({ where: { id: cost.id }, update: {}, create: { ...cost, lastVerified: new Date() } });
    }

    return NextResponse.json({ success: true, created: certs.length, message: `Seeded ${certs.length} certifications` });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
