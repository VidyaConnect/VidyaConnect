import { TeacherManagementDashboard } from '@/features/academics/components/TeacherManagementDashboard';
import RolePortalChrome from '../../components/RolePortalChrome';

export default function TeachersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole="school-admin" />
      <main className="mx-auto w-full max-w-[1500px] p-6">
        <TeacherManagementDashboard />
      </main>
    </div>
  );
}
