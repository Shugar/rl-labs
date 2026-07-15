export type PlanKey = "free" | "premium" | "elite";

export const links: Record<PlanKey, string> = {
  free: import.meta.env.VITE_FREE_URL || "https://whop.com/rl-labs",
  premium: import.meta.env.VITE_PREMIUM_URL || "https://whop.com/rl-labs",
  elite: import.meta.env.VITE_ELITE_URL || "https://whop.com/rl-labs",
};

export const planPricing: Record<PlanKey, string> = {
  free: "$0",
  premium: "$19.99/mo",
  elite: "$297/mo",
};
