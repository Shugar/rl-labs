export type PlanKey = "free" | "premium" | "elite";

export const links: Record<PlanKey, string> = {
  free: import.meta.env.VITE_FREE_URL || "https://whop.com/checkout/plan_cQojmsr5npTXw",
  premium: import.meta.env.VITE_PREMIUM_URL || "https://whop.com/checkout/plan_Ahp2KZ9CcErQt",
  elite: import.meta.env.VITE_ELITE_URL || "https://whop.com/checkout/plan_v4EvWCOe2w5EB",
};

export const externalLinks = {
  discord: "https://discord.com/invite/rl-labs",
  reviews: import.meta.env.VITE_REVIEWS_URL || "https://whop.com/rl-labs-free/reviews/",
};

export const planPricing: Record<PlanKey, string> = {
  free: "$0",
  premium: "$19.99/mo",
  elite: "$297/mo",
};
