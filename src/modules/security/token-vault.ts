import crypto from 'crypto';

/**
 * TokenVaultService
 * Handles Application-Layer Envelope Encryption (AES-256-GCM) for sensitive OAuth tokens.
 * Supports multiple key versions for zero-downtime key rotation.
 * 
 * Ciphertext format: "keyVersion:ivBase64:authTagBase64:ciphertextBase64"
 */
export class TokenVaultService {
  private keys: Map<string, Buffer> = new Map();
  private primaryVersion: string;

  constructor(keysJson?: string, primaryVersion?: string) {
    const rawKeys = keysJson || process.env.ENCRYPTION_KEYS_JSON || '{"v1":"0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"}';
    this.primaryVersion = primaryVersion || process.env.ENCRYPTION_PRIMARY_VERSION || 'v1';

    try {
      const parsed = JSON.parse(rawKeys) as Record<string, string>;
      for (const [ver, hexOrBase64] of Object.entries(parsed)) {
        // Expecting 32 bytes (256-bit) key in hex (64 chars) or base64 (44 chars)
        const buf = hexOrBase64.length === 64 
          ? Buffer.from(hexOrBase64, 'hex') 
          : Buffer.from(hexOrBase64, 'base64');
        
        if (buf.length !== 32) {
          throw new Error(`Encryption key for version ${ver} must be exactly 32 bytes (256 bits). Found ${buf.length} bytes.`);
        }
        this.keys.set(ver, buf);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to initialize TokenVaultService keys: ${msg}`);
    }

    if (!this.keys.has(this.primaryVersion)) {
      throw new Error(`Primary encryption key version '${this.primaryVersion}' not found in key store.`);
    }
  }

  /**
   * Encrypts plaintext using AES-256-GCM with the primary key version.
   */
  public encrypt(plaintext: string): { ciphertext: string; keyVersion: string } {
    if (!plaintext) {
      throw new Error('Cannot encrypt empty plaintext');
    }

    const key = this.keys.get(this.primaryVersion)!;
    const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    const packed = `${this.primaryVersion}:${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`;
    return {
      ciphertext: packed,
      keyVersion: this.primaryVersion,
    };
  }

  /**
   * Decrypts ciphertext formatted as "version:iv:tag:data".
   * Automatically selects the correct key according to the stored version.
   */
  public decrypt(packedCiphertext: string): string {
    if (!packedCiphertext) {
      throw new Error('Cannot decrypt empty ciphertext');
    }

    const parts = packedCiphertext.split(':');
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted token format. Expected "version:iv:tag:data"');
    }

    const [version, ivB64, tagB64, dataB64] = parts;
    const key = this.keys.get(version);

    if (!key) {
      throw new Error(`Decryption failed: Unknown or retired key version '${version}'`);
    }

    try {
      const iv = Buffer.from(ivB64, 'base64');
      const authTag = Buffer.from(tagB64, 'base64');
      const ciphertext = Buffer.from(dataB64, 'base64');

      const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
      decipher.setAuthTag(authTag);

      const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
      return decrypted.toString('utf8');
    } catch (err: unknown) {
      throw new Error('Decryption failed: Invalid ciphertext or corrupted authentication tag');
    }
  }

  /**
   * Checks if a ciphertext needs re-encryption with the latest primary key version.
   */
  public needsReEncryption(packedCiphertext: string): boolean {
    const version = packedCiphertext.split(':')[0];
    return version !== this.primaryVersion;
  }
}
