import React from 'react';

export default function Table({ columns = [], data = [], actions }) {
  return (
    <div className="overflow-x-auto rounded-t-2xl border border-[#F2E6E0] bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-[#FFF3F0] text-[#D9433B]">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="text-left px-6 py-4 font-ibarra font-bold text-sm uppercase tracking-wide">{col.title}</th>
            ))}
            {actions && <th className="px-6 py-4" />}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF6F1]'} border-b border-[#F2E6E0] hover:bg-[#FFF8F2] transition-colors duration-200`}> 
              {columns.map(col => (
                <td key={col.key} className="px-6 py-4 text-gray-700 align-middle">{row[col.key]}</td>
              ))}
              {actions && <td className="px-6 py-4">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
