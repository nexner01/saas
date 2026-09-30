import { NoteEditorPage } from "@/src/presentation/components/note/NoteEditorPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Noteflow - 노트 에디터",
  description: "방해 없는 고성능 마크다운 문서 작성 및 AI 기반 지식 확장",
};

interface NotePageRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePageRoute({ params }: NotePageRouteProps) {
  const { id } = await params;
  return <NoteEditorPage noteId={id} />;
}
