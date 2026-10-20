import RolePortalChrome from '@/components/RolePortalChrome';
import TeacherAnnouncementFeed from '@/features/announcements/components/TeacherAnnouncementFeed';

export default function TeacherFeedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole="teacher" />
      <main className="mx-auto w-full max-w-[1480px] px-6 pb-8 pt-8">
        <TeacherAnnouncementFeed />
      </main>
    </div>
  );
}