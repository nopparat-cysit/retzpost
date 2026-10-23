import { describe, it, expect } from 'vitest';
import { TokenVaultService } from './token-vault';

describe('TokenVaultService', () => {
  const v1Key = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const v2Key = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';
  const keysJson = JSON.stringify({ v1: v1Key, v2: v2Key });

  it('should encrypt and decrypt plaintext accurately using primary key', () => {
    const vault = new TokenVaultService(keysJson, 'v1');
    const secret = 'ya29.a0AfH6SMB_secret_youtube_oauth_token_12345';

    const { ciphertext, keyVersion } = vault.encrypt(secret);
    expect(keyVersion).toBe('v1');
    expect(ciphertext.startsWith('v1:')).toBe(true);

    const decrypted = vault.decrypt(ciphertext);
    expect(decrypted).toBe(secret);
  });

  it('should support key rotation: decrypt older v1 ciphertexts even when primary is v2', () => {
    const vaultV1 = new TokenVaultService(keysJson, 'v1');
    const originalToken = 'tiktok_refresh_token_xyz_987';
    const { ciphertext: v1Ciphertext } = vaultV1.encrypt(originalToken);

    // Now instantiate vault with v2 as primary
    const vaultV2 = new TokenVaultService(keysJson, 'v2');
    expect(vaultV2.needsReEncryption(v1Ciphertext)).toBe(true);

    const decrypted = vaultV2.decrypt(v1Ciphertext);
    expect(decrypted).toBe(originalToken);

    // Re-encrypting with v2
    const { ciphertext: v2Ciphertext } = vaultV2.encrypt(decrypted);
    expect(vaultV2.needsReEncryption(v2Ciphertext)).toBe(false);
    expect(vaultV2.decrypt(v2Ciphertext)).toBe(originalToken);
  });

  it('should throw error when decrypting tampered ciphertext', () => {
    const vault = new TokenVaultService(keysJson, 'v1');
    const { ciphertext } = vault.encrypt('secret');

    // Tamper the ciphertext data
    const parts = ciphertext.split(':');
    parts[3] = Buffer.from('corrupted_data').toString('base64');
    const tampered = parts.join(':');

    expect(() => vault.decrypt(tampered)).toThrowError(/Decryption failed/);
  });

  it('should reject invalid keys that are not 32 bytes', () => {
    const badKeys = JSON.stringify({ v1: 'short_key_123' });
    expect(() => new TokenVaultService(badKeys, 'v1')).toThrowError(/must be exactly 32 bytes/);
  });
});
