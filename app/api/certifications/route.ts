import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Valores válidos para level e category (do schema Prisma)
const VALID_LEVELS = ['ENTRY', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
const VALID_CATEGORIES = [
  'OFFENSIVE_SECURITY',
  'DEFENSIVE_SECURITY',
  'GOVERNANCE_RISK',
  'CLOUD_SECURITY',
  'APPLICATION_SECURITY',
  'NETWORK_SECURITY',
  'FORENSICS',
  'INCIDENT_RESPONSE',
  'SECURITY_ENGINEERING',
  'THREAT_INTELLIGENCE',
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Filtros com validação
    const levelParam = searchParams.get('level');
    const categoryParam = searchParams.get('category');
    const search = searchParams.get('search');

    // Validar level
    const level =
      levelParam && VALID_LEVELS.includes(levelParam) ? levelParam : null;

    // Validar category
    const category =
      categoryParam && VALID_CATEGORIES.includes(categoryParam)
        ? categoryParam
        : null;

    // Paginação com limites
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('limit') || '12'))
    );
    const skip = (page - 1) * limit;

    console.log('🔍 [API] /api/certifications called', {
      level,
      category,
      search,
      page,
      limit,
      invalidLevel: levelParam && !level ? levelParam : null,
      invalidCategory: categoryParam && !category ? categoryParam : null,
    });

    // Build where clause
    const where: any = {};

    if (level) {
      where.level = level;
      console.log('🔍 [API] Filtering by level:', level);
    }

    if (category) {
      where.category = category;
      console.log('🔍 [API] Filtering by category:', category);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
      console.log('🔍 [API] Searching for:', search);
    }

    // Query
    const [certifications, total] = await Promise.all([
      prisma.certification.findMany({
        where,
        skip,
        take: limit,
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              website: true,
            },
          },
          costs: {
            where: {
              currency: 'USD',
            },
            take: 1,
            select: {
              id: true,
              examCost: true,
              renewalCost: true,
              currency: true,
              region: true,
            },
          },
          _count: {
            select: {
              resources: true,
              skills: true,
              prerequisites: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.certification.count({ where }),
    ]);

    console.log(
      '✅ [API] Found certifications:',
      certifications.length,
      'of',
      total
    );

    // Calcular estatísticas dos resultados
    const stats = {
      totalResults: total,
      currentPage: page,
      entryLevel: certifications.filter((c) => c.level === 'ENTRY').length,
      intermediate: certifications.filter((c) => c.level === 'INTERMEDIATE')
        .length,
      advanced: certifications.filter((c) => c.level === 'ADVANCED').length,
      expert: certifications.filter((c) => c.level === 'EXPERT').length,
      avgCost:
        certifications.length > 0
          ? Math.round(
              certifications.reduce(
                (sum, c) => sum + (c.costs[0]?.examCost || 0),
                0
              ) / certifications.length
            )
          : 0,
    };

    console.log('✅ [API] Stats:', stats);

    return NextResponse.json({
      data: certifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
      stats,
    });
  } catch (error) {
    console.error('❌ [API] Error in /api/certifications:', error);

    if (error instanceof Error) {
      console.error('❌ [API] Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch certifications',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
