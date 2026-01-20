import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const certification = await prisma.certification.findUnique({
      where: {
        id: params.id,
      },
      include: {
        provider: true,
        costs: {
          orderBy: {
            region: 'asc',
          },
        },
        marketRecognition: {
          orderBy: {
            region: 'asc',
          },
        },
        skills: {
          include: {
            skill: true,
          },
        },
        resources: {
          orderBy: {
            rating: 'desc',
          },
        },
        prerequisites: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
          },
        },
        prerequisitesFor: {
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
          },
        },
      },
    });

    if (!certification) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(certification);
  } catch (error) {
    console.error('Error fetching certification:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certification' },
      { status: 500 }
    );
  }
}
