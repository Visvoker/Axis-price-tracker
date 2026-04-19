import { Sidebar } from "@/components/sidebar/sidebar";

type DashboardLayoutProp = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProp) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
