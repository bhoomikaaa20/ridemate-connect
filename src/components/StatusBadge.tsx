import { Badge } from "@/components/ui/badge";

const map: Record<string, string> = {
  pending: "bg-accent/20 text-accent-foreground border-accent/40",
  accepted: "bg-info/15 text-foreground border-info/40",
  completed: "bg-primary/15 text-primary border-primary/40",
  cancelled: "bg-destructive/15 text-destructive border-destructive/40",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={`capitalize ${map[status] ?? ""}`}>
      {status}
    </Badge>
  );
}
