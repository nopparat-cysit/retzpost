---
name: retzpost-platforms
description: Developer and AI Agent playbook for adding new social media publishing destinations to RetzPost (Threads, X, Lemon8, Pinterest, LINE VOOM).
---

# RetzPost Platform Integration Playbook

This skill governs the integration of new social platforms into the RetzPost publishing engine. Every platform integration must satisfy our strict security, envelope encryption, error classification, and emergency revocation contracts.

## 1. Schema Enum Update
In `prisma/schema.prisma`:
1. Add the platform to `enum Platform`:
   ```prisma
   enum Platform {
     YOUTUBE
     TIKTOK
     INSTAGRAM
     FACEBOOK
     THREADS    // New platform
     X          // New platform
   }
   ```
2. Generate client and run database migration:
   ```bash
   npx prisma migrate dev --name add_platform_enum
   ```

## 2. Platform Capability Registration
In `src/modules/publishing/platform-capabilities.ts`:
1. Register the platform in `PLATFORM_CAPABILITIES`:
   - `displayName`: Human-readable name.
   - `canDeleteViaApi`: Boolean flag whether the provider Open API provides an endpoint to delete posts (e.g., YouTube `videos.delete`, Facebook `DELETE /{post-id}`, X `DELETE /2/tweets/:id`).
   - `deepLinkTemplate`: For platforms that forbid API deletion (e.g. TikTok, Lemon8), provide deep link template (e.g., `'https://www.threads.net/@{username}/post/{id}'`).
   - `supportedFormats`: Array of `PostFormat` (`FEED_POST`, `STORY`, `VIDEO_REEL`).
   - `maxCaptionLength`: Strict character ceiling.
   - `maxMediaCount`: Max images/videos allowed per post.

## 3. Security & Envelope Encryption
1. **Never store plaintext OAuth tokens:**
   - Always encrypt access and refresh tokens through `TokenVaultService` (`src/modules/security/token-vault.ts`) using AES-256-GCM.
   - Format: `version:ivBase64:authTagBase64:ciphertextBase64`.
2. **Least Privilege Scopes:**
   - Request only the strictly required scopes for publishing and creator profile inspection.
   - Separate publish scopes from inbox fallback or read-only scopes.
3. **Link Scanning:**
   - Before dispatching posts with captions, invoke `scanLinks()` from `src/modules/security/link-scanner.ts` to ensure safety compliance.

## 4. Provider Implementation (`src/providers/{platform}/`)
1. Create `src/providers/{platform}/oauth.ts`:
   - PKCE generation (`code_verifier` and `code_challenge` S256).
   - Code exchange & refresh handlers.
   - Account profile fetching (`providerAccountId`, `handle`, `displayName`, `avatarUrl`).
2. Create callback route at `src/app/api/connections/{platform}/callback/route.ts`:
   - Validate `state` binding with `workspaceId`.
   - Encrypt tokens with `TokenVaultService`.
   - Upsert `SocialConnection` and `PlatformAccount` atomically.

## 5. Emergency Revocation Contract
1. If `canDeleteViaApi: true`:
   - Worker implements the delete API call using authenticated credentials.
2. If `canDeleteViaApi: false`:
   - `resolveEmergencyDeleteAction()` builds the deep link and flags `DEEP_LINK_REQUIRED`.
   - UI and operator alerts present the direct link so the creator can immediately delete the post manually.

## 6. Verification Checklist
- [ ] Unit tests added in `src/modules/publishing/platform-capabilities.test.ts`.
- [ ] Link safety verified with `scanLinks()`.
- [ ] Token vault tests pass: `npm test -- src/modules/security/token-vault.test.ts`.
- [ ] Type check passes: `npx tsc --noEmit`.
