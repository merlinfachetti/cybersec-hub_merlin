-- CreateEnum
CREATE TYPE "CertificationLevel" AS ENUM ('ENTRY', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "CertificationCategory" AS ENUM ('OFFENSIVE_SECURITY', 'DEFENSIVE_SECURITY', 'GOVERNANCE_RISK', 'CLOUD_SECURITY', 'APPLICATION_SECURITY', 'NETWORK_SECURITY', 'FORENSICS', 'INCIDENT_RESPONSE', 'SECURITY_ENGINEERING', 'THREAT_INTELLIGENCE');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('NORTH_AMERICA', 'SOUTH_AMERICA', 'EUROPE', 'ASIA', 'OCEANIA', 'AFRICA', 'MIDDLE_EAST');

-- CreateEnum
CREATE TYPE "DemandLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('COURSE_VIDEO', 'COURSE_INTERACTIVE', 'BOOK', 'PRACTICE_EXAM', 'LAB_ENVIRONMENT', 'CHEAT_SHEET', 'STUDY_GUIDE', 'BOOTCAMP', 'MENTORSHIP', 'COMMUNITY');

-- CreateEnum
CREATE TYPE "SkillImportance" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED', 'CORE');

-- CreateTable
CREATE TABLE "providers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT,
    "acronym" TEXT,
    "providerId" TEXT NOT NULL,
    "level" "CertificationLevel" NOT NULL,
    "category" "CertificationCategory" NOT NULL,
    "subCategory" TEXT,
    "description" TEXT NOT NULL,
    "objectives" TEXT[],
    "targetAudience" TEXT,
    "recommendedExperience" TEXT,
    "examFormat" TEXT,
    "examDuration" INTEGER,
    "numberOfQuestions" INTEGER,
    "passingScore" INTEGER,
    "examLanguages" TEXT[],
    "validityYears" INTEGER,
    "requiresRenewal" BOOLEAN NOT NULL DEFAULT false,
    "renewalRequirements" TEXT,
    "officialUrl" TEXT NOT NULL,
    "syllabusPdfUrl" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification_costs" (
    "id" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "country" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "examCost" DOUBLE PRECISION NOT NULL,
    "officialTraining" DOUBLE PRECISION,
    "renewalCost" DOUBLE PRECISION,
    "voucherAvailable" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "lastVerified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certification_costs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_recognition" (
    "id" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "country" TEXT,
    "demandLevel" "DemandLevel" NOT NULL,
    "jobPostingsCount" INTEGER,
    "averageSalaryImpact" DOUBLE PRECISION,
    "juniorSalaryRange" TEXT,
    "midSalaryRange" TEXT,
    "seniorSalaryRange" TEXT,
    "topCompanies" TEXT[],
    "governmentRequired" BOOLEAN NOT NULL DEFAULT false,
    "dataSource" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_recognition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certification_skills" (
    "certificationId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "importance" "SkillImportance" NOT NULL,

    CONSTRAINT "certification_skills_pkey" PRIMARY KEY ("certificationId","skillId")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "provider" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "reviewsCount" INTEGER DEFAULT 0,
    "language" TEXT NOT NULL DEFAULT 'en',
    "durationHours" INTEGER,
    "lastUpdated" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CertificationPrerequisites" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CertificationPrerequisites_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "providers_name_key" ON "providers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "providers_slug_key" ON "providers"("slug");

-- CreateIndex
CREATE INDEX "providers_slug_idx" ON "providers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "certifications_slug_key" ON "certifications"("slug");

-- CreateIndex
CREATE INDEX "certifications_level_category_idx" ON "certifications"("level", "category");

-- CreateIndex
CREATE INDEX "certifications_providerId_idx" ON "certifications"("providerId");

-- CreateIndex
CREATE INDEX "certifications_slug_idx" ON "certifications"("slug");

-- CreateIndex
CREATE INDEX "certification_costs_certificationId_idx" ON "certification_costs"("certificationId");

-- CreateIndex
CREATE UNIQUE INDEX "certification_costs_certificationId_region_country_key" ON "certification_costs"("certificationId", "region", "country");

-- CreateIndex
CREATE INDEX "market_recognition_certificationId_idx" ON "market_recognition"("certificationId");

-- CreateIndex
CREATE INDEX "market_recognition_region_idx" ON "market_recognition"("region");

-- CreateIndex
CREATE UNIQUE INDEX "market_recognition_certificationId_region_country_key" ON "market_recognition"("certificationId", "region", "country");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skills_slug_key" ON "skills"("slug");

-- CreateIndex
CREATE INDEX "skills_slug_idx" ON "skills"("slug");

-- CreateIndex
CREATE INDEX "certification_skills_certificationId_idx" ON "certification_skills"("certificationId");

-- CreateIndex
CREATE INDEX "certification_skills_skillId_idx" ON "certification_skills"("skillId");

-- CreateIndex
CREATE INDEX "resources_certificationId_idx" ON "resources"("certificationId");

-- CreateIndex
CREATE INDEX "resources_type_idx" ON "resources"("type");

-- CreateIndex
CREATE INDEX "_CertificationPrerequisites_B_index" ON "_CertificationPrerequisites"("B");

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification_costs" ADD CONSTRAINT "certification_costs_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "certifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_recognition" ADD CONSTRAINT "market_recognition_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "certifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification_skills" ADD CONSTRAINT "certification_skills_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "certifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certification_skills" ADD CONSTRAINT "certification_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "certifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificationPrerequisites" ADD CONSTRAINT "_CertificationPrerequisites_A_fkey" FOREIGN KEY ("A") REFERENCES "certifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificationPrerequisites" ADD CONSTRAINT "_CertificationPrerequisites_B_fkey" FOREIGN KEY ("B") REFERENCES "certifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
