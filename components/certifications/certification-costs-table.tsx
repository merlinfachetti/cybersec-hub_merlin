import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/format';
import { REGIONS } from '@/lib/constants';
import type { CertificationDetail } from '@/lib/types';

interface CertificationCostsTableProps {
  costs: CertificationDetail['costs'];
}

export function CertificationCostsTable({
  costs,
}: CertificationCostsTableProps) {
  if (costs.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No cost information available yet.
      </p>
    );
  }

  const sortedCosts = [...costs].sort((a, b) =>
    a.region.localeCompare(b.region)
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Region</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="text-right">Exam Cost</TableHead>
            <TableHead className="text-right">Training</TableHead>
            <TableHead className="text-right">Renewal</TableHead>
            <TableHead>Voucher</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCosts.map((cost) => (
            <TableRow key={cost.id}>
              <TableCell className="font-medium">
                {REGIONS[cost.region as keyof typeof REGIONS]}
              </TableCell>
              <TableCell>{cost.country || '-'}</TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(cost.examCost, cost.currency)}
              </TableCell>
              <TableCell className="text-right">
                {cost.officialTraining
                  ? formatCurrency(cost.officialTraining, cost.currency)
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                {cost.renewalCost
                  ? formatCurrency(cost.renewalCost, cost.currency)
                  : '-'}
              </TableCell>
              <TableCell>
                {cost.voucherAvailable ? (
                  <Badge variant="secondary">Available</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
