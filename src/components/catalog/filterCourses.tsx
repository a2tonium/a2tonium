import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FilterType } from "@/types/courseData";
import { useTranslation } from "react-i18next";
import categoryData from "@/data/categories.json";

interface FilterCoursesProps {
    selectedCategory: string[];
    setSelectedCategory: (categories: string[]) => void;
    selectedDifficulty: string[];
    selectedRating: number[];
    selectedPrice: number[];
    handleFilterChange: (type: FilterType, value: string | number) => void;
}

interface Category {
    id: string;
    label: string;
    subcategories?: Category[];
}

export function FilterCourses({
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    selectedRating,
    selectedPrice,
    handleFilterChange,
}: FilterCoursesProps) {
    const { t } = useTranslation();

    const handleCategoryToggle = (id: string) => {
        const updated = selectedCategory.includes(id)
            ? selectedCategory.filter((cat) => cat !== id)
            : [...selectedCategory, id];

        setSelectedCategory(updated);
    };

    

    const renderCategoryGroup = (cat: Category) => (
        <AccordionItem key={cat.id} value={cat.id}>
          <AccordionTrigger className="text-left text-sm font-medium hover:bg-muted px-1 rounded-sm">
            <div className="flex items-center gap-2 w-full">
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedCategory.includes(cat.id)}
                  onCheckedChange={() => handleCategoryToggle(cat.id)}
                />
              </div>
    
              <span>{t(`category.${cat.id}`)}</span>
            </div>
          </AccordionTrigger>
      
          <AccordionContent className="space-y-2">
            {cat.subcategories?.map((sub) => (
              <Label
                key={sub.id}
                className="flex items-center gap-2 cursor-pointer ml-6"
              >
                <Checkbox
                  checked={selectedCategory.includes(sub.id)}
                  onCheckedChange={() => handleCategoryToggle(sub.id)}
                />
                {t(`category.${sub.id}`)}
              </Label>
            ))}
          </AccordionContent>
        </AccordionItem>
      );
      
      

    return (
        <Accordion type="multiple" className="w-full space-y-1">
            {/* Difficulty */}
            <AccordionItem value="difficulty">
                <AccordionTrigger className="hover:underline font-semibold text-sm">
                    Difficulty
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                    {["Beginner", "Intermediate", "Advanced"].map((level) => (
                        <Label
                            key={level}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Checkbox
                                checked={selectedDifficulty.includes(level)}
                                onCheckedChange={() =>
                                    handleFilterChange("difficulty", level)
                                }
                            />
                            {level}
                        </Label>
                    ))}
                </AccordionContent>
            </AccordionItem>

            {/* Rating */}
            <AccordionItem value="rating">
                <AccordionTrigger className="hover:underline font-semibold text-sm">
                    Rating
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                    {[4, 4.5, 5].map((r) => (
                        <Label
                            key={r}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Checkbox
                                checked={selectedRating.includes(r)}
                                onCheckedChange={() =>
                                    handleFilterChange("rating", r)
                                }
                            />
                            {r}+ stars
                        </Label>
                    ))}
                </AccordionContent>
            </AccordionItem>

            {/* Price */}
            <AccordionItem value="price">
                <AccordionTrigger className="hover:underline font-semibold text-sm">
                    Price
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                    {[50, 100].map((p) => (
                        <Label
                            key={p}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Checkbox
                                checked={selectedPrice.includes(p)}
                                onCheckedChange={() =>
                                    handleFilterChange("price", p)
                                }
                            />
                            Under {p} TON
                        </Label>
                    ))}
                </AccordionContent>
            </AccordionItem>

            {/* Categories */}
            <AccordionItem value="category">
                <AccordionTrigger className="hover:underline font-semibold text-sm">
                    Category
                </AccordionTrigger>
                <AccordionContent className="">
                    <Accordion type="multiple" className="w-full space-y-1">
                        {categoryData.map(renderCategoryGroup)}
                    </Accordion>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
