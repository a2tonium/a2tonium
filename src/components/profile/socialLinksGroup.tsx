import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SocialIcon } from "react-social-icons";

interface SocialLinksGroupProps {
    links: { trait_type: string; value: string }[];
}

export function SocialLinksGroup({ links }: SocialLinksGroupProps) {
    const formatUrl = (value: string, type: string) => {
        if (type === "Email") return `mailto:${value}`;
        if (/^https?:\/\//i.test(value)) return value;
        return `https://${value}`;
    };
    return (
        <div className="flex gap-2 flex-wrap">
            {links.map((link, index) => {
                const url = formatUrl(link.value, link.trait_type);

                return (
                    <HoverCard key={index}>
                        <HoverCardTrigger asChild>
                            <SocialIcon
                                target="_blank"
                                rel="noopener noreferrer"
                                url={
                                    link.trait_type === "Email"
                                        ? "mailto:" + url
                                        : url
                                }
                                style={{ height: 30, width: 30 }}
                            />
                        </HoverCardTrigger>
                        <HoverCardContent className="text-sm font-semibold text-black-700 max-w-xs break-words hover:underline">
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={
                                    link.trait_type === "Email"
                                        ? "mailto:" + url
                                        : url
                                }
                            >
                                {url}
                            </a>
                        </HoverCardContent>
                    </HoverCard>
                );
            })}
        </div>
    );
}
