import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const certificationId = searchParams.get('certificationId');
    const region = searchParams.get('region');

    // Query base
    const where: any = {};

    if (certificationId) {
      where.certificationId = certificationId;
    }

    if (region) {
      where.region = region;
    }

    // Buscar dados de mercado
    const marketData = await prisma.marketRecognition.findMany({
      where,
      include: {
        certification: {
          select: {
            id: true,
            name: true,
            level: true,
            category: true,
          },
        },
      },
      orderBy: {
        demandLevel: 'desc',
      },
    });

    // Estatísticas gerais
    const totalJobs = marketData.reduce(
      (sum, item) => sum + (item.jobPostingsCount || 0),
      0
    );

    const avgSalaryImpact =
      marketData.reduce(
        (sum, item) => sum + (item.averageSalaryImpact || 0),
        0
      ) / (marketData.filter((item) => item.averageSalaryImpact).length || 1);

    // Agrupar por região
    const byRegion = marketData.reduce((acc: any, item) => {
      if (!acc[item.region]) {
        acc[item.region] = {
          region: item.region,
          totalJobs: 0,
          certifications: 0,
          avgImpact: 0,
          topDemand: [],
        };
      }

      acc[item.region].totalJobs += item.jobPostingsCount || 0;
      acc[item.region].certifications += 1;
      acc[item.region].avgImpact += item.averageSalaryImpact || 0;

      if (item.demandLevel === 'CRITICAL' || item.demandLevel === 'HIGH') {
        acc[item.region].topDemand.push(item.certification.name);
      }

      return acc;
    }, {});

    // Calcular médias
    Object.keys(byRegion).forEach((region) => {
      byRegion[region].avgImpact =
        byRegion[region].avgImpact / byRegion[region].certifications;
    });

    return NextResponse.json({
      summary: {
        totalJobs,
        avgSalaryImpact: Math.round(avgSalaryImpact),
        regionsTracked: Object.keys(byRegion).length,
        certificationsTracked: new Set(
          marketData.map((item) => item.certificationId)
        ).size,
      },
      byRegion: Object.values(byRegion),
      details: marketData,
    });
  } catch (error) {
    console.error('Error fetching market stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market stats' },
      { status: 500 }
    );
  }
}
