'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Search, TrendingUp } from 'lucide-react';
import { SearchForm } from '@/components/search/SearchForm';
import { RankingDisplay } from '@/components/ranking/RankingDisplay';
import { DataVisualization } from '@/components/ranking/DataVisualization';
import { VGRankingData } from '@/types';
import { LocalStorageManager } from '@/lib/storage';

export default function Home() {
  const [rankingData, setRankingData] = useState<VGRankingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'ranking' | 'visualization'>('ranking');

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setCurrentQuery(query);
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm: query }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const result = await response.json();
      
      if (result.success) {
        setRankingData(result.data);
        LocalStorageManager.saveRankingData(result.data);
      } else {
        console.error('Search error:', result.error);
        setRankingData([]);
      }
    } catch (error) {
      console.error('Failed to search:', error);
      setRankingData([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const savedData = LocalStorageManager.getRankingData();
    if (savedData.length > 0) {
      setRankingData(savedData);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <motion.header 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              VG流通量ランキングシステム
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            実写BL作品のビデオグラム流通量をECサイト別に調査し、ランキング表示するシステムです
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </motion.div>

        {rankingData.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setActiveTab('ranking')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'ranking'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                ランキング
              </button>
              <button
                onClick={() => setActiveTab('visualization')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'visualization'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                データ分析
              </button>
            </div>

            {activeTab === 'ranking' && (
              <RankingDisplay data={rankingData} searchQuery={currentQuery} />
            )}
            
            {activeTab === 'visualization' && (
              <DataVisualization data={rankingData} />
            )}
          </motion.div>
        )}

        {!isLoading && rankingData.length === 0 && !currentQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-12"
          >
            <Search className="h-16 w-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              検索を開始してください
            </h3>
            <p className="text-slate-500 dark:text-slate-500">
              実写BL作品名を入力して、ECサイトでの流通量を調査できます
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
