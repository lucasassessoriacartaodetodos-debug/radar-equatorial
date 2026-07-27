import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-graphite-900">
      <Sidebar />
      <div
        className="flex flex-col"
        style={{ marginLeft: "var(--sidebar-width)" }}
      >
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}