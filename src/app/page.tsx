"use client";

import React, { useState } from 'react';
import ResultsDisplay from '@/components/ResultsDisplay';

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any | null>(null);

  const getAgencies = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/agencies');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults({ error: 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">eCFR Analyzer</h1>
        <p className="text-sm mt-1">Federal Regulations Analysis Dashboard</p>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Button Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Content Structure</h2>
          
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            onClick={getAgencies}
          >
            Get Agencies
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          
          <ResultsDisplay 
            data={results} 
            loading={loading} 
            analysisType="contentStructure" 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center p-4 text-sm text-gray-600 mt-8">
        eCFR Analyzer &copy; {new Date().getFullYear()} - Federal Regulations Analysis Tool
      </footer>
    </div>
  );
}
