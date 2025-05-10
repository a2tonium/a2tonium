import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow } from "lucide-react";

interface SortButtonProps {
    sortBy: string;
    setSortBy: (value: string) => void;
}

export function SortButton({ sortBy, setSortBy }: SortButtonProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2 items-center font-semibold">
                    <ArrowDownWideNarrow />
                    <span>Sort by: {sortBy}</span></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className=" font-semibold">
                <DropdownMenuRadioGroup
                    value={sortBy}
                    onValueChange={setSortBy}
                >
                    <DropdownMenuRadioItem value="featured">
                        Featured
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="newest">
                        Newest
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="low-to-high">
                        Price: Low to High
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="high-to-low">
                        Price: High to Low
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
