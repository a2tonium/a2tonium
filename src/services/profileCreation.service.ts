import {
    createPinataInstance,
    findPinataGateway,
} from "@/lib/pinata/pinataClient.lib";
import { uploadImageToPinata, uploadProfileDataToPinata } from "@/lib/pinata/pinataUploader.lib";

import { ProfileDataInterface } from "@/types/profileData";

export async function createProfile(
    profile: ProfileDataInterface,
    jwt: string
): Promise<string> {
    const gateway = await findPinataGateway(jwt);
    const pinata = createPinataInstance(jwt, gateway);
    const imageUrl = await uploadImageToPinata(
        "a2tonium-profile",
        profile.name,
        profile.image,
        pinata
    );

    const cleaned = await reformatProfileData(profile, imageUrl);

    console.log("cleaned", cleaned);
    return await uploadProfileDataToPinata(cleaned, pinata);
}

export async function reformatProfileData(
    profile: ProfileDataInterface,
    imageUrl: string
): Promise<ProfileDataInterface> {
    console.log("formatted", profile);
    const formatted: ProfileDataInterface = {
        ...profile,
        image: imageUrl,
    };

    return formatted;
}

export async function updateProfile(
    profile: ProfileDataInterface,
    jwt: string
): Promise<string> {
    const gateway = await findPinataGateway(jwt);
    const pinata = createPinataInstance(jwt, gateway);
    const imageUrl = await uploadImageToPinata(
        "profile-image",
        profile.name,
        profile.image,
        pinata
    );

    const cleaned = await reformatProfileData(profile, imageUrl);

    console.log("cleaned", cleaned);
    return await uploadProfileDataToPinata(cleaned, pinata);
}