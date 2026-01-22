import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock de progresso do usuário
// ⚠️ NOTA: Em produção, isso viria do banco de dados via Prisma
// Este é um MVP com dados mock para desenvolvimento

// IDs das certificações do seed (devem corresponder ao banco)
const CERT_SLUGS_TO_IDS: Record<string, string> = {};

// Função para buscar IDs reais das certificações
async function getCertificationIds() {
  if (Object.keys(CERT_SLUGS_TO_IDS).length === 0) {
    try {
      const certs = await prisma.certification.findMany({
        select: { id: true, slug: true },
      });
      certs.forEach((cert) => {
        CERT_SLUGS_TO_IDS[cert.slug] = cert.id;
      });
      console.log(
        '✅ [API] Loaded certification IDs:',
        Object.keys(CERT_SLUGS_TO_IDS).length
      );
    } catch (error) {
      console.error('❌ [API] Failed to load certification IDs:', error);
    }
  }
  return CERT_SLUGS_TO_IDS;
}

const MOCK_PROGRESS = [
  {
    id: 'progress_1',
    userId: 'user_merlin_123',
    certificationSlug: 'comptia-security-plus',
    status: 'STUDYING',
    progressPercent: 45,
    studyHours: 80,
    startedAt: '2025-01-01T00:00:00Z',
    completedAt: null,
    expiresAt: null,
    examScore: null,
    attempts: 0,
    notes:
      'Focusing on network security section. Professor Messer videos completed.',
  },
  {
    id: 'progress_2',
    userId: 'user_merlin_123',
    certificationSlug: 'ceh-certified-ethical-hacker',
    status: 'INTERESTED',
    progressPercent: 0,
    studyHours: 0,
    startedAt: null,
    completedAt: null,
    expiresAt: null,
    examScore: null,
    attempts: 0,
    notes: 'Planning to start after Security+',
  },
];

// Validação de status permitidos
const VALID_STATUSES = [
  'INTERESTED',
  'STUDYING',
  'SCHEDULED',
  'PASSED',
  'FAILED',
  'EXPIRED',
];

export async function GET() {
  try {
    console.log('🔍 [API] /api/user/progress GET called');

    // Carregar IDs das certificações
    const certIds = await getCertificationIds();

    // Simular delay de rede (remover em produção)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Enriquecer mock com IDs reais e dados de certificações
    const enrichedProgress = await Promise.all(
      MOCK_PROGRESS.map(async (progress) => {
        const certId = certIds[progress.certificationSlug];

        if (!certId) {
          console.log(
            '⚠️ [API] Certification not found:',
            progress.certificationSlug
          );
          return {
            ...progress,
            certificationId: null,
            certification: null,
          };
        }

        // Buscar dados da certificação
        const certification = await prisma.certification.findUnique({
          where: { id: certId },
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            category: true,
            provider: {
              select: {
                id: true,
                name: true,
              },
            },
            costs: {
              where: { currency: 'USD' },
              take: 1,
              select: {
                examCost: true,
              },
            },
          },
        });

        return {
          ...progress,
          certificationId: certId,
          certification,
        };
      })
    );

    // Calcular estatísticas reais
    const inProgressCount = enrichedProgress.filter(
      (p) => p.status === 'STUDYING' || p.status === 'SCHEDULED'
    ).length;

    const completedCount = enrichedProgress.filter(
      (p) => p.status === 'PASSED'
    ).length;

    const totalStudyHours = enrichedProgress.reduce(
      (sum, p) => sum + p.studyHours,
      0
    );

    const avgProgress =
      enrichedProgress.length > 0
        ? enrichedProgress.reduce((sum, p) => sum + p.progressPercent, 0) /
          enrichedProgress.length
        : 0;

    const upcomingExams = enrichedProgress.filter(
      (p) => p.status === 'SCHEDULED'
    ).length;

    const stats = {
      totalCertifications: enrichedProgress.length,
      inProgress: inProgressCount,
      completed: completedCount,
      totalStudyHours,
      averageProgress: Math.round(avgProgress * 10) / 10, // 1 decimal
      upcomingExams,
    };

    console.log('✅ [API] Returning progress:', {
      count: enrichedProgress.length,
      stats,
    });

    return NextResponse.json({
      data: enrichedProgress,
      stats,
      meta: {
        isMockData: true,
        message: 'This is mock data. Real auth coming soon.',
      },
    });
  } catch (error) {
    console.error('❌ [API] Error in /api/user/progress GET:', error);

    if (error instanceof Error) {
      console.error('❌ [API] Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch progress',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔍 [API] /api/user/progress POST called');

    const body = await request.json();

    console.log('🔍 [API] Request body:', body);

    // Validar campos obrigatórios
    if (!body.certificationSlug && !body.certificationId) {
      console.log('❌ [API] Missing certification identifier');
      return NextResponse.json(
        { error: 'certificationSlug or certificationId is required' },
        { status: 400 }
      );
    }

    // Validar status
    if (body.status && !VALID_STATUSES.includes(body.status)) {
      console.log('❌ [API] Invalid status:', body.status);
      return NextResponse.json(
        {
          error: 'Invalid status',
          validStatuses: VALID_STATUSES,
        },
        { status: 400 }
      );
    }

    // Validar progressPercent (0-100)
    if (
      body.progressPercent !== undefined &&
      (body.progressPercent < 0 || body.progressPercent > 100)
    ) {
      console.log('❌ [API] Invalid progressPercent:', body.progressPercent);
      return NextResponse.json(
        { error: 'progressPercent must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Validar studyHours (>= 0)
    if (body.studyHours !== undefined && body.studyHours < 0) {
      console.log('❌ [API] Invalid studyHours:', body.studyHours);
      return NextResponse.json(
        { error: 'studyHours must be >= 0' },
        { status: 400 }
      );
    }

    // Validar examScore (0-100 ou null)
    if (
      body.examScore !== undefined &&
      body.examScore !== null &&
      (body.examScore < 0 || body.examScore > 100)
    ) {
      console.log('❌ [API] Invalid examScore:', body.examScore);
      return NextResponse.json(
        { error: 'examScore must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Em produção, salvar no banco de dados:
    // await prisma.userCertification.create({ data: body });

    const newProgress = {
      id: `progress_${Date.now()}`,
      userId: 'user_merlin_123', // Mock user ID
      progressPercent: 0,
      studyHours: 0,
      status: 'INTERESTED',
      attempts: 0,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('✅ [API] Progress created (mock):', newProgress.id);

    return NextResponse.json(
      {
        success: true,
        data: newProgress,
        meta: {
          isMockData: true,
          message:
            'Progress saved to mock store. Real DB integration coming soon.',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ [API] Error in /api/user/progress POST:', error);

    if (error instanceof Error) {
      console.error('❌ [API] Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }

    // Tratamento específico de erros JSON
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update progress',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
