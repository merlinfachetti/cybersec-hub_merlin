import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CERTIFICATIONS } from '@/lib/content/career-guide';
import { EDITORIAL_PROVIDERS } from '@/lib/content/editorial-api';

function inferExamFormat(certification: (typeof CERTIFICATIONS)[number]) {
  if (certification.numberOfQuestions > 0) return 'Knowledge exam';
  return 'Practical exam';
}

function inferTargetAudience(certification: (typeof CERTIFICATIONS)[number]) {
  return certification.bestFor;
}

export async function POST() {
  try {
    for (const provider of Object.values(EDITORIAL_PROVIDERS)) {
      await prisma.provider.upsert({
        where: { slug: provider.slug },
        update: {
          name: provider.name,
          website: provider.website,
          description: provider.description,
          country: provider.country,
        },
        create: {
          name: provider.name,
          slug: provider.slug,
          website: provider.website,
          description: provider.description,
          country: provider.country,
        },
      });
    }

    let seeded = 0;

    for (const certification of CERTIFICATIONS) {
      const provider = EDITORIAL_PROVIDERS[certification.providerSlug];
      if (!provider) continue;

      await prisma.certification.upsert({
        where: { slug: certification.slug },
        update: {
          name: certification.name,
          fullName: certification.fullName,
          acronym: certification.acronym,
          level: certification.level,
          category: certification.category,
          description: certification.description,
          objectives: certification.objectives,
          targetAudience: inferTargetAudience(certification),
          recommendedExperience: certification.recommendedExperience,
          examFormat: inferExamFormat(certification),
          examDuration: certification.examDuration,
          numberOfQuestions: certification.numberOfQuestions,
          passingScore: null,
          officialUrl: certification.officialUrl,
          validityYears: certification.validityYears || null,
          requiresRenewal: certification.requiresRenewal,
        },
        create: {
          slug: certification.slug,
          name: certification.name,
          fullName: certification.fullName,
          acronym: certification.acronym,
          provider: {
            connect: { slug: provider.slug },
          },
          level: certification.level,
          category: certification.category,
          description: certification.description,
          objectives: certification.objectives,
          targetAudience: inferTargetAudience(certification),
          recommendedExperience: certification.recommendedExperience,
          examFormat: inferExamFormat(certification),
          examDuration: certification.examDuration,
          numberOfQuestions: certification.numberOfQuestions,
          passingScore: null,
          officialUrl: certification.officialUrl,
          validityYears: certification.validityYears || null,
          requiresRenewal: certification.requiresRenewal,
        },
      });

      const saved = await prisma.certification.findUnique({
        where: { slug: certification.slug },
        select: { id: true },
      });

      if (!saved) continue;

      for (const cost of certification.costs) {
        await prisma.certificationCost.upsert({
          where: {
            certificationId_region_country: {
              certificationId: saved.id,
              region: cost.region as any,
              country: null,
            },
          },
          update: {
            currency: cost.currency,
            examCost: cost.examCost,
            lastVerified: new Date(),
          },
          create: {
            certificationId: saved.id,
            region: cost.region as any,
            country: null,
            currency: cost.currency,
            examCost: cost.examCost,
            voucherAvailable: false,
            lastVerified: new Date(),
          },
        });
      }

      seeded += 1;
    }

    return NextResponse.json({
      success: true,
      created: seeded,
      message: `Seeded or updated ${seeded} editorial certifications`,
      source: 'editorial',
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
