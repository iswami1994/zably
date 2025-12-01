import type { PageServerLoad } from './$types';
import { getPricingPlans } from '$lib/server/pricing-plans-seeder.js';

export const load: PageServerLoad = async () => {
	try {
		// Get all pricing plans from the database
		const allPlans = await getPricingPlans();

		// Filter monthly plans for the landing page
		const monthlyPlans = allPlans.filter(plan => plan.billingInterval === 'month');

		// Separate free and paid plans
		const freePlan = monthlyPlans.find(plan => plan.tier === 'free');
		const paidPlans = monthlyPlans.filter(plan => plan.tier !== 'free');

		return {
			freePlan: freePlan || null,
			paidPlans: paidPlans || [],
		};
	} catch (error) {
		console.error('Error loading pricing data for landing page:', error);
		// Return empty data on error
		return {
			freePlan: null,
			paidPlans: [],
		};
	}
};
