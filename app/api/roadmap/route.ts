import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const predefinedId = searchParams.get('predefinedId');

    console.log('🔍 [API] /api/roadmap called', { predefinedId });

    // Se tem predefinedId, redirecionar para endpoint específico
    if (predefinedId) {
      console.log('ℹ️ [API] Redirecting to /api/roadmap/predefined');
      return NextResponse.json(
        { error: 'Use /api/roadmap/predefined?id=X instead' },
        { status: 400 }
      );
    }

    console.log('🔍 [API] Fetching all certifications for roadmap');

    // Buscar todas as certificações com pré-requisitos (self-relation)
    const certifications = await prisma.certification.findMany({
      include: {
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
        prerequisites: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    console.log('✅ [API] Found certifications:', certifications.length);

    if (certifications.length === 0) {
      console.log('⚠️ [API] No certifications in database');
      return NextResponse.json({
        nodes: [],
        edges: [],
        message: 'No certifications available. Please run database seed.',
      });
    }

    // Criar nós
    const nodes = certifications.map((cert) => ({
      id: cert.id,
      certificationId: cert.id,
      name: cert.name,
      level: cert.level,
      category: cert.category,
      highlighted: false,
    }));

    console.log('✅ [API] Created nodes:', nodes.length);

    // Criar edges baseado em pré-requisitos (self-relation direta)
    const edges: Array<{
      id: string;
      source: string;
      target: string;
      type: 'prerequisite' | 'recommended';
    }> = [];

    certifications.forEach((cert) => {
      if (cert.prerequisites && cert.prerequisites.length > 0) {
        cert.prerequisites.forEach((prereq) => {
          const edgeId = `${prereq.id}-${cert.id}`;
          if (!edges.find((e) => e.id === edgeId)) {
            edges.push({
              id: edgeId,
              source: prereq.id,
              target: cert.id,
              type: 'prerequisite' as const,
            });
            console.log(`✅ [API] Created edge: ${prereq.name} → ${cert.name}`);
          }
        });
      }
    });

    console.log('✅ [API] Created edges:', edges.length);
    console.log('ℹ️ [API] Edges summary:', {
      total: edges.length,
      prerequisites: edges.filter((e) => e.type === 'prerequisite').length,
      recommended: edges.filter((e) => e.type === 'recommended').length,
    });

    return NextResponse.json({
      nodes,
      edges,
      stats: {
        totalCertifications: certifications.length,
        totalConnections: edges.length,
        entryLevel: certifications.filter((c) => c.level === 'ENTRY').length,
        intermediate: certifications.filter((c) => c.level === 'INTERMEDIATE')
          .length,
        advanced: certifications.filter((c) => c.level === 'ADVANCED').length,
        expert: certifications.filter((c) => c.level === 'EXPERT').length,
      },
    });
  } catch (error) {
    console.error('❌ [API] Error in /api/roadmap:', error);

    if (error instanceof Error) {
      console.error('❌ [API] Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch roadmap',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
