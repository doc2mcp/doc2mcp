import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import { normalizeCouponCode, resolveCoupon } from "@/lib/billing/coupons";
import { getPeriodWindow } from "@/lib/billing/plans";
import {
  applyCouponSubscription,
  getActiveSubscriptionByUserId,
  getCouponRedemption,
} from "@/lib/db/queries";
import { ChatbotError } from "@/lib/errors";

const bodySchema = z.object({
  code: z.string().min(3).max(64),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.type === "guest") {
    return new ChatbotError("unauthorized:api").toResponse();
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid coupon code" }, { status: 400 });
  }

  const coupon = resolveCoupon(parsed.data.code);
  if (!coupon) {
    return Response.json(
      { error: "Invalid or expired coupon code" },
      { status: 404 }
    );
  }

  const userId = session.user.id;
  const code = normalizeCouponCode(coupon.code);

  const existingRedemption = await getCouponRedemption({ userId, code });
  if (existingRedemption) {
    return Response.json(
      {
        error: "You already redeemed this coupon",
        code,
        plan: coupon.plan,
      },
      { status: 409 }
    );
  }

  const active = await getActiveSubscriptionByUserId(userId);
  if (
    active &&
    (active.status === "active" || active.status === "trialing") &&
    coupon.blockedByPlans.includes(active.plan as typeof coupon.plan)
  ) {
    return Response.json(
      {
        error: `Your ${active.plan} plan already includes more than this coupon grants`,
        plan: active.plan,
      },
      { status: 409 }
    );
  }

  if (
    active &&
    (active.status === "active" || active.status === "trialing") &&
    active.plan === coupon.plan
  ) {
    return Response.json(
      {
        error: "Starter is already active on your account",
        plan: active.plan,
        currentPeriodEnd: active.currentPeriodEnd,
      },
      { status: 409 }
    );
  }

  const { start, end } = getPeriodWindow(coupon.billingCycle);

  try {
    const { subscription: sub } = await applyCouponSubscription({
      userId,
      code,
      plan: coupon.plan,
      billingCycle: coupon.billingCycle,
      currentPeriodStart: start,
      currentPeriodEnd: end,
    });

    return Response.json({
      ok: true,
      plan: sub.plan,
      billingCycle: sub.billingCycle,
      currentPeriodEnd: sub.currentPeriodEnd,
      description: coupon.description,
    });
  } catch (error) {
    console.error("apply-coupon failed:", error);
    return Response.json(
      { error: "Could not apply coupon. Try again or contact support." },
      { status: 500 }
    );
  }
}
