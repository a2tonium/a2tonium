import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

/**
 * Decrypts an encrypted quiz payload using Curve25519 private key.
 *
 * @param encryptedPayload - object with `encrypted`, `nonce`, `ephemeralPublicKey`
 * @param curve25519PrivateKey - Uint8Array (32 bytes)
 * @returns decrypted plain text string
 */
export function decryptAnswers(
  encryptedPayload: {
    encrypted: string;
    nonce: string;
    ephemeralPublicKey: string;
  },
  curve25519PrivateKey: Uint8Array
): string | null {
  try {
    const decrypted = nacl.box.open(
      naclUtil.decodeBase64(encryptedPayload.encrypted),
      naclUtil.decodeBase64(encryptedPayload.nonce),
      naclUtil.decodeBase64(encryptedPayload.ephemeralPublicKey),
      curve25519PrivateKey
    );

    return decrypted ? naclUtil.encodeUTF8(decrypted) : null;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}
