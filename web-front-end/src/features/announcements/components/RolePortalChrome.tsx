'use client';

import { useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Topbar from '@/components/Topbar';
import {
  TEACHER_PAGE_ROUTES,
  ADMIN_PAGE_ROUTES,
  SUPER_ADMIN_PAGE_ROUTES,
} from '../navigationMap';

interface RolePortalChromeProps {
  userRole: 'teacher' | 'admin' | 'super-admin';
}

export default function RolePortalChrome({ userRole }: RolePortalChromeProps) {
  const router = useRouter();
  const pathname = usePathname();

  const routeMap =
    userRole === 'teacher'
      ? TEACHER_PAGE_ROUTES
      : userRole === 'super-admin'
      ? SUPER_ADMIN_PAGE_ROUTES
      : ADMIN_PAGE_ROUTES;

  // Figure out which page ID matches the current URL
  const currentPage =
    Object.entries(routeMap).find(([, href]) => pathname === href)?.[0] || 'announcements';

  function handleNavigate(pageId: string) {
    const href = routeMap[pageId];
    if (href) router.push(href);
  }

  return (
    <>
      <Navbar userRole={userRole} currentPage={currentPage} onNavigate={handleNavigate} />
      <Topbar userRole={userRole} />
    </>
  );
}