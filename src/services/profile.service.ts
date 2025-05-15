import {
    createPinataInstance,
    findPinataGateway,
} from "@/lib/pinata/pinataClient.lib";
import {
    uploadImageToPinata,
    uploadProfileDataToPinata,
} from "@/lib/pinata/pinataUploader.lib";

import { ProfileDataInterface } from "@/types/profileData";
import { Sender } from "@ton/core";
import {
    getProfileData,
    getTonWalletData,
    getUserNFTsRaw,
} from "@/lib/ton.lib";

export async function createProfile(
    sender: Sender,
    form: {
        image: string;
        name: string;
        description: string;
        social_links: {
            type: string;
            value: string;
        }[];
        jwt: string;
    },
    enrollToProfileContract: (
        sender: Sender,
        profileUrl: string
    ) => Promise<null | undefined>
) {
    const { profileData, jwt } = reformatProfileData(form);

    const gateway = await findPinataGateway(jwt);
    const pinata = createPinataInstance(jwt, gateway);
    const imageUrl = await uploadImageToPinata(
        "profile-image",
        profileData.name,
        profileData.image,
        pinata
    );

    const cleaned = reformatProfileImage(profileData, imageUrl);

    console.log("cleaned", cleaned);
    const profileUrl = await uploadProfileDataToPinata(cleaned, pinata);

    await enrollToProfileContract(sender, profileUrl);
}

export async function updateProfile(
    sender: Sender,
    form: {
        image: string;
        name: string;
        description: string;
        social_links: {
            type: string;
            value: string;
        }[];
        jwt: string;
    },
    updateProfileData: (
        sender: Sender,
        profileUrl: string
    ) => Promise<null | undefined>
) {
    const { profileData, jwt } = reformatProfileData(form);

    const gateway = await findPinataGateway(jwt);
    const pinata = createPinataInstance(jwt, gateway);
    const imageUrl = await uploadImageToPinata(
        "profile-image",
        profileData.name,
        form.image,
        pinata
    );

    const cleaned = reformatProfileImage(profileData, imageUrl);

    console.log("cleaned", cleaned);
    const profileUrl = await uploadProfileDataToPinata(cleaned, pinata);

    await updateProfileData(sender, profileUrl);
}

export async function fetchProfileData(ownerAddress: string) {
    try {
        // const link = profileCell.beginParse().loadRef().beginParse().loadStringTail()
        const profileLink = await getProfileData(ownerAddress);

        const ipfsLink = profileLink?.slice(8);
        console.log("Link:", ipfsLink);

        const profileData: ProfileDataInterface = await fetch(
            `https://ipfs.io/ipfs/${ipfsLink}`
        ).then((res) => res.json());

        return profileData;
    } catch (error) {
        console.error("Error fetching profile data:", error);
        return undefined;
    }
}

export async function fetchTonWalletData(addr: string) {
    const data = await getTonWalletData(addr);
    return {
        address: addr,
        balance: (data.balance / 1e9).toString(),
    };
}

// export async function fetchTonWalletData(
//     addr: string
// ): Promise<ProfileWithWalletDataInterface> {
//     const data = await getTonWalletRawData(addr);
//     return {
//         address: addr,
//         name: "Amandyk",
//         balance: (data.balance / 1e9).toFixed(4),
//         description:
//             "DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION DESCRIPTION",
//         image: "bafybeie74p4z242aeohi2i3cahrc2l7fsfyonxnujfnyvbpjvsnpmpqsgu",
//         attributes: [
//             {
//                 trait_type: "Telegram",
//                 value: "https://t.me/surname",
//             },
//             {
//                 trait_type: "Youtube",
//                 value: "https://www.youtube.com/user/qydnama",
//             },
//             {
//                 trait_type: "Instagram",
//                 value: "https://www.instagram.com/qydnama",
//             },
//             {
//                 trait_type: "X",
//                 value: "https://x.com/qydnama",
//             },
//             {
//                 trait_type: "Linkedin",
//                 value: "https://www.linkedin.com/in/qydnama",
//             },
//             {
//                 trait_type: "Facebook",
//                 value: "https://www.facebook.com/qydnama",
//             },
//             {
//                 trait_type: "Email",
//                 value: "amangikbaktibaiuli@gmail.com",
//             },
//             {
//                 trait_type: "Other",
//                 value: "http://localhost:5173/user/0QA8-SVqn4H2dew-CzMrfzpqg2ReIQSYCFxkzpr4ZnwcunaS",
//             },
//             {
//                 trait_type: "Other",
//                 value: "http://localhost:5173/user/0QA8-SVqn4H2dew-CzMrfzpqg2ReIQSYCFxkzpr4ZnwcunaS",
//             },
//         ],
//     };
// }

export async function fetchUserNFTs(addr: string) {
    const data = await getUserNFTsRaw(addr);
    return data.nft_items;
}

export function reformatProfileData(profile: {
    image: string;
    name: string;
    description: string;
    social_links: {
        type: string;
        value: string;
    }[];
    jwt: string;
}) {
    const { jwt, social_links, ...rest } = profile;
    social_links.map((link) => ({
        ...link,
        value:
            link.type.toLowerCase() === "email" || link.value.startsWith("http")
                ? link.value
                : `https://${link.value}`,
    }));

    const profileData: ProfileDataInterface = {
        ...rest,
        content_url: "",
        attributes: social_links.map((link) => ({
            trait_type: link.type,
            value: link.value,
        })),
    };

    return { profileData, jwt };
}

export function reformatProfileImage(
    profile: ProfileDataInterface,
    imageUrl: string
): ProfileDataInterface {
    console.log("formatted", profile);
    const formatted: ProfileDataInterface = {
        ...profile,
        image: `ipfs://${imageUrl}`,
    };

    return formatted;
}
