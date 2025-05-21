import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { CertificateInterface } from "@/types/course.types";

interface CertificateCardsProps {
    certificates: CertificateInterface[];
}

export function CertificateCards({ certificates }: CertificateCardsProps) {
    if (!certificates || certificates.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No certificates enrolled yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {certificates.map((certificate) => (
                <Link
                    to={`/certificate/${certificate.certificateAddress}`}
                    key={certificate.certificateAddress}
                    className="block"
                >
                    <Card className="overflow-hidden rounded-xl h-full shadow-md transition-shadow hover:shadow-lg">
                        <CardContent className="p-0">
                            <div className="aspect-square w-full overflow-hidden">
                                <img
                                    src={
                                        certificate.image ||
                                        "/placeholder.svg?height=300&width=300"
                                    }
                                    alt={certificate.title}
                                    className="h-full w-full object-cover transform transition-transform duration-300 ease-in-out hover:scale-105"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 bg-white">
                            <h3 className="font-medium text-sm sm:text-base md:text-lg line-clamp-2">
                                {certificate.title}
                            </h3>
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
