# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WeaveAI is a comprehensive multimodal AI platform built with SvelteKit 2.x and Svelte 5.x (Runes mode). It provides unified access to 65+ AI models from 9 different providers for text, image, and video generation, with complete authentication, billing, and admin management systems.

## Development Commands

### Core Development
```bash
npm install              # Install dependencies
npm run dev              # Start development server (Vite)
npm run build            # Build for production
npm run preview          # Preview production build
```

### Type Checking
```bash
npm run check            # Run type checking once
npm run check:watch      # Run type checking in watch mode
```

### Database Operations
```bash
npm run db:push          # Push schema changes to database (development)
npm run db:migrate       # Run database migrations (production)
npm run db:studio        # Open Drizzle Studio for database management
```

### Internationalization
```bash
npm run machine-translate # Translate i18n messages via Inlang
```

## Tech Stack & Architecture

### Frontend Architecture

**Framework**: SvelteKit 2.x with Svelte 5.x in **Runes mode only**
- Use `$state`, `$derived`, `$effect` exclusively
- Import from `$app/state` instead of `$app/stores`
- No legacy Svelte stores pattern

**State Management**:
- `src/lib/components/chat-state.svelte.ts`: Global chat state using Svelte 5 runes
- State is managed per-component using `$state` runes
- Browser-based navigation uses `goto()` from `$app/navigation`

**Component Library**: shadcn-svelte (powered by bits-ui)
- All UI components follow shadcn patterns
- Located in `src/lib/components/ui/`
- Maintain consistency with existing component patterns

**Styling**: TailwindCSS 4.x
- Extensive CSS custom properties for theming
- Dark/light mode support via mode-watcher
- Forms styled with @tailwindcss/forms
- Typography with @tailwindcss/typography

### Backend Architecture

**Database**: PostgreSQL with Drizzle ORM and PostgreSQL.js driver
- Schema: `src/lib/server/db/schema.ts`
- Database instance exported from `src/lib/server/db/index.ts`
- Always use parameterized queries for security
- Performance indexes on `createdAt` fields and composite indexes for common queries

**Authentication**: Auth.js for SvelteKit
- Config: `src/lib/server/auth-config.ts`
- Entry point: `src/auth.ts`
- Drizzle adapter for session management
- Supports email/password + OAuth (Google, Apple, X, Facebook)
- Email verification with 24-hour tokens
- Password reset with secure tokens and rate limiting

**Middleware Pipeline** (`src/hooks.server.ts`):
1. Security headers middleware
2. Settings store loading
3. Locale default handling
4. Paraglide i18n middleware
5. Storage service warming
6. Auth middleware with rate limiting
7. Session augmentation with user data

### AI Provider Architecture

**Multi-Provider System** (`src/lib/ai/`):
- `providers/`: Individual AI provider implementations
  - `openrouter.ts`: 32+ text models via unified API
  - `google-gemini.ts`: Image/video generation
  - `openai.ts`: DALL-E, GPT Image models
  - `xai.ts`: Grok-2-Image
  - `stability.ts`: Stable Diffusion models
  - `bfl.ts`: FLUX models
  - `kling.ts`: Kling image/video
  - `lumalabs.ts`: Photon/Ray models
  - `alibaba.ts`: Wan image/video
- `tools/`: Function calling implementations (Deep Research, Think Longer)
- `types.ts`: Comprehensive type definitions for all AI operations
- `index.ts`: Provider registry and model exports

**Provider Pattern**:
Each provider implements the `AIProvider` interface:
- `chat()`: Text generation with streaming support
- `generateImage()`: Image generation
- `generateVideo()`: Video generation
- `chatMultimodal()`: Multimodal conversations
- `chatWithTools()`: Function calling support

**Model Configuration**:
- Models have capability flags: `supportsTextGeneration`, `supportsImageGeneration`, etc.
- Guest access controlled via `isGuestAllowed` flag
- Demo mode restrictions via `isDemoAllowed` flag
- Model metadata includes provider, maxTokens, streaming support

### Usage Tracking System

**Service**: `src/lib/server/usage-tracking.ts`

**Key Features**:
- Dual reset schedules: 12-hour for free tier, billing period for paid tiers
- Tracks text, image, and video generation counts
- Per-user limits based on pricing plan tier
- Throws `UsageLimitError` when limits exceeded
- Supports model-specific usage statistics

**Integration Points**:
- API endpoints check limits before processing
- Increments usage after successful generation
- Resets usage based on tier schedule

### Security Architecture (9-Layer System)

1. **Input Sanitization**: `src/lib/utils/sanitization.ts` (DOMPurify)
2. **Password Security**: `src/lib/utils/password-validation.ts` (bcrypt with 12 rounds, OWASP/NIST compliant)
3. **Email Validation**: `src/lib/utils/email-validation.ts` (RFC 5322 compliant)
4. **Rate Limiting**: `src/lib/server/rate-limiting.ts` (exponential backoff, per-operation limits)
5. **Bot Protection**: `src/lib/server/turnstile.ts` (Cloudflare Turnstile)
6. **Security Headers**: `src/lib/server/security-headers.ts` (CSP, HSTS, X-Frame-Options)
7. **Session Security**: `src/lib/server/session-security.ts` (secure cookies, JWT encryption)
8. **Security Monitoring**: `src/lib/server/security-monitoring.ts` (25+ event types, data masking)
9. **Error Handling**: `src/lib/utils/error-handling.ts` (sanitized error messages)

**Security Requirements**:
- Always sanitize user input before processing
- Use `validateSession` for protected routes
- Log security events using SecurityLogger
- Never expose sensitive data in error messages
- Use standardized error responses

### Storage System

**Service**: `src/lib/server/storage.ts`

**3-Tier Fallback Architecture**:
1. Cloudflare R2 (primary, S3-compatible)
2. Local filesystem (automatic fallback)
3. Database metadata tracking

**File Management**:
- Images tracked in `images` table with `storageLocation` field
- Videos tracked in `videos` table
- Cloud files use presigned URLs for access
- Local files served from `static/uploads/`

### Billing & Subscriptions

**Service**: `src/lib/server/stripe.ts`

**Features**:
- Stripe Checkout integration
- Webhook handling for subscription events
- Customer portal for self-service management
- Multi-tier pricing plans configurable via admin dashboard
- Payment history tracking

**Database Tables**:
- `pricingPlans`: Tier definitions with usage limits
- `subscriptions`: Active subscription data
- `paymentHistory`: Complete payment audit trail
- `usageTracking`: Usage quotas with reset schedules

## Database Schema

### Authentication Tables
- `users`: User accounts with planTier, subscriptionStatus, stripeCustomerId, emailVerified, marketingConsent
- `accounts`: OAuth provider connections
- `sessions`: Active user sessions
- `verificationTokens`: 24-hour email verification tokens
- `passwordResetTokens`: 24-hour password reset tokens with rate limiting
- `authenticators`: WebAuthn authenticator credentials

### Content Tables
- `chats`: Conversation history with JSON message storage, multimodal support, pinning
- `images`: Image metadata with cloud/local storage tracking, MIME types, user/chat links
- `videos`: Video metadata with storage location, file sizes, timestamps

### Billing Tables
- `pricingPlans`: Configurable subscription plans with usage limits
- `subscriptions`: Stripe subscription data with status tracking
- `paymentHistory`: Complete payment audit trail
- `usageTracking`: Usage quotas with 12-hour reset support via `lastResetAt` field

### Admin Tables
- `adminSettings`: Encrypted system configuration (SMTP, storage, security settings)

**Important**: All tables use cascade deletes for data integrity. Performance indexes exist on `createdAt` fields and composite indexes for common queries (e.g., `images_user_created_idx`).

## API Endpoint Patterns

### Chat & AI Generation
- `POST /api/chat`: Text conversations with streaming
- `POST /api/chat-multimodal`: Multimodal conversations with file uploads
- `POST /api/image-generation`: Generate images
- `POST /api/video-generation`: Generate videos
- `GET /api/models`: List all models with capabilities

### Chat Management
- `GET /api/chats`: List user's chat history
- `GET /api/chats/[id]`: Retrieve specific chat
- `PUT /api/chats/[id]`: Update chat
- `DELETE /api/chats/[id]`: Delete chat
- `POST /api/chats/[id]/pin`: Pin/unpin chat

### Billing & Subscriptions
- `POST /api/stripe/create-checkout-session`: Create Stripe checkout
- `POST /api/stripe/webhook`: Handle Stripe webhook events
- `POST /api/stripe/create-portal-session`: Customer billing portal
- `GET /api/billing`: User billing information

### Admin APIs (Protected)
- `GET /api/admin/analytics`: User growth and subscription metrics
- `GET /api/admin/plans/*`: Manage pricing plans (CRUD)
- Form actions in `/admin/settings/*` for system configuration

**Endpoint Pattern**:
1. Validate session using `validateSession()`
2. Check user permissions (admin check for admin endpoints)
3. Validate request data (sanitize inputs)
4. Check usage limits if applicable
5. Process request
6. Track usage if applicable
7. Return standardized response

## Guest User System

**Constants**: `src/lib/constants/guest-limits.ts`

**Restrictions**:
- 10 message limit per session
- Limited model access (free tier models only)
- No chat history persistence
- No file uploads
- Conversion-focused UI prompts

**Implementation**:
- Check `userId` presence to determine guest status
- Enforce limits in API endpoints
- Filter models by `isGuestAllowed` flag
- Show upgrade prompts after limits reached

## Demo Mode

**Constants**: `src/lib/constants/demo-mode.ts`

**Features**:
- Environment-controlled via `DEMO_MODE` env variable
- Read-only access to admin dashboard
- Restricted model access via `isDemoAllowed` flag
- All write operations blocked with friendly messages

## Internationalization (i18n)

**Library**: Paraglide JS

**Supported Languages**: English (en), German (de)

**Message Structure**:
```typescript
import * as m from '$lib/paraglide/messages.js';
// Usage: m['category.key']()
```

**Default Language**:
- Set via admin dashboard (`adminSettings.defaultLanguage`)
- Falls back to 'en' if not configured
- User preference stored in `PARAGLIDE_LOCALE` cookie

## Development Guidelines

### Code Style
- TypeScript with strict mode throughout
- Svelte 5 Runes mode exclusively (`$state`, `$derived`, `$effect`)
- Follow shadcn-svelte component patterns
- Use Drizzle ORM with parameterized queries
- Avoid over-engineering: only implement what's requested

### Security Practices
- Always sanitize user input using `src/lib/utils/sanitization.ts`
- Use standardized error handling from `src/lib/utils/error-handling.ts`
- Log security events using SecurityLogger for auth operations
- Never expose sensitive information in error messages
- Validate sessions for protected routes

### Performance Considerations
- Use session caching to prevent N+1 queries
- Implement proper indexes for database queries
- Leverage Svelte 5 fine-grained reactivity
- Consider lazy loading for large components
- Use composite indexes for common query patterns

### Testing Approach
- Test AI integrations thoroughly across providers
- Verify error handling for all edge cases
- Test security measures (rate limiting, input sanitization)
- Validate usage tracking calculations
- Test guest user restrictions

## Environment Variables

**Required**:
- `DATABASE_URL`: PostgreSQL connection string
- `AUTH_SECRET`: Auth.js secret (generate with `npx auth secret`)
- `PUBLIC_ORIGIN`: Public URL for the application
- `NODE_ENV`: Environment (production/development)

**Optional** (can be configured via admin dashboard):
- `OPENROUTER_API_KEY`: Text models via OpenRouter
- `GEMINI_API_KEY`: Google Gemini image/video
- `OPENAI_API_KEY`: DALL-E, GPT Image
- `XAI_API_KEY`: Grok-2-Image
- `STABILITYAI_API_KEY`: Stable Diffusion
- `BFL_API_KEY`: FLUX models
- `ALIBABA_API_KEY`: Wan models
- `LUMALABS_API_KEY`: Photon/Ray models
- `KLING_API_ACCESS_KEY` + `KLING_API_SECRET_KEY`: Kling models
- `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET`: Google OAuth
- `AUTH_APPLE_ID` + `AUTH_APPLE_SECRET`: Apple OAuth
- `AUTH_TWITTER_ID` + `AUTH_TWITTER_SECRET`: X OAuth
- `AUTH_FACEBOOK_ID` + `AUTH_FACEBOOK_SECRET`: Facebook OAuth
- `PUBLIC_STRIPE_PUBLISHABLE_KEY` + `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`: Stripe billing
- `R2_ACCOUNT_ID` + `R2_ACCESS_KEY_ID` + `R2_SECRET_ACCESS_KEY` + `R2_BUCKET_NAME` + `R2_PUBLIC_URL`: Cloudflare R2 storage
- `TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile bot protection
- `SMTP_HOST` + `SMTP_PORT` + `SMTP_USER` + `SMTP_PASS` + `FROM_EMAIL` + `FROM_NAME`: Email configuration
- `DEMO_MODE`: Enable read-only demonstration mode

## Important Architectural Patterns

### Admin Settings Pattern
Admin-configurable settings are stored in `adminSettings` table and cached in memory via `settingsStore` service. Settings are loaded in middleware and available in `event.locals.settings`. This prevents database calls on every request.

### Storage Fallback Pattern
When uploading files, the storage service attempts R2 upload first. If R2 is not configured or fails, it automatically falls back to local filesystem storage. The `storageLocation` field in database tracks where each file is stored.

### Usage Reset Pattern
Free tier users have 12-hour reset cycles tracked via `lastResetAt` timestamp. Paid users reset based on billing period start date from Stripe subscription. The `UsageTrackingService.checkAndResetUsage()` method handles both patterns.

### Message Storage Pattern
Chat messages are stored as JSON arrays in the `messages` field of the `chats` table. Each message includes role, content, and optional metadata (imageIds, videoId, tool_calls). This allows for efficient retrieval and flexible message structure.

### Model Capability Pattern
Models are defined with capability flags rather than type hierarchies. A model can support multiple capabilities (text + image, text + video, etc.). Check capabilities using flags like `supportsTextGeneration`, `supportsImageGeneration` rather than model type.

### Security Event Pattern
Authentication and security-related operations log events via `SecurityLogger` from `src/lib/server/security-monitoring.ts`. Events include type, severity, user info, and masked sensitive data. Use this for audit trails and security monitoring.
