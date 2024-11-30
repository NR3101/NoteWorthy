import dynamic from "next/dynamic";

// Dynamically import the dashboard content with no SSR
const DashboardContent = dynamic(
  () => import("@/components/dashboard/DashboardContent"),
  { ssr: false }
);

export default function DashboardPage() {
  return <DashboardContent />;
}
