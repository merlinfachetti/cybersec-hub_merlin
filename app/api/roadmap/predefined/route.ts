import { NextResponse } from 'next/server';
import {
  getEditorialRoadmapGraph,
  getEditorialRoadmaps,
} from '@/lib/content/editorial-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roadmapId = searchParams.get('id');

  if (roadmapId) {
    const roadmap = getEditorialRoadmapGraph(roadmapId);

    if (!roadmap) {
      return NextResponse.json({ error: 'Roadmap not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...roadmap,
      source: 'editorial',
    });
  }

  return NextResponse.json({
    roadmaps: getEditorialRoadmaps(),
    source: 'editorial',
  });
}
