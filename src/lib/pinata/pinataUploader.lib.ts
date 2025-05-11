import { PinataSDK } from "pinata";
import { CourseDataInterfaceNew } from "@/types/courseData";
import {
    base64ToFile,
    formatCourseFilename,
    getBase64FromImageURL,
} from "@/utils/file.utils";

export async function uploadImageToPinata(
    type: string,
    courseName: string,
    base64: string,
    pinata: PinataSDK
): Promise<string> {
    try {
        const baseFilename = `${type}_${formatCourseFilename(courseName)}`;
        let file;
        if (type == "certificate" && base64 == "/images/cards/1.png") {
            const fullBase64 = await getBase64FromImageURL(base64);

            file = base64ToFile(fullBase64, baseFilename);
        } else {
            file = base64ToFile(base64, baseFilename);
        }

        const result = await pinata.upload.public.file(file);
        return `${result.cid}`;
    } catch (error) {
        console.error(`Error uploading ${type} image to Pinata:`, error);
        throw error;
    }
}

export async function uploadImagesToPinata(
    image: string,
    cover_image: string,
    certificate: string,
    pinata: PinataSDK,
    courseName: string
): Promise<[string, string, string]> {
    const imageUrl = await uploadImageToPinata(
        "logo",
        courseName,
        image,
        pinata
    );
    const coverImageUrl =
        cover_image !== ""
            ? await uploadImageToPinata(
                  "cover",
                  courseName,
                  cover_image,
                  pinata
              )
            : "";
    const certificateUrl = await uploadImageToPinata(
        "certificate",
        courseName,
        certificate,
        pinata
    );

    return [imageUrl, coverImageUrl, certificateUrl];
}

export async function uploadCourseDataToPinata(
    course: CourseDataInterfaceNew,
    pinata: PinataSDK
): Promise<string> {
    try {
        const result = await pinata.upload.public
            .json(course)
            .name(`${formatCourseFilename(course.name)}.json`);
        return `${result.cid}`;
    } catch (error) {
        console.error("Error uploading course data to Pinata:", error);
        throw error;
    }
}
