import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Roadmaps predefinidos com slugs (mais fácil de manter)
const roadmapDefinitions = [
  {
    id: 'dev-to-security-engineer',
    title: 'Developer → Security Engineer',
    description:
      'Perfect for software developers transitioning into application security and secure coding.',
    fromRole: 'Software Developer',
    toRole: 'Security Engineer',
    duration: '12-18 months',
    difficulty: 'intermediate',
    certificationSlugs: [
      'comptia-security-plus',
      'ceh-certified-ethical-hacker',
      'oscp-offensive-security-certified-professional',
    ],
  },
  {
    id: 'beginner-to-analyst',
    title: 'Beginner → Security Analyst',
    description:
      'Start from scratch and build a solid foundation in cybersecurity.',
    fromRole: 'No experience',
    toRole: 'Security Analyst',
    duration: '6-12 months',
    difficulty: 'beginner',
    certificationSlugs: ['comptia-security-plus'],
  },
  {
    id: 'analyst-to-pentester',
    title: 'Security Analyst → Penetration Tester',
    description:
      'Advance from defensive to offensive security. Master penetration testing.',
    fromRole: 'Security Analyst',
    toRole: 'Penetration Tester',
    duration: '12-24 months',
    difficulty: 'advanced',
    certificationSlugs: [
      'ceh-certified-ethical-hacker',
      'oscp-offensive-security-certified-professional',
    ],
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get('id');

    console.log('🔍 [API] /api/roadmap/predefined called', { roadmapId });

    if (roadmapId) {
      // Retornar roadmap específico com dados completos
      const definition = roadmapDefinitions.find((r) => r.id === roadmapId);

      if (!definition) {
        console.log('❌ [API] Roadmap not found:', roadmapId);
        return NextResponse.json(
          { error: 'Roadmap not found' },
          { status: 404 }
        );
      }

      console.log('🔍 [API] Found roadmap definition:', definition.title);

      // Buscar certificações por slug
      const certifications = await prisma.certification.findMany({
        where: {
          slug: {
            in: definition.certificationSlugs,
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          level: true,
          category: true,
          prerequisites: {
            select: {
              id: true,
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
        console.log(
          '⚠️ [API] No certifications found for slugs:',
          definition.certificationSlugs
        );
        return NextResponse.json(
          { error: 'No certifications found for this roadmap' },
          { status: 404 }
        );
      }

      // Criar nós
      const nodes = certifications.map((cert) => ({
        id: cert.id,
        certificationId: cert.id,
        name: cert.name,
        level: cert.level,
        category: cert.category,
        highlighted: true,
      }));

      console.log('✅ [API] Created nodes:', nodes.length);

      // Criar edges baseado em pré-requisitos
      const edges: Array<{
        id: string;
        source: string;
        target: string;
        type: 'prerequisite' | 'recommended';
      }> = [];

      certifications.forEach((cert) => {
        if (cert.prerequisites && cert.prerequisites.length > 0) {
          cert.prerequisites.forEach((prereqRelation) => {
            const prereqId = prereqRelation.id;
            const prereqCert = certifications.find((c) => c.id === prereqId);

            if (prereqCert) {
              const edgeId = `${prereqId}-${cert.id}`;
              // Evitar duplicatas
              if (!edges.find((e) => e.id === edgeId)) {
                edges.push({
                  id: edgeId,
                  source: prereqId,
                  target: cert.id,
                  type: 'prerequisite' as const,
                });
                console.log(
                  `✅ [API] Created edge: ${prereqCert.name} → ${cert.name}`
                );
              }
            }
          });
        }
      });

      // Se não há edges de pré-requisitos, criar sequencial
      if (edges.length === 0 && certifications.length > 1) {
        console.log(
          'ℹ️ [API] No prerequisites found, creating sequential path'
        );
        for (let i = 0; i < certifications.length - 1; i++) {
          edges.push({
            id: `${certifications[i].id}-${certifications[i + 1].id}`,
            source: certifications[i].id,
            target: certifications[i + 1].id,
            type: 'recommended' as const,
          });
        }
      }

      console.log('✅ [API] Built graph:', {
        nodes: nodes.length,
        edges: edges.length,
      });

      // ✅ CORREÇÃO: Retornar estrutura CONSISTENTE
      return NextResponse.json({
        nodes,
        edges,
        roadmapInfo: {
          id: definition.id,
          title: definition.title,
          description: definition.description,
          fromRole: definition.fromRole,
          toRole: definition.toRole,
          duration: definition.duration,
          difficulty: definition.difficulty,
        },
      });
    }

    // Retornar lista de roadmaps (sem ID)
    console.log('✅ [API] Returning roadmaps list:', roadmapDefinitions.length);
    return NextResponse.json({
      roadmaps: roadmapDefinitions,
    });
  } catch (error) {
    console.error('❌ [API] Error in /api/roadmap/predefined:', error);

    if (error instanceof Error) {
      console.error('❌ [API] Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch roadmaps',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
