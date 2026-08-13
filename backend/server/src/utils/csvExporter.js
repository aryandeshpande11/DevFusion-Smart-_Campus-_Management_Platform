// turns an array of flat-ish objects into a csv string, used by the admin export endpoint
function convertToCsv(rows) {
  if (!rows.length) return '';

  const headers = Object.keys(rows[0]).filter((key) => typeof rows[0][key] !== 'object');
  const headerLine = headers.join(',');

  const dataLines = rows.map((row) =>
    headers.map((header) => JSON.stringify(row[header] ?? '')).join(',')
  );

  return [headerLine, ...dataLines].join('\n');
}

module.exports = { convertToCsv };
