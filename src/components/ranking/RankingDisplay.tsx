'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Package, Clock, Yen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VGRankingData, VGProduct } from '@/types';

interface RankingDisplayProps {
  data: VGRankingData[];
  searchQuery?: string;
}

export function RankingDisplay({ data, searchQuery }: RankingDisplayProps) {
  const sortedData = [...data].sort((a, b) => b.productCount - a.productCount);

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈'; 
      case 3: return '🥉';
      default: return `${rank}位`;
    }
  };

  const formatPrice = (price: number) => {
    return price > 0 ? `¥${price.toLocaleString()}` : '価格未設定';
  };

  if (sortedData.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Package className="h-12 w-12 mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            {searchQuery ? `「${searchQuery}」の検索結果が見つかりませんでした。` : '検索を実行してください。'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          VG流通量ランキング
        </h2>
        {searchQuery && (
          <p className="text-slate-600 dark:text-slate-400">
            検索キーワード: 「{searchQuery}」
          </p>
        )}
      </div>

      <div className="grid gap-4">
        {sortedData.map((siteData, index) => (
          <motion.div
            key={siteData.site}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold">
                      {getRankMedal(index + 1)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{siteData.site}</CardTitle>
                      <CardDescription>
                        {siteData.productCount}件の商品が見つかりました
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="h-4 w-4" />
                    {siteData.lastUpdated.toLocaleString('ja-JP')}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {siteData.products.slice(0, 3).map((product, productIndex) => (
                    <motion.div
                      key={productIndex}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{product.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Yen className="h-3 w-3" />
                            {formatPrice(product.price)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${\n                            product.availability \n                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'\n                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'\n                          }`}>
                            {product.availability ? '在庫あり' : '在庫なし'}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="ml-4"
                      >
                        <a 
                          href={product.productUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </motion.div>
                  ))}
                  
                  {siteData.products.length > 3 && (
                    <p className="text-sm text-slate-500 text-center pt-2">
                      他 {siteData.products.length - 3} 件の商品があります
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}