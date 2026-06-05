import { ResultView } from "@/components/ResultView";

export default async function ResultPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <ResultView sessionId={sessionId} />;
}
