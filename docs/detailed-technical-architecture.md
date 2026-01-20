# Database Schema (Prisma)
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==================== CERTIFICAÇÕES ====================

model Certification {
  id                    String                 @id @default(cuid())
  slug                  String                 @unique
  name                  String
  fullName              String?
  acronym               String?
  provider              Provider               @relation(fields: [providerId], references: [id])
  providerId            String
  
  // Classificação
  level                 CertificationLevel
  category              CertificationCategory
  subCategory           String?
  
  // Descrição
  description           String                 @db.Text
  objectives            String[]               @default([])
  targetAudience        String?                @db.Text
  
  // Requisitos
  prerequisites         Certification[]        @relation("Prerequisites")
  prerequisitesFor      Certification[]        @relation("Prerequisites")
  recommendedExperience String?
  
  // Exame
  examFormat            String?
  examDuration          Int?                   // minutos
  numberOfQuestions     Int?
  passingScore          Int?
  examLanguages         String[]               @default(["en"])
  
  // Validade
  validityYears         Int?
  requiresRenewal       Boolean                @default(false)
  renewalRequirements   String?                @db.Text
  
  // Metadados
  officialUrl           String
  syllabusPdfUrl        String?
  lastUpdated           DateTime               @updatedAt
  createdAt             DateTime               @default(now())
  
  // Relações
  costs                 CertificationCost[]
  marketRecognition     MarketRecognition[]
  skills                CertificationSkill[]
  resources             Resource[]
  userProgress          UserCertification[]
  reviews               Review[]
  
  @@index([level, category])
  @@index([providerId])
}

enum CertificationLevel {
  ENTRY
  INTERMEDIATE
  ADVANCED
  EXPERT
}

enum CertificationCategory {
  OFFENSIVE_SECURITY      // Red Team, Pentesting
  DEFENSIVE_SECURITY      // Blue Team, SOC
  GOVERNANCE_RISK         // GRC, Compliance
  CLOUD_SECURITY
  APPLICATION_SECURITY    // Secure Coding, SAST/DAST
  NETWORK_SECURITY
  FORENSICS
  INCIDENT_RESPONSE
  SECURITY_ENGINEERING
  THREAT_INTELLIGENCE
}

// ==================== PROVEDORES ====================

model Provider {
  id              String          @id @default(cuid())
  name            String          @unique
  slug            String          @unique
  website         String
  description     String?         @db.Text
  logo            String?
  country         String?
  certifications  Certification[]
  
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  @@index([slug])
}

// ==================== CUSTOS ====================

model CertificationCost {
  id                String         @id @default(cuid())
  certification     Certification  @relation(fields: [certificationId], references: [id], onDelete: Cascade)
  certificationId   String
  
  region            Region
  country           String?        // ISO code (BR, US, DE, etc)
  
  // Valores
  currency          String         @default("USD")
  examCost          Float
  officialTraining  Float?
  renewalCost       Float?
  voucherAvailable  Boolean        @default(false)
  
  // Metadados
  source            String?        // URL da fonte do preço
  lastVerified      DateTime       @default(now())
  notes             String?        @db.Text
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@unique([certificationId, region, country])
  @@index([certificationId])
}

enum Region {
  NORTH_AMERICA
  SOUTH_AMERICA
  EUROPE
  ASIA
  OCEANIA
  AFRICA
  MIDDLE_EAST
}

// ==================== RECONHECIMENTO DE MERCADO ====================

model MarketRecognition {
  id                     String         @id @default(cuid())
  certification          Certification  @relation(fields: [certificationId], references: [id], onDelete: Cascade)
  certificationId        String
  
  region                 Region
  country                String?
  
  // Demanda
  demandLevel            DemandLevel
  jobPostingsCount       Int?           // Número de vagas que pedem essa cert
  
  // Impacto Salarial
  averageSalaryImpact    Float?         // Percentual de aumento
  juniorSalaryRange      String?        // ex: "€45k-55k"
  midSalaryRange         String?
  seniorSalaryRange      String?
  
  // Empresas
  topCompanies           String[]       @default([])
  governmentRequired     Boolean        @default(false)
  
  // Metadados
  dataSource             String?
  lastUpdated            DateTime       @default(now())
  
  createdAt              DateTime       @default(now())
  updatedAt              DateTime       @updatedAt
  
  @@unique([certificationId, region, country])
  @@index([certificationId])
  @@index([region])
}

enum DemandLevel {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

// ==================== HABILIDADES ====================

model Skill {
  id                String               @id @default(cuid())
  name              String               @unique
  slug              String               @unique
  category          String?
  description       String?              @db.Text
  
  certifications    CertificationSkill[]
  
  createdAt         DateTime             @default(now())
  updatedAt         DateTime             @updatedAt
  
  @@index([slug])
}

model CertificationSkill {
  certification     Certification  @relation(fields: [certificationId], references: [id], onDelete: Cascade)
  certificationId   String
  skill             Skill          @relation(fields: [skillId], references: [id], onDelete: Cascade)
  skillId           String
  
  importance        SkillImportance
  
  @@id([certificationId, skillId])
  @@index([certificationId])
  @@index([skillId])
}

enum SkillImportance {
  BASIC
  INTERMEDIATE
  ADVANCED
  CORE
}

// ==================== RECURSOS DE ESTUDO ====================

model Resource {
  id                String         @id @default(cuid())
  certification     Certification  @relation(fields: [certificationId], references: [id], onDelete: Cascade)
  certificationId   String
  
  // Informações básicas
  title             String
  type              ResourceType
  provider          String
  url               String
  
  // Detalhes
  description       String?        @db.Text
  cost              Float          @default(0)
  currency          String         @default("USD")
  isFree            Boolean        @default(false)
  
  // Qualidade
  rating            Float?         @default(0)  // 0-5
  reviewsCount      Int?           @default(0)
  
  // Metadados
  language          String         @default("en")
  durationHours     Int?
  lastUpdated       DateTime?
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@index([certificationId])
  @@index([type])
}

enum ResourceType {
  COURSE_VIDEO
  COURSE_INTERACTIVE
  BOOK
  PRACTICE_EXAM
  LAB_ENVIRONMENT
  CHEAT_SHEET
  STUDY_GUIDE
  BOOTCAMP
  MENTORSHIP
  COMMUNITY
}

// ==================== USUÁRIOS E PROGRESSO ====================

model User {
  id                String              @id @default(cuid())
  email             String              @unique
  name              String?
  
  // Perfil
  currentRole       String?
  yearsExperience   Int?
  targetRole        String?
  location          String?             // País/Cidade
  preferredRegion   Region?
  
  // Configurações
  budget            Float?
  studyHoursPerWeek Int?
  timeline          Int?                // meses para transição
  
  certifications    UserCertification[]
  reviews           Review[]
  
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  
  @@index([email])
}

model UserCertification {
  id                String             @id @default(cuid())
  user              User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId            String
  certification     Certification      @relation(fields: [certificationId], references: [id], onDelete: Cascade)
  certificationId   String
  
  status            CertificationStatus
  
  // Datas
  startedAt         DateTime?
  completedAt       DateTime?
  expiresAt         DateTime?
  
  // Progresso
  progressPercent   Int                @default(0)
  studyHours        Int                @default(0)
  
  // Notas
  examScore         Int?
  attempts          Int                @default(0)
  notes             String?            @db.Text
  
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  
  @@unique([userId, certificationId])
  @@index([userId])
  @@index([certificationId])
}

enum CertificationStatus {
  INTERESTED
  STUDYING
  SCHEDULED
  PASSED
  FAILED
  EXPIRED
}

// ==================== REVIEWS ====================

model Review {
  id                String         @id @default(cuid())
  user              User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId            String
  certification     Certification  @relation(fields: [certificationId], references: [id], onDelete: Cascade)
  certificationId   String
  
  rating            Int            // 1-5
  title             String?
  content           String         @db.Text
  
  // Detalhes úteis
  studyDuration     Int?           // semanas
  difficulty        Int?           // 1-5
  worthIt           Boolean?
  
  helpful           Int            @default(0)
  
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@index([certificationId])
  @@index([userId])
}