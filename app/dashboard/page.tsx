import { DashboardPage } from "@/src/presentation/components/dashboard/DashboardPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Noteflow Workspace - 대시보드",
  description: "개인 및 팀 워크스페이스 대시보드에서 모든 생각과 노트를 연결하세요.",
};

export default function DashboardRoute() {
  return <DashboardPage />;
}
