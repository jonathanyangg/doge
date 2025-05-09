import React from 'react';

interface AnalysisButtonsProps {
  onSelect: (analysisType: string) => void;
  selectedType: string | null;
  disabled: boolean;
}

export default function AnalysisButtons({
  onSelect,
  selectedType,
  disabled
}: AnalysisButtonsProps) {
  const buttons = [
    {
      id: 'wordCount',
      label: 'Word Count Analysis',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      id: 'historicalChanges',
      label: 'Historical Changes',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      id: 'contentStructure',
      label: 'Content Structure',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {buttons.map((button) => (
        <button
          key={button.id}
          className={`${button.color} text-white px-4 py-2 rounded-md ${
            selectedType === button.id ? 'ring-2 ring-offset-2 ring-offset-white ring-blue-300' : ''
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => onSelect(button.id)}
          disabled={disabled}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
} 