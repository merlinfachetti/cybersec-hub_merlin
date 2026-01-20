```
// prisma/seed.ts

const certifications = [
  {
    name: "CompTIA Security+",
    slug: "comptia-security-plus",
    fullName: "CompTIA Security+ (SY0-701)",
    acronym: "Sec+",
    provider: { connect: { slug: "comptia" } },
    level: "ENTRY",
    category: "DEFENSIVE_SECURITY",
    description: "CompTIA Security+ is a global certification that validates the baseline skills necessary to perform core security functions and pursue an IT security career.",
    objectives: [
      "Assess the security posture of an enterprise environment",
      "Recommend and implement appropriate security solutions",
      "Monitor and secure hybrid environments",
      "Operate with an awareness of applicable laws and policies",
      "Identify, analyze, and respond to security events and incidents"
    ],
    targetAudience: "IT professionals with 2 years of hands-on experience working in a security/systems administrator job role",
    examFormat: "90 multiple choice and performance-based questions",
    examDuration: 90,
    numberOfQuestions: 90,
    passingScore: 750,
    examLanguages: ["en", "ja", "pt", "de", "es"],
    validityYears: 3,
    requiresRenewal: true,
    renewalRequirements: "Earn 50 CEUs over 3 years",
    officialUrl: "https://www.comptia.org/certifications/security",
    
    costs: {
      create: [
        {
          region: "NORTH_AMERICA",
          country: "US",
          currency: "USD",
          examCost: 370,
          officialTraining: 1500,
          renewalCost: 50,
          lastVerified: new Date()
        },
        {
          region: "EUROPE",
          country: "DE",
          currency: "EUR",
          examCost: 370,
          officialTraining: 1200,
          renewalCost: 50,
          lastVerified: new Date()
        },
        {
          region: "SOUTH_AMERICA",
          country: "BR",
          currency: "BRL",
          examCost: 1850,
          officialTraining: 3500,
          renewalCost: 250,
          lastVerified: new Date()
        }
      ]
    },
    
    marketRecognition: {
      create: [
        {
          region: "NORTH_AMERICA",
          country: "US",
          demandLevel: "CRITICAL",
          jobPostingsCount: 45000,
          averageSalaryImpact: 12,
          juniorSalaryRange: "$55k-70k",
          midSalaryRange: "$75k-95k",
          seniorSalaryRange: "$100k-130k",
          topCompanies: ["Microsoft", "Amazon", "Google", "Lockheed Martin"],
          governmentRequired: true
        },
        {
          region: "EUROPE",
          country: "DE",
          demandLevel: "HIGH",
          jobPostingsCount: 3500,
          averageSalaryImpact: 15,
          juniorSalaryRange: "€45k-55k",
          midSalaryRange: "€60k-75k",
          seniorSalaryRange: "€80k-100k",
          topCompanies: ["Siemens", "SAP", "Deutsche Telekom", "Bosch"]
        }
      ]
    },
    
    skills: {
      create: [
        {
          skill: { connectOrCreate: { where: { slug: "network-security" }, create: { name: "Network Security", slug: "network-security" } } },
          importance: "CORE"
        },
        {
          skill: { connectOrCreate: { where: { slug: "cryptography" }, create: { name: "Cryptography", slug: "cryptography" } } },
          importance: "CORE"
        },
        {
          skill: { connectOrCreate: { where: { slug: "incident-response" }, create: { name: "Incident Response", slug: "incident-response" } } },
          importance: "ADVANCED"
        }
      ]
    },
    
    resources: {
      create: [
        {
          title: "Professor Messer Security+ Course",
          type: "COURSE_VIDEO",
          provider: "YouTube",
          url: "https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/",
          description: "Complete free video course covering all SY0-701 objectives",
          cost: 0,
          isFree: true,
          rating: 4.8,
          reviewsCount: 15000,
          language: "en",
          durationHours: 40
        },
        {
          title: "Jason Dion Security+ Practice Exams",
          type: "PRACTICE_EXAM",
          provider: "Udemy",
          url: "https://www.udemy.com/course/comptia-security-plus-practice-exams/",
          cost: 19.99,
          currency: "USD",
          rating: 4.7,
          reviewsCount: 25000,
          language: "en"
        },
        {
          title: "TryHackMe Security+ Learning Path",
          type: "LAB_ENVIRONMENT",
          provider: "TryHackMe",
          url: "https://tryhackme.com/path/outline/securityplus",
          cost: 0,
          isFree: true,
          rating: 4.6,
          language: "en",
          durationHours: 60
        }
      ]
    }
  },
  
  // Adicionar mais: CEH, OSCP, OSWE, CISSP, etc.
];

async function main() {
  for (const cert of certifications) {
    await prisma.certification.create({
      data: cert
    });
  }
}

main();
```
