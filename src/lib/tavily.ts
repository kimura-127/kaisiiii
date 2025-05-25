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
          include_domains: ['amazon.co.jp', 'rakuten.co.jp', 'yahoo.co.jp'],
          exclude_domains: ['google.com', 'bing.com'],
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
    const blTerms = ['BL', 'ボーイズラブ', 'Boys Love', '実写', 'DVD', 'Blu-ray', 'ビデオグラム'];
    const fullQuery = `${searchTerm} ${blTerms.join(' OR ')} 実写BL DVD OR Blu-ray`;

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
      
      // Extract domain name for other sites
      const parts = hostname.split('.');
      return parts.length > 2 ? parts[parts.length - 2] : hostname;
    } catch {
      return 'Unknown Site';
    }
  }

  private parseProductFromResult(result: any): VGProduct | null {
    try {
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