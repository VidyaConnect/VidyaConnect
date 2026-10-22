import { Suspense } from "react";
import { CommunityScreen } from "@/features/communication/components/CommunityScreen";

export default function CommunityPage() {
  return (
    <Suspense fallback={null}>
      <CommunityScreen />
    </Suspense>
  );
}