import React from "react";

// small heading row every inner dashboard page starts with —
// title on the left, an action button (if any) on the right
export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

// simple bordered-row table — columns: [{ key, label, render? }]
export function DataTable({ columns, rows, keyField = "id" }) {
  return (
    <div className="overflow-x-auto surfaceCard">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border dark:border-white/10">
            {columns.map((column) => (
              <th key={column.key} className="whitespace-nowrap px-4 py-3 font-medium text-muted">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[keyField]} className="border-b border-border last:border-0 dark:border-white/10">
              {columns.map((column) => (
                <td key={column.key} className="whitespace-nowrap px-4 py-3">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
