import { useState } from 'react';
import type { ParsedTask } from '../types/task';
import { NaturalLanguageParser } from '../services/NaturalLanguageParser';

interface NaturalLanguageInputProps {
  onSubmit: (parsed: ParsedTask) => void;
  placeholder?: string;
}

const parser = new NaturalLanguageParser();

export function NaturalLanguageInput({
  onSubmit,
  placeholder = '+ タスクを追加...',
}: NaturalLanguageInputProps) {
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<ParsedTask | null>(null);

  const handleChange = (value: string) => {
    setInput(value);
    if (value.trim()) {
      const parsed = parser.parse(value);
      setPreview(parsed);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = () => {
    if (!input.trim()) return;

    const parsed = parser.parse(input);
    onSubmit(parsed);
    setInput('');
    setPreview(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {preview && (
        <div className="text-xs text-gray-600 flex gap-2">
          {preview.dueDate && (
            <span className="bg-yellow-100 px-2 py-1 rounded">
              📅 {preview.dueDate.toLocaleDateString()}
            </span>
          )}
          {preview.tags.map((tag) => (
            <span key={tag} className="bg-blue-100 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
