import { PinataSDK } from "pinata";
import { CourseDeployedInterface } from "@/types/courseData";
import {
    base64ToFile,
    formatFilename,
    getBase64FromImageURL,
} from "@/utils/file.utils";
import { ProfileDataInterface } from "@/types/profileData";

export async function uploadImageToPinata(
    type: string,
    fileName: string,
    base64: string,
    pinata: PinataSDK
): Promise<string> {
    try {
        const baseFilename = `a2tonium-${type}-${formatFilename(fileName)}`;
        let file;
        if (type == "course-certificate" && base64 == "/images/cards/1.png") {
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
        "course-logo",
        courseName,
        image,
        pinata
    );
    const coverImageUrl =
        cover_image !== ""
            ? await uploadImageToPinata(
                  "course-cover",
                  courseName,
                  cover_image,
                  pinata
              )
            : "";
    const certificateUrl = await uploadImageToPinata(
        "course-certificate",
        courseName,
        certificate,
        pinata
    );

    return [imageUrl, coverImageUrl, certificateUrl];
}

export async function uploadCourseDataToPinata(
    course: CourseDeployedInterface,
    pinata: PinataSDK
): Promise<string> {
    try {
        const result = await pinata.upload.public
            .json(course)
            .name(`a2tonium-course-${formatFilename(course.name)}.json`);
        return `${result.cid}`;
    } catch (error) {
        console.error("Error uploading course data to Pinata:", error);
        throw error;
    }
}

export async function uploadProfileDataToPinata(
    profile: ProfileDataInterface,
    pinata: PinataSDK
): Promise<string> {
    try {
        const result = await pinata.upload.public
            .json(profile)
            .name(`a2tonium-profile-${formatFilename(profile.name)}.json`);
        return `${result.cid}`;
    } catch (error) {
        console.error("Error uploading profile data to Pinata:", error);
        throw error;
    }
}
