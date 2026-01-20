import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLevelColor, formatLevel } from '@/lib/format';

const levels = ['ENTRY', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

export function RoadmapLegend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Legend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Certification Levels:</p>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => (
                <Badge key={level} className={getLevelColor(level)}>
                  {formatLevel(level)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-2">Interactions:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Click on a node to view details</li>
              <li>• Drag to pan the view</li>
              <li>• Scroll to zoom in/out</li>
              <li>• Arrows show prerequisites</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
