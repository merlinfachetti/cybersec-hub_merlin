import { NextResponse } from 'next/server';
import { CAREER_PATH_LIST, CERTIFICATIONS } from '@/lib/content/career-guide';

export async function GET() {
  const nodes = CERTIFICATIONS.map((cert) => ({
    id: `editorial-${cert.slug}`,
    certificationId: `editorial-${cert.slug}`,
    name: cert.name,
    level: cert.level,
    category: cert.category,
    highlighted: false,
  }));

  const edgeMap = new Map<
    string,
    {
      id: string;
      source: string;
      target: string;
      type: 'recommended';
    }
  >();

  for (const path of CAREER_PATH_LIST) {
    const steps = path.steps.filter((step) => step.slug);

    for (let index = 0; index < steps.length - 1; index++) {
      const source = `editorial-${steps[index].slug}`;
      const target = `editorial-${steps[index + 1].slug}`;
      const id = `${source}-${target}`;

      if (!edgeMap.has(id)) {
        edgeMap.set(id, {
          id,
          source,
          target,
          type: 'recommended',
        });
      }
    }
  }

  const edges = [...edgeMap.values()];

  return NextResponse.json({
    nodes,
    edges,
    stats: {
      totalCertifications: nodes.length,
      totalConnections: edges.length,
      entryLevel: nodes.filter((node) => node.level === 'ENTRY').length,
      intermediate: nodes.filter((node) => node.level === 'INTERMEDIATE').length,
      advanced: nodes.filter((node) => node.level === 'ADVANCED').length,
      expert: nodes.filter((node) => node.level === 'EXPERT').length,
    },
    source: 'editorial',
  });
}
