import { BranchProvider } from "@/components/providers/BranchProvider";
import { Sidebar } from "@/components/admin/Sidebar";
import { BranchSelector } from "@/components/admin/BranchSelector";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BranchProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a]">
        <Sidebar />

        <div className="pl-64 flex flex-col min-h-screen">
          <header className="h-16 bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="text-sm breadcrumbs text-zinc-500">
              Admin /{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                Dashboard
              </span>
            </div>

            <BranchSelector />
          </header>

          <main className="flex-1 p-8">{children}</main>
        </div>
      </div>
    </BranchProvider>
  );
}
