import nacl from "tweetnacl";

import {
    hexToUint8Array,
    stringToUint8Array,
    uint8ArrayToBase64,
} from "@/utils/file.utils";

export const encryptStudentAnswers = async (
    message: string,
    recipientPublicKey: string, // Public key of the recipient
    senderPrivateKey: string
): Promise<string> => {
    const encryptedMessage = await encryptMessage(
        message,
        hexToUint8Array(recipientPublicKey),
        hexToUint8Array(senderPrivateKey)
    );

    return uint8ArrayToBase64(encryptedMessage);
};
export const encryptCourseAnswers = async (
    message: string,
    recipientPublicKey: string // Public key of the recipient
): Promise<{ encryptedMessage: string; senderPublicKey: string }> => {
    const keyPair = nacl.box.keyPair();
    const senderPrivateKey = keyPair.secretKey; // Private key of the sender

    const encryptedMessage = await encryptMessage(
        message,
        hexToUint8Array(recipientPublicKey),
        senderPrivateKey
    );
    return {
        encryptedMessage: uint8ArrayToBase64(encryptedMessage),
        senderPublicKey: uint8ArrayToBase64(keyPair.publicKey),
    };
};

// Encrypts the message using the sender's private key and recipient's public key
const encryptMessage = async (
    message: string,
    recipientPublicKey: Uint8Array, // Public key of the recipient
    senderPrivateKey: Uint8Array // Private key of the sender
): Promise<Uint8Array> => {
    // Convert the message to a byte array
    const messageBytes = stringToUint8Array(message);

    // Generate the shared secret using the sender's private key and the recipient's public key
    const sharedSecret = nacl.box.before(recipientPublicKey, senderPrivateKey);
    console.log(
        "Shared Secret (first 16 bytes for AES):",
        sharedSecret.slice(0, 16)
    );

    // AES encryption setup (using the shared secret as the key)
    const key = sharedSecret.slice(0, 16); // Take the first 16 bytes for AES-128
    const iv = crypto.getRandomValues(new Uint8Array(16)); // Generate a random IV for each encryption

    console.log("Generated IV:", iv);

    // Import the AES key into Web Crypto API
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "AES-CBC" },
        false,
        ["encrypt"]
    );

    // Encrypt the message with AES-CBC
    const encryptedMessage = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv },
        cryptoKey,
        messageBytes
    );

    // Combine IV and encrypted message
    const encryptedBytes = new Uint8Array(
        iv.byteLength + encryptedMessage.byteLength
    );
    encryptedBytes.set(iv, 0); // Set the IV at the beginning
    encryptedBytes.set(new Uint8Array(encryptedMessage), iv.byteLength); // Append the encrypted message

    console.log(
        "Encrypted Message with IV prepended:",
        Array.from(encryptedBytes)
    );
    return encryptedBytes;
};
