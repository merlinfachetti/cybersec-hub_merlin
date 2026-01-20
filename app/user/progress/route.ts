import { NextResponse } from 'next/server';

// Mock de progresso do usuário
// Em produção, isso viria do banco de dados via Prisma

const MOCK_PROGRESS = [
  {
    id: 'progress_1',
    userId: 'user_merlin_123',
    certificationId: '', // Será preenchido com ID real
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
    certificationId: '',
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

export async function GET() {
  try {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Em produção, buscar do banco de dados
    // const progress = await prisma.userCertification.findMany({
    //   where: { userId: session.user.id },
    //   include: { certification: { include: { provider: true } } }
    // });

    return NextResponse.json({
      data: MOCK_PROGRESS,
      stats: {
        totalCertifications: 2,
        inProgress: 1,
        completed: 0,
        totalStudyHours: 80,
        averageProgress: 22.5,
        upcomingExams: 0,
      },
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Em produção, salvar no banco de dados
    // await prisma.userCertification.create({ data: body });

    return NextResponse.json({
      success: true,
      data: {
        id: `progress_${Date.now()}`,
        ...body,
      },
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
