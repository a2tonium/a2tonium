import {
    Tags,
    TagsTrigger,
    TagsContent,
    TagsInput,
    TagsItem,
    TagsList,
    TagsEmpty,
    TagsGroup,
    TagsValue,
} from "@/components/ui/kibo-ui/tags";
import { useState, useEffect } from "react";
import { CheckIcon, ChevronRight, ChevronDown } from "lucide-react";
import categoryData from "@/data/categories.json";
import { useTranslation } from "react-i18next";

// Define the category type with subcategories
interface Category {
    id: string;
    label: string;
    subcategories?: Category[];
}

interface CategorySelectProps {
    selected: string[];
    setSelected: (categories: string[]) => void;
}

export const CategorySelect = ({
    selected,
    setSelected,
}: CategorySelectProps) => {
    const [newTag, setNewTag] = useState<string>("");
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [, setFlattenedTags] = useState<
        { id: string; label: string; path: string[] }[]
    >([]);

    const { t } = useTranslation();

    // Hierarchical categories data
    const categories: Category[] = categoryData;

    // Flatten categories for search and selection
    useEffect(() => {
        const flatten = (
            categories: Category[],
            parentPath: string[] = []
        ): { id: string; label: string; path: string[] }[] => {
            return categories.flatMap((category) => {
                const currentPath = [...parentPath, category.id];
                const result = [
                    { id: category.id, label: category.id, path: currentPath },
                ];

                if (category.subcategories?.length) {
                    return [
                        ...result,
                        ...flatten(category.subcategories, currentPath),
                    ];
                }

                return result;
            });
        };

        setFlattenedTags(flatten(categories));
    }, [categories]);

    const handleRemove = (value: string) => {
        if (!selected.includes(value)) {
            return;
        }

        setSelected(selected.filter((v) => v !== value));
    };

    const handleSelect = (value: string) => {
        if (selected.includes(value)) {
            handleRemove(value);
            return;
        }

        if (selected.length >= 5) {
            return;
        }

        setSelected([...selected, value]);
    };

    const toggleExpand = (categoryId: string) => {
        setExpandedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Filter categories based on search term
    const filterCategories = (
        categories: Category[],
        searchTerm: string
    ): Category[] => {
        if (!searchTerm) return categories;

        return categories
            .map((category): Category | null => {
                const matchesSearch = category.label
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

                let filteredSubcategories: Category[] = [];
                if (
                    category.subcategories &&
                    category.subcategories.length > 0
                ) {
                    filteredSubcategories = filterCategories(
                        category.subcategories,
                        searchTerm
                    );
                }

                if (matchesSearch || filteredSubcategories.length > 0) {
                    return {
                        ...category,
                        subcategories:
                            filteredSubcategories.length > 0
                                ? filteredSubcategories
                                : category.subcategories,
                    };
                }

                return null;
            })
            .filter((category): category is Category => category !== null); // TS теперь понимает, что null убран
    };

    const filteredCategories = filterCategories(categories, searchTerm);

    // Render categories recursively
    const renderCategories = (categories: Category[], level = 0) => {
        return categories.map((category) => {
            const hasSubcategories =
                category.subcategories && category.subcategories.length > 0;
            const isExpanded = expandedCategories.includes(category.id);

            return (
                <div key={category.id} className="w-full">
                    <TagsItem
                        value={category.id}
                        onSelect={handleSelect}
                        className={`pl-${level * 4} w-full`}
                        style={{ paddingLeft: `${level * 16}px` }}
                    >
                        <div className="flex items-center gap-2 w-full">
                            {hasSubcategories && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand(category.id);
                                    }}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    {isExpanded ? (
                                        <ChevronDown size={14} />
                                    ) : (
                                        <ChevronRight size={14} />
                                    )}
                                </button>
                            )}
                            {!hasSubcategories && <div className="w-[14px]" />}
                            <span>{t(`category.${category.id}`)}</span>
                        </div>
                        {selected.includes(category.id) && (
                            <CheckIcon size={14} className="text-goluboy" />
                        )}
                    </TagsItem>

                    {hasSubcategories && isExpanded && (
                        <div className="w-full">
                            {renderCategories(
                                category.subcategories!,
                                level + 1
                            )}
                        </div>
                    )}
                </div>
            );
        });
    };

    // Get label for selected tag
    const getTagLabel = (id: string) => {
        return t(`category.${id}`);
    };

    return (
        <Tags className="max-w-[300px]">
            <TagsTrigger className="rounded-2xl">
                {selected.map((tag) => (
                    <TagsValue key={tag} onRemove={() => handleRemove(tag)}>
                        {getTagLabel(tag)}
                    </TagsValue>
                ))}
            </TagsTrigger>
            <TagsContent className="">
                <TagsInput
                    placeholder="Search category..."
                    value={searchTerm}
                    onValueChange={(value) => {
                        setSearchTerm(value);
                        setNewTag(value);
                    }}
                />
                <TagsList>
                    <TagsEmpty>
                        {newTag.trim() && null}
                        {!newTag.trim() && "No categories found."}
                    </TagsEmpty>
                    <TagsGroup>
                        {renderCategories(filteredCategories)}
                    </TagsGroup>
                </TagsList>
            </TagsContent>
        </Tags>
    );
};
