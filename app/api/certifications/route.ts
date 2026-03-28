import { NextResponse } from 'next/server';
import { getEditorialCertificationsList } from '@/lib/content/editorial-api';

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
  const { searchParams } = new URL(request.url);

  const levelParam = searchParams.get('level');
  const categoryParam = searchParams.get('category');
  const search = searchParams.get('search')?.trim().toLowerCase() ?? '';

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('limit') || '12', 10))
  );

  const level =
    levelParam && VALID_LEVELS.includes(levelParam) ? levelParam : null;
  const category =
    categoryParam && VALID_CATEGORIES.includes(categoryParam)
      ? categoryParam
      : null;

  const allCertifications = getEditorialCertificationsList();

  const filtered = allCertifications.filter((cert) => {
    if (level && cert.level !== level) return false;
    if (category && cert.category !== category) return false;
    if (!search) return true;

    return (
      cert.name.toLowerCase().includes(search) ||
      cert.fullName.toLowerCase().includes(search) ||
      (cert.acronym ?? '').toLowerCase().includes(search) ||
      cert.description.toLowerCase().includes(search) ||
      cert.provider.name.toLowerCase().includes(search) ||
      cert.editorial.bestFor.toLowerCase().includes(search)
    );
  });

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    data: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
    stats: {
      totalResults: total,
      currentPage: page,
      entryLevel: filtered.filter((cert) => cert.level === 'ENTRY').length,
      intermediate: filtered.filter((cert) => cert.level === 'INTERMEDIATE')
        .length,
      advanced: filtered.filter((cert) => cert.level === 'ADVANCED').length,
      expert: filtered.filter((cert) => cert.level === 'EXPERT').length,
      avgCost:
        filtered.length > 0
          ? Math.round(
              filtered.reduce(
                (sum, cert) => sum + (cert.costs[0]?.examCost || 0),
                0
              ) / filtered.length
            )
          : 0,
    },
    source: 'editorial',
  });
}
