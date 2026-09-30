import { Metadata } from "next";
import { NotesManagementPage } from "@/src/presentation/components/notes/NotesManagementPage";

export const metadata: Metadata = {
  title: "Noteflow Workspace - 노트 관리",
  description: "체계적인 카테고리, 태그, 검색 및 필터로 모든 노트를 관리하세요.",
};

export default function NotesRoute() {
  return <NotesManagementPage />;
}
