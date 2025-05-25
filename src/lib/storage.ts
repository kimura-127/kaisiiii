import { VGRankingData, SearchFilters } from '@/types';

const STORAGE_KEYS = {
  RANKING_DATA: 'vg_ranking_data',
  SEARCH_FILTERS: 'vg_search_filters',
  SEARCH_HISTORY: 'vg_search_history',
} as const;

export class LocalStorageManager {
  static saveRankingData(data: VGRankingData[]): void {
    try {
      const serializedData = JSON.stringify(data.map(item => ({
        ...item,
        lastUpdated: item.lastUpdated.toISOString()
      })));
      localStorage.setItem(STORAGE_KEYS.RANKING_DATA, serializedData);
    } catch (error) {
      console.error('Failed to save ranking data:', error);
    }
  }

  static getRankingData(): VGRankingData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RANKING_DATA);
      if (!data) return [];
      
      const parsedData = JSON.parse(data);
      return parsedData.map((item: any) => ({
        ...item,
        lastUpdated: new Date(item.lastUpdated)
      }));
    } catch (error) {
      console.error('Failed to load ranking data:', error);
      return [];
    }
  }

  static saveSearchFilters(filters: SearchFilters): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH_FILTERS, JSON.stringify(filters));
    } catch (error) {
      console.error('Failed to save search filters:', error);
    }
  }

  static getSearchFilters(): SearchFilters | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SEARCH_FILTERS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load search filters:', error);
      return null;
    }
  }

  static saveSearchHistory(query: string): void {
    try {
      const history = this.getSearchHistory();
      const updatedHistory = [query, ...history.filter(q => q !== query)].slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }

  static getSearchHistory(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load search history:', error);
      return [];
    }
  }

  static clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage data:', error);
    }
  }
}

export class SessionStorageManager {
  static saveTemporaryData(key: string, data: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save temporary data for key ${key}:`, error);
    }
  }

  static getTemporaryData<T>(key: string): T | null {
    try {
      const data = sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to load temporary data for key ${key}:`, error);
      return null;
    }
  }

  static removeTemporaryData(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove temporary data for key ${key}:`, error);
    }
  }
}