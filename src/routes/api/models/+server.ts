import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { getAllModels } from '$lib/ai/index.js';
import { waitForEnrichmentCompletion } from '$lib/ai/providers/openrouter.js';
import { isModelAllowedForGuests } from '$lib/constants/guest-limits.js';
import { isDemoModeEnabled, isModelAllowedForDemo, isDemoModeRestricted } from '$lib/constants/demo-mode.js';
import { isModelAllowedForFreeTier, isUserFreeTier } from '$lib/constants/free-tier-limits.js';

export const GET: RequestHandler = async ({ locals }) => {
	try {
		// Wait for OpenRouter architecture enrichment to complete (with 10s timeout)
		console.log('Waiting for OpenRouter architecture enrichment...');
		const enrichmentSuccess = await waitForEnrichmentCompletion(10000);

		if (enrichmentSuccess) {
			console.log('Architecture enrichment completed, returning enriched models');
		} else {
			console.warn('Architecture enrichment timed out, returning basic models');
		}

		const allModels = getAllModels();

		// Check if user is logged in
		// Use locals.auth() to get the enhanced session with planTier from database
		const session = await locals.auth();
		const isLoggedIn = !!session?.user?.id;
		const userPlanTier = session?.user?.planTier;

		// Debug logging
		console.log('[/api/models] Session debug:', {
			isLoggedIn,
			userId: session?.user?.id,
			userPlanTier,
			email: session?.user?.email
		});

		// Check demo mode status
		const demoModeEnabled = isDemoModeEnabled();
		const userDemoRestricted = isDemoModeRestricted(isLoggedIn);

		// Check if user is on free tier
		const isFreeTier = isLoggedIn && isUserFreeTier(userPlanTier);

		console.log('[/api/models] Access control:', {
			isFreeTier,
			demoModeEnabled,
			userDemoRestricted
		});

		// Add guest access and demo mode flags to all models
		const models = allModels.map(model => {
			const guestAllowed = isModelAllowedForGuests(model.name);
			const demoAllowed = isModelAllowedForDemo(model.name);
			const freeTierAllowed = isModelAllowedForFreeTier(model.name);

			let isLocked = false;

			// Determine if model is locked based on user status and demo mode
			if (!isLoggedIn) {
				// Guest users - check guest restrictions
				isLocked = !guestAllowed;
			} else if (isFreeTier) {
				// Free tier users - same restrictions as guest users
				// Only allow text models, no image/video generation
				isLocked = !freeTierAllowed;
			} else if (userDemoRestricted) {
				// Logged-in users in demo mode - check demo restrictions
				isLocked = !demoAllowed;
			}
			// Paid users in normal mode - no restrictions (isLocked = false)

			return {
				...model,
				isGuestAllowed: guestAllowed,
				isDemoAllowed: demoAllowed,
				isLocked,
				isDemoMode: demoModeEnabled
			};
		});

		return json({ models });
	} catch (error) {
		console.error('Models API error:', error);
		return json(
			{ error: 'Failed to fetch models' },
			{ status: 500 }
		);
	}
};