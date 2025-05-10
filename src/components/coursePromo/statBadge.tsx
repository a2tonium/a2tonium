import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatBadgeProps {
    children: React.ReactNode;
    filled?: boolean;
}

export function StatBadge({ children, filled = false }: StatBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn(
                "border-goluboy text-goluboy",
                filled ? "bg-goluboy text-white" : "bg-white"
            )}
        >
            {children}
        </Badge>
    );
}
