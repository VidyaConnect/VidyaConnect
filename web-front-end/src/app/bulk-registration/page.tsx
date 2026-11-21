import { BulkRegistrationDashboard } from '@/features/bulk-registration/components/BulkRegistrationDashboard';
import RolePortalChrome from '../../components/RolePortalChrome';

export default function BulkRegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RolePortalChrome userRole="school-admin" />
      <main className="mx-auto w-full max-w-[1500px] p-6">
        <BulkRegistrationDashboard />
      </main>
    </div>
  );
}