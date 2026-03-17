// @ts-nocheck — legacy route, typed in Sprint 4
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Validação de UUID v4 (CUID também aceito)
function isValidId(id: string): boolean {
  // CUID: c + 24 chars alfanuméricos
  const cuidRegex = /^c[a-z0-9]{24}$/i;
  // UUID v4: 8-4-4-4-12 formato
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return cuidRegex.test(id) || uuidRegex.test(id);
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: certificationId } = await context.params;

    console.log('🔍 [API] /api/certifications/[id] called', {
      id: certificationId,
    });

    // Validar formato do ID
    if (!isValidId(certificationId)) {
      console.log('❌ [API] Invalid ID format:', certificationId);
      return NextResponse.json(
        {
          error: 'Invalid certification ID format',
          details: 'ID must be a valid CUID or UUID',
        },
        { status: 400 }
      );
    }

    console.log('🔍 [API] Fetching certification with all relations...');

    const certification = await prisma.certification.findUnique({
      where: {
        id: certificationId,
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            slug: true,
            website: true,
            description: true,
            logo: true,
            country: true,
          },
        },
        costs: {
          orderBy: {
            region: 'asc',
          },
          select: {
            id: true,
            region: true,
            country: true,
            currency: true,
            examCost: true,
            officialTraining: true,
            renewalCost: true,
            voucherAvailable: true,
            lastVerified: true,
          },
        },
        marketRecognition: {
          orderBy: {
            region: 'asc',
          },
          select: {
            id: true,
            region: true,
            country: true,
            demandLevel: true,
            jobPostingsCount: true,
            averageSalaryImpact: true,
            juniorSalaryRange: true,
            midSalaryRange: true,
            seniorSalaryRange: true,
            topCompanies: true,
            governmentRequired: true,
            lastUpdated: true,
          },
        },
        skills: {
          include: {
            skill: {
              select: {
                id: true,
                name: true,
                slug: true,
                category: true,
                description: true,
              },
            },
          },
          orderBy: {
            importance: 'desc', // CORE first
          },
        },
        resources: {
          orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
          take: 50, // Limitar a 50 recursos mais relevantes
          select: {
            id: true,
            title: true,
            type: true,
            provider: true,
            url: true,
            description: true,
            cost: true,
            currency: true,
            isFree: true,
            rating: true,
            reviewsCount: true,
            language: true,
            durationHours: true,
            lastUpdated: true,
          },
        },
        prerequisites: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            category: true,
            provider: {
              select: {
                name: true,
              },
            },
          },
        },
        prerequisitesFor: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            category: true,
            provider: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!certification) {
      console.log('❌ [API] Certification not found:', certificationId);
      return NextResponse.json(
        {
          error: 'Certification not found',
          details: `No certification exists with ID: ${certificationId}`,
        },
        { status: 404 }
      );
    }

    console.log('✅ [API] Certification found:', certification.name);
    console.log('✅ [API] Relations loaded:', {
      provider: !!certification.provider,
      costs: certification.costs.length,
      marketRecognition: certification.marketRecognition.length,
      skills: certification.skills.length,
      resources: certification.resources.length,
      prerequisites: certification.prerequisites.length,
      prerequisitesFor: certification.prerequisitesFor.length,
    });

    // Calcular estatísticas úteis
    const stats = {
      totalCosts: certification.costs.length,
      totalMarketData: certification.marketRecognition.length,
      totalSkills: certification.skills.length,
      totalResources: certification.resources.length,
      totalPrerequisites: certification.prerequisites.length,
      totalPrerequisitesFor: certification.prerequisitesFor.length,
      freeResources: certification.resources.filter((r) => r.isFree).length,
      avgResourceRating:
        certification.resources.length > 0
          ? Math.round(
              (certification.resources.reduce(
                (sum, r) => sum + (r.rating || 0),
                0
              ) /
                certification.resources.length) *
                10
            ) / 10
          : 0,
      avgExamCost:
        certification.costs.length > 0
          ? Math.round(
              certification.costs.reduce((sum, c) => sum + c.examCost, 0) /
                certification.costs.length
            )
          : 0,
      highestDemandRegion:
        certification.marketRecognition.length > 0
          ? certification.marketRecognition.sort((a, b) => {
              const demandOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
              return (
                (demandOrder[b.demandLevel] || 0) -
                (demandOrder[a.demandLevel] || 0)
              );
            })[0]?.region
          : null,
    };

    console.log('✅ [API] Stats calculated:', stats);

    return NextResponse.json({
      ...certification,
      stats,
    });
  } catch (error) {
    console.error('❌ [API] Error in /api/certifications/[id]:', error);

    if (error instanceof Error) {
      console.error('❌ [API] Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }

    // Tratamento específico de erros Prisma
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: any };

      // P2023: Query timeout
      if (prismaError.code === 'P2023') {
        return NextResponse.json(
          {
            error: 'Database query timeout',
            details: 'Request took too long. Please try again.',
          },
          { status: 504 }
        );
      }

      // P2025: Record not found
      if (prismaError.code === 'P2025') {
        return NextResponse.json(
          { error: 'Certification not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch certification',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
