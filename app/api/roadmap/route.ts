import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 API /roadmap called'); // ← ADICIONAR LOG

    // Buscar todas as certificações com seus pré-requisitos
    const certifications = await prisma.certification.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        level: true,
        category: true,
        prerequisites: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        level: 'asc',
      },
    });

    // Mapear para formato de grafo
    const nodes = certifications.map((cert) => ({
      id: cert.id,
      certificationId: cert.id,
      name: cert.name,
      level: cert.level,
      category: cert.category,
    }));

    const edges: Array<{
      id: string;
      source: string;
      target: string;
      type: string;
    }> = [];

    certifications.forEach((cert) => {
      cert.prerequisites.forEach((prereq) => {
        edges.push({
          id: `${prereq.id}-${cert.id}`,
          source: prereq.id,
          target: cert.id,
          type: 'prerequisite',
        });
      });
    });

    return NextResponse.json({
      nodes,
      edges,
    });
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roadmap' },
      { status: 500 }
    );
  }
}
