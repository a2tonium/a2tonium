import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SortButtonProps {
    sortBy: string;
    setSortBy: (value: string) => void;
}

export function SortButton({ sortBy, setSortBy }: SortButtonProps) {
    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="flex gap-2 items-center font-semibold"
                >
                    <ArrowDownWideNarrow />
                    <span>
                        {t("catalog.sortBy")}: {t(`catalog.sort.${sortBy}`)}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-semibold">
                <DropdownMenuRadioGroup
                    value={sortBy}
                    onValueChange={setSortBy}
                >
                    <DropdownMenuRadioItem value="featured">
                        {t("catalog.sort.featured")}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="newest">
                        {t("catalog.sort.newest")}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="low-to-high">
                        {t("catalog.sort.low-to-high")}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="high-to-low">
                        {t("catalog.sort.high-to-low")}
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
