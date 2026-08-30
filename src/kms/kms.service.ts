import { DecryptCommand, GenerateDataKeyCommand, GenerateMacCommand, KMSClient } from '@aws-sdk/client-kms';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto'

@Injectable()
export class KmsService {
    private readonly client: KMSClient

    constructor(){
        this.client = new KMSClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
            }
        });
    }

    async generateDateKey(): Promise<{ plaintextKey: Buffer, encryptedKey: Buffer }>{
        const response = await this.client.send(
            new GenerateDataKeyCommand ({ KeyId: process.env.KMS_ENVELOPE_KEY_ID!, KeySpec: "AES_256" })
        )
        const { Plaintext, CiphertextBlob } = response;
        return {
            plaintextKey: Buffer.from(Plaintext!),
            encryptedKey: Buffer.from(CiphertextBlob!)
        }
    }

    async decryptDataKey(encryptedKey: Buffer): Promise<Buffer> {
        const response = await this.client.send(
            new DecryptCommand({ CiphertextBlob: encryptedKey }),
        );
        const { Plaintext } = response;
        return Buffer.from(Plaintext!);
    }

    async generateMac(data: string): Promise<string> {
        const response = await this.client.send(
            new GenerateMacCommand({
                KeyId: process.env.KMS_HMAC_KEY_ID!,
                Message: Buffer.from(data, 'utf8'),
                MacAlgorithm: 'HMAC_SHA_256',
            }),
        );
        return Buffer.from(response.Mac!).toString('base64');
    }

    encryptPayload(data: object, key: Buffer): string {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        const ciphertext = Buffer.concat([
            cipher.update(JSON.stringify(data), 'utf8'),
            cipher.final(),
        ]);
        const authTag = cipher.getAuthTag();
        return Buffer.concat([iv, authTag, ciphertext]).toString('base64');
    }

    decryptPayload(base64: string, key: Buffer): object {
        const buf = Buffer.from(base64, 'base64');
        const iv = buf.subarray(0, 12);
        const authTag = buf.subarray(12, 28);
        const ciphertext = buf.subarray(28);
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);
        const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
        return JSON.parse(plaintext.toString('utf8'));
    }
}
