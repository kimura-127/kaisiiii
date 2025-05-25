'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VGRankingData } from '@/types';

interface DataVisualizationProps {
  data: VGRankingData[];
}

export function DataVisualization({ data }: DataVisualizationProps) {
  if (data.length === 0) return null;

  const totalProducts = data.reduce((sum, site) => sum + site.productCount, 0);
  const maxCount = Math.max(...data.map(site => site.productCount));
  const averagePrice = data.reduce((sum, site) => {
    const siteAverage = site.products.reduce((pSum, product) => pSum + product.price, 0) / site.products.length || 0;
    return sum + siteAverage;
  }, 0) / data.length;

  const availableProducts = data.reduce((sum, site) => {
    return sum + site.products.filter(p => p.availability).length;
  }, 0);

  const availabilityRate = totalProducts > 0 ? (availableProducts / totalProducts) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>統計情報</CardTitle>
          <CardDescription>検索結果の詳細データ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
              <div className="text-sm text-slate-600">総商品数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.length}</div>
              <div className="text-sm text-slate-600">検索サイト数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ¥{Math.round(averagePrice).toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">平均価格</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {availabilityRate.toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600">在庫率</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>サイト別商品数</CardTitle>
          <CardDescription>各ECサイトの商品取扱数</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((site, index) => {
              const percentage = maxCount > 0 ? (site.productCount / maxCount) * 100 : 0;
              return (
                <div key={site.site} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{site.site}</span>
                    <span className="text-sm text-slate-600">
                      {site.productCount}件 ({((site.productCount / totalProducts) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>価格分布</CardTitle>
          <CardDescription>サイト別の価格帯分析</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((site) => {
              const prices = site.products.map(p => p.price).filter(p => p > 0);
              if (prices.length === 0) return null;

              const minPrice = Math.min(...prices);
              const maxPrice = Math.max(...prices);
              const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

              return (
                <div key={site.site} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <h4 className="font-medium mb-2">{site.site}</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-slate-600">最安値</div>
                      <div className="font-medium">¥{minPrice.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-slate-600">平均値</div>
                      <div className="font-medium">¥{Math.round(avgPrice).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-slate-600">最高値</div>
                      <div className="font-medium">¥{maxPrice.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}