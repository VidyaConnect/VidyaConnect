import AnnouncementList from '@/features/announcements/components/AnnouncementList';

export default function AnnouncementsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <AnnouncementList />
      </div>
    </div>
  );
}