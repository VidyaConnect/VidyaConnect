import XLSX from 'xlsx';

// Alternative column names an admin might use, mapped to the names the backend expects.
const HEADER_ALIASES = {
  contact: 'phone',
  contact_number: 'phone',
  mobile: 'phone',
  grade: 'grade_level',
  class: 'class_name',
  admission_no: 'admission_number',
};

// "Full Name" / "full-name" / " FULL_NAME " -> "full_name", then apply aliases
const normalizeHeader = (h) => {
  const key = String(h).trim().toLowerCase().replace(/[\s-]+/g, '_');
  return HEADER_ALIASES[key] ?? key;
};

/**
 * Reads a CSV or XLSX buffer (first sheet only).
 * Returns { headers, rows: [{ rowNumber, data }] } where rowNumber matches
 * the row the admin sees in Excel (header is row 1, first data row is 2).
 */
export function parseSpreadsheet(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return { headers: [], rows: [] };

  const raw = XLSX.utils.sheet_to_json(sheet, {
    defval: '',
    raw: false, // everything as strings, so "0771234567" is not turned into a number
    dateNF: 'yyyy-mm-dd',
  });

  const rows = raw
    .map((record, index) => {
      const data = {};
      for (const [key, value] of Object.entries(record)) {
        data[normalizeHeader(key)] =
          typeof value === 'string' ? value.trim() : value;
      }
      return { rowNumber: index + 2, data };
    })
    .filter(({ data }) => Object.values(data).some((v) => v !== '')); // skip blank rows

  const headers = raw.length ? Object.keys(raw[0]).map(normalizeHeader) : [];
  return { headers, rows };
}