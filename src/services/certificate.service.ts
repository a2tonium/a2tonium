import { CertificateCompletionInterface } from "@/types/courseData";

export async function fetchMockCertificate(): Promise<CertificateCompletionInterface> {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds

    return {
        certificateId: "050202930193",
        certificateAddress: "kQAJ6JM9QyDaGH6gvHIxolnwC6bh7VAodnHcyecPvX1NLGoP",
        title: "Python Programming Course",
        description: "Description of the course goes here.",
        courseImage: "/images/cards/1.png",
        courseTitle: "Python Programming Course",
        courseAddress:
            "0:c4e8e20e802afd8b1fd347ad0c63662ab7dae4ef53ca7380a5ab5280b7464d98",
        ownerAddress: "EQA8-SVqn4H2dew-CzMrfzpqg2ReIQSYCFxkzpr4ZnwcunaS",
        attributes: [
            { trait_type: "Completion Date", value: "2025-04-08" },
            { trait_type: "Instructor", value: "Dr. Phil" },
            { trait_type: "Student_IIN", value: "050204814823" },
            { trait_type: "email", value: "ansi_nitro@gmail.com" },
            { trait_type: "Overall Grade", value: "100%" },
            { trait_type: "Quiz1", value: "100%" },
            { trait_type: "Quiz2", value: "100%" },
            { trait_type: "Quiz3", value: "100%" },
            { trait_type: "Quiz4", value: "100%" },
            { trait_type: "Quiz5", value: "100%" },
            { trait_type: "Quiz6", value: "100%" },
        ],
    };
}
