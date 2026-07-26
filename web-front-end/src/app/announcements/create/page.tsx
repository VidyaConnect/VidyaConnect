import AnnouncementForm from '@/features/announcements/components/AnnouncementForm';

export default function CreateAnnouncementPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto mb-4">
        <nav className="text-sm text-gray-500">
          <span>Announcements</span>
          <span className="mx-2">›</span>
          <span className="text-gray-900 font-medium">Create New Announcement</span>
        </nav>
      </div>
      <AnnouncementForm />
    </div>
  );
}