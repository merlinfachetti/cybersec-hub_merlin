'use client';

import { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './custom-node';
import { useRouter } from 'next/navigation';
import type { RoadmapData } from '@/lib/types';

interface RoadmapViewerProps {
  data: {
    nodes: Array<{
      id: string;
      certificationId: string;
      name: string;
      level: string;
      category: string;
      highlighted?: boolean;
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
      type: string; // ✅ ACEITAR STRING GENÉRICO
    }>;
  };
}

// Layout automático melhorado
function autoLayout(nodes: Node[], edges: Edge[]) {
  const levelGroups: Record<string, Node[]> = {
    ENTRY: [],
    INTERMEDIATE: [],
    ADVANCED: [],
    EXPERT: [],
  };

  // Agrupar por nível
  nodes.forEach((node) => {
    const level = (node.data as any).level;
    if (levelGroups[level]) {
      levelGroups[level].push(node);
    }
  });

  // Posicionar com espaçamento melhorado
  const levelOrder = ['ENTRY', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
  const positioned: Node[] = [];
  let yOffset = 0;

  levelOrder.forEach((level) => {
    const nodesInLevel = levelGroups[level];
    if (nodesInLevel.length === 0) return;

    const xSpacing = 320;
    const ySpacing = 180;
    const startX = -(nodesInLevel.length - 1) * (xSpacing / 2);

    nodesInLevel.forEach((node, index) => {
      positioned.push({
        ...node,
        position: {
          x: startX + index * xSpacing,
          y: yOffset,
        },
      });
    });

    yOffset += ySpacing;
  });

  return positioned;
}

export function RoadmapViewer({ data }: RoadmapViewerProps) {
  const router = useRouter();

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  // Preparar nodes
  const initialNodes: Node[] = useMemo(() => {
    const nodes = data.nodes.map((node) => ({
      id: node.id,
      type: 'custom',
      data: {
        label: node.name,
        level: node.level,
        category: node.category,
        certificationId: node.certificationId,
        highlighted: node.highlighted || false,
      },
      position: { x: 0, y: 0 },
    }));

    return autoLayout(nodes, data.edges as Edge[]);
  }, [data.nodes, data.edges]);

  // Preparar edges
  const initialEdges: Edge[] = useMemo(() => {
    return data.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
      style: {
        strokeWidth: 2,
        stroke: 'hsl(var(--primary))',
      },
    }));
  }, [data.edges]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      const certId = (node.data as any).certificationId;
      router.push(`/certifications/${certId}`);
    },
    [router]
  );

  return (
    <div className="h-[58vh] min-h-[420px] w-full max-h-[760px] rounded-lg border bg-background sm:h-[68vh]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.3,
        }}
        minZoom={0.1}
        maxZoom={1.5}
      >
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if ((node.data as any).highlighted) {
              return '#3b82f6'; // primary color
            }
            const level = (node.data as any).level;
            const colors: Record<string, string> = {
              ENTRY: '#86efac',
              INTERMEDIATE: '#93c5fd',
              ADVANCED: '#c084fc',
              EXPERT: '#fca5a5',
            };
            return colors[level] || '#d1d5db';
          }}
          className="hidden rounded border sm:block"
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
