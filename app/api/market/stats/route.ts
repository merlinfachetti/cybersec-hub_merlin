import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const certificationId = searchParams.get('certificationId');
    const region = searchParams.get('region');

    console.log('🔍 [API] /api/market/stats called', {
      certificationId,
      region,
    });

    // Query base
    const where: any = {};

    if (certificationId) {
      where.certificationId = certificationId;
      console.log('🔍 [API] Filtering by certification:', certificationId);
    }

    if (region) {
      where.region = region;
      console.log('🔍 [API] Filtering by region:', region);
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

    console.log('✅ [API] Found market data records:', marketData.length);

    // Verificar se há dados
    if (marketData.length === 0) {
      console.log('⚠️ [API] No market data found');
      return NextResponse.json({
        summary: {
          totalJobs: 0,
          avgSalaryImpact: 0,
          regionsTracked: 0,
          certificationsTracked: 0,
        },
        byRegion: [],
        details: [],
        message: 'No market data available. Please run database seed.',
      });
    }

    // Estatísticas gerais
    const totalJobs = marketData.reduce(
      (sum, item) => sum + (item.jobPostingsCount || 0),
      0
    );

    const salaryImpactItems = marketData.filter(
      (item) => item.averageSalaryImpact && item.averageSalaryImpact > 0
    );

    const avgSalaryImpact =
      salaryImpactItems.length > 0
        ? salaryImpactItems.reduce(
            (sum, item) => sum + (item.averageSalaryImpact || 0),
            0
          ) / salaryImpactItems.length
        : 0;

    console.log('✅ [API] Calculated stats:', {
      totalJobs,
      avgSalaryImpact: Math.round(avgSalaryImpact),
    });

    // Agrupar por região
    const byRegion = marketData.reduce((acc: any, item) => {
      if (!acc[item.region]) {
        acc[item.region] = {
          region: item.region,
          totalJobs: 0,
          certifications: 0,
          avgImpact: 0,
          topDemand: [], // ✅ SEMPRE INICIALIZAR COMO ARRAY
        };
      }

      acc[item.region].totalJobs += item.jobPostingsCount || 0;
      acc[item.region].certifications += 1;
      acc[item.region].avgImpact += item.averageSalaryImpact || 0;

      // ✅ GARANTIR QUE topDemand SEMPRE EXISTE
      if (!acc[item.region].topDemand) {
        acc[item.region].topDemand = [];
      }

      if (item.demandLevel === 'CRITICAL' || item.demandLevel === 'HIGH') {
        // ✅ EVITAR DUPLICATAS
        if (!acc[item.region].topDemand.includes(item.certification.name)) {
          acc[item.region].topDemand.push(item.certification.name);
        }
      }

      return acc;
    }, {});

    // Calcular médias e limpar topDemand
    Object.keys(byRegion).forEach((regionKey) => {
      const regionData = byRegion[regionKey];

      // ✅ CALCULAR MÉDIA COM SEGURANÇA
      regionData.avgImpact =
        regionData.certifications > 0
          ? Math.round(regionData.avgImpact / regionData.certifications)
          : 0;

      // ✅ GARANTIR topDemand É ARRAY
      if (!Array.isArray(regionData.topDemand)) {
        regionData.topDemand = [];
      }

      // ✅ LIMITAR A 5 ITENS MAIS DEMANDADOS
      regionData.topDemand = regionData.topDemand.slice(0, 5);

      console.log(`✅ [API] Region ${regionKey}:`, {
        jobs: regionData.totalJobs,
        certs: regionData.certifications,
        topDemand: regionData.topDemand.length,
      });
    });

    const response = {
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
    };

    console.log('✅ [API] Returning data:', {
      regions: response.byRegion.length,
      details: response.details.length,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ [API] Error in /api/market/stats:', error);

    if (error instanceof Error) {
      console.error('❌ [API] Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch market stats',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
