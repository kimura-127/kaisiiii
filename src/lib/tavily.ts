import { TavilyResponse, VGProduct, VGRankingData } from '@/types';

const TAVILY_API_URL = 'https://api.tavily.com/search';

export class TavilyClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string, maxResults: number = 10): Promise<TavilyResponse> {
    try {
      const response = await fetch(TAVILY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          query,
          max_results: maxResults,
          search_depth: 'advanced',
          include_domains: ['amazon.co.jp', 'rakuten.co.jp', 'yahoo.co.jp', 'tsutaya.co.jp', 'hmv.co.jp'],
          exclude_domains: [
            'google.com', 'bing.com', 
            'cardshop.jp', 'tcg.jp', 'cardlab.jp', 'toretoku.jp',
            'hareruya.com', 'bigmagic.net', 'fullahead.jp',
            'pokemon.co.jp', 'yugioh-card.com'
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to search with Tavily API:', error);
      throw error;
    }
  }

  async searchVGProducts(searchTerm: string): Promise<VGRankingData[]> {
    const blTerms = ['BL', 'ボーイズラブ', 'Boys Love', '実写BL', 'DVD', 'Blu-ray', 'ビデオグラム', '映画', 'ドラマ'];
    const excludeTerms = ['カード', 'TCG', 'トレーディング', 'カードゲーム', 'プレイマット', 'スリーブ', 'デッキ', 'ポケモン', '遊戯王', 'カードショップ'];
    
    // BL実写作品に特化したクエリを構築
    const inclusiveQuery = `"${searchTerm}" AND (${blTerms.map(term => `"${term}"`).join(' OR ')})`;
    const exclusiveQuery = excludeTerms.map(term => `-"${term}"`).join(' ');
    const fullQuery = `${inclusiveQuery} ${exclusiveQuery}`;

    try {
      const results = await this.search(fullQuery, 30);
      return this.parseSearchResults(results);
    } catch (error) {
      console.error('Failed to search VG products:', error);
      throw error;
    }
  }

  private parseSearchResults(results: TavilyResponse): VGRankingData[] {
    const siteGroups = new Map<string, { url: string; products: VGProduct[] }>();

    results.results.forEach(result => {
      const siteKey = this.extractSiteName(result.url);
      const product = this.parseProductFromResult(result);

      if (product) {
        if (!siteGroups.has(siteKey)) {
          siteGroups.set(siteKey, {
            url: new URL(result.url).origin,
            products: []
          });
        }
        siteGroups.get(siteKey)!.products.push(product);
      }
    });

    return Array.from(siteGroups.entries()).map(([siteName, data]) => ({
      site: siteName,
      siteUrl: data.url,
      productCount: data.products.length,
      products: data.products,
      lastUpdated: new Date(),
    }));
  }

  private extractSiteName(url: string): string {
    try {
      const hostname = new URL(url).hostname;
      
      if (hostname.includes('amazon')) return 'Amazon';
      if (hostname.includes('rakuten')) return '楽天市場';
      if (hostname.includes('yahoo')) return 'Yahoo!ショッピング';
      if (hostname.includes('mercari')) return 'メルカリ';
      if (hostname.includes('tsutaya')) return 'TSUTAYA';
      if (hostname.includes('hmv')) return 'HMV&BOOKS';
      if (hostname.includes('7net')) return 'セブンネット';
      if (hostname.includes('yodobashi')) return 'ヨドバシ';
      if (hostname.includes('biccamera')) return 'ビックカメラ';
      
      // Extract domain name for other sites
      const parts = hostname.split('.');
      return parts.length > 2 ? parts[parts.length - 2] : hostname;
    } catch {
      return 'Unknown Site';
    }
  }

  private parseProductFromResult(result: any): VGProduct | null {
    try {
      // カード関連の商品を除外
      const cardKeywords = ['カード', 'TCG', 'トレーディング', 'カードゲーム', 'プレイマット', 'スリーブ', 'デッキ', 'ポケモン', '遊戯王'];
      const titleAndContent = (result.title + ' ' + result.content).toLowerCase();
      
      for (const keyword of cardKeywords) {
        if (titleAndContent.includes(keyword.toLowerCase())) {
          return null; // カード関連商品は除外
        }
      }

      // BL/実写関連のキーワードが含まれているかチェック
      const blKeywords = ['bl', 'ボーイズラブ', 'boys love', '実写', 'dvd', 'blu-ray', 'ビデオグラム', '映画', 'ドラマ'];
      const hasBLKeyword = blKeywords.some(keyword => titleAndContent.includes(keyword.toLowerCase()));
      
      if (!hasBLKeyword) {
        return null; // BL関連でない商品は除外
      }

      // Extract price from content (simplified parsing)
      const priceMatch = result.content.match(/[¥￥]?([0-9,]+)円?/);
      const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;

      // Check availability keywords
      const availability = !result.content.toLowerCase().includes('売り切れ') &&
                          !result.content.toLowerCase().includes('品切れ') &&
                          !result.content.toLowerCase().includes('在庫なし');

      return {
        title: result.title,
        price,
        availability,
        productUrl: result.url,
        description: result.content.substring(0, 200) + '...',
      };
    } catch (error) {
      console.error('Failed to parse product from result:', error);
      return null;
    }
  }
}