'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LocalStorageManager } from '@/lib/storage';

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    setSearchHistory(LocalStorageManager.getSearchHistory());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      LocalStorageManager.saveSearchHistory(query.trim());
      setSearchHistory(LocalStorageManager.getSearchHistory());
      onSearch(query.trim());
    }
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    onSearch(historyQuery);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="実写BL作品のタイトル (例: 「映画名」「ドラマ名」)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-4"
          />
        </div>
        <Button type="submit" disabled={isLoading || !query.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          検索
        </Button>
      </form>

      {searchHistory.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-400">検索履歴:</p>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((historyItem, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(historyItem)}
                className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                {historyItem}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}