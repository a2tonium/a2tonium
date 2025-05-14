import { useTonClient } from "@/hooks/useTonClient";
import { useTonConnect } from "@/hooks/useTonConnect";
import { Address, OpenedContract, Sender, toNano } from "@ton/core";
import { encodeOffChainContent } from "@/utils/encodeOffChainContent.utils";
import { useEffect, useState } from "react";
import { ProfileFactory } from "@/wrappers/profileFactory";
import { Profile } from "@/wrappers/profile";

export function useProfileContract() {
    const { client } = useTonClient();
    const { address } = useTonConnect();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (client && address) {
            setReady(true);
        }
    }, [client, address]);

    const enrollToProfileContract = async (
        sender: Sender,
        profileUrl: string
    ) => {
        const PROFILE_CONTENT = encodeOffChainContent(`ipfs://${profileUrl}`);
        const profileFactory = client?.open(
            await ProfileFactory.fromInit(
                Address.parse(
                    "EQCkZ7j3CPaHiwduvyIA8S-PqXEhrpPqxwyLhfZx3HASPHZe"
                )
            )
        );
        console.log("profileFactory", profileFactory?.address.toString());
        console.log("PROFILE_CONTENT", PROFILE_CONTENT);

        if (!profileFactory) {
            console.error("Profile Factory contract not found");
            return null;
        }
        await profileFactory.send(
            sender,
            {
                value: toNano("0.03"),
            },
            {
                $$type: "ProfileCreate",
                profile_content: PROFILE_CONTENT,
            }
        );
    };

    const getProfileData = async () => {
        if (!client || !ready) return [];
        let data;

        const profile = client?.open(
            await Profile.fromInit(
                Address.parse(
                    "EQCriJIjnxh2NedMZUiEhV4DT4RIO6_FjQvP5kc3LsqvE7cx"
                ),
                0n
            )
        ) as OpenedContract<Profile>;
        try {
            data = (await profile.getGetNftData()).individual_content;
        } catch (e) {
            console.error("Error opening course contract", e);
        }
        console.log("data", data);
        return data;
    };

    const updateProfileContract = async (
        sender: Sender,
        profileUrl: string
    ) => {
        const PROFILE_CONTENT = encodeOffChainContent(`ipfs://${profileUrl}`);
        const profileFactory = client?.open(
            await ProfileFactory.fromInit(
                Address.parse(
                    "EQCkZ7j3CPaHiwduvyIA8S-PqXEhrpPqxwyLhfZx3HASPHZe"
                )
            )
        );
        const profile = client?.open(
            await Profile.fromInit(
                Address.parse(
                    "EQCriJIjnxh2NedMZUiEhV4DT4RIO6_FjQvP5kc3LsqvE7cx"
                ),
                0n
            )
        ) as OpenedContract<Profile>;

        console.log("profile", profile);
        console.log("profileFactory", profileFactory?.address.toString());
        console.log("PROFILE_CONTENT", PROFILE_CONTENT);

        if (!profileFactory || !profile) {
            console.error("Profile Factory or Profile contract not found");
            return null;
        }
        await profile.send(
            sender,
            {
                value: toNano("0.03"),
            },
            {
            $$type: 'Transfer',
            query_id: 0n,
            new_owner: null,
            response_destination: null,
            custom_payload: PROFILE_CONTENT,
            forward_amount: null,
            forward_payload: null,
            }
        );
    };

    return {
        enrollToProfileContract,
        getProfileData,
        updateProfileContract,
        ready,
    };
}
