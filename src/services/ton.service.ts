import { ipfsToHttp } from "@/utils/ton.utils";

import {
    CertificateCompletionInterface,
    CourseCreationInterface,
    CourseDeployedInterface,
    CoursePromoInterface,
    EnrolledCoursePreview,
} from "@/types/courseData";
import { getEnrolledCourseAddresses, getCourseData } from "@/lib/ton.lib";

export async function fetchIfEnrolled(
    userAddress: string,
    contractAddress: string
): Promise<CourseDeployedInterface> {
    const enrolledCourses = await getEnrolledCourseAddresses(userAddress);
    if (!enrolledCourses.includes(contractAddress)) {
        throw new Error("Access denied");
    }
    const { collectionContent } = await getCourseData(contractAddress);
    const data = await fetch(collectionContent).then((res) => res.json());

    return data as CourseDeployedInterface;
}

export async function fetchPromo(
    contractAddress: string
): Promise< CoursePromoInterface > {
    const { collectionContent, cost, enrolledNumber } = await getCourseData(contractAddress);
    const data = await fetch(collectionContent).then((res) => res.json());
    const dataWithCost = {
        ...data,
        cost: cost,
        enrolledNumber: enrolledNumber,
    }
    return dataWithCost;
}

export async function listEnrolledCourses(
    userAddress: string
): Promise<EnrolledCoursePreview[]> {
    const courseAddrs = await getEnrolledCourseAddresses(userAddress);

    const previews = await Promise.all(
        courseAddrs.map(async (addr): Promise<EnrolledCoursePreview | null> => {
            try {
                const { collectionContent } = await getCourseData(addr);
                if (
                    collectionContent == undefined ||
                    collectionContent == null ||
                    collectionContent === "" ||
                    !collectionContent
                ) {
                    console.warn(
                        "No collection content found for course:",
                        addr
                    );
                    return null;
                }
                const course: CourseCreationInterface = await fetch(
                    collectionContent
                ).then((res) => res.json());

                return {
                    courseAddress: addr,
                    title: course.name,
                    image: ipfsToHttp(course.image),
                };
            } catch (err) {
                console.warn("Skipping invalid course:", addr, err);
                return null;
            }
        })
    );

    return previews.filter(Boolean) as EnrolledCoursePreview[];
}

export async function fetchMockCertificate(): Promise<CertificateCompletionInterface> {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds

    return {
        certificateId: "050202930193",
        certificateAddress: "kQAJ6JM9QyDaGH6gvHIxolnwC6bh7VAodnHcyecPvX1NLGoP",
        title: "Firefighter Training and Safety Course",
        description: "Description of the course goes here.",
        courseImage: "/images/cards/1.png",
        courseTitle: "Firefighter Training and Safety Course",
        courseAddress:
            "0:c4e8e20e802afd8b1fd347ad0c63662ab7dae4ef53ca7380a5ab5280b7464d98",
        ownerAddress: "EQA8-SVqn4H2dew-CzMrfzpqg2ReIQSYCFxkzpr4ZnwcunaS",
        attributes: {
            "Completion Status": "Oh Yeah",
            "Completion Date": "2025-04-08",
            Instructor: "Dr. Akylzhan Akatakatukasay",
            Student_IIN: "050204814823",
            email: "animemylife@gmail.com",
            "Average Grade": "100%",
            Quiz1: "100%",
            Quiz2: "100%",
            Quiz3: "100%",
            Quiz4: "100%",
            Quiz5: "100%",
            Quiz6: "100%",
            Overall: "100%",
        },
    };
}
