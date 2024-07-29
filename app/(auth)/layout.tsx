import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    return redirect("/");
  }
  return (
    <div className="flex items-center justify-center h-screen">{children}</div>
  );
}
