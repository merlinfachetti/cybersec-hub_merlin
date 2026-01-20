import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Filtros
    const level = searchParams.get('level');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Paginação
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (level) {
      where.level = level;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
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
          },
          _count: {
            select: {
              resources: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.certification.count({ where }),
    ]);

    return NextResponse.json({
      data: certifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching certifications:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch certifications',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
