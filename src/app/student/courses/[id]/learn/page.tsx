import LmsClient from "./LmsClient";
import { use } from "react";

export default function LmsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <LmsClient courseId={resolvedParams.id} />;
}
