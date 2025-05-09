import React from 'react';

interface AgencySearchProps {
  onSearch: (agency: string) => void;
}

export default function AgencySearch({ onSearch }: AgencySearchProps) {
  const [agency, setAgency] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (agency.trim()) {
      onSearch(agency);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <label htmlFor="agency-input" className="block text-sm font-medium text-gray-700 mb-1">
        Enter Agency Name or ID
      </label>
      <div className="flex">
        <input
          type="text"
          id="agency-input"
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Department of Agriculture"
          value={agency}
          onChange={(e) => setAgency(e.target.value)}
        />
        <button 
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
        >
          Search
        </button>
      </div>
    </form>
  );
} 