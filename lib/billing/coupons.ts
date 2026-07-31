import type { BillingCycle, PlanId } from "@/lib/billing/plans";

export type CouponDefinition = {
  code: string;
  plan: PlanId;
  billingCycle: BillingCycle;
  /** Human-readable grant description for UI / emails. */
  description: string;
  /** Plans that already outrank this coupon — do not downgrade. */
  blockedByPlans: PlanId[];
};

/**
 * Contributor / open-source promo codes.
 * Apply via POST /api/billing/apply-coupon — no Razorpay checkout.
 */
export const COUPONS: Record<string, CouponDefinition> = {
  opensourcedoc2mcp: {
    code: "opensourcedoc2mcp",
    plan: "starter",
    billingCycle: "yearly",
    description:
      "Open-source contributor grant — Starter plan free for 12 months",
    blockedByPlans: ["pro", "team", "enterprise"],
  },
};

export function normalizeCouponCode(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, "");
}

export function resolveCoupon(raw: string): CouponDefinition | null {
  const code = normalizeCouponCode(raw);
  return COUPONS[code] ?? null;
}
