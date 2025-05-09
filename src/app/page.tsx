"use client";

import React, { useState } from 'react';
import AgencySearch from '@/components/AgencySearch';
import AnalysisButtons from '@/components/AnalysisButtons';
import ResultsDisplay from '@/components/ResultsDisplay';

export default function Home() {
  const [agency, setAgency] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<any | null>(null);

  const handleAgencySearch = (agencyName: string) => {
    setAgency(agencyName);
    setAnalysisType(null);
    setResults(null);
  };

  const handleAnalysisSelect = async (type: string) => {
    setAnalysisType(type);
    setLoading(true);
    
    try {
      // Different API endpoints based on analysis type
      let data;
      
      if (type === 'wordCount') {
        const response = await fetch(`/api/wordcounts?agency=${encodeURIComponent(agency || '')}`);
        data = await response.json();
      } 
      else if (type === 'historicalChanges') {
        const response = await fetch(`/api/changes?agency=${encodeURIComponent(agency || '')}`);
        data = await response.json();
      } 
      else if (type === 'contentStructure') {
        // For simplicity, we'll just fetch agencies for now
        const response = await fetch('/api/agencies');
        data = await response.json();
      }
      
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
        {/* Search Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Agency Information</h2>
          
          <AgencySearch onSearch={handleAgencySearch} />
          
          <AnalysisButtons 
            onSelect={handleAnalysisSelect} 
            selectedType={analysisType}
            disabled={!agency} 
          />
          
          {agency && (
            <div className="mt-2 text-sm text-gray-600">
              Selected Agency: <span className="font-medium">{agency}</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          
          <ResultsDisplay 
            data={results} 
            loading={loading} 
            analysisType={analysisType} 
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
