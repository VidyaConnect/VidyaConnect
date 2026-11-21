import type { PreviewRow } from '../types';

export function ValidationErrorDetails({ row, colSpan }: { row: PreviewRow; colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className={`px-4 py-2 text-sm ${row.status === 'error' ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-900'}`}>
        Row {row.row}: {row.message}. Fix it in your Excel file and replace the file.
      </td>
    </tr>
  );
}
