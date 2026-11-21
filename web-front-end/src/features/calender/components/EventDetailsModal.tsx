import { CalendarEvent, CalendarPermissions } from '../types';
import { getTypeMeta } from '../constants';
import { formatEventWhen } from '../utils/dateHelpers';
import { Modal } from './Modal';

interface EventDetailsModalProps {
  event: CalendarEvent;
  permissions: CalendarPermissions;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
}

export function EventDetailsModal({
  event,
  permissions,
  onClose,
  onEdit,
  onDelete,
}: EventDetailsModalProps) {
  const meta = getTypeMeta(event.type);

  return (
    <Modal title={event.title} onClose={onClose}>
      <span
        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.chip}`}
      >
        {meta.label}
      </span>

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase text-slate-400">When</dt>
          <dd className="text-slate-800">{formatEventWhen(event)}</dd>
        </div>

        {event.location && (
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-400">Location</dt>
            <dd className="text-slate-800">{event.location}</dd>
          </div>
        )}

        {event.description && (
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-400">Description</dt>
            <dd className="whitespace-pre-wrap text-slate-800">{event.description}</dd>
          </div>
        )}
      </dl>

      {(permissions.canEdit || permissions.canDelete) && (
        <div className="mt-6 flex justify-end gap-2">
          {permissions.canDelete && (
            <button
              onClick={() => onDelete(event)}
              className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          )}
          {permissions.canEdit && (
            <button
              onClick={() => onEdit(event)}
              className="rounded-md bg-[#0b3d91] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Edit
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}