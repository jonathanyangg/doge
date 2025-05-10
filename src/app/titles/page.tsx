"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface ContentVersion {
  date: string;
  amendment_date: string;
  issue_date: string;
  identifier: string;
  name: string;
  part: string;
  substantive: boolean;
  removed: boolean;
  subpart: string | null;
  title: string;
  type: string;
}

interface VersionsResponse {
  content_versions: ContentVersion[];
  meta: {
    title: string;
    result_count: string;
    issue_date?: {
      lte?: string;
      gte?: string;
      on?: string;
    };
    latest_amendment_date: string;
    latest_issue_date: string;
  };
  error?: string;
}

export default function TitlesSearch() {
  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<VersionsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      setError('Title number is required');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let url = `/api/changes?title=${title}`;
      
      if (startDate) {
        url += `&startDate=${startDate}`;
      }
      
      if (endDate) {
        url += `&endDate=${endDate}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setResults(null);
      } else {
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Search Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Search Title Changes</h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title Number (required)
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date (optional)
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (optional)
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Change History Results</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : !results ? (
            <div className="text-center text-gray-500 py-12">
              Enter a title number and click Search to see changes
            </div>
          ) : (
            <div className="overflow-auto max-h-[600px]">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Found {results.meta?.result_count || 0} changes for Title {results.meta?.title}
                </p>
                {results.meta?.issue_date && (
                  <p className="text-sm text-gray-600">
                    {results.meta.issue_date.gte && `From: ${results.meta.issue_date.gte}`}
                    {results.meta.issue_date.lte && results.meta.issue_date.gte && ' - '}
                    {results.meta.issue_date.lte && `To: ${results.meta.issue_date.lte}`}
                    {results.meta.issue_date.on && `On: ${results.meta.issue_date.on}`}
                  </p>
                )}
              </div>
              
              <table className="min-w-full bg-white border border-gray-200 rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Date</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Section</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Name</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Type</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.content_versions?.length > 0 ? (
                    results.content_versions.map((version, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{version.amendment_date}</td>
                        <td className="py-3 px-4">{version.identifier}</td>
                        <td className="py-3 px-4">{version.name}</td>
                        <td className="py-3 px-4">{version.type}</td>
                        <td className="py-3 px-4">
                          {version.removed ? (
                            <span className="text-red-600">Removed</span>
                          ) : version.substantive ? (
                            <span className="text-green-600">Substantive Change</span>
                          ) : (
                            <span className="text-blue-600">Editorial Change</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No changes found for the specified criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center p-4 text-sm text-gray-600 mt-8">
        eCFR Analyzer &copy; {new Date().getFullYear()} - Federal Regulations Analysis Tool
      </footer>
    </div>
  );
} 