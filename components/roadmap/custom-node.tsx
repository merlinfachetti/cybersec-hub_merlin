import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import { formatLevel, getLevelColor } from '@/lib/format';

interface CustomNodeProps {
  data: {
    label: string;
    level: string;
    category: string;
    certificationId: string;
  };
}

function CustomNode({ data }: CustomNodeProps) {
  return (
    <div className="px-4 py-3 shadow-md rounded-lg border-2 border-primary bg-card hover:shadow-lg transition-shadow min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="space-y-2">
        <Badge className={getLevelColor(data.level)} variant="secondary">
          {formatLevel(data.level)}
        </Badge>

        <div className="font-semibold text-sm leading-tight">{data.label}</div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}

export default memo(CustomNode);
