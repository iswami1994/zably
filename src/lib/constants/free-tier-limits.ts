/**
 * Free tier user limitation constants
 * Centralized configuration for free tier user restrictions
 * Free tier users have the same restrictions as guest users
 */

// Free tier message limit (same as guest users)
export const FREE_TIER_MESSAGE_LIMIT = 6;

// Free tier users can only access text generation models
// Same models as guest users
export const FREE_TIER_ALLOWED_MODELS = [
    // "deepseek/deepseek-chat-v3.1:free",
    // "deepseek/deepseek-r1-0528:free",
    "google/gemma-3-27b-it:free",
    "openai/gpt-oss-20b:free",
    "moonshotai/kimi-k2:free",
    "z-ai/glm-4.5-air:free"
];

// Helper function to check if a model is allowed for free tier users
export function isModelAllowedForFreeTier(modelName: string): boolean {
    return FREE_TIER_ALLOWED_MODELS.includes(modelName);
}

// Check if user is on free tier
export function isUserFreeTier(planTier: string | null | undefined): boolean {
    return !planTier || planTier === 'free';
}
