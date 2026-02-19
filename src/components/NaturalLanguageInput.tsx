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
  placeholder = 'Add task...',
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
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 px-0 py-1 border-0 border-b border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-500"
          placeholder={placeholder}
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-lg leading-none pb-1 transition-colors"
          title="Add task (Ctrl+Enter)"
        >
          +
        </button>
      </div>

      {preview && (
        <div className="text-xs text-gray-500 flex gap-3">
          {preview.dueDate && (
            <span>{preview.dueDate.toLocaleDateString()}</span>
          )}
          {preview.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
