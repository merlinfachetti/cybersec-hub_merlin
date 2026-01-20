import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Ordenação
    const orderBy = searchParams.get('orderBy') || 'rating';
    const order = searchParams.get('order') || 'desc';

    // Paginação
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (certificationId) {
      where.certificationId = certificationId;
    }

    if (type) {
      where.type = type;
    }

    if (isFree === 'true') {
      where.isFree = true;
    }

    if (minRating) {
      where.rating = {
        gte: parseFloat(minRating),
      };
    }

    if (language) {
      where.language = language;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { provider: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Build orderBy clause
    const orderByClause: any = {};
    if (orderBy === 'rating') {
      orderByClause.rating = order;
    } else if (orderBy === 'cost') {
      orderByClause.cost = order;
    } else if (orderBy === 'reviews') {
      orderByClause.reviewsCount = order;
    } else if (orderBy === 'recent') {
      orderByClause.lastUpdated = order;
    }

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

    return NextResponse.json({
      data: resources,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}
