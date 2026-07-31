-- Coupon redemptions: track one-time promo grants (e.g. opensourcedoc2mcp → Starter).
CREATE TABLE IF NOT EXISTS "CouponRedemption" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" uuid NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "code" varchar(64) NOT NULL,
  "plan" varchar(32) NOT NULL,
  "billingCycle" varchar(32) NOT NULL,
  "subscriptionId" uuid REFERENCES "Subscription"("id") ON DELETE SET NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "CouponRedemption_user_code_uidx"
  ON "CouponRedemption" ("userId", "code");

CREATE INDEX IF NOT EXISTS "CouponRedemption_code_idx"
  ON "CouponRedemption" ("code");
