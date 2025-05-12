import { useTonClient } from "@/hooks/useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Certificate } from "@/wrappers/certificate";

export function useCertificateContract() {
    const { client } = useTonClient;

    const certificateContract = useAsyncInitialize(async () => {
        if (!client) return;

        const contract = Certificate.fromAddress()
    });
}
