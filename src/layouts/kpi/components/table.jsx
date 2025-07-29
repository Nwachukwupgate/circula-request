import React from 'react';
import { Loader } from 'lucide-react';


function GenericTable({
  data,
  columns,
  loading = false,
  emptyMessage = 'No records found',
  title,
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {title && (
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">{title} ({data.length})</h2>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}
                    >
                      {col.render
                        ? col.render(row)
                        : (row[col.accessor])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {data.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">{emptyMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GenericTable;