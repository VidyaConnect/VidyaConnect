import Topbar from "@/components/Topbar";
import SubNav from "@/components/SubNav";
import { getPortalMenu } from "@/components/portalMenus";
import ParentLinkRequestsBoard from "@/features/parents-requests/components/ParentRequestsBoard";


export default function Page() {
  return (
    <>
      <header className="sticky top-0 z-30">
        <Topbar userRole="teacher" />
        <SubNav items={getPortalMenu("teacher")} />
      </header>
      <main className="mx-auto w-full max-w-[1480px] px-6 pb-8 pt-8">
        <ParentLinkRequestsBoard />
      </main>
    </>
  );
}