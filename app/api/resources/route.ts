// @ts-nocheck — legacy route, typed in Sprint 4
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Valores válidos para ordenação
const VALID_ORDER_BY = ['rating', 'cost', 'reviews', 'recent', 'title'];
const VALID_ORDER = ['asc', 'desc'];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Filtros
    const certificationId = searchParams.get('certificationId');
    const type = searchParams.get('type');
    const isFree = searchParams.get('isFree');
    const minRating = searchParams.get('minRating');
    const language = searchParams.get('language');
    const search = searchParams.get('search');

    // Ordenação com validação
    const orderByParam = searchParams.get('orderBy') || 'rating';
    const orderParam = searchParams.get('order') || 'desc';

    const orderBy = VALID_ORDER_BY.includes(orderByParam)
      ? orderByParam
      : 'rating';
    const order = VALID_ORDER.includes(orderParam) ? orderParam : 'desc';

    // Paginação com limites
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get('limit') || '20'))
    );
    const skip = (page - 1) * limit;

    console.log('🔍 [API] /api/resources called', {
      certificationId,
      type,
      isFree,
      minRating,
      language,
      search,
      orderBy,
      order,
      page,
      limit,
    });

    // Build where clause
    const where: any = {};

    if (certificationId) {
      where.certificationId = certificationId;
      console.log('🔍 [API] Filtering by certification:', certificationId);
    }

    if (type) {
      where.type = type;
      console.log('🔍 [API] Filtering by type:', type);
    }

    if (isFree === 'true') {
      where.isFree = true;
      console.log('🔍 [API] Filtering free resources only');
    }

    if (minRating) {
      const parsedRating = parseFloat(minRating);
      if (!isNaN(parsedRating) && parsedRating >= 0 && parsedRating <= 5) {
        where.rating = {
          gte: parsedRating,
        };
        console.log('🔍 [API] Filtering by minRating:', parsedRating);
      } else {
        console.log('⚠️ [API] Invalid minRating value:', minRating);
      }
    }

    if (language) {
      where.language = language;
      console.log('🔍 [API] Filtering by language:', language);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { provider: { contains: search, mode: 'insensitive' } },
      ];
      console.log('🔍 [API] Searching for:', search);
    }

    // Build orderBy clause
    const orderByClause: any = {};

    switch (orderBy) {
      case 'rating':
        orderByClause.rating = order;
        break;
      case 'cost':
        orderByClause.cost = order;
        break;
      case 'reviews':
        orderByClause.reviewsCount = order;
        break;
      case 'recent':
        orderByClause.lastUpdated = order;
        break;
      case 'title':
        orderByClause.title = order;
        break;
      default:
        orderByClause.rating = 'desc'; // Fallback seguro
    }

    console.log('🔍 [API] Ordering by:', orderByClause);

    // Query
    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        skip,
        take: limit,
        include: {
          certification: {
            select: {
              id: true,
              name: true,
              slug: true,
              level: true,
            },
          },
        },
        orderBy: orderByClause,
      }),
      prisma.resource.count({ where }),
    ]);

    console.log('✅ [API] Found resources:', resources.length, 'of', total);

    // Calcular estatísticas dos resultados
    const stats = {
      totalResults: total,
      currentPage: page,
      freeCount: resources.filter((r) => r.isFree).length,
      avgRating:
        resources.length > 0
          ? resources.reduce((sum, r) => sum + (r.rating || 0), 0) /
            resources.length
          : 0,
      totalHours: resources.reduce((sum, r) => sum + (r.durationHours || 0), 0),
    };

    console.log('✅ [API] Stats:', stats);

    const response = {
      data: resources,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
      stats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ [API] Error in /api/resources:', error);

    if (error instanceof Error) {
      console.error('❌ [API] Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch resources',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
