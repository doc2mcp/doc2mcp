import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";

export default async function PlaygroundRedirectPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.type === "guest") {
    redirect("/login?redirectUrl=/chat");
  }

  redirect("/chat");
}
