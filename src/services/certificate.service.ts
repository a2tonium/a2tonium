import {
    CertificateCompletionInterface,
    CertificateInterface,
    MAX_FAILURES,
    RETRY_DELAY,
} from "@/types/courseData";
import { fetchAndClassifyCourses, getCertificateData } from "@/lib/ton.lib";
import { ipfsToHttp } from "@/utils/ton.utils";
import { Address } from "@ton/core";

export async function listCertificates(
    studentAddress: string
): Promise<CertificateInterface[]> {
    const { completed } = await fetchAndClassifyCourses(studentAddress);
    const result: CertificateInterface[] = [];

    for (const nftItem of completed) {
        let attempts = 0;

        while (attempts < MAX_FAILURES) {
            try {
                const certAddress = Address.parse(nftItem.address).toString();
                const { collectionContent } = await getCertificateData(
                    certAddress
                );

                if (!collectionContent?.trim()) {
                    console.warn(
                        "No collection content found for certificate:",
                        certAddress
                    );
                    break;
                }

                const res = await fetch(collectionContent);

                if (res.status === 429) {
                    throw new Error("Too many requests (429)");
                }

                if (!res.ok) {
                    console.warn(
                        `Non-OK response (${res.status}) for: ${certAddress}`
                    );
                    break;
                }

                const metadata = await res.json();

                if (!metadata?.name || !metadata?.image) {
                    console.warn("Incomplete metadata for:", certAddress);
                    break;
                }

                result.push({
                    certificateAddress: certAddress,
                    title: metadata.name,
                    image: ipfsToHttp(metadata.image),
                });

                break;
            } catch (err: unknown) {
                if (err instanceof Error && err.message.includes("429")) {
                    attempts++;
                    console.warn(
                        `429 Too Many Requests for ${nftItem.address} (attempt ${attempts})`
                    );
                    await new Promise((resolve) =>
                        setTimeout(resolve, RETRY_DELAY)
                    );
                } else {
                    console.warn(
                        `Non-retryable error for ${nftItem.address}:`,
                        err
                    );
                    break;
                }
            }
        }
    }

    return result;
}

export async function getCertificate(
    certificateAddress: string
): Promise<CertificateCompletionInterface> {
    let attempts = 0;

    while (attempts < MAX_FAILURES) {
        try {
            const { collectionContent, ownerAddress, collectionAddress } =
                await getCertificateData(certificateAddress);

            if (!collectionContent?.trim()) {
                console.warn(
                    "No collection content found for certificate:",
                    certificateAddress
                );
                break;
            }

            const res = await fetch(collectionContent);

            if (res.status === 429) {
                throw new Error("Too many requests (429)");
            }

            if (!res.ok) {
                console.warn(`Non-OK response (${res.status}) for: ${certificateAddress}`);
                break;
            }

            const metadata = await res.json();

            if (
                !metadata?.name
            ) {
                console.warn("Incomplete metadata for:", certificateAddress);
                break;
            }

            return {
                certificateAddress: certificateAddress,
                name: metadata.name,
                image: ipfsToHttp(metadata.image),
                description: metadata.description,
                courseAddress: collectionAddress,
                ownerAddress: ownerAddress,
                attributes: metadata.attributes,
                grades: metadata.quizGrades
            };
        } catch (err: unknown) {
            if (err instanceof Error && err.message.includes("429")) {
                attempts++;
                console.warn(
                    `429 Too Many Requests for ${certificateAddress} (attempt ${attempts})`
                );
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
            } else {
                console.warn(`Non-retryable error for ${certificateAddress}:`, err);
                break;
            }
        }
    }

    throw new Error(
        `Failed to load certificate data after ${MAX_FAILURES} attempts`
    );
}

