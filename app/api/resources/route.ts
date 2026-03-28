import { NextResponse } from 'next/server';
import { getEditorialResources } from '@/lib/content/editorial-api';

const VALID_ORDER_BY = ['rating', 'cost', 'reviews', 'recent', 'title'];
const VALID_ORDER = ['asc', 'desc'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const certificationId = searchParams.get('certificationId');
  const type = searchParams.get('type');
  const isFree = searchParams.get('isFree');
  const minRating = searchParams.get('minRating');
  const language = searchParams.get('language');
  const search = searchParams.get('search')?.trim().toLowerCase() ?? '';

  const orderByParam = searchParams.get('orderBy') || 'rating';
  const orderParam = searchParams.get('order') || 'desc';
  const orderBy = VALID_ORDER_BY.includes(orderByParam)
    ? orderByParam
    : 'rating';
  const order = VALID_ORDER.includes(orderParam) ? orderParam : 'desc';

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get('limit') || '20', 10))
  );

  let resources = getEditorialResources().filter((resource) => {
    if (certificationId && resource.certificationId !== certificationId) {
      return false;
    }

    if (type && resource.type !== type) return false;
    if (isFree === 'true' && !resource.isFree) return false;

    if (minRating) {
      const parsed = parseFloat(minRating);
      if (!Number.isNaN(parsed) && (resource.rating || 0) < parsed) {
        return false;
      }
    }

    if (language && resource.language !== language) return false;

    if (!search) return true;

    return (
      resource.title.toLowerCase().includes(search) ||
      resource.provider.toLowerCase().includes(search) ||
      (resource.description ?? '').toLowerCase().includes(search) ||
      (resource.certification?.name ?? '').toLowerCase().includes(search)
    );
  });

  resources = resources.sort((first, second) => {
    const direction = order === 'asc' ? 1 : -1;

    switch (orderBy) {
      case 'cost':
        return (first.cost - second.cost) * direction;
      case 'reviews':
        return ((first.reviewsCount || 0) - (second.reviewsCount || 0)) * direction;
      case 'recent':
        return 0;
      case 'title':
        return first.title.localeCompare(second.title) * direction;
      case 'rating':
      default:
        return ((first.rating || 0) - (second.rating || 0)) * direction;
    }
  });

  const total = resources.length;
  const start = (page - 1) * limit;
  const paginated = resources.slice(start, start + limit);

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
      freeCount: paginated.filter((resource) => resource.isFree).length,
      avgRating:
        paginated.length > 0
          ? paginated.reduce(
              (sum, resource) => sum + (resource.rating || 0),
              0
            ) / paginated.length
          : 0,
      totalHours: paginated.reduce(
        (sum, resource) => sum + (resource.durationHours || 0),
        0
      ),
    },
    source: 'editorial',
  });
}
