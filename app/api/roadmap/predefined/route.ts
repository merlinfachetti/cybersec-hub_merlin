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

    if (roadmapId) {
      // Retornar roadmap específico com dados completos
      const definition = roadmapDefinitions.find((r) => r.id === roadmapId);

      if (!definition) {
        return NextResponse.json(
          { error: 'Roadmap not found' },
          { status: 404 }
        );
      }

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
            },
          },
        },
      });

      // Criar nós e edges
      const nodes = certifications.map((cert) => ({
        id: cert.id,
        certificationId: cert.id,
        name: cert.name,
        level: cert.level,
        category: cert.category,
        highlighted: true,
      }));

      const edges: Array<{
        id: string;
        source: string;
        target: string;
        type: string;
      }> = [];

      certifications.forEach((cert) => {
        cert.prerequisites.forEach((prereq) => {
          // Apenas incluir edges se ambos nós estão no roadmap
          if (certifications.find((c) => c.id === prereq.id)) {
            edges.push({
              id: `${prereq.id}-${cert.id}`,
              source: prereq.id,
              target: cert.id,
              type: 'prerequisite',
            });
          }
        });
      });

      return NextResponse.json({
        roadmap: definition,
        nodes,
        edges,
      });
    }

    // Retornar lista de roadmaps
    return NextResponse.json({
      roadmaps: roadmapDefinitions,
    });
  } catch (error) {
    console.error('Error fetching predefined roadmaps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roadmaps' },
      { status: 500 }
    );
  }
}
