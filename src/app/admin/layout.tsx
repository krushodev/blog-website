import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Sidebar from "@/components/admin/sidebar";

export const metadata: Metadata = {
  title: { template: "%s | Admin — DevLog", default: "Admin — DevLog" },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen flex bg-[var(--color-background)]">
      <Sidebar userEmail={session.user.email ?? "admin"} />
      <div className="flex-1 min-w-0 overflow-auto">{children}</div>
    </div>
  );
}
