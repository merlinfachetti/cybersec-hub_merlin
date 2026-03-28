import { NextResponse } from 'next/server';
import { getEditorialCertificationDetail } from '@/lib/content/editorial-api';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const certification = getEditorialCertificationDetail(id);

  if (!certification) {
    return NextResponse.json(
      {
        error: 'Certification not found',
        details: `No editorial certification matches: ${id}`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ...certification,
    stats: {
      totalCosts: certification.costs.length,
      totalMarketData: certification.marketRecognition.length,
      totalSkills: certification.skills.length,
      totalResources: certification.resources.length,
      totalPrerequisites: certification.prerequisites.length,
      totalPrerequisitesFor: certification.prerequisitesFor.length,
      freeResources: certification.resources.filter((resource) => resource.isFree)
        .length,
      avgResourceRating: 0,
      avgExamCost:
        certification.costs.length > 0
          ? Math.round(
              certification.costs.reduce(
                (sum, cost) => sum + cost.examCost,
                0
              ) / certification.costs.length
            )
          : 0,
      highestDemandRegion: null,
    },
    source: 'editorial',
  });
}
