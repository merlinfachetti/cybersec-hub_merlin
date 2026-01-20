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
    highlighted?: boolean;
  };
}

function CustomNode({ data }: CustomNodeProps) {
  return (
    <div
      className={`px-4 py-3 shadow-md rounded-lg border-2 bg-card hover:shadow-lg transition-all min-w-[200px] ${
        data.highlighted
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-border'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3" />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge className={getLevelColor(data.level)} variant="secondary">
            {formatLevel(data.level)}
          </Badge>
          {data.highlighted && (
            <Badge variant="default" className="text-xs">
              ⭐
            </Badge>
          )}
        </div>

        <div className="font-semibold text-sm leading-tight">{data.label}</div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}

export default memo(CustomNode);
