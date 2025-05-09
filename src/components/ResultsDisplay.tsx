import React from 'react';

interface ResultsDisplayProps {
  data: any | null;
  loading: boolean;
  analysisType: string | null;
}

export default function ResultsDisplay({ 
  data, 
  loading, 
  analysisType 
}: ResultsDisplayProps) {
  if (loading) {
    return (
      <div className="border border-gray-200 rounded-md p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data || !analysisType) {
    return (
      <div className="border border-gray-200 rounded-md p-4 bg-gray-50 min-h-[300px] flex items-center justify-center text-gray-500">
        Select an agency and analysis type to view results
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

  // Different display based on analysis type
  const renderContent = () => {
    switch (analysisType) {
      case 'wordCount':
        return renderWordCountResults();
      case 'historicalChanges':
        return renderHistoricalChanges();
      case 'contentStructure':
        return renderContentStructure();
      default:
        return <p>Select an analysis type</p>;
    }
  };

  const renderWordCountResults = () => {
    return (
      <div>
        <h3 className="text-lg font-medium mb-2">{data.agency} Word Count Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Word Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.titleCounts && data.titleCounts.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.wordCount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderHistoricalChanges = () => {
    return (
      <div>
        <h3 className="text-lg font-medium mb-2">{data.agency} Historical Changes</h3>
        <p className="mb-4 text-sm text-gray-600">
          Period: {data.period?.start} to {data.period?.end}
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Changes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.changes && Object.entries(data.changes).map(([date, count]: [string, any], index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderContentStructure = () => {
    // For simplicity, we're just showing the agencies list
    return (
      <div>
        <h3 className="text-lg font-medium mb-4">All Agencies</h3>
        <div className="overflow-y-auto max-h-[400px]">
          <ul className="divide-y divide-gray-200">
            {Array.isArray(data) && data.map((agency: any, index: number) => (
              <li key={index} className="py-2">
                <div className="font-medium">{agency.name}</div>
                <div className="text-sm text-gray-500">Slug: {agency.slug}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-md p-4 bg-white">
      {renderContent()}
    </div>
  );
} 