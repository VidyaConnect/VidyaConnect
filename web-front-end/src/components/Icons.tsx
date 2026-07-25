'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faTableCellsLarge,
  faUsers,
  faComment,
  faComments,
  faCheck,
  faPenToSquare,
  faFileCirclePlus,
  faCalendarDays,
  faArrowDown,
  faGear,
  faShieldHalved,
  faMagnifyingGlass,
  faBell,
  faCircleInfo,
  faUser,
  faRightFromBracket,
  faFloppyDisk,
  faCircleCheck,
  faCircleXmark,
  faClock,
  faEllipsis,
  faDownload,
  faTriangleExclamation,
  faUserCheck,
  faUserXmark,
  faArrowLeft,
  faChartColumn,
  faCalendar,
  faUmbrellaBeach,
} from '@fortawesome/free-solid-svg-icons'

interface IconProps {
  className?: string
  size?: number
}

function FaIcon({
  icon,
  className = '',
  size = 24,
}: IconProps & { icon: IconDefinition }) {
  return (
    <FontAwesomeIcon
      icon={icon}
      className={className}
      style={{ width: size, height: size, fontSize: size }}
    />
  )
}

/** Nav / chrome icons — mapped to match Figma UI kit shapes */
export const DashboardIcon = (p: IconProps) => <FaIcon icon={faTableCellsLarge} {...p} />
export const ClassesIcon = (p: IconProps) => <FaIcon icon={faUsers} {...p} />
export const AnnouncementsIcon = (p: IconProps) => <FaIcon icon={faComment} {...p} />
export const CommunityIcon = (p: IconProps) => <FaIcon icon={faComments} {...p} />
export const AttendanceIcon = (p: IconProps) => <FaIcon icon={faCheck} {...p} />
export const AssignmentsIcon = (p: IconProps) => <FaIcon icon={faPenToSquare} {...p} />
export const ConsentIcon = (p: IconProps) => <FaIcon icon={faFileCirclePlus} {...p} />
export const CalendarIcon = (p: IconProps) => <FaIcon icon={faCalendarDays} {...p} />
export const ReportsIcon = (p: IconProps) => <FaIcon icon={faArrowDown} {...p} />
export const SettingsIcon = (p: IconProps) => <FaIcon icon={faGear} {...p} />
export const SchoolsIcon = (p: IconProps) => <FaIcon icon={faShieldHalved} {...p} />
export const SearchIcon = (p: IconProps) => <FaIcon icon={faMagnifyingGlass} {...p} />
export const NotificationIcon = (p: IconProps) => <FaIcon icon={faBell} {...p} />
export const HelpIcon = (p: IconProps) => <FaIcon icon={faCircleInfo} {...p} />
export const ProfileIcon = (p: IconProps) => <FaIcon icon={faUser} {...p} />
export const LogoutIcon = (p: IconProps) => <FaIcon icon={faRightFromBracket} {...p} />

/** Attendance / action icons */
export const SaveIcon = (p: IconProps) => <FaIcon icon={faFloppyDisk} {...p} />
export const CheckCircleIcon = (p: IconProps) => <FaIcon icon={faCircleCheck} {...p} />
export const XCircleIcon = (p: IconProps) => <FaIcon icon={faCircleXmark} {...p} />
export const ClockIcon = (p: IconProps) => <FaIcon icon={faClock} {...p} />
export const MoreIcon = (p: IconProps) => <FaIcon icon={faEllipsis} {...p} />
export const DownloadIcon = (p: IconProps) => <FaIcon icon={faDownload} {...p} />
export const WarningIcon = (p: IconProps) => <FaIcon icon={faTriangleExclamation} {...p} />
export const UserCheckIcon = (p: IconProps) => <FaIcon icon={faUserCheck} {...p} />
export const UserXmarkIcon = (p: IconProps) => <FaIcon icon={faUserXmark} {...p} />
export const ArrowLeftIcon = (p: IconProps) => <FaIcon icon={faArrowLeft} {...p} />
export const ChartIcon = (p: IconProps) => <FaIcon icon={faChartColumn} {...p} />
export const CalendarDayIcon = (p: IconProps) => <FaIcon icon={faCalendar} {...p} />
export const HolidayIcon = (p: IconProps) => <FaIcon icon={faUmbrellaBeach} {...p} />
