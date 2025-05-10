import React, { useState } from "react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
    className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/users/${searchQuery.trim()}`);
        }
    };

    return (
        <Popover>
            <PopoverTrigger>
                <div
                    className={`${className} flex items-center space-x-2 px-4 py-2 border rounded-xl cursor-pointer`}
                >
                    <Search className="h-5 w-5 text-gray-500" />
                    <span className="hidden sm:inline text-sm text-gray-500">
                        Search
                    </span>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-80 shadow-xl rounded-xl border-0 p-0"
                sideOffset={14}
            >
                <div className="flex flex-col px-3 py-2">
                    <Input
                        type="search"
                        placeholder="Search wallet address..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="w-full border-0 p-0"
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
};
