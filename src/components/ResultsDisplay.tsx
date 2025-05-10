import React from 'react';

interface Agency {
  name: string;
  short_name: string;
  display_name: string;
  sortable_name: string;
  slug: string;
  children: Agency[];
  cfr_references: {
    title: number;
    chapter: string;
  }[];
}

interface AgenciesResponse {
  agencies: Agency[];
  error?: string;
}

interface ResultsDisplayProps {
  data: AgenciesResponse | null;
  loading: boolean;
  analysisType: string | null;
}

export default function ResultsDisplay({ 
  data, 
  loading, 
}: ResultsDisplayProps) {
  if (loading) {
    return (
      <div className="border border-gray-200 rounded-md p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="border border-gray-200 rounded-md p-4 bg-gray-50 min-h-[300px] flex items-center justify-center text-gray-500">
        Click the button above to view content structure
      </div>
    );
  }

  // Handle error case
  if (data.error) {
    return (
      <div className="border border-gray-200 rounded-md p-4 bg-red-50 min-h-[300px] flex items-center justify-center text-red-500">
        Error: {data.error}
      </div>
    );
  }

  // Recursive function to render agencies with indentation
  const renderAgencyRow = (agency: Agency, depth = 0) => {
    const indentClass = `pl-${depth * 6}`;
    const cfr = agency.cfr_references && agency.cfr_references.length > 0
      ? `${agency.cfr_references[0].title} CFR Chapter ${agency.cfr_references[0].chapter}`
      : 'N/A';
    
    return (
      <React.Fragment key={agency.slug}>
        <tr className="border-b hover:bg-gray-50">
          <td className={`py-3 px-4 ${indentClass}`}>
            {depth > 0 && <span className="text-gray-400 mr-2">└─</span>}
            {agency.display_name}
          </td>
          <td className="py-3 px-4">{agency.short_name}</td>
          <td className="py-3 px-4">{cfr}</td>
        </tr>
        {agency.children && agency.children.map(child => renderAgencyRow(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="border border-gray-200 rounded-md p-4 bg-white">
      <h3 className="text-lg font-medium mb-4">Agencies</h3>
      <div className="overflow-auto max-h-[600px] rounded-md">
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Agency Name</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Abbreviation</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">CFR Reference</th>
            </tr>
          </thead>
          <tbody>
            {data.agencies && data.agencies.map(agency => renderAgencyRow(agency))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 